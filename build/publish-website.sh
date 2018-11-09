#!/usr/bin/env bash

REMOTE_URL="$(git remote get-url origin)"
COMMITTER_USER_NAME="$(git log --format='%an' -1)"
COMMITTER_EMAIL="$(git log --format='%ae' -1)"

cd ../monaco-editor-website
git config user.name "${COMMITTER_USER_NAME}"
git config user.email "${COMMITTER_EMAIL}"
git remote add origin "${REMOTE_URL}"
git checkout -b gh-pages
git add .
git commit -m "Publish website"
