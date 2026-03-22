#!/usr/bin/env bash
# Deploy: Add class_label to SubjectContextController student query
# This makes /subjects/my-context return sc.base_class_label as class_label
# for STUDENT role, so the frontend can display per-subject class names.
set -euo pipefail

cd /var/www/laravel

CTRL="app/Http/Controllers/Api/SubjectContextController.php"
cp "$CTRL" "${CTRL}.bak_class_label_$(date +%Y%m%d%H%M%S)"

# Replace the STUDENT branch selectRaw to include sc.base_class_label
python3 - <<'PY'
from pathlib import Path
import re

path = Path("app/Http/Controllers/Api/SubjectContextController.php")
text = path.read_text()

old = "->selectRaw($this->subjectSelectSql('s'))"
# Only replace the occurrence inside the STUDENT branch (first one after 'STUDENT')
student_pos = text.find("'STUDENT'")
if student_pos < 0:
    raise SystemExit("STUDENT branch not found in SubjectContextController.php")

idx = text.find(old, student_pos)
if idx < 0:
    if "class_label" in text[student_pos:student_pos+800]:
        print("Already patched — class_label present in STUDENT branch.")
    else:
        raise SystemExit("selectRaw not found after STUDENT branch")
else:
    new = "->selectRaw($this->subjectSelectSql('s') . ', sc.base_class_label as class_label')"
    text = text[:idx] + new + text[idx + len(old):]
    path.write_text(text)
    print("Patched SubjectContextController: student query now includes class_label.")

PY

echo "Done. Clear cache:"
php artisan config:clear
php artisan route:clear
echo "Deploy complete."
