import React, { VFC, useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import styles from './Editor.module.css';
import { initializeMode } from 'monaco-graphql/esm/initializeMode';

const SCHEMA_URL = 'https://api.spacex.land/graphql/';

const GRAPHQL_LANGUAGE_ID = 'gql';
const THEME = 'vs-dark';
const operationString = `query {
	capsules {
		id
	}
}`;

export const Editor: VFC = () => {
	const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
	const monacoEl = useRef(null);

	useEffect(() => {
		if (monacoEl && !editor) {
			initializeMode({
				modeConfiguration: {
					colors: true
				},
				schemas: [
					{
						uri: SCHEMA_URL
					}
				]
			});
			const operationModel = monaco.editor.createModel(
				operationString,
				'graphql',
				monaco.Uri.file('/1/operation.graphql')
			);

			setEditor(
				monaco.editor.create(monacoEl.current!, {
					model: operationModel,
					formatOnPaste: true,
					formatOnType: true,
					folding: true,
					language: 'graphql'
				})
			);
		}

		return () => editor?.dispose();
	}, [monacoEl.current]);

	return <div className={styles.Editor} ref={monacoEl}></div>;
};
