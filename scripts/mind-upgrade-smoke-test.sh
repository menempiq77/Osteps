#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   API_BASE_URL="https://YOUR_API_URL/api" \
#   ADMIN_TOKEN="..." \
#   STUDENT_TOKEN="..." \
#   CLASS_ID="123" \
#   STUDENT_ID="456" \
#   ./scripts/mind-upgrade-smoke-test.sh

if [[ -z "${API_BASE_URL:-}" || -z "${ADMIN_TOKEN:-}" || -z "${STUDENT_TOKEN:-}" || -z "${CLASS_ID:-}" || -z "${STUDENT_ID:-}" ]]; then
  echo "Missing required env vars: API_BASE_URL, ADMIN_TOKEN, STUDENT_TOKEN, CLASS_ID, STUDENT_ID"
  exit 1
fi

echo "1) Catalog"
curl -sS -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  "${API_BASE_URL}/mind-upgrade/catalog" | jq .

echo "2) Assign aqeedah to class ${CLASS_ID}"
curl -sS -X POST "${API_BASE_URL}/mind-upgrade/assignments" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"course_key\": \"aqeedah\",
    \"class_ids\": [${CLASS_ID}]
  }" | jq .

echo "3) Student assignment visibility"
curl -sS -H "Authorization: Bearer ${STUDENT_TOKEN}" \
  "${API_BASE_URL}/mind-upgrade/assignments/my" | jq .

echo "3b) Assign aqeedah directly to student ${STUDENT_ID}"
curl -sS -X POST "${API_BASE_URL}/mind-upgrade/assignments" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"course_key\": \"aqeedah\",
    \"student_ids\": [${STUDENT_ID}]
  }" | jq .

echo "4) Student quiz completion (+100/+150 based on score)"
curl -sS -X POST "${API_BASE_URL}/mind-upgrade/progress/quiz-complete" \
  -H "Authorization: Bearer ${STUDENT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "course_key": "aqeedah",
    "unit_key": "aqeedah:aqeedah-1:quiz",
    "score": 7,
    "total": 10
  }' | jq .

echo "5) Student minigame completion (+15 or +30)"
curl -sS -X POST "${API_BASE_URL}/mind-upgrade/progress/minigame-complete" \
  -H "Authorization: Bearer ${STUDENT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "course_key": "aqeedah",
    "unit_key": "aqeedah:aqeedah-1:checkpoint-4:minigame",
    "xp": 30
  }' | jq .

echo "6) Student points endpoint"
curl -sS -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  "${API_BASE_URL}/mind-upgrade/points/student/${STUDENT_ID}" | jq .

echo "7) School leaderboard should include mind points in total_marks"
curl -sS -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  "${API_BASE_URL}/leaderboard/school-self" | jq .

echo "Smoke test done."
