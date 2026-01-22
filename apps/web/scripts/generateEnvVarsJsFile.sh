#!/bin/bash
set -euo pipefail

FILE_DESTINATION=${1:-./env-vars.js}

echo "Generating ${FILE_DESTINATION}"

# Create file with proper JS structure
{
  echo "window._benefriches_env = {"

  # Use null-delimited output to handle special characters
  env -0 | while IFS='=' read -r -d '' varname value; do
    # Only process WEBAPP_ prefixed variables
    if [[ "$varname" == WEBAPP_* ]]; then
      # Escape backslashes and double quotes for valid JS string
      escaped_value="${value//\\/\\\\}"
      escaped_value="${escaped_value//\"/\\\"}"
      # Escape newlines
      escaped_value="${escaped_value//$'\n'/\\n}"

      echo "  $varname: \"$escaped_value\","
    fi
  done

  echo "};"
} > "${FILE_DESTINATION}"

echo "Generated ${FILE_DESTINATION}"
