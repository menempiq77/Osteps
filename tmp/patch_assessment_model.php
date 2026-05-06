<?php
$file = '/var/www/laravel/app/Models/Assessment.php';
$content = file_get_contents($file);

if (strpos($content, "'subject_id'") !== false) {
    echo 'subject_id already in fillable!' . PHP_EOL;
    exit(0);
}

// Handle multi-line fillable where 'position' is the last item
// Replace 'position' at end of fillable with 'position', 'subject_id'
$old = "'position'\n    ];";
$new = "'position',\n        'subject_id'\n    ];";
$updated = str_replace($old, $new, $content);

if ($updated === $content) {
    // Also try with different spacing
    $old2 = "'position'\r\n    ];";
    $new2 = "'position',\r\n        'subject_id'\r\n    ];";
    $updated = str_replace($old2, $new2, $content);
}

if ($updated === $content) {
    echo 'Pattern not found! Dumping fillable:' . PHP_EOL;
    preg_match('/fillable[^;]+;/s', $content, $m);
    echo bin2hex($m[0] ?? 'no match') . PHP_EOL;
    exit(1);
}

file_put_contents($file, $updated);
echo 'Done! Added subject_id to Assessment fillable.' . PHP_EOL;
