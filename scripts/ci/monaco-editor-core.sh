#!/bin/bash
set -e

# cwd must be the vscode repository.

npm ci
npm run playwright-install
npm run gulp hygiene
npm run valid-layers-check
cd build && npm run compile && cd -
npm run eslint
npm run monaco-compile-check
npm run compile

npm run test-browser --browser chromium

npm run gulp editor-distro
mkdir typings-test

cd typings-test
yarn init -yp
../node_modules/.bin/tsc --init
echo "import '../out-monaco-editor-core';" > a.ts
../node_modules/.bin/tsc --noEmit
cd ..

cd test/monaco
npm run esm-check
npm run bundle-webpack
npm run compile
npm test
cd ../..

# npm package is now in dependencies/vscode/out-monaco-editor-core, ready to be published
