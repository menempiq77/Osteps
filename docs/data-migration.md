# File storage to Laravel DB migration

Each feature remains file-backed by default. Set its storage flag to `laravel` only after installing the corresponding files under `tmp/data_migration` in the Laravel backend and running `php artisan migrate`.

## Quiz incidents

Set `QUIZ_INCIDENTS_STORAGE=laravel`. Backfill each event from `.data/quiz-incidents/{assessment}/{quiz}/{student}.json` into `quiz_incidents`, mapping the directory identifiers and event `reason`, `context`, and `createdAt`. A Laravel artisan command should iterate JSON files and use `QuizIncident::updateOrCreate` scoped by `school_id` and `student_id`.

## Student notes

Set `STUDENT_NOTES_STORAGE=laravel` and `STUDENT_NOTES_LARAVEL_BASE_URL` (or use `NEXT_PUBLIC_API_BASE_URL`). Import `.data/student-notes.json` entries with `StudentNote::updateOrCreate(['school_id'=>..., 'student_id'=>$id], ['note'=>$note])`.

## Class story

Set `CLASS_STORY_STORAGE=laravel`. Import posts from `.data/class-story/posts/**` into `class_story_posts`, preserving class and author IDs; import reactions from `.data/class-story/reactions/**` into `class_story_reactions`. Scope every insert by `school_id`, and use `updateOrCreate` for the `(item_id,user_id)` reaction key.

The draft migrations, models/controllers, and route snippets are in `tmp/data_migration/{quiz_incidents,student_notes,class_story}`.
