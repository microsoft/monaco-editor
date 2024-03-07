#!/bin/bash
set -e

# Install OS Dependencies for Playwright
sudo npm run playwright-install-deps
# Check prettier
npm run prettier-check
# Build
npm run build-monaco-editor

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
# npm run package-for-smoketest-parcel --prefix test/smoke/parcel
# Disabled for now, as the parcel bundler cannot deal with VS Code process variable

# Run smoke test
npm run smoketest

# npm package is now ready to be published in ./out/monaco-editor
