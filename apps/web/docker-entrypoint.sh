#!/bin/sh
set -e

# Constants
NGINX_ROOT="/usr/share/nginx/html"
SITE_CONF_TEMPLATE="/etc/nginx/templates/site.conf.template"
SITE_CONF_OUTPUT="/etc/nginx/conf.d/site.conf"

# Validate required environment variables
if [ -z "$API_HOST_URL" ]; then
  echo "ERROR: API_HOST_URL environment variable is not set" >&2
  exit 1
fi
# Validate required environment variables
if [ -z "$WEBAPP_MUTAFRICHES_FRAME_SRC" ]; then
  echo "ERROR: WEBAPP_MUTAFRICHES_FRAME_SRC environment variable is not set" >&2
  exit 1
fi

echo "Configuring nginx..."
echo "  API_HOST_URL: $API_HOST_URL"
echo "  WEBAPP_MUTAFRICHES_FRAME_SRC: $WEBAPP_MUTAFRICHES_FRAME_SRC"

# Process ERB template to generate site config
sed -e "s|<%= ENV\['API_HOST_URL'\] %>|${API_HOST_URL}|g" \
    -e "s|<%= ENV\['WEBAPP_MUTAFRICHES_FRAME_SRC'\] %>|${WEBAPP_MUTAFRICHES_FRAME_SRC}|g" \
    -e "s|/app/dist|${NGINX_ROOT}|g" \
    "$SITE_CONF_TEMPLATE" > "$SITE_CONF_OUTPUT"

# Verify site config was generated
if [ ! -s "$SITE_CONF_OUTPUT" ]; then
  echo "ERROR: Failed to generate site configuration" >&2
  exit 1
fi

# Generate env-vars.js file with all WEBAPP_* environment variables
echo "Generating environment variables file..."
sh /scripts/generateEnvVarsJsFile.sh "${NGINX_ROOT}/js/env-vars.js"

# Start nginx in foreground
echo "Starting nginx..."
exec nginx
