<?php

$opts = getopt('', [
    'job:',
    'file:',
    'storage:',
    'cache:',
    'python:',
    'script:',
    'model:',
]);

$jobId = $opts['job'] ?? null;
$filePath = $opts['file'] ?? null;
$storageDir = $opts['storage'] ?? null;
$cacheDir = $opts['cache'] ?? null;
$python = $opts['python'] ?? '/usr/bin/python3';
$script = $opts['script'] ?? '';
$model = $opts['model'] ?? 'base';

if (!$jobId || !$filePath || !$storageDir) {
    exit(1);
}

$jobsDir = rtrim($storageDir, '/\\') . '/jobs';
if (!is_dir($jobsDir)) {
    mkdir($jobsDir, 0755, true);
}

$jobPath = $jobsDir . '/' . $jobId . '.json';

$writeJob = function (string $status, array $payload = []) use ($jobPath, $jobId) {
    $data = array_merge([
        'status' => $status,
        'job_id' => $jobId,
        'updated_at' => date('c'),
    ], $payload);
    file_put_contents($jobPath, json_encode($data));
};

$writeJob('processing', ['started_at' => date('c')]);

try {
    if (!file_exists($filePath)) {
        $writeJob('failed', ['message' => 'Uploaded file is missing.']);
        exit(0);
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
        $writeJob('failed', ['message' => 'This file has no audio track. Please upload a file with audio.']);
        exit(0);
    }

    $durationCmd = sprintf(
        'ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 %s 2>&1',
        escapeshellarg($filePath)
    );
    $durationOutput = [];
    $durationStatus = 0;
    exec($durationCmd, $durationOutput, $durationStatus);
    $durationSeconds = $durationStatus === 0 ? (float) trim(implode("\n", $durationOutput)) : 0.0;

    $modelToUse = $model;
    if ($durationSeconds >= 600 && $model !== 'tiny') {
        $modelToUse = 'tiny';
    }

    $convertedPath = rtrim($storageDir, '/\\') . '/input_' . bin2hex(random_bytes(6)) . '.wav';
    $ffmpegCmd = sprintf(
        'ffmpeg -y -i %s -ar 16000 -ac 1 -vn %s 2>&1',
        escapeshellarg($filePath),
        escapeshellarg($convertedPath)
    );
    $ffmpegOutput = [];
    $ffmpegStatus = 0;
    exec($ffmpegCmd, $ffmpegOutput, $ffmpegStatus);
    if ($ffmpegStatus !== 0 || !file_exists($convertedPath)) {
        $writeJob('failed', [
            'message' => 'Unsupported or invalid media file.',
            'debug' => implode("\n", $ffmpegOutput),
        ]);
        exit(0);
    }

    if ($cacheDir) {
        putenv('HF_HOME=' . $cacheDir);
        putenv('XDG_CACHE_HOME=' . $cacheDir);
        putenv('TRANSFORMERS_CACHE=' . $cacheDir);
    }

    $cmd = sprintf(
        '%s %s --model %s --file %s 2>&1',
        escapeshellarg($python),
        escapeshellarg($script),
        escapeshellarg($modelToUse),
        escapeshellarg($convertedPath)
    );

    $output = shell_exec($cmd);
    if ($output === null) {
        $writeJob('failed', ['message' => 'Transcription failed to run.']);
        exit(0);
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
        $snippet = substr($output ?? '', 0, 800);
        $writeJob('failed', [
            'message' => 'Transcription failed to parse output.',
            'debug' => $snippet,
        ]);
        exit(0);
    }

    $writeJob('done', [
        'result' => $data,
        'model' => $modelToUse,
        'finished_at' => date('c'),
    ]);
} catch (Throwable $e) {
    $writeJob('failed', [
        'message' => 'Transcription failed.',
        'debug' => $e->getMessage(),
    ]);
} finally {
    if (isset($convertedPath) && $convertedPath && file_exists($convertedPath)) {
        @unlink($convertedPath);
    }
    if ($filePath && file_exists($filePath)) {
        @unlink($filePath);
    }
}
