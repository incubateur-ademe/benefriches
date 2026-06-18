#!/bin/sh
# Generate a JS file assigning every WEBAPP_*-prefixed env var to
# window._benefriches_env, read by the SPA at runtime (src/app/envVars.ts).
#
# Runs at container start (nginx docker-entrypoint.sh + Scalingo Procfile) so a
# single build is configured per environment. Must work under BOTH BusyBox ash
# (nginx:alpine) and bash (Scalingo); both support `env -0`, `read -d ''` and
# `${//}` substitution — keep to that shared subset.
set -eu

FILE_DESTINATION="${1:-./env-vars.js}"
TMP_FILE="${FILE_DESTINATION}.tmp.$$"

mkdir -p "$(dirname "$FILE_DESTINATION")"
trap 'rm -f "$TMP_FILE"' EXIT

{
  echo "window._benefriches_env = {"
  env -0 | while IFS='=' read -r -d '' varname value; do
    case "$varname" in
      WEBAPP_*) ;;
      *) continue ;;
    esac
    # Escape for a JS double-quoted string: backslash, quote, CR, LF.
    value="${value//\\/\\\\}"
    value="${value//\"/\\\"}"
    value="${value//$'\r'/\\r}"
    value="${value//$'\n'/\\n}"
    printf '  %s: "%s",\n' "$varname" "$value"
  done
  echo "};"
} > "$TMP_FILE"

mv "$TMP_FILE" "$FILE_DESTINATION"
echo "Generated $FILE_DESTINATION ($(grep -c '^  WEBAPP_' "$FILE_DESTINATION") variable(s))"
