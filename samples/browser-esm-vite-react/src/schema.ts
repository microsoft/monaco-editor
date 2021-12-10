import { getIntrospectionQuery } from 'graphql';
import type { SchemaConfig } from 'monaco-graphql/src/typings';
import { Uri } from 'monaco-editor';

const SCHEMA_URL = 'https://api.spacex.land/graphql';

const setSchemaStatus = (message: string) => {
	const schemaStatus = document.getElementById('schema-status');
	if (schemaStatus) {
		const html = `<small>${message}</small>`;
		schemaStatus.innerHTML = html;
	}
};

class MySchemaFetcher {
	private _schemaCache = new Map<string, SchemaConfig>();
	constructor() {}
	async getSchema() {
		return this.loadSchema();
	}
	async loadSchema() {
		try {
			setSchemaStatus('Schema Loading...');

			const headers = {
				'content-type': 'application/json'
			};
			const result = await fetch(SCHEMA_URL, {
				method: 'POST',
				headers: {
					...headers
				},
				body: JSON.stringify(
					{
						query: getIntrospectionQuery(),
						operationName: 'IntrospectionQuery'
					},
					null,
					2
				)
			});
			this._schemaCache.set(SCHEMA_URL, {
				introspectionJSON: (await result.json()).data,
				uri: Uri.parse(SCHEMA_URL).toString()
			});

			setSchemaStatus('Schema Loaded');
		} catch {
			setSchemaStatus('Schema error');
		}

		return this._schemaCache.get(SCHEMA_URL);
	}
}

export const schemaFetcher = new MySchemaFetcher();
