<?php
use Illuminate\Support\Facades\DB;

$sc = DB::table('subject_classes')->where('id', 37)->first();
echo "SC37: " . json_encode($sc) . "\n\n";

$names = ['AbdullahAli', 'Ege', 'Khizar', 'Talia'];
foreach ($names as $n) {
    $rows = DB::table('students')->where('student_name', 'like', '%' . $n . '%')->get();
    foreach ($rows as $s) {
        $enr = DB::table('student_subject_enrollments')->where('student_id', $s->id)->get();
        $base = DB::table('school_classes')->where('id', $s->class_id)->first();
        echo $s->student_name . " id=" . $s->id
            . " class_id=" . $s->class_id
            . " baseClass=" . ($base ? $base->class_name . "(year " . $base->year_id . ")" : "NULL")
            . " school_id=" . $s->school_id . "\n"
            . "   enrollments=" . json_encode($enr) . "\n";
    }
}
