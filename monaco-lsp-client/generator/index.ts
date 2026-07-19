import * as fs from 'fs';
import * as path from 'path';

/**
 * Utility class for writing formatted code with proper indentation
 */
class LineWriter {
	private lines: string[] = [];
	private indentLevel: number = 0;
	private indentStr: string = '    '; // 4 spaces

	/**
	 * Write a line with current indentation
	 */
	writeLine(line: string = ''): void {
		if (line.trim() === '') {
			this.lines.push('');
		} else {
			this.lines.push(this.indentStr.repeat(this.indentLevel) + line);
		}
	}

	/**
	 * Write text without adding a new line
	 */
	write(text: string): void {
		if (this.lines.length === 0) {
			this.lines.push('');
		}
		const lastIndex = this.lines.length - 1;
		if (this.lines[lastIndex] === '') {
			this.lines[lastIndex] = this.indentStr.repeat(this.indentLevel) + text;
		} else {
			this.lines[lastIndex] += text;
		}
	}

	/**
	 * Increase indentation level
	 */
	indent(): void {
		this.indentLevel++;
	}

	/**
	 * Decrease indentation level
	 */
	outdent(): void {
		if (this.indentLevel > 0) {
			this.indentLevel--;
		}
	}

	/**
	 * Get the generated content as a string
	 */
	toString(): string {
		return this.lines.join('\n');
	}

	/**
	 * Clear all content and reset indentation
	 */
	clear(): void {
		this.lines = [];
		this.indentLevel = 0;
	}
}

/**
 * Interface definitions based on the metaModel schema
 */
interface MetaModel {
	metaData: MetaData;
	requests: Request[];
	notifications: Notification[];
	structures: Structure[];
	enumerations: Enumeration[];
	typeAliases: TypeAlias[];
}

interface MetaData {
	version: string;
}

interface Request {
	method: string;
	result: Type;
	messageDirection: MessageDirection;
	params?: Type | Type[];
	partialResult?: Type;
	errorData?: Type;
	registrationOptions?: Type;
	registrationMethod?: string;
	documentation?: string;
	since?: string;
	proposed?: boolean;
	deprecated?: string;
}

interface Notification {
	method: string;
	messageDirection: MessageDirection;
	params?: Type | Type[];
	registrationOptions?: Type;
	registrationMethod?: string;
	documentation?: string;
	since?: string;
	proposed?: boolean;
	deprecated?: string;
}

interface Structure {
	name: string;
	properties: Property[];
	extends?: Type[];
	mixins?: Type[];
	documentation?: string;
	since?: string;
	proposed?: boolean;
	deprecated?: string;
}

interface Property {
	name: string;
	type: Type;
	optional?: boolean;
	documentation?: string;
	since?: string;
	proposed?: boolean;
	deprecated?: string;
}

interface Enumeration {
	name: string;
	type: EnumerationType;
	values: EnumerationEntry[];
	supportsCustomValues?: boolean;
	documentation?: string;
	since?: string;
	proposed?: boolean;
	deprecated?: string;
}

interface EnumerationEntry {
	name: string;
	value: string | number;
	documentation?: string;
	since?: string;
	proposed?: boolean;
	deprecated?: string;
}

interface EnumerationType {
	kind: 'base';
	name: 'string' | 'integer' | 'uinteger';
}

interface TypeAlias {
	name: string;
	type: Type;
	documentation?: string;
	since?: string;
	proposed?: boolean;
	deprecated?: string;
}

type MessageDirection = 'clientToServer' | 'serverToClient' | 'both';

type Type =
	| BaseType
	| ReferenceType
	| ArrayType
	| MapType
	| AndType
	| OrType
	| TupleType
	| StructureLiteralType
	| StringLiteralType
	| IntegerLiteralType
	| BooleanLiteralType;

interface BaseType {
	kind: 'base';
	name:
		| 'URI'
		| 'DocumentUri'
		| 'integer'
		| 'uinteger'
		| 'decimal'
		| 'RegExp'
		| 'string'
		| 'boolean'
		| 'null';
}

interface ReferenceType {
	kind: 'reference';
	name: string;
}

interface ArrayType {
	kind: 'array';
	element: Type;
}

interface MapType {
	kind: 'map';
	key: Type;
	value: Type;
}

interface AndType {
	kind: 'and';
	items: Type[];
}

interface OrType {
	kind: 'or';
	items: Type[];
}

interface TupleType {
	kind: 'tuple';
	items: Type[];
}

interface StructureLiteralType {
	kind: 'literal';
	value: StructureLiteral;
}

interface StructureLiteral {
	properties: Property[];
	documentation?: string;
	since?: string;
	proposed?: boolean;
	deprecated?: string;
}

interface StringLiteralType {
	kind: 'stringLiteral';
	value: string;
}

interface IntegerLiteralType {
	kind: 'integerLiteral';
	value: number;
}

interface BooleanLiteralType {
	kind: 'booleanLiteral';
	value: boolean;
}

/**
 * TypeScript types generator for LSP client
 */
class LSPTypesGenerator {
	private writer = new LineWriter();

	/**
	 * Load and parse the metaModel.json file
	 */
	private loadMetaModel(): MetaModel {
		const metaModelPath = path.join(__dirname, '..', 'metaModel.json');
		const content = fs.readFileSync(metaModelPath, 'utf-8');
		return JSON.parse(content) as MetaModel;
	}

	/**
	 * Convert Type to TypeScript type string
	 */
	private typeToTypeScript(type: Type): string {
		switch (type.kind) {
			case 'base':
				switch (type.name) {
					case 'string':
					case 'DocumentUri':
					case 'URI':
						return 'string';
					case 'integer':
					case 'uinteger':
					case 'decimal':
						return 'number';
					case 'boolean':
						return 'boolean';
					case 'null':
						return 'null';
					case 'RegExp':
						return 'RegExp';
					default:
						return 'any';
				}
			case 'reference':
				return type.name;
			case 'array':
				return `(${this.typeToTypeScript(type.element)})[]`;
			case 'map':
				return `{ [key: ${this.typeToTypeScript(type.key)}]: ${this.typeToTypeScript(
					type.value
				)} }`;
			case 'and':
				return type.items.map((item) => this.typeToTypeScript(item)).join(' & ');
			case 'or':
				return type.items.map((item) => this.typeToTypeScript(item)).join(' | ');
			case 'tuple':
				return `[${type.items.map((item) => this.typeToTypeScript(item)).join(', ')}]`;
			case 'literal':
				return this.structureLiteralToTypeScript(type.value);
			case 'stringLiteral':
				return `'${type.value}'`;
			case 'integerLiteral':
				return type.value.toString();
			case 'booleanLiteral':
				return type.value.toString();
			default:
				return 'any';
		}
	}

	/**
	 * Convert structure literal to TypeScript interface
	 */
	private structureLiteralToTypeScript(literal: StructureLiteral): string {
		const properties = literal.properties.map((prop) => {
			const optional = prop.optional ? '?' : '';
			return `${prop.name}${optional}: ${this.typeToTypeScript(prop.type)}`;
		});
		return `{\n    ${properties.join(';\n    ')}\n}`;
	}

	/**
	 * Generate TypeScript interface for a structure
	 */
	private generateStructure(structure: Structure): void {
		if (structure.documentation) {
			this.writer.writeLine('/**');
			this.writer.writeLine(` * ${structure.documentation.replace(/\n/g, '\n * ')}`);
			this.writer.writeLine(' */');
		}

		// Build extends clause combining extends and mixins
		const allParents: string[] = [];

		if (structure.extends && structure.extends.length > 0) {
			allParents.push(...structure.extends.map((type) => this.typeToTypeScript(type)));
		}

		if (structure.mixins && structure.mixins.length > 0) {
			allParents.push(...structure.mixins.map((type) => this.typeToTypeScript(type)));
		}

		const extendsClause = allParents.length > 0 ? ` extends ${allParents.join(', ')}` : '';

		this.writer.writeLine(`export interface ${structure.name}${extendsClause} {`);
		this.writer.indent();

		// Add properties
		for (const property of structure.properties) {
			if (property.documentation) {
				this.writer.writeLine('/**');
				this.writer.writeLine(` * ${property.documentation.replace(/\n/g, '\n * ')}`);
				this.writer.writeLine(' */');
			}
			const optional = property.optional ? '?' : '';
			this.writer.writeLine(
				`${property.name}${optional}: ${this.typeToTypeScript(property.type)};`
			);
		}

		this.writer.outdent();
		this.writer.writeLine('}');
		this.writer.writeLine('');
	}

	/**
	 * Generate TypeScript enum for an enumeration
	 */
	private generateEnumeration(enumeration: Enumeration): void {
		if (enumeration.documentation) {
			this.writer.writeLine('/**');
			this.writer.writeLine(` * ${enumeration.documentation.replace(/\n/g, '\n * ')}`);
			this.writer.writeLine(' */');
		}

		this.writer.writeLine(`export enum ${enumeration.name} {`);
		this.writer.indent();

		for (let i = 0; i < enumeration.values.length; i++) {
			const entry = enumeration.values[i];
			if (entry.documentation) {
				this.writer.writeLine('/**');
				this.writer.writeLine(` * ${entry.documentation.replace(/\n/g, '\n * ')}`);
				this.writer.writeLine(' */');
			}
			const isLast = i === enumeration.values.length - 1;
			const comma = isLast ? '' : ',';
			if (typeof entry.value === 'string') {
				this.writer.writeLine(`${entry.name} = '${entry.value}'${comma}`);
			} else {
				this.writer.writeLine(`${entry.name} = ${entry.value}${comma}`);
			}
		}

		this.writer.outdent();
		this.writer.writeLine('}');
		this.writer.writeLine('');
	}

	/**
	 * Generate TypeScript type alias
	 */
	private generateTypeAlias(typeAlias: TypeAlias): void {
		if (typeAlias.documentation) {
			this.writer.writeLine('/**');
			this.writer.writeLine(` * ${typeAlias.documentation.replace(/\n/g, '\n * ')}`);
			this.writer.writeLine(' */');
		}

		this.writer.writeLine(
			`export type ${typeAlias.name} = ${this.typeToTypeScript(typeAlias.type)};`
		);
		this.writer.writeLine('');
	}

	/**
	 * Generate the Capability class
	 */
	private generateCapabilityClass(): void {
		this.writer.writeLine('/**');
		this.writer.writeLine(
			' * Represents a capability with its associated method and registration options type'
		);
		this.writer.writeLine(' */');
		this.writer.writeLine('export class Capability<T> {');
		this.writer.indent();
		this.writer.writeLine('constructor(public readonly method: string) {}');
		this.writer.outdent();
		this.writer.writeLine('}');
		this.writer.writeLine('');
	}

	/**
	 * Generate the capabilities map
	 */
	private generateCapabilitiesMap(metaModel: MetaModel): void {
		this.writer.writeLine('/**');
		this.writer.writeLine(' * Map of all LSP capabilities with their registration options');
		this.writer.writeLine(' */');
		this.writer.writeLine('export const capabilities = {');
		this.writer.indent();

		// Collect all requests and notifications with registration options
		const itemsWithRegistration: Array<{ method: string; registrationOptions?: Type }> = [];

		for (const request of metaModel.requests) {
			if (request.registrationOptions) {
				itemsWithRegistration.push({
					method: request.method,
					registrationOptions: request.registrationOptions
				});
			}
		}

		for (const notification of metaModel.notifications) {
			if (notification.registrationOptions) {
				itemsWithRegistration.push({
					method: notification.method,
					registrationOptions: notification.registrationOptions
				});
			}
		}

		// Generate capability entries
		for (const item of itemsWithRegistration) {
			const methodIdentifier = this.methodToIdentifier(item.method);
			const registrationType = item.registrationOptions
				? this.typeToTypeScript(item.registrationOptions)
				: 'unknown';

			this.writer.writeLine(
				`${methodIdentifier}: new Capability<${registrationType}>('${item.method}'),`
			);
		}

		this.writer.outdent();
		this.writer.writeLine('};');
		this.writer.writeLine('');
	}

	/**
	 * Convert LSP method name to valid JavaScript identifier
	 */
	private methodToIdentifier(method: string): string {
		const parts = method
			.replace(/\$/g, '') // Remove $ characters
			.split('/') // Split on forward slashes
			.filter((part) => part.length > 0); // Remove empty parts

		return parts
			.map((part, index) => {
				// Convert kebab-case to camelCase for each part
				const camelCase = part.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
				// Capitalize first letter of all parts except the first non-empty part
				return index === 0 ? camelCase : camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
			})
			.join('');
	}

	/**
	 * Generate the API contract object
	 */
	private generateApiContract(metaModel: MetaModel): void {
		this.writer.writeLine('/**');
		this.writer.writeLine(' * LSP API Contract');
		this.writer.writeLine(' */');

		this.writer.writeLine('export const api = contract({');
		this.writer.indent();

		this.writer.writeLine('name: "LSP",');

		// Helper function to generate request entries
		const generateRequest = (request: Request, isOptional: boolean = false) => {
			const methodIdentifier = this.methodToIdentifier(request.method);
			const paramsType = this.getParamsType(request.params);
			const resultType = this.typeToTypeScript(request.result);

			if (request.documentation) {
				this.writer.writeLine('/**');
				this.writer.writeLine(` * ${request.documentation.replace(/\n/g, '\n     * ')}`);
				this.writer.writeLine(' */');
			}

			const optional = isOptional ? '.optional()' : '';
			this.writer.writeLine(
				`${methodIdentifier}: unverifiedRequest<${paramsType}, ${resultType}>({ method: "${request.method}" })${optional},`
			);
		};

		// Helper function to generate notification entries
		const generateNotification = (notification: Notification) => {
			const methodIdentifier = this.methodToIdentifier(notification.method);
			const paramsType = this.getParamsType(notification.params);

			if (notification.documentation) {
				this.writer.writeLine('/**');
				this.writer.writeLine(` * ${notification.documentation.replace(/\n/g, '\n     * ')}`);
				this.writer.writeLine(' */');
			}
			this.writer.writeLine(
				`${methodIdentifier}: unverifiedNotification<${paramsType}>({ method: "${notification.method}" }),`
			);
		};

		// Server section
		this.writer.writeLine('server: {');
		this.writer.indent();

		// Server requests (sent from client to server)
		for (const request of metaModel.requests) {
			if (request.messageDirection === 'clientToServer' || request.messageDirection === 'both') {
				generateRequest(request);
			}
		}

		// Server notifications (sent from client to server)
		for (const notification of metaModel.notifications) {
			if (
				notification.messageDirection === 'clientToServer' ||
				notification.messageDirection === 'both'
			) {
				generateNotification(notification);
			}
		}

		this.writer.outdent();
		this.writer.writeLine('},');

		// Client section
		this.writer.writeLine('client: {');
		this.writer.indent();

		// Client requests (handled by server)
		for (const request of metaModel.requests) {
			if (request.messageDirection === 'serverToClient' || request.messageDirection === 'both') {
				generateRequest(request, true); // serverToClient requests are optional
			}
		}

		// Client notifications (sent from server to client)
		for (const notification of metaModel.notifications) {
			if (
				notification.messageDirection === 'serverToClient' ||
				notification.messageDirection === 'both'
			) {
				generateNotification(notification);
			}
		}

		this.writer.outdent();
		this.writer.writeLine('}');

		this.writer.outdent();
		this.writer.writeLine('});');
		this.writer.writeLine('');
	}

	/**
	 * Helper method to get parameter type
	 */
	private getParamsType(params?: Type | Type[]): string {
		if (!params) {
			return 'void';
		}
		if (Array.isArray(params)) {
			const paramTypes = params.map((p) => this.typeToTypeScript(p));
			return `[${paramTypes.join(', ')}]`;
		} else {
			return this.typeToTypeScript(params);
		}
	}

	/**
	 * Generate the complete TypeScript types
	 */
	generate(): void {
		const metaModel = this.loadMetaModel();

		this.writer.clear();
		this.writer.writeLine('// Generated TypeScript definitions for LSP');
		this.writer.writeLine(`// Protocol version: ${metaModel.metaData.version}`);
		this.writer.writeLine('// This file is auto-generated. Do not edit manually.');
		this.writer.writeLine('');

		// Import contract types from @hediet/json-rpc
		this.writer.writeLine('import {');
		this.writer.indent();
		this.writer.writeLine('contract,');
		this.writer.writeLine('Contract,');
		this.writer.writeLine('unverifiedRequest,');
		this.writer.writeLine('unverifiedNotification,');
		this.writer.outdent();
		this.writer.writeLine('} from "@hediet/json-rpc";');
		this.writer.writeLine('');

		// Generate enumerations
		for (const enumeration of metaModel.enumerations) {
			this.generateEnumeration(enumeration);
		}

		// Generate type aliases
		for (const typeAlias of metaModel.typeAliases) {
			this.generateTypeAlias(typeAlias);
		}

		// Generate structures
		for (const structure of metaModel.structures) {
			this.generateStructure(structure);
		}

		// Generate Capability class
		this.generateCapabilityClass();

		// Generate capabilities map
		this.generateCapabilitiesMap(metaModel);

		// Generate API contract
		this.generateApiContract(metaModel);

		// Write types file
		const srcDir = path.join(__dirname, '..', 'src');
		if (!fs.existsSync(srcDir)) {
			fs.mkdirSync(srcDir, { recursive: true });
		}
		fs.writeFileSync(path.join(srcDir, 'types.ts'), this.writer.toString());

		console.log('Generated LSP types file: src/types.ts');
	}
}

// Run the generator
if (require.main === module) {
	const generator = new LSPTypesGenerator();
	generator.generate();
}
