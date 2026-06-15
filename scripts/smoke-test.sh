#!/usr/bin/env sh
set -eu

BASE_URL="${BASE_URL:-http://localhost}"
STAMP="$(date +%s)"
USER_ONE_EMAIL="smoke-alice-${STAMP}@example.com"
USER_TWO_EMAIL="smoke-bob-${STAMP}@example.com"
PASSWORD="strong-password"

json_field() {
  node -pe "JSON.parse(require('fs').readFileSync(0, 'utf8'))$1"
}

echo "Checking health endpoints on ${BASE_URL}"
curl -fsS "${BASE_URL}/health" >/dev/null
curl -fsS "${BASE_URL}/ready" >/dev/null

echo "Registering two users"
REGISTER_ONE_RESPONSE="$(curl -fsS -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${USER_ONE_EMAIL}\",\"name\":\"Alice\",\"password\":\"${PASSWORD}\"}")"
TOKEN_ONE="$(printf "%s" "${REGISTER_ONE_RESPONSE}" | json_field ".token")"

REGISTER_TWO_RESPONSE="$(curl -fsS -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${USER_TWO_EMAIL}\",\"name\":\"Bob\",\"password\":\"${PASSWORD}\"}")"
TOKEN_TWO="$(printf "%s" "${REGISTER_TWO_RESPONSE}" | json_field ".token")"

echo "Creating a task as first user"
TASK_RESPONSE="$(curl -fsS -X POST "${BASE_URL}/api/tasks" \
  -H "Authorization: Bearer ${TOKEN_ONE}" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Smoke test task\",\"description\":\"Created by smoke test\"}")"
TASK_ID="$(printf "%s" "${TASK_RESPONSE}" | json_field ".task.id")"

echo "Checking task isolation"
USER_ONE_TASK_COUNT="$(curl -fsS -H "Authorization: Bearer ${TOKEN_ONE}" "${BASE_URL}/api/tasks" | json_field ".tasks.length")"
USER_TWO_TASK_COUNT="$(curl -fsS -H "Authorization: Bearer ${TOKEN_TWO}" "${BASE_URL}/api/tasks" | json_field ".tasks.length")"

if [ "${USER_ONE_TASK_COUNT}" -lt 1 ]; then
  echo "Expected first user to see at least one task"
  exit 1
fi

if [ "${USER_TWO_TASK_COUNT}" -ne 0 ]; then
  echo "Expected second user to see zero tasks"
  exit 1
fi

echo "Completing, updating and deleting task"
curl -fsS -X PATCH "${BASE_URL}/api/tasks/${TASK_ID}/complete" \
  -H "Authorization: Bearer ${TOKEN_ONE}" >/dev/null

curl -fsS -X PATCH "${BASE_URL}/api/tasks/${TASK_ID}" \
  -H "Authorization: Bearer ${TOKEN_ONE}" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Smoke test task updated\",\"completed\":true}" >/dev/null

OTHER_USER_STATUS="$(curl -sS -o /tmp/todo-smoke-other-user.json -w "%{http_code}" \
  -X PATCH "${BASE_URL}/api/tasks/${TASK_ID}/complete" \
  -H "Authorization: Bearer ${TOKEN_TWO}")"

if [ "${OTHER_USER_STATUS}" -ne 404 ]; then
  echo "Expected another user to receive 404, got ${OTHER_USER_STATUS}"
  exit 1
fi

NO_TOKEN_STATUS="$(curl -sS -o /tmp/todo-smoke-no-token.json -w "%{http_code}" "${BASE_URL}/api/tasks")"

if [ "${NO_TOKEN_STATUS}" -ne 401 ]; then
  echo "Expected request without token to receive 401, got ${NO_TOKEN_STATUS}"
  exit 1
fi

curl -fsS -X DELETE "${BASE_URL}/api/tasks/${TASK_ID}" \
  -H "Authorization: Bearer ${TOKEN_ONE}" >/dev/null

echo "Smoke test passed"
