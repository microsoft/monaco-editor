import { getIntrospectionQuery } from 'graphql';
import type { SchemaConfig } from 'monaco-graphql/src/typings';
import { Uri } from 'monaco-editor';

const SCHEMA_URL = 'https://api.github.com/graphql';
// const API_TOKEN = localStorage.getItem('ghapi') || null;
const API_TOKEN = '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';

export const schemaOptions = [
	{
		value: SCHEMA_URL,
		label: 'Github API',
		default: true,
		headers: Object.create(null)
	},
	{
		value: 'https://api.spacex.land/graphql',
		label: 'SpaceX GraphQL API',
		headers: Object.create(null)
	}
];

const setSchemaStatus = (message: string) => {
	const schemaStatus = document.getElementById('schema-status');
	if (schemaStatus) {
		const html = `<small>${message}</small>`;
		schemaStatus.innerHTML = html;
	}
};

class MySchemaFetcher {
	private _options: typeof schemaOptions;
	private _currentSchema: typeof schemaOptions[0];
	private _schemaCache = new Map<string, SchemaConfig>();
	constructor(options = schemaOptions) {
		this._options = options;
		this._currentSchema = schemaOptions[0];
		if (API_TOKEN) {
			this._currentSchema.headers.authorization = `Bearer ${API_TOKEN}`;
		}
	}
	public get currentSchema() {
		return this._currentSchema;
	}
	public get token() {
		return this._currentSchema.headers.authorization;
	}
	async getSchema() {
		const cacheItem = this._schemaCache.get(this._currentSchema.value);
		if (cacheItem) {
			return cacheItem;
		}
		return this.loadSchema();
	}
	async setApiToken(token: string) {
		this._currentSchema.headers.authorization = `Bearer ${token}`;
	}
	async loadSchema() {
		try {
			setSchemaStatus('Schema Loading...');
			const url = this._currentSchema.value as string;

			const headers = {
				'content-type': 'application/json'
			};
			const result = await fetch(url, {
				method: 'POST',
				headers: {
					...headers,
					...this._currentSchema.headers
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
			this._schemaCache.set(url, {
				introspectionJSON: (await result.json()).data,
				uri: Uri.parse(url).toString()
			});

			setSchemaStatus('Schema Loaded');
		} catch {
			setSchemaStatus('Schema error');
		}

		return this._schemaCache.get(this._currentSchema.value);
	}
	async changeSchema(uri: string) {
		this._currentSchema = this._options.find((opt) => opt.value === uri)!;
		return this.getSchema();
	}
}

export const schemaFetcher = new MySchemaFetcher(schemaOptions);
