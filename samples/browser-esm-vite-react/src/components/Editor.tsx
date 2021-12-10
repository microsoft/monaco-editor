import React, { VFC, useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// import * as monaco from 'monaco-editor';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';
import { schemaFetcher } from '../schema';

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import gqlWorker from 'monaco-graphql/esm/graphql.worker?worker&inline';

// @ts-ignore
self.MonacoEnvironment = {
	getWorker(_: any, label: string) {
		console.log(label);
		if (label === 'graphql') {
			return new gqlWorker();
		}
		if (label === 'json') {
			return new jsonWorker();
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return new cssWorker();
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return new htmlWorker();
		}
		if (label === 'typescript' || label === 'javascript') {
			return new tsWorker();
		}
		return new editorWorker();
	}
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

const operationString = `query {
	capsules {
		id
	}
}`;

export const Editor: VFC = () => {
	const monacoEl = useRef(null);
	const monacoVarEl = useRef(null);
	const monacoResEl = useRef(null);

	useEffect(() => {
		const run = async () => {
			if (monacoEl) {
				const monacoGraphQLAPI = initializeMode({});
				const operationModel = monaco.editor.createModel(
					operationString,
					'graphql',
					monaco.Uri.file('/1/operation.graphql')
				);
				monaco.editor.create(monacoEl.current!, {
					model: operationModel,
					formatOnPaste: true,
					formatOnType: true,
					folding: true,
					language: 'graphql'
				});

				const variablesModel = monaco.editor.createModel(
					'{}',
					'json',
					monaco.Uri.file('/1/variables.json')
				);

				monaco.editor.create(monacoVarEl.current!, {
					model: variablesModel,
					language: 'json',
					formatOnPaste: true,
					formatOnType: true,
					comments: {
						insertSpace: true,
						ignoreEmptyLines: true
					}
				});
				const resultsModel = monaco.editor.createModel(
					'{}',
					'json',
					monaco.Uri.file('/1/results.json')
				);

				monaco.editor.create(monacoResEl.current!, {
					model: resultsModel,
					language: 'json',
					wordWrap: 'on',
					readOnly: true,
					showFoldingControls: 'always'
				});
				const operationUri = operationModel.uri.toString();
				const schema = await schemaFetcher.loadSchema();
				if (schema) {
					monacoGraphQLAPI.setSchemaConfig([{ ...schema, fileMatch: [operationUri] }]);
				}
				monacoGraphQLAPI.setDiagnosticSettings({
					validateVariablesJSON: {
						[operationUri]: [variablesModel.uri.toString()]
					},
					jsonDiagnosticSettings: {
						allowComments: true,
						schemaValidation: 'error',
						trailingCommas: 'warning'
					}
				});
			}
		};

		run();
	}, [monacoEl.current]);
	const style = { height: '100px', width: '100vw' };

	return (
		<>
			<div style={style} ref={monacoEl}></div>
			<div style={style} ref={monacoVarEl}></div>
			<div style={style} ref={monacoResEl}></div>
		</>
	);
};
