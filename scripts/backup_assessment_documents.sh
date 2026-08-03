#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="${OSTEPS_ASSESSMENT_DOCUMENTS_DIR:-/var/www/osteps/Osteps/.data/assessment-documents}"
BACKUP_DIR="${OSTEPS_ASSESSMENT_BACKUP_DIR:-/var/backups/osteps}"
STAMP="$(date -u +%Y%m%d-%H%M%S)"
ARCHIVE_PATH="${BACKUP_DIR}/assessment-documents-${STAMP}.tar.gz"

mkdir -p "$BACKUP_DIR"
exec 9>"${BACKUP_DIR}/.assessment-documents.lock"
flock -n 9 || exit 0

test -d "$SOURCE_DIR"
tar -czf "$ARCHIVE_PATH" -C "$(dirname "$SOURCE_DIR")" "$(basename "$SOURCE_DIR")"

find "$BACKUP_DIR" -maxdepth 1 -type f -name 'assessment-documents-*.tar.gz' -printf '%T@ %p\n' |
  sort -rn |
  tail -n +8 |
  cut -d' ' -f2- |
  xargs -r rm -f --
