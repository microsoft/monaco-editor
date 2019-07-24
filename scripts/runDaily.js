// @ts-check
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const { execSync } = require("child_process");
const { join } = require("path");
const { readFileSync, writeFileSync } = require("fs");
const fetch = require("node-fetch");

try {
  // Update to the daily build
  execSync("npm install --save typescript@next")

  // Update the dts files
  execSync("npm run import-typescript")

  // Sync the versions
  const packagePath = join(__dirname, "../package.json")
  const package = JSON.parse(readFileSync(packagePath, "utf8"))

  const tsPackagePath = join(__dirname, "../node_modules/typescript/package.json")
  const tsPackage = JSON.parse(readFileSync(tsPackagePath, "utf8"))

  // Set the monaco-typescript version to directly match the typescript nightly version
  package.version = tsPackage.version
  writeFileSync(packagePath, JSON.stringify(package), "utf8")

  // Update the dts files
  execSync("npm run compile")

} catch (error) {
    // If it fails, post a message into the TS teams bot channel
    const teamsURL = process.env.TEAMS_INCOMING_WEBHOOK_URL
    if(!teamsURL) return

    const message = {
    "@type": "MessageCard",
    "@context": "https://schema.org/extensions",
    summary: "Issue with Monaco-TypeScript daily build",
    themeColor: "0078D7",
    title: 'Issue opened: "Push notifications not working"',
    sections: [
      {
        activityTitle: "Azure Pipelines",
        activitySubtitle: "9/13/2016, 11:46am",
        activityImage:
          "https://avatars2.githubusercontent.com/ml/1303?s=140&v=4",
        facts: [
          {
            name: "Error:",
            value: error.name
          },
          {
            name: "Description:",
            value: error.message || error.description
          }
        ]
      }
    ],
    potentialAction: [
      {
        "@type": "OpenUri",
        name: "View in Pipelines",
        targets: [
          {
            os: "default",
            uri: "https://link.com"
          }
        ]
      }
    ]
  };

  fetch(teamsURL, {
    method: "post",
    body: JSON.stringify(message),
    headers: { "Content-Type": "application/json" }
  });
}

