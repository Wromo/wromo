#!/usr/bin/env bash

# Convert context URL to an array
mapfile -t CONTEXT_URL_ITEMS < <(echo "$GITPOD_WORKSPACE_CONTEXT_URL" | tr '/' '\n')

# Check if Gitpod started from a specific example directory in the repository
if [ "${CONTEXT_URL_ITEMS[7]}" = "examples" ]; then
    EXAMPLE_PROJECT=${CONTEXT_URL_ITEMS[8]}
# Check it Gitpod started with $WROMO_NEW environment variable
elif [ -n "$WROMO_NEW" ]; then
    EXAMPLE_PROJECT="$WROMO_NEW"
# Otherwise, set the default example project - 'starter'
else
    EXAMPLE_PROJECT="starter"
fi

# Wait for VSCode to be ready (port 23000)
gp await-port 23000 > /dev/null 2>&1

echo "Loading example project:" $EXAMPLE_PROJECT

# Go to the requested example project
cd "$GITPOD_REPO_ROOT"/examples/"$EXAMPLE_PROJECT" || exit
# Open the main page in VSCode
code src/pages/index.wromo
# Start Wromo
pnpm start
