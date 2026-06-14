import re

p = "routes/api.php"
s = open(p).read()

use_anchor = "use App\\Http\\Controllers\\Api\\StudentProfileController;"
use_new = use_anchor + "\nuse App\\Http\\Controllers\\Api\\StudentReportController;"
if "StudentReportController;" not in s:
    s = s.replace(use_anchor, use_new, 1)

anchor = "Route::post('search-studentProfile',[StudentProfileController::class,'searchStudentProfile'])->name('search-studentProfile');"
routes = """

    //student narrative reports (teacher written reports)
    Route::get('students/{studentId}/reports',[StudentReportController::class,'index'])->name('student-reports-index');
    Route::post('student-reports',[StudentReportController::class,'store'])->name('student-reports-store');
    Route::post('student-reports/{id}',[StudentReportController::class,'update'])->name('student-reports-update');
    Route::delete('student-reports/{id}',[StudentReportController::class,'destroy'])->name('student-reports-destroy');"""

if "student-reports-store" not in s:
    if anchor not in s:
        raise SystemExit("ANCHOR NOT FOUND")
    s = s.replace(anchor, anchor + routes, 1)

open(p, "w").write(s)
print("import:", "StudentReportController;" in s, "routes:", "student-reports-store" in s)
