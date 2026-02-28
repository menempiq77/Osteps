## Mind-upgrade points backend patch notes

These updates should be applied in the real Laravel backend controllers that power:

- `GET /get-studentProfile/{studentId}`
- `GET /get-whole-assessments-report/{id}`
- `GET /schoolget-whole-assessments-report`

### 1) StudentProfileController response additions

Add joins/aggregates for mind + tracker points:

```php
$mindPoints = (int) DB::table('mind_upgrade_student_points')
    ->where('student_id', $student->id)
    ->value('mind_points');

$trackerPoints = (int) DB::table('student_topic_marks')
    ->where('student_id', $student->id)
    ->sum('marks');

$student->mind_points = $mindPoints;
$student->tracker_points = $trackerPoints;
$student->total_points = $mindPoints + $trackerPoints;
```

### 2) ReportController response additions

For each student row emitted in report payloads, include:

- `mind_points`
- `tracker_points` (if available in report context)
- `total_points` (when applicable)

Recommended prefetch map for a report dataset:

```php
$mindByStudent = DB::table('mind_upgrade_student_points')
    ->whereIn('student_id', $studentIds)
    ->pluck('mind_points', 'student_id');
```

Then attach during response shaping:

```php
$row['mind_points'] = (int) ($mindByStudent[$studentId] ?? 0);
```

Keep existing report grading logic unchanged. Mind-upgrade points should be an additional metric.
