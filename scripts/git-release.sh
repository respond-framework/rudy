#!/usr/bin/env bash

set -e

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

yarn run lerna version --no-git-tag-version --no-push --allow-branch $CURRENT_BRANCH --yes
git add .
git commit -m "Publish to git"

for PACKAGE in $(yarn run -s lerna changed --parseable); do
  (
    cd "$PACKAGE"
    VERSION=$(cat package.json | jq -r '.version')
    NAME=$(cat package.json | jq -r '.name')
    echo $NAME $VERSION $CURRENT_BRANCH

    yarn run prepare
    yarn run npm-publish-git --tag "${NAME}/${CURRENT_BRANCH}/${VERSION}"
  )
done
