import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Start!');

	let disposable = vscode.commands.registerCommand('refactoringextension.helloWorld', () => {
		var currentEditor = vscode.window.activeTextEditor!;
	
		const report = getSourceMetrics(currentEditor.document.getText());
	
		showDiagnostics(currentEditor, report);

		vscode.window.showInformationMessage('Rodou a extensão!');	
	});

	context.subscriptions.push(disposable);
}

export function getSourceMetrics(sourceCode: string): any {
	var escomplex = require('typhonjs-escomplex');

	return escomplex.analyzeModule(sourceCode);
}

export function showDiagnostics(editor: any, report: any) {
	console.log("report", report);

	let diagnosticCollection = vscode.languages.createDiagnosticCollection("stuff");
	let diagnostics : vscode.Diagnostic[] = [];

	/*let positionStart = new vscode.Position(0, 0);
	let positionEnd = new vscode.Position(0, 0);

	let range = new vscode.Range(positionStart, positionEnd);

	diagnostics.push(new vscode.Diagnostic(range, "teste", vscode.DiagnosticSeverity.Warning));*/

	report.classes.forEach((classe: any) => {
		getClassDiagnostic(classe, diagnostics);
	});

	report.methods.forEach((method: any) => {
		getMethodDiagnostic(method, diagnostics);
	});

	diagnosticCollection.set(editor.document.uri, diagnostics);
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
