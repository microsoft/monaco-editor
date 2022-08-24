import * as ts from './lib/typescriptServices';
import * as tsc from 'typescript';

enum CustomCodes {
	InvalidAbsoluteTimeString = -1,
	InvalidRelativeTimeString = -2
}

export function generateEdslDiagnostics(
	fileName: string,
	languageService: ts.LanguageService
): ts.Diagnostic[] {
	return [
		...generateRelativeTimeStringDiagnostics(fileName, languageService),
		...generateAbsoluteTimeStringDiagnostics(fileName, languageService)
	];
}

function getDescendents(node: ts.Node, selector: (node: ts.Node) => boolean): ts.Node[] {
	const selectedNodes = [];
	if (selector(node)) {
		selectedNodes.push(node);
	}
	for (const child of node.getChildren()) {
		selectedNodes.push(...getDescendents(child, selector));
	}
	return selectedNodes;
}

const DOY_REGEX = /(\d{4})-(\d{3})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?/;
const HMS_REGEX = /(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?/;

function generateRelativeTimeStringDiagnostics(
	fileName: string,
	languageService: ts.LanguageService
): ts.Diagnostic[] {
	const diagnostics: ts.Diagnostic[] = [];

	const program = languageService.getProgram();
	if (program === undefined) return [];
	const typechecker = program.getTypeChecker();
	const sourceFile = program.getSourceFile(fileName);
	if (sourceFile === undefined) return [];
	const sourceFileSymbol = typechecker.getSymbolAtLocation(sourceFile)?.getDeclarations()?.[0] as
		| ts.SourceFile
		| undefined;

	if (sourceFileSymbol === undefined) return [];

	const relativeTimeNodes = getDescendents(
		sourceFileSymbol,
		(node) =>
			tsc.isIdentifier(node) &&
			(node.escapedText === 'E' || node.escapedText === 'R') &&
			(tsc.isTaggedTemplateExpression(node.parent) || tsc.isCallExpression(node.parent))
	).map((node) => node.parent);

	for (const relativeTimeNode of relativeTimeNodes) {
		if (tsc.isTaggedTemplateExpression(relativeTimeNode)) {
			if (tsc.isNoSubstitutionTemplateLiteral(relativeTimeNode.template)) {
				if (!HMS_REGEX.test(relativeTimeNode.template.text)) {
					diagnostics.push({
						category: tsc.DiagnosticCategory.Error,
						code: CustomCodes.InvalidRelativeTimeString,
						file: sourceFile,
						start: relativeTimeNode.template.getStart(sourceFile),
						length:
							relativeTimeNode.template.getEnd() - relativeTimeNode.template.getStart(sourceFile),
						messageText: `Incorrectly formatted relative time string. Expected format: hh:mm:ss[.sss]`
					});
				}
			}
		} else if (tsc.isCallExpression(relativeTimeNode)) {
			const firstArg = relativeTimeNode.arguments[0];
			if (tsc.isStringLiteral(firstArg)) {
				if (!HMS_REGEX.test(firstArg.text)) {
					diagnostics.push({
						category: tsc.DiagnosticCategory.Error,
						code: CustomCodes.InvalidRelativeTimeString,
						file: sourceFile,
						start: firstArg.getStart(sourceFile),
						length: firstArg.getEnd() - firstArg.getStart(sourceFile),
						messageText: `Incorrectly formatted relative time string. Expected format: hh:mm:ss[.sss]`
					});
				}
			}
		}
	}

	return diagnostics;
}

function generateAbsoluteTimeStringDiagnostics(
	fileName: string,
	languageService: ts.LanguageService
): ts.Diagnostic[] {
	const diagnostics: ts.Diagnostic[] = [];

	const program = languageService.getProgram();
	if (program === undefined) return [];
	const typechecker = program.getTypeChecker();
	const sourceFile = program.getSourceFile(fileName);
	if (sourceFile === undefined) return [];
	const sourceFileSymbol = typechecker.getSymbolAtLocation(sourceFile)?.getDeclarations()?.[0] as
		| ts.SourceFile
		| undefined;

	if (sourceFileSymbol === undefined) return [];

	const absoluteTimeNodes = getDescendents(
		sourceFileSymbol,
		(node) =>
			tsc.isIdentifier(node) &&
			node.escapedText === 'A' &&
			(tsc.isTaggedTemplateExpression(node.parent) || tsc.isCallExpression(node.parent))
	).map((node) => node.parent);

	for (const absoluteTimeNode of absoluteTimeNodes) {
		if (tsc.isTaggedTemplateExpression(absoluteTimeNode)) {
			if (tsc.isNoSubstitutionTemplateLiteral(absoluteTimeNode.template)) {
				if (!DOY_REGEX.test(absoluteTimeNode.template.text)) {
					diagnostics.push({
						category: tsc.DiagnosticCategory.Error,
						code: CustomCodes.InvalidAbsoluteTimeString,
						file: sourceFile,
						start: absoluteTimeNode.template.getStart(sourceFile),
						length:
							absoluteTimeNode.template.getEnd() - absoluteTimeNode.template.getStart(sourceFile),
						messageText: `Incorrectly formatted absolute time string. Expected format: YYYY-DOYThh:mm:ss[.sss]`
					});
				}
			}
		} else if (tsc.isCallExpression(absoluteTimeNode)) {
			const firstArg = absoluteTimeNode.arguments[0];
			if (tsc.isStringLiteral(firstArg)) {
				if (!DOY_REGEX.test(firstArg.text)) {
					diagnostics.push({
						category: tsc.DiagnosticCategory.Error,
						code: CustomCodes.InvalidAbsoluteTimeString,
						file: sourceFile,
						start: firstArg.getStart(sourceFile),
						length: firstArg.getEnd() - firstArg.getStart(sourceFile),
						messageText: `Incorrectly formatted absolute time string. Expected format: YYYY-DOYThh:mm:ss[.sss]`
					});
				}
			}
		}
	}

	return diagnostics;
}
