<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ToolsController extends Controller
{
    public function transcribe(Request $request)
    {
        $user = Auth::user();
        $role = $user?->role;

        if (!in_array($role, ["SCHOOL_ADMIN", "HOD", "TEACHER"], true)) {
            return response()->json([
                'message' => 'You do not have access to this tool.',
                'status_code' => 403,
            ], 403);
        }

        $request->validate([
            'file' => 'nullable|file|max:204800',
            'url' => 'nullable|url',
        ]);

        if (!$request->hasFile('file') && !$request->filled('url')) {
            return response()->json([
                'message' => 'Provide a file or a URL.',
                'status_code' => 422,
            ], 422);
        }

        $storageDir = storage_path('app/private/transcribe');
        $cacheDir = env('TRANSCRIBE_CACHE', storage_path('transcribe_cache'));
        if (!is_dir($storageDir)) {
            mkdir($storageDir, 0755, true);
        }
        if (!is_dir($cacheDir)) {
            mkdir($cacheDir, 0755, true);
        }

        $filePath = null;
        $storedPath = null;
        $convertedPath = null;
        $subtitlePath = null;
        $cookiesTempPath = null;
        $skipCleanup = false;

        try {
            if ($request->hasFile('file')) {
                $storedPath = $request->file('file')->store('transcribe', 'local');
                $filePath = storage_path('app/private/' . $storedPath);
                if (!$storedPath || !file_exists($filePath)) {
                    return response()->json([
                        'message' => 'Uploaded file could not be saved.',
                        'debug' => [
                            'stored_path' => $storedPath,
                            'file_path' => $filePath,
                        ],
                        'status_code' => 422,
                    ], 422);
                }

                if ($request->boolean('async')) {
                    $jobsDir = $storageDir . '/jobs';
                    if (!is_dir($jobsDir)) {
                        mkdir($jobsDir, 0755, true);
                    }

                    $jobId = (string) Str::uuid();
                    $jobPath = $jobsDir . '/' . $jobId . '.json';
                    file_put_contents($jobPath, json_encode([
                        'status' => 'queued',
                        'job_id' => $jobId,
                        'created_at' => now()->toISOString(),
                    ]));

                    $python = env('TRANSCRIBE_PYTHON', '/usr/bin/python3');
                    $script = env('TRANSCRIBE_SCRIPT', storage_path('transcribe/transcribe.py'));
                    $model = env('TRANSCRIBE_MODEL', 'base');

                    $worker = storage_path('transcribe/transcribe_worker.php');
                    $logPath = $jobsDir . '/' . $jobId . '.log';

                    $cmd = sprintf(
                        'nohup php %s --job %s --file %s --storage %s --cache %s --python %s --script %s --model %s > %s 2>&1 &',
                        escapeshellarg($worker),
                        escapeshellarg($jobId),
                        escapeshellarg($filePath),
                        escapeshellarg($storageDir),
                        escapeshellarg($cacheDir),
                        escapeshellarg($python),
                        escapeshellarg($script),
                        escapeshellarg($model),
                        escapeshellarg($logPath)
                    );
                    exec($cmd);

                    $skipCleanup = true;
                    return response()->json([
                        'job_id' => $jobId,
                        'status' => 'queued',
                    ]);
                }
            } else {
                $url = $request->input('url');
                $subtitleOnly = $request->boolean('subtitle_only');
                $isYouTube = (bool) preg_match('/(youtube\.com|youtu\.be)/i', (string) $url);

                if ($isYouTube && !$subtitleOnly) {
                    $subtitleOnly = true;
                }

                $cookiesPath = storage_path('transcribe/cookies.txt');
                if (file_exists($cookiesPath) && is_readable($cookiesPath)) {
                    $cookiesTempPath = $storageDir . '/cookies_' . Str::random(12) . '.txt';
                    if (@copy($cookiesPath, $cookiesTempPath)) {
                        @chmod($cookiesTempPath, 0600);
                    } else {
                        $cookiesTempPath = null;
                    }
                }
                $cookiesArg = $cookiesTempPath ? (' --cookies ' . escapeshellarg($cookiesTempPath)) : '';

                $ytdlpHeaders = ' --add-header "Referer:https://www.youtube.com/" --add-header "Origin:https://www.youtube.com" --add-header "Accept-Language:en-US,en;q=0.9" --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36" --extractor-args "youtube:player_client=tv,mweb;player_skip=webpage"';
                $ytdlpCommon = ' --geo-bypass --geo-bypass-country "US" --age-limit 99 --force-ipv4';

                $ytdlpBin = '/usr/local/bin/yt-dlp';

                if ($subtitleOnly) {
                    $template = $storageDir . '/sub_' . Str::random(12) . '.%(ext)s';
                    $ytdlpCmd = sprintf(
                        '%s --no-playlist --write-auto-sub --write-sub --skip-download --sub-format vtt --sub-langs "en.*,ar.*"%s%s%s -o %s %s 2>&1',
                        escapeshellarg($ytdlpBin),
                        $cookiesArg,
                        $ytdlpHeaders,
                        $ytdlpCommon,
                        escapeshellarg($template),
                        escapeshellarg($url)
                    );
                    $ytdlpOutput = [];
                    $ytdlpStatus = 0;
                    exec($ytdlpCmd, $ytdlpOutput, $ytdlpStatus);

                    $matches = glob($storageDir . '/sub_*.vtt');
                    $candidates = array_filter($matches ?: [], function ($path) {
                        return is_file($path) && filesize($path) > 0;
                    });
                    $subtitlePath = $candidates ? array_reduce($candidates, function ($a, $b) {
                        return filemtime($a) >= filemtime($b) ? $a : $b;
                    }) : null;

                    if ($ytdlpStatus !== 0 || !$subtitlePath || !file_exists($subtitlePath)) {
                        return response()->json([
                            'message' => 'No subtitles found for this URL. Please upload the file instead.',
                            'debug' => implode("\n", $ytdlpOutput),
                            'status_code' => 422,
                        ], 422);
                    }

                    $raw = file_get_contents($subtitlePath) ?: '';
                    $lines = preg_split("/\r\n|\n|\r/", $raw);
                    $textLines = [];
                    foreach ($lines as $line) {
                        $line = trim($line);
                        if ($line === '' || $line === 'WEBVTT') {
                            continue;
                        }
                        if (str_contains($line, '-->')) {
                            continue;
                        }
                        if (preg_match('/^\d+$/', $line)) {
                            continue;
                        }
                        $textLines[] = $line;
                    }
                    $text = trim(preg_replace('/\s+/', ' ', implode(' ', $textLines)));

                    if ($text === '') {
                        $subtitleOnly = false;
                    } else {
                        return response()->json([
                            'text' => $text,
                            'source' => 'subtitles',
                        ]);
                    }
                }

                $response = Http::timeout(60)->get($url);
                $contentType = strtolower((string) ($response->header('Content-Type') ?? ''));

                if ($response->ok() && (
                    str_starts_with($contentType, 'audio/') ||
                    str_starts_with($contentType, 'video/') ||
                    str_starts_with($contentType, 'application/octet-stream')
                )) {
                    $contentLength = (int) ($response->header('Content-Length') ?? 0);
                    if ($contentLength > 200 * 1024 * 1024) {
                        return response()->json([
                            'message' => 'URL file is too large (max 200MB).',
                            'status_code' => 422,
                        ], 422);
                    }

                    $extension = pathinfo(parse_url($url, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION);
                    $extension = $extension ? '.' . ltrim($extension, '.') : '';
                    $filePath = $storageDir . '/transcribe_' . Str::random(12) . $extension;
                    $written = file_put_contents($filePath, $response->body());
                    if ($written === false || !file_exists($filePath)) {
                        return response()->json([
                            'message' => 'Failed to save URL media to disk.',
                            'debug' => [
                                'file_path' => $filePath,
                            ],
                            'status_code' => 422,
                        ], 422);
                    }
                } else {
                    $template = $storageDir . '/transcribe_%(id)s.%(ext)s';
                    $ytdlpCmd = sprintf(
                        '%s --no-playlist -f "bestaudio[ext=m4a]/bestaudio/best" -x --audio-format wav --audio-quality 0%s%s%s -o %s %s 2>&1',
                        escapeshellarg($ytdlpBin),
                        $cookiesArg,
                        $ytdlpHeaders,
                        $ytdlpCommon,
                        escapeshellarg($template),
                        escapeshellarg($url)
                    );
                    $ytdlpOutput = [];
                    $ytdlpStatus = 0;
                    exec($ytdlpCmd, $ytdlpOutput, $ytdlpStatus);

                    $matches = glob($storageDir . '/transcribe_*.wav');
                    $candidates = array_filter($matches ?: [], function ($path) {
                        return is_file($path) && filesize($path) > 0;
                    });

                    $latest = $candidates ? array_reduce($candidates, function ($a, $b) {
                        return filemtime($a) >= filemtime($b) ? $a : $b;
                    }) : null;

                    if ($ytdlpStatus !== 0 || !$latest || !file_exists($latest)) {
                        return response()->json([
                            'message' => 'Failed to download media from URL.',
                            'debug' => implode("\n", $ytdlpOutput),
                            'status_code' => 422,
                        ], 422);
                    }

                    $filePath = $latest;
                }
            }

            $probeCmd = sprintf(
                'ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 %s 2>&1',
                escapeshellarg($filePath)
            );
            $probeOutput = [];
            $probeStatus = 0;
            exec($probeCmd, $probeOutput, $probeStatus);

            $hasAudio = $probeStatus === 0 && trim(implode("\n", $probeOutput)) !== '';
            if (!$hasAudio) {
                return response()->json([
                    'message' => 'This file has no audio track. Please upload a file with audio.',
                    'status_code' => 422,
                ], 422);
            }

            $convertedPath = $storageDir . '/input_' . Str::random(12) . '.wav';
            $ffmpegCmd = sprintf(
                'ffmpeg -y -i %s -ar 16000 -ac 1 -vn %s 2>&1',
                escapeshellarg($filePath),
                escapeshellarg($convertedPath)
            );
            $ffmpegOutput = [];
            $ffmpegStatus = 0;
            exec($ffmpegCmd, $ffmpegOutput, $ffmpegStatus);
            if ($ffmpegStatus !== 0) {
                return response()->json([
                    'message' => 'Unsupported or invalid media file.',
                    'debug' => implode("\n", $ffmpegOutput),
                    'status_code' => 422,
                ], 422);
            }

            if (!file_exists($convertedPath)) {
                return response()->json([
                    'message' => 'Failed to prepare audio for transcription.',
                    'status_code' => 500,
                ], 500);
            }

            $python = env('TRANSCRIBE_PYTHON', '/usr/bin/python3');
            $script = env('TRANSCRIBE_SCRIPT', storage_path('transcribe/transcribe.py'));
            $model = env('TRANSCRIBE_MODEL', 'base');

            putenv('HF_HOME=' . $cacheDir);
            putenv('XDG_CACHE_HOME=' . $cacheDir);
            putenv('TRANSFORMERS_CACHE=' . $cacheDir);

            $cmd = sprintf(
                '%s %s --model %s --file %s 2>&1',
                escapeshellarg($python),
                escapeshellarg($script),
                escapeshellarg($model),
                escapeshellarg($convertedPath)
            );

            $output = shell_exec($cmd);
            if ($output === null) {
                return response()->json([
                    'message' => 'Transcription failed to run.',
                    'status_code' => 500,
                ], 500);
            }

            $lines = preg_split("/\r\n|\n|\r/", trim($output));
            $data = null;
            for ($i = count($lines) - 1; $i >= 0; $i--) {
                $candidate = trim($lines[$i]);
                if ($candidate === '') {
                    continue;
                }
                $decoded = json_decode($candidate, true);
                if (is_array($decoded)) {
                    $data = $decoded;
                    break;
                }
            }

            if (!is_array($data)) {
                Log::error('Transcribe output parse error', ['output' => $output]);
                $snippet = substr($output ?? '', 0, 800);
                return response()->json([
                    'message' => 'Transcription failed to parse output.',
                    'debug' => $snippet,
                    'status_code' => 500,
                ], 500);
            }

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Transcribe error', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return response()->json([
                'message' => 'Transcription failed.',
                'status_code' => 500,
            ], 500);
        } finally {
            if (!$skipCleanup) {
                if ($storedPath) {
                    @unlink(storage_path('app/private/' . $storedPath));
                } elseif ($filePath && file_exists($filePath)) {
                    @unlink($filePath);
                }
                if ($convertedPath && file_exists($convertedPath)) {
                    @unlink($convertedPath);
                }
                if ($subtitlePath && file_exists($subtitlePath)) {
                    @unlink($subtitlePath);
                }
                if ($cookiesTempPath && file_exists($cookiesTempPath)) {
                    @unlink($cookiesTempPath);
                }
            }
        }
    }

    public function transcribeStatus(string $jobId)
    {
        $user = Auth::user();
        $role = $user?->role;

        if (!in_array($role, ["SCHOOL_ADMIN", "HOD", "TEACHER"], true)) {
            return response()->json([
                'message' => 'You do not have access to this tool.',
                'status_code' => 403,
            ], 403);
        }

        $jobPath = storage_path('app/private/transcribe/jobs/' . $jobId . '.json');
        if (!file_exists($jobPath)) {
            return response()->json([
                'message' => 'Job not found.',
                'status_code' => 404,
            ], 404);
        }

        $contents = file_get_contents($jobPath);
        $data = json_decode($contents ?: '', true);
        if (!is_array($data)) {
            return response()->json([
                'message' => 'Invalid job status data.',
                'status_code' => 500,
            ], 500);
        }

        return response()->json($data);
    }
}
