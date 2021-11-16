#!/usr/bin/env bash

COMMITTER_USER_NAME="$(git log --format='%an' -1)"
COMMITTER_EMAIL="$(git log --format='%ae' -1)"

cd ../monaco-editor-website
git init
git config user.name "${COMMITTER_USER_NAME}"
git config user.email "${COMMITTER_EMAIL}"
git remote add origin "https://x-access-token:${GITHUB_TOKEN}@github.com/microsoft/monaco-editor.git"
git checkout -b gh-pages
git add .
git commit -m "Publish website"
git push origin gh-pages --force
