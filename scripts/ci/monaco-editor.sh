#!/bin/bash
set -e

# execute `npm install` to pick up local monaco-editor-core
npm install
# Install OS Dependencies for Playwright
sudo npm run playwright-install-deps
# Check prettier
npm run prettier-check
# Build
npm run release

# Run unit tests
npm test

# Compile webpack plugin
npm run compile --prefix webpack-plugin
# Package using webpack plugin
npm run package-for-smoketest-webpack
# Package using esbuild
npm run package-for-smoketest-esbuild
# Package using vite
npm run package-for-smoketest-vite
# Package using parcel
npm run package-for-smoketest-parcel --prefix test/smoke/parcel

# Run smoke test
npm run smoketest

# Build website
npm run build-website

# npm package is now ready to be published in ./release
