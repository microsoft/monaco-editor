import React, { VFC, useRef, useState, useEffect } from 'react';
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import * as monaco from 'monaco-editor';
import styles from './Editor.module.css';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';
import { schemaFetcher } from '../schema';

const operationString = `query {
	capsules {
		id
	}
}`;

export const Editor: VFC = () => {
	// const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
	const monacoEl = useRef(null);
	const monacoVarEl = useRef(null);
	const monacoResEl = useRef(null);

	useEffect(() => {
		const run = async () => {
			if (monacoEl) {
				const monacoGraphQLAPI = initializeMode({
					formattingOptions: {
						prettierConfig: {
							printWidth: 120
						}
					}
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
						// jsonc tip!
						allowComments: true,
						schemaValidation: 'error',
						// this is nice too
						trailingCommas: 'warning'
					}
				});
			}
		};

		run();
		// return () => editor?.dispose();
	}, [monacoEl.current]);

	return (
		<>
			<div className={styles.Editor} ref={monacoEl}></div>
			<div className={styles.Editor} ref={monacoVarEl}></div>
			<div className={styles.Editor} ref={monacoResEl}></div>
		</>
	);
};
