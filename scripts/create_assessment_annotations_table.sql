CREATE TABLE IF NOT EXISTS assessment_document_annotations (
  id bigint unsigned AUTO_INCREMENT PRIMARY KEY,
  assessment_id bigint unsigned NOT NULL,
  task_id bigint unsigned NOT NULL,
  student_id bigint unsigned NOT NULL,
  status varchar(255) DEFAULT 'draft',
  student_locked tinyint(1) DEFAULT 0,
  student_annotations longtext,
  teacher_annotations longtext,
  metadata longtext,
  submitted_at datetime DEFAULT NULL,
  marked_at datetime DEFAULT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_assessment_task_student (assessment_id, task_id, student_id),
  KEY idx_assessment (assessment_id),
  KEY idx_task (task_id),
  KEY idx_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
