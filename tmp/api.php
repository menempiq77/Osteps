<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TermController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\YearController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\GradeController;
use App\Http\Controllers\Api\TopicController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\StatusController;
use App\Http\Controllers\Api\LibraryController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\TrackerController;
use App\Http\Controllers\LeaderBoardController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\BehaviourController;
use App\Http\Controllers\Api\TimeTableController;
use App\Http\Controllers\Api\AssessmentController;
use App\Http\Controllers\Api\AskQuestionController;
use App\Http\Controllers\Api\TrackerQuizController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\QuizQuestionController;
use App\Http\Controllers\Api\AssignQuizTermController;
use App\Http\Controllers\Api\AssignTaskQuizController;
use App\Http\Controllers\Api\ToogleProgressController;
use App\Http\Controllers\Api\LibraryCategoryController;
use App\Http\Controllers\Api\LibraryResourceController;
use App\Http\Controllers\Api\AssignAssessmentController;
use App\Http\Controllers\Api\StudentBehaviourController;
use App\Http\Controllers\Api\SuperAdminProfileController;
use App\Http\Controllers\Api\AssignTrackerClassController;
use App\Http\Controllers\Api\ProgressManagementController;
use App\Http\Controllers\Api\StudentAssessmentTaskController;
use App\Http\Controllers\Api\LibraryRequestApprovalController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\StudentProfileController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\ToolsController;
use App\Http\Controllers\Api\MindUpgradeController;

Route::get('/user', function (Request $request) {             
    return $request->user();
})->middleware('auth:sanctum');

Route::post('login',[AuthController::class,'login'])->name('login');
Route::get('test',[AuthController::class,'test'])->name('test');
Route::middleware(['auth:sanctum'])->group(function(){
    Route::post('logout',[AuthController::class,'logout'])->name('logout');

    //profile Apis//
    Route::post('change-password',[ProfileController::class,'changePassword'])->name('change-password');
    Route::post('update-schoolAdmin-profile',[ProfileController::class,'UpdateSchoolProfile'])->name('update-schoolAdmin-profile');
    Route::post('update-school-information',[ProfileController::class,'UpdateSchoolInformation'])->name('update-schoolAdmin-profile');

    //superAdmin profile//i have used dto and reposiry layer in this api
    Route::post('update-superAdmin-profile',[SuperAdminProfileController::class,'UpdateSuperAdminInformation'])->name('update-superAdmin-profile');
    Route::get('get-logo',[SuperAdminProfileController::class,'getLogo'])->name('get-logo');

    //student profile Apis 
    Route::post('update-student-profile',[ProfileController::class,'UpdateStudentProfile'])->name('update-student-profile');
    //teacher profile update
    Route::post('update-teacher-profile',[ProfileController::class,'UpdateTeacherProfile'])->name('update-teacher-profile');

    //Add admin, work like superAdmin
    Route::get('get-admin',[AdminController::class,'getAdmin'])->name('get-admin');
    Route::post('add-admin',[AdminController::class,'addAdmin'])->name('add-admin'); 
    Route::post('update-admin/{id}',[AdminController::class,'updateAdmin'])->name('update-admin');
    Route::post('delete-admin/{id}',[AdminController::class,'deleteAdmin'])->name('delete-admin');

    Route::get('school/dashboard',[SchoolController::class,'dashboard'])->name('school/dashboard');
    //Add School

    Route::get('get-school',[SchoolController::class,'getSchool'])->name('get-school');
    Route::post('add-school',[SchoolController::class,'addSchool'])->name('add-school');
    Route::post('update-school/{id}',[SchoolController::class,'updateSchool'])->name('update-school');
    Route::post('delete-school/{id}',[SchoolController::class,'deleteSchool'])->name('delete-school');

    //Add Years
    Route::get('get-year',[YearController::class,'getYear'])->name('get-year');
    Route::get('get-school-year/{id}',[YearController::class,'getSchoolYear'])->name('get-school-year');
    Route::post('add-year',[YearController::class,'addYear'])->name('add-year');
    Route::post('update-year/{id}',[YearController::class,'updateYear'])->name('update-year');
    Route::post('delete-year/{id}',[YearController::class,'deleteYear'])->name('delete-year');

    //Add Classes 
    Route::get('get-class/{id}',[ClassController::class,'getClass'])->name('get-class');
    Route::post('add-class',[ClassController::class,'addClass'])->name('add-class');
    Route::post('update-class/{id}',[ClassController::class,'updateClass'])->name('update-class');
    Route::post('delete-class/{id}',[ClassController::class,'deleteClass'])->name('delete-class');

    //now show the assign classes to the teacher on the base of teacher id
    Route::get('show-assign-classes-teacher/{teacherId}',[ClassController::class,'assignClasses'])->name('show-assign-classes-teacher');

    //get classes for an assign teacher
    Route::get('get-assign-year',[ClassController::class,'getAssignYear'])->name('get-assign-year');
    Route::get('get-assign-classes/{year_id}',[ClassController::class,'getAssignClass'])->name('get-assign-class');

    //Add Terms
    Route::get('get-term/{id}',[TermController::class,'getTerm'])->name('get-term');
    Route::post('add-term',[TermController::class,'addTerm'])->name('add-term');
    Route::post('update-term/{id}',[TermController::class,'updateTerm'])->name('update-term');
    Route::post('delete-term/{id}',[TermController::class,'deleteTerm'])->name('delete-term');

    // Assessment 
    //get assessment on base school id
    Route::get('get-school-assessments/{schoolId}',[AssessmentController::class,'getSchoolAssessments'])->name('get-school-assessments');

    Route::post('assign-assessments',[AssignAssessmentController::class,'assignAssessments'])->name('assign-assessments');
    Route::post('unassign-assessments',[AssignAssessmentController::class,'unassignAssessments'])->name('unassign-assessments');

    Route::get('get-assessment/{termId}',[AssessmentController::class,'getAssessment'])->name('get-assessment');
    Route::post('add-assessment',[AssessmentController::class,'addAssessment'])->name('add-assessment');
    Route::post('reorder-assessment',[AssessmentController::class,'reorder'])->name('reorder-assessment');

    Route::post('update-assessment/{id}',[AssessmentController::class,'updateAssessment'])->name('update-assessment');
    Route::post('delete-assessment/{id}',[AssessmentController::class,'deleteAssessment'])->name('delete-assessment');

    //assign specific quiz inside terms
    Route::get('get-assign-term-quiz/{term_id}',[AssignQuizTermController::class,'getAssignTermQuiz'])->name('get-assign-term-quiz');
    Route::post('add-assign-term-quiz',[AssignQuizTermController::class,'addAssignTermQuiz'])->name('add-assign-term-quiz');
    Route::put('update-assign-term-quiz/{id}',[AssignQuizTermController::class,'updateAssignTermQuiz'])->name('update-assign-term-quiz');
    Route::delete('delete-assign-term-quiz/{id}',[AssignQuizTermController::class,'deleteAssignTermQuiz'])->name('delete-assign-term-quiz');

    //get specific student tasks and assignments on the base of its terms
    Route::get('get-student-assessment/{term_id}',[AssessmentController::class,'getStudentAssessment'])->name('get-student-assessment');
    Route::get('dashboard-student-assessment',[AssessmentController::class,'dashboardAssessment'])->name('dashboard-student-assessment');
    //add the marks of student tasks
    Route::post('add-student-task-marks/{id}',[AssessmentController::class,'addStudentTaskMarks'])->name('add-student-task-marks');

    //get the tasks of speific assessment that is assigned for student
    Route::get('get-student-assessment-tasks/{assessment_id}',[StudentAssessmentTaskController::class,'getStudentAssessmentTasks'])->name('get-student-assessment-tasks');
    //submit the task of assessment
    Route::post('submit-student-assessment-tasks/{assessment_id}',[StudentAssessmentTaskController::class,'submitStudentAssessmentTasks'])->name('submit-student-assessment-tasks');
    
    //add tasks
    Route::get('get-tasks/{id}',[TaskController::class,'getById'])->name('get-tasks');
    Route::post('add-task',[TaskController::class,'addTask'])->name('add-task');
    Route::post('update-task/{id}',[TaskController::class,'updateTask'])->name('update-task');
    Route::post('delete-task/{id}',[TaskController::class,'deleteTask'])->name('delete-task');
    
    //mark url task_type tasks
    Route::post('mark-url-taskAsComplete',[TaskController::class,'urlTaskAsComplete'])->name('mark-url-taskAsComplete');

    //assign quize inside task
    Route::post('assign-task-quiz',[AssignTaskQuizController::class,'assignTaskQuiz'])->name('assign-task-quiz');
    Route::post('remove-task-quiz/{quizId}',[AssignTaskQuizController::class,'removeTaskQuiz'])->name('remove-task-quiz');

    //add-teacher
    Route::get('get-teacher',[TeacherController::class,'getTeacher'])->name('get-teacher');
    Route::get('getspecTeachers',[TeacherController::class,'getspecTeachers'])->name('getspecTeachers');

    Route::post('add-teacher',[TeacherController::class,'addTeacher'])->name('add-teacher');
    Route::post('update-teacher/{id}',[TeacherController::class,'updateTeacher'])->name('update-teacher');
    Route::post('delete-teacher/{id}',[TeacherController::class,'deleteTeacher'])->name('delete-teacher');

    //assign teacher
    Route::post('assign-teacher',[TeacherController::class,'assignTeacher'])->name('assign-teacher');
    Route::post('unassign-teacher',[TeacherController::class,'unassignTeacher'])->name('unassign-teacher');
    Route::get('get-assign-teacher/{classId}',[TeacherController::class,'getAssignedTeachers'])->name('get-assign-teacher');

    //add Student
    Route::get('get-student/{class_id}',[StudentController::class,'getStudent'])->name('get-student');
    Route::post('add-student',[StudentController::class,'addStudent'])->name('add-student');
    Route::post('update-student/{id}',[StudentController::class,'updateStudent'])->name('update-student');
    Route::post('delete-student/{id}',[StudentController::class,'deleteStudent'])->name('delete-student');

    //grades-apis
    Route::get('get-grades/{id}',[GradeController::class,'getGrades'])->name('get-grades'); 
    Route::post('add-grades',[GradeController::class,'addGrades'])->name('add-grades');
    Route::post('update-grades/{id}',[GradeController::class,'updateGrades'])->name('update-grades');
    Route::post('delete-grades/{id}',[GradeController::class,'deleteGrades'])->name('delete-grades');

    //reports modeule api
    //here get the assigned years and classes for teacher
    Route::get('get-assigned-year-classes',[ReportController::class,'getAssignedYearClasses'])->name('get-assigned-year-classes');
    Route::get('get-report-assessments/{id}',[ReportController::class,'getReportAssessment'])->name('get-report-assessments');
    Route::get('get-report-specific-assessment-tasks/{id}',[ReportController::class,'getAssessmentTasks'])->name('get-report-specific-assessment-tasks');
    Route::get('get-whole-assessments-report/{id}',[ReportController::class,'getWholeAssessmentReport'])->name('get-whole-assessments-report');
    Route::get('schoolget-whole-assessments-report',[ReportController::class,'schoolgetWholeAssessmentReport'])->name('schoolget-whole-assessments-report');

    Route::get('getall-assigned-year-classes',[ReportController::class,'getallAssignedYearClasses'])->name('getall-assigned-year-classes');

    //add status
    Route::get('get-statuses',[StatusController::class,'getStatuses'])->name('get-statuses');
    Route::post('add-status',[StatusController::class,'addStatus'])->name('add-status');
    Route::post('update-status/{id}',[StatusController::class,'updateStatus'])->name('update-status');
    Route::post('delete-status/{id}',[StatusController::class,'deleteStatus'])->name('delete-status');

    //Tracker Api
    Route::get('get-school-trackers/{schoolId}',[TrackerController::class,'getSchoolTrackers'])->name('get-school-trackers');

    Route::get('get-trackers/{id}',[TrackerController::class,'getTrackers'])->name('get-trackers');
    Route::post('add-trackers',[TrackerController::class,'addTrackers'])->name('add-trackers');
    Route::post('reorder-trackers',[TrackerController::class,'reorder'])->name('reorder-trackers');
    Route::post('update-trackers/{id}',[TrackerController::class,'updateTrackers'])->name('update-trackers');
    Route::post('delete-trackers/{id}',[TrackerController::class,'deleteTrackers'])->name('delete-trackers');

    ///////////claim certificate/////////
    Route::post('claim-certificate',[TrackerController::class,'claimCertificate'])->name('claim-certificate'); //student will claim the certificate if the tracker have claim_certificate value 1
    Route::post('check-certificate-request',[TrackerController::class,'checkCertificateRequest'])->name('check-certificate-request'); //when click on tracker check the request
    Route::get('certificate-request',[TrackerController::class,'certificateRequests'])->name('certificate-request'); //teacher  will see the certificate request 
    Route::post('upload-certificate',[TrackerController::class,'uploadCertificate'])->name('upload-certificate'); //teacher  will upload the certificate  
    Route::get('download-certificate/{claimId}',[TrackerController::class,'downloadCertificate'])->name('download-certificate'); //teacher  will upload the certificate  
    Route::get('myclaim-certificate',[TrackerController::class,'myCertificateClaims'])->name('myclaim-certificate'); 

    ///////points check tracker//
    Route::get('student-trackerProgress-points/{trackerId}',[TrackerController::class,'getTrackerProgressPoints'])->name('student-trackerProgress-points'); //teacher  will see the certificate request 
    Route::get('teacher-track-points/{trackerId}/{studentId}',[TrackerController::class,'getstudentTrackerProgressPoints'])->name('teacher-track-points'); //teacher  will see the certificate request 

    //Approve or Reject the Tracker
    Route::get('fetch-tracker-requests',[TrackerController::class,'fetchTrackerRequests'])->name('fetch-tracker-requests');
    Route::get('accept-tracker/{id}',[TrackerController::class,'acceptTrackers'])->name('accept-tracker');
    Route::get('reject-tracker/{id}',[TrackerController::class,'rejectTrackers'])->name('reject-tracker');

    //Add tpoics of each tracker  like surah, hadith etc
    Route::get('get-topics-progress/{id}',[TopicController::class,'getTopicsWithProgress'])->name('get-topics-progress'); //on base of tracker id
    Route::post('add-topic',[TopicController::class,'addTopic'])->name('add-topic');
    Route::post('reorder-topic',[TopicController::class,'reorderTopics'])->name('reorder-topic');
    Route::post('update-topic/{id}',[TopicController::class,'updateTopic'])->name('update-topic');
    Route::post('delete-topic/{id}',[TopicController::class,'deleteTopic'])->name('delete-topic');


    //get tracker and its associated topics =for teacher
    Route::get('get-tracker-topics/{id}',[TopicController::class,'getTrackerTopics'])->name('get-tracker-topics'); //on base of tracker id
    Route::get('get-trackerTopics/{trackerId}-studentProgress/{studentId}',[TopicController::class,'getStudentTopicsProgress'])->name('get-trackerTopics-studentProgress'); //on base of tracker id

    //get tracker topic on the base of student id, means get the tracker topics of each student then add marks
    Route::get('get-student-tracker-topics/{studentId}/{trackerId}',[TopicController::class,'getStudentTrackerTopics'])->name('get-student-tracker-topics');
    // Route::get('get-student-tracker-topics/{tracker_id}/{student_id}', [TopicController::class, 'getStudentTrackerTopics'])->name('get-student-tracker-topics');
 
    // tracker topic mark by teacher
    Route::post('add-topic-marks',[TopicController::class,'addTopicMarks'])->name('add-topic-marks'); //add total mark of each topic
    //here in this api add the marks of each topic for each student
    Route::post('add-student-topic-marks',[TopicController::class,'addStudentTopicMarks'])->name('add-student-topic-marks');
    Route::post('transcribe',[ToolsController::class,'transcribe'])->name('transcribe');
    Route::get('transcribe/{jobId}',[ToolsController::class,'transcribeStatus'])->name('transcribe-status');
 //add each topic mark for student

    //add toogle values
    Route::post('add-toggleProgress',[ToogleProgressController::class,'toggleProgress'])->name('add-toggleProgress');
    Route::get('/tracker/certificate-eligibility/{tracker_id}',
        [ToogleProgressController::class, 'certificateEligibility']
    ); 

    //add quiz
    Route::post('add-quiz',[QuizController::class,'addQuiz'])->name('add-quiz');
    Route::get('get-quiz/{id}',[QuizController::class,'getQuiz'])->name('get-quiz');
    Route::post('update-quiz/{id}',[QuizController::class,'updateQuiz'])->name('update-quiz');
    Route::post('delete-quiz/{id}',[QuizController::class,'deleteQuiz'])->name('delete-quiz');

    //approve or reject quiz
    Route::get('fetch-quiz-requests',[QuizController::class,'quizRequests'])->name('fetch-quiz-requests');
    Route::get('approve-quiz/{id}',[QuizController::class,'approveQuiz'])->name('approve-quiz');
    Route::get('reject-quiz/{id}',[QuizController::class,'rejectQuiz'])->name('reject-quiz');

    //add tracker quiz controller
        //here api for the quiz that we are adding inside tracker->topics 
    Route::get('get-tracker-quiz/{id}',[TrackerQuizController::class,'getTrackerQuiz'])->name('get-tracker-quiz'); //on base of tracker id
    Route::post('assign-tracker-quiz',[TrackerQuizController::class,'addTrackerQuiz'])->name('add-tracker-quiz'); 
    Route::post('update-tracker-quiz/{id}',[TrackerQuizController::class,'updateTrackerQuiz'])->name('update-tracker-quiz'); 
    Route::post('delete-tracker-quiz/{id}',[TrackerQuizController::class,'deleteTrackerQuiz'])->name('delete-tracker-quiz'); 
    
    //now assign tracker to class,
    Route::post('assign-tracker-class',[AssignTrackerClassController::class,'assignTrackerClass'])->name('assign-tracker-class'); 
    Route::post('unassign-tracker-class',[AssignTrackerClassController::class,'unassignTrackerClass'])->name('unassign-tracker-class'); 
    Route::post('update-assign-tracker-class/{id}',[AssignTrackerClassController::class,'updateAssignTrackerClass'])->name('update-assign-tracker-class'); 
    Route::post('delete-assign-tracker-class/{id}',[AssignTrackerClassController::class,'deleteAssignTrackerClass'])->name('delete-assign-tracker-class'); 

    // add quiz question controller
    Route::get('get-quiz-questions/{id}',[QuizQuestionController::class,'getQuizQuestion'])->name('get-quiz-questions'); //on base of tracker id
    Route::post('add-quiz-question',[QuizQuestionController::class,'store'])->name('add-quiz-question'); 
    Route::post('update-quiz-question/{id}',[QuizQuestionController::class,'update'])->name('update-quiz-question'); 
    Route::post('delete-quiz-question/{id}',[QuizQuestionController::class,'delete'])->name('delete-quiz-question'); 
  
    //now student will submit the answers via this api
    Route::post('submitQuizAnswers',[QuizQuestionController::class,'submitQuizAnswers'])->name('submitQuizAnswers'); 
    // Route::get('get-SubmittedQuizDetails',[QuizQuestionController::class,'getSubmittedQuizDetails'])->name('get-SubmittedQuizDetails'); 
    Route::get('get-SubmittedQuizDetails/{quizId}/{studentId}/{type}',[QuizQuestionController::class,'getSubmittedQuizDetails'])->name('get-SubmittedQuizDetails'); 
    Route::post('/quiz-answer/{id}', [QuizQuestionController::class, 'markAnswer']); //quiz_answer id use to add marks

    //add status values of progress
    // Route::get('get-progress-values/{id}',[ProgressManagementController::class,'getProgressValues'])->name('get-progress-values'); //tracker id on path
    // Route::post('add-progress-values/{id}',[ProgressManagementController::class,'addProgressValues'])->name('add-progress-values'); //tracker id on path

    //add announcement
    Route::get('get-announcement',[AnnouncementController::class,'getAnnouncement'])->name('get-announcement');
    Route::post('add-announcement',[AnnouncementController::class,'addAnnouncement'])->name('add-announcement');
    Route::post('update-announcement/{id}',[AnnouncementController::class,'updateAnnouncement'])->name('update-announcement');
    Route::post('delete-announcement/{id}',[AnnouncementController::class,'deleteAnnouncement'])->name('delete-announcement');

    Route::get('mark-announcement-seen/{id}',[AnnouncementController::class,'markAsSeen'])->name('mark-announcement-seen');
    Route::get('unseen-announcement-count',[AnnouncementController::class,'unseenCount'])->name('unseen-announcement-count');

    /////Library Model Apis///////////
    ///category api////////
    Route::get('get-category',[LibraryCategoryController::class,'getCategory'])->name('get-category');
    Route::post('add-category',[LibraryCategoryController::class,'addCategory'])->name('add-category');
    Route::post('update-category/{id}',[LibraryCategoryController::class,'updateCategory'])->name('update-category');
    Route::post('delete-category/{id}',[LibraryCategoryController::class,'deleteCategory'])->name('delete-category');

    //library resource//
    Route::get('get-resources',[LibraryResourceController::class,'getResources'])->name('get-resources');
    Route::post('add-resource',[LibraryResourceController::class,'addResource'])->name('add-resource');
    Route::post('update-resource/{id}',[LibraryResourceController::class,'updateResource'])->name('update-resource');
    Route::post('delete-resource/{id}',[LibraryResourceController::class,'deleteResource'])->name('delete-resource');

    //library apis
    Route::get('get-library',[LibraryController::class,'getLibrary'])->name('get-library');
    Route::post('add-library',[LibraryController::class,'addLibrary'])->name('add-library');
    Route::post('update-library/{id}',[LibraryController::class,'updateLibrary'])->name('update-library');
    Route::post('delete-library/{id}',[LibraryController::class,'deleteLibrary'])->name('delete-library');

    //////approve disapprove model 
    Route::get('fetch-library-requests',[LibraryRequestApprovalController::class,'fetchLibraryRequests'])->name('fetch-library');
    Route::get('approve-library-request/{id}',[LibraryRequestApprovalController::class,'ApproveLibraryRequest'])->name('approve-library-request');
    Route::get('reject-library-request/{id}',[LibraryRequestApprovalController::class,'RejectLibraryRequest'])->name('reject-library-request');

    //timeTables
    Route::get('get-timeTable',[TimeTableController::class,'getTimeTable'])->name('get-timeTable');
    Route::post('add-timeTable',[TimeTableController::class,'addTimeTable'])->name('add-timeTable');
    Route::post('update-timeTable/{id}',[TimeTableController::class,'updateTimeTable'])->name('add-timeTable');
    Route::post('delete-timeTable/{id}',[TimeTableController::class,'deleteTimeTable'])->name('delete-timeTable');

    //Ask Question Module
    Route::get('get-askQuestions',[AskQuestionController::class,'getAskQuestions'])->name('get-askQuestions');
    Route::post('askQuestion',[AskQuestionController::class,'askQuestion'])->name('askQuestion');
    Route::post('update-askQuestion/{id}',[AskQuestionController::class,'updateAskQuestion'])->name('update-askQuestion');
    Route::post('delete-askQuestion/{id}',[AskQuestionController::class,'deleteAskQuestion'])->name('delete-askQuestion');

    Route::get('filter-askQuestion',[AskQuestionController::class,'filterAskQuestion'])->name('filter-askQuestion');

    //get the questions that will be relevent to teacher
    Route::get('get-askQuestionTeacher',[AskQuestionController::class,'getAskQuestionsTeacher'])->name('get-askQuestionTeacher');

    ////////Notifications apis//////////////
    Route::get('get-notifications', [NotificationController::class, 'getNotifications'])->name('get-notifications');
    Route::get('/unread-notifications', [NotificationController::class, 'getUnreadNotifications'])->name('unread-notifications');
    Route::get('/unread-count', [NotificationController::class, 'getUnreadCount'])->name('unread-count');
    // Route::get('/mark-as-read/{id}', [NotificationController::class, 'markAsRead'])->name('mark-as-read');
    Route::get('/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('mark-all-read');
    // Route::delete('/{id}', [NotificationController::class, 'deleteNotification']);
    // Route::delete('/clear-all', [NotificationController::class, 'clearAll']);

    //Answer of Question
    Route::post('submitAnswer/{id}',[AskQuestionController::class,'submitAnswer'])->name('submitAnswer');
    Route::post('filterQuestionAndAnswers',[AskQuestionController::class,'QuestionAndAnswers'])->name('filterQuestionAndAnswers');

    //Behaviour type Apis
    Route::get('get-behaviour',[BehaviourController::class,'getBehaviour'])->name('get-behaviour');
    Route::post('add-behaviour',[BehaviourController::class,'addBehaviour'])->name('add-behaviour');
    Route::put('update-behaviour/{id}',[BehaviourController::class,'updateBehaviour'])->name('update-behaviour');
    Route::delete('delete-behaviour/{id}',[BehaviourController::class,'deleteBehaviour'])->name('delete-behaviour');

    //Student Behaviour
    Route::get('get-studentBehaviour/{student_id}',[StudentBehaviourController::class,'getStudentBehaviour'])->name('get-studentBehaviour');
    Route::post('add-studentBehaviour',[StudentBehaviourController::class,'addStudentBehaviour'])->name('add-studentBehaviour');
    Route::put('update-studentBehaviour/{id}',[StudentBehaviourController::class,'updateStudentBehaviour'])->name('update-studentBehaviour');
    Route::delete('delete-studentBehaviour/{id}',[StudentBehaviourController::class,'deleteStudentBehaviour'])->name('delete-studentBehaviour');

    /////leaderboard Apis/
    Route::get('get-student-scores/{id}',[LeaderBoardController::class,'getStudentsTotalMarks'])->name('get-student-scores');
    Route::get('leaderboard/school-self',[LeaderBoardController::class,'schoolSelf'])->name('leaderboard-school-self');

    /////mind-upgrade Apis/
    Route::get('mind-upgrade/catalog', [MindUpgradeController::class, 'catalog'])->name('mind-upgrade-catalog');
    Route::post('mind-upgrade/assignments', [MindUpgradeController::class, 'assignCourses'])->name('mind-upgrade-assignments-store');
    Route::get('mind-upgrade/assignments/manage', [MindUpgradeController::class, 'manageAssignments'])->name('mind-upgrade-assignments-manage');
    Route::delete('mind-upgrade/assignments/{id}', [MindUpgradeController::class, 'unassign'])->name('mind-upgrade-assignments-destroy');
    Route::get('mind-upgrade/assignments/my', [MindUpgradeController::class, 'myAssignments'])->name('mind-upgrade-assignments-my');
    Route::post('mind-upgrade/progress/quiz-complete', [MindUpgradeController::class, 'submitQuizCompletion'])->name('mind-upgrade-progress-quiz');
    Route::post('mind-upgrade/progress/minigame-complete', [MindUpgradeController::class, 'submitMiniGameCompletion'])->name('mind-upgrade-progress-minigame');
    Route::get('mind-upgrade/points/student/{studentId}', [MindUpgradeController::class, 'studentPoints'])->name('mind-upgrade-student-points');

    //add user using DTO 
    Route::post('add-user',[UserController::class,'addUser'])->name('add-user');

    //Add Materials for students by teacher
    Route::post('add-material',[MaterialController::class,'addMaterial'])->name('add-material');
    Route::post('update-material/{materialId}',[MaterialController::class,'updateMaterial'])->name('update-material');
    Route::delete('delete-material/{materialId}',[MaterialController::class,'deleteMaterial'])->name('delete-material');
    Route::get('get-material',[MaterialController::class,'getMaterial'])->name('get-material');

    ///////student upload the material//
    Route::post('upload-material',[MaterialController::class,'uploadMaterial'])->name('upload-material');

    //student of relevent class will access the material
    Route::get('get-student-material',[MaterialController::class,'getStudentMaterial'])->name('get-student-material');
    Route::get('get-student-submissions/{materialId}',[MaterialController::class,'getStudentSubmissions'])->name('get-student-submissions');

    /////Subject///
    Route::post('add-subject',[SubjectController::class,'addSubject'])->name('add-subject');
    Route::post('update-subject/{id}',[SubjectController::class,'updateSubject'])->name('update-subject');
    Route::post('delete-subject/{id}',[SubjectController::class,'deleteSubject'])->name('delete-subject');
    Route::get('get-subject',[SubjectController::class,'getSubject'])->name('get-subject');

    Route::get('get-studentProfile/{studentId}',[StudentProfileController::class,'studentProfile'])->name('get-studentProfile');
    Route::post('search-studentProfile',[StudentProfileController::class,'searchStudentProfile'])->name('search-studentProfile');

});
