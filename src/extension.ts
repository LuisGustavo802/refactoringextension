import * as vscode from 'vscode';
import * as ternary from "./refactorings/convert-if-else-to-ternary/convert-if-else-to-ternary";
import * as deadCode from "./refactorings/remove-dead-code/remove-dead-code";
import * as extractType from "./refactorings/extract-type/extract-type";
import * as extractInterface from "./refactorings/extract-interface/extract-interface";
import * as inlineFunction from "./refactorings/inline-function/inline-function";
import * as t from "./ast";

//tecnicas de refatoracao
	//extract method
	//inline method

//code smells
   // dead
   // convert to ternary
   // 

export const activeEditor = () => vscode.window.activeTextEditor!;

export function activate(context: vscode.ExtensionContext) {
	let convertIfElseToTernary = vscode.commands.registerCommand('refactoringextension.convertIfElseToTernary', () => {
		executeConvertIfElseToTernary();
	});

	context.subscriptions.push(convertIfElseToTernary);

	let removeDeadCode = vscode.commands.registerCommand('refactoringextension.removeDeadCode', () => {
		executeRemoveDeadCode();
	});

	context.subscriptions.push(removeDeadCode);

	let extractType = vscode.commands.registerCommand('refactoringextension.extractType', () => {
		executeExtractType();
	});

	context.subscriptions.push(extractType);

	let extractInterface = vscode.commands.registerCommand('refactoringextension.extractInterface', () => {
		executeExtractInterface();
	});

	context.subscriptions.push(extractInterface);

	let inlineFunction = vscode.commands.registerCommand('refactoringextension.inlineFunction', () => {
		executeInlineFunction();
	});

	context.subscriptions.push(inlineFunction);

	let identifyOportunity = vscode.commands.registerCommand('refactoringextension.identifyOportunity', () => {
		executeIdentifyOportunity();
	});

	context.subscriptions.push(identifyOportunity);
}

export function executeIdentifyOportunity() {

	let refatoracoes: any = [];

	refatoracoes.push(ternary.hasCodeChanged(activeEditor().document.getText(), 
	vscode.window.activeTextEditor?.selection, activeEditor().document.fileName));

	refatoracoes.push(deadCode.hasCodeChanged(activeEditor().document.getText(), 
			vscode.window.activeTextEditor?.selection, activeEditor().document.fileName));

	refatoracoes.push(extractType.hasCodeChanged(activeEditor().document.getText(), 
			vscode.window.activeTextEditor?.selection, activeEditor().document.fileName));

	refatoracoes.push(extractInterface.hasCodeChanged(activeEditor().document.getText(), 
			vscode.window.activeTextEditor?.selection, activeEditor().document.fileName));

	refatoracoes.push(inlineFunction.hasCodeChanged(activeEditor().document.getText(), 
			vscode.window.activeTextEditor?.selection, activeEditor().document.fileName));

	if (refatoracoes.length > 0) {
		let formatedRefactors = ""; 	

		refatoracoes.forEach((item: string) => {
			formatedRefactors += item !== undefined ? item === refatoracoes[refatoracoes.length -1] ? item : item + ", " : "";
		});

		vscode.window
		.showInformationMessage("Foram identificadas as seguintes oportunidades de refatoração: " + formatedRefactors + ". Deseja aplica-las?", "Sim", "Não")
		.then(answer => {
			if (answer === "Sim") {
				//executeConvertIfElseToTernary();
				//executeRemoveDeadCode();
				//executeExtractType();
				//executeExtractInterface();
				//executeInlineFunction();
			}
		});
	}
}

export function executeConvertIfElseToTernary() {
	const report = getSourceMetrics();
	showDiagnostics(report);
	const teste = t.parse(activeEditor().document.getText());

	console.log("var teste", teste);
	console.log("teste", vscode.window);
	console.log("editor", vscode.window.activeTextEditor);

	ternary.convertIfElseToTernary(activeEditor().document.getText(), 
		vscode.window.activeTextEditor?.selection, activeEditor().document.fileName);

	vscode.window.showInformationMessage('Sucesso ternary!');	
}

export function executeRemoveDeadCode() {
	const report = getSourceMetrics();
	showDiagnostics(report);
	const teste = t.parse(activeEditor().document.getText());

	console.log("var teste", teste);
	console.log("teste", vscode.window);
	console.log("editor", vscode.window.activeTextEditor);

	deadCode.removeDeadCode(activeEditor().document.getText(), 
		vscode.window.activeTextEditor?.selection, activeEditor().document.fileName);

	vscode.window.showInformationMessage('Sucesso dead code!');	
}

export function executeExtractType() {
	const report = getSourceMetrics();
	showDiagnostics(report);
	const teste = t.parse(activeEditor().document.getText());

	console.log("var teste", teste);
	console.log("teste", vscode.window);
	console.log("editor", vscode.window.activeTextEditor);

	extractType.extractType(activeEditor().document.getText(), 
		vscode.window.activeTextEditor?.selection, activeEditor().document.fileName);

	vscode.window.showInformationMessage('Sucesso extract type!');	
}

export function executeExtractInterface() {
	const report = getSourceMetrics();
	showDiagnostics(report);
	const teste = t.parse(activeEditor().document.getText());

	console.log("var teste", teste);
	console.log("teste", vscode.window);
	console.log("editor", vscode.window.activeTextEditor);

	extractInterface.extractInterface(activeEditor().document.getText(), 
		vscode.window.activeTextEditor?.selection, activeEditor().document.fileName);

	vscode.window.showInformationMessage('Sucesso extract interface!');	
}

export function executeInlineFunction() {
	const report = getSourceMetrics();
	showDiagnostics(report);
	const teste = t.parse(activeEditor().document.getText());

	console.log("var teste", teste);
	console.log("teste", vscode.window);
	console.log("editor", vscode.window.activeTextEditor);

	inlineFunction.inlineFunction(activeEditor().document.getText(), 
		vscode.window.activeTextEditor?.selection, activeEditor().document.fileName);

	vscode.window.showInformationMessage('Sucesso inline function!');	
}

export function getSourceMetrics(): any {
	var escomplex = require('typhonjs-escomplex');

	console.log(activeEditor().document.getText());

	return escomplex.analyzeModule(activeEditor().document.getText());
}

export function showDiagnostics(report: any) {
	console.log("report", report);

	let diagnosticCollection = vscode.languages.createDiagnosticCollection("stuff");
	let diagnostics : vscode.Diagnostic[] = [];

	report.classes.forEach((classe: any) => {
		getClassDiagnostic(classe, diagnostics);
	});

	report.methods.forEach((method: any) => {
		getMethodDiagnostic(method, diagnostics);
	});

	diagnosticCollection.set(activeEditor().document.uri, diagnostics);
}

export function getClassDiagnostic(classReport: any, diagnostics: any) {

	let positionStart = new vscode.Position(classReport.lineStart - 1, 0);
	let positionEnd = new vscode.Position(classReport.lineStart - 1, classReport.name.length + 8);

	let range = new vscode.Range(positionStart, positionEnd);

	diagnostics.push(new vscode.Diagnostic(range, "Complexidade ciclomática: ".concat(classReport.aggregateAverage.cyclomatic), vscode.DiagnosticSeverity.Warning));
	diagnostics.push(new vscode.Diagnostic(range, "Dificuldade: ".concat(classReport.aggregateAverage.halstead.difficulty), vscode.DiagnosticSeverity.Warning));
	diagnostics.push(new vscode.Diagnostic(range, "Manutenibilidade: ".concat(classReport.maintainability), vscode.DiagnosticSeverity.Warning));
}

export function getMethodDiagnostic(methodReport: any, diagnostics: any) {

	let positionStart = new vscode.Position(methodReport.lineStart - 1, 0);
	let positionEnd = new vscode.Position(methodReport.lineStart - 1, methodReport.name.length + 8);

	let range = new vscode.Range(positionStart, positionEnd);

	diagnostics.push(new vscode.Diagnostic(range, "Complexidade ciclomática: ".concat(methodReport.cyclomatic), vscode.DiagnosticSeverity.Warning));
	diagnostics.push(new vscode.Diagnostic(range, "Dificuldade: ".concat(methodReport.halstead.difficulty), vscode.DiagnosticSeverity.Warning));
	diagnostics.push(new vscode.Diagnostic(range, "Bugs: ".concat(methodReport.halstead.bugs), vscode.DiagnosticSeverity.Warning));
	diagnostics.push(new vscode.Diagnostic(range, "sloc (logical): ".concat(methodReport.sloc.logical), vscode.DiagnosticSeverity.Warning));
	diagnostics.push(new vscode.Diagnostic(range, "sloc (physical): ".concat(methodReport.sloc.physical), vscode.DiagnosticSeverity.Warning));
}

export function deactivate() {}
