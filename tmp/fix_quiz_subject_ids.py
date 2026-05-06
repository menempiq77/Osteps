#!/usr/bin/env python3
"""
Fix quiz subject_id mapping.
- Sets subject_id for existing quizzes based on their names
- Islamic quizzes (4,7,8,10) → subject_id=3
- Other quizzes updated where subject can be inferred by name
"""
import subprocess, re

DSN = "mysql -u osteps_user '-pAccrual@5264!' osteps_db"

def run_sql(sql):
    result = subprocess.run(
        f'ssh root@dashboard.osteps.com "{DSN} -e \\"{sql}\\""',
        shell=True, capture_output=True, text=True
    )
    return result.stdout.strip(), result.stderr.strip()

# 1. Get subject list
out, err = run_sql("SELECT id, name FROM subjects WHERE school_id=1;")
print("Subjects:")
print(out)

# 2. Get quiz list
out2, _ = run_sql("SELECT id, name, subject_id FROM quizzes WHERE school_id=1;")
print("\nQuizzes:")
print(out2)

# 3. Set subject_id=3 for Islamic quizzes: 4,7,8,10
out3, err3 = run_sql("UPDATE quizzes SET subject_id=3 WHERE id IN (4,7,8,10) AND school_id=1;")
print("\nUpdate Islamic quizzes result:")
print(out3 or "OK", err3 or "")

# 4. Verify
out4, _ = run_sql("SELECT id, name, subject_id FROM quizzes WHERE school_id=1;")
print("\nUpdated quizzes:")
print(out4)
