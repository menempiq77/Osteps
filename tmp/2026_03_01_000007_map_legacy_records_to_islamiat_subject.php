<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('subjects') || !Schema::hasTable('schools')) {
            return;
        }

        $schools = DB::table('schools')->select('id')->get();

        foreach ($schools as $school) {
            $subjectId = DB::table('subjects')
                ->where('school_id', $school->id)
                ->whereIn(DB::raw('LOWER(name)'), ['islamiat', 'islamic', 'islamic studies'])
                ->value('id');

            if (!$subjectId) {
                $subjectId = DB::table('subjects')->insertGetId([
                    'school_id' => $school->id,
                    'name' => 'Islamiat',
                    'code' => 'ISL',
                    'description' => 'Legacy mapped default subject',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $tables = ['quizzes', 'trackers', 'assessments', 'mind_upgrade_assignments', 'mind_upgrade_progress'];
            foreach ($tables as $tableName) {
                if (!Schema::hasTable($tableName) || !Schema::hasColumn($tableName, 'subject_id')) {
                    continue;
                }

                $query = DB::table($tableName)->whereNull('subject_id');
                if (Schema::hasColumn($tableName, 'school_id')) {
                    $query->where('school_id', $school->id);
                }
                $query->update(['subject_id' => $subjectId]);
            }

            if (Schema::hasTable('school_classes') && Schema::hasTable('subject_classes')) {
                $classes = DB::table('school_classes')->where('school_id', $school->id)->get();
                foreach ($classes as $class) {
                    DB::table('subject_classes')->updateOrInsert(
                        [
                            'school_id' => $school->id,
                            'subject_id' => $subjectId,
                            'name' => $class->class_name . '-Islamiat',
                        ],
                        [
                            'year_id' => $class->year_id ?? null,
                            'base_class_label' => $class->class_name,
                            'is_active' => true,
                            'updated_at' => now(),
                            'created_at' => now(),
                        ]
                    );
                }
            }
        }
    }

    public function down(): void
    {
        // Intentionally non-destructive rollback for data migration.
    }
};
