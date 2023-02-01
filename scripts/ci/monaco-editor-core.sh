#!/bin/bash
set -e

# cwd must be the vscode repository.

yarn --frozen-lockfile --network-timeout 180000
yarn playwright-install
yarn gulp hygiene
yarn valid-layers-check
yarn --cwd build compile
yarn eslint
yarn monaco-compile-check
yarn --max_old_space_size=4095 compile

yarn test-browser --browser chromium

yarn gulp editor-distro
mkdir typings-test

cd typings-test
yarn init -yp
../node_modules/.bin/tsc --init
echo "import '../out-monaco-editor-core';" > a.ts
../node_modules/.bin/tsc --noEmit
cd ..

cd test/monaco
yarn run esm-check
yarn run bundle-webpack
yarn run compile
yarn test
cd ../..

# npm package is now in dependencies/vscode/out-monaco-editor-core, ready to be published
