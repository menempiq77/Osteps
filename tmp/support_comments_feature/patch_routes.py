#!/usr/bin/env python3
"""Register routes for student support & wellbeing comments.

Run from the Laravel app root (/var/www/laravel). Idempotent.
"""
p = "routes/api.php"
s = open(p).read()

use_anchor = "use App\\Http\\Controllers\\Api\\StudentReportController;"
use_new = use_anchor + "\nuse App\\Http\\Controllers\\Api\\StudentSupportCommentController;"
if "StudentSupportCommentController;" not in s:
    if use_anchor not in s:
        raise SystemExit("StudentReportController use anchor not found")
    s = s.replace(use_anchor, use_new, 1)

anchor = "    Route::delete('student-reports/{id}',[StudentReportController::class,'destroy'])->name('student-reports-destroy');"
routes = """

    //student support & wellbeing comments
    Route::get('students/{studentId}/support-comments',[StudentSupportCommentController::class,'index'])->name('student-support-comments-index');
    Route::post('student-support-comments',[StudentSupportCommentController::class,'store'])->name('student-support-comments-store');
    Route::post('student-support-comments/{id}',[StudentSupportCommentController::class,'update'])->name('student-support-comments-update');
    Route::delete('student-support-comments/{id}',[StudentSupportCommentController::class,'destroy'])->name('student-support-comments-destroy');"""

if "student-support-comments-store" not in s:
    if anchor not in s:
        raise SystemExit("ANCHOR NOT FOUND (student-reports-destroy route)")
    s = s.replace(anchor, anchor + routes, 1)

open(p, "w").write(s)
print("import:", "StudentSupportCommentController;" in s, "routes:", "student-support-comments-store" in s)
