import * as vscode from 'vscode';
import * as ternary from "../../refactorings/convert-if-else-to-ternary/convert-if-else-to-ternary";
import * as deadCode from "../../refactorings/remove-dead-code/remove-dead-code";
import * as extractType from "../../refactorings/extract-type/extract-type";
import * as extractInterface from "../../refactorings/extract-interface/extract-interface";
import * as inlineFunction from "../../refactorings/inline-function/inline-function";

const activeEditor = () => vscode.window.activeTextEditor!;

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
			formatedRefactors += item !== undefined ? "  - " + item : "";
		});

		vscode.window
		.showInformationMessage("Foram identificadas as seguintes oportunidades de refatoração:\n" + formatedRefactors + "\nDeseja aplica-las?", { modal: true },  "Sim", "Não")
		.then(answer => {
			if (answer === "Sim") {
				executeConvertIfElseToTernary();
				executeRemoveDeadCode();
				executeExtractType();
				executeExtractInterface();
				executeInlineFunction();
			}
		});
	}
}

export function executeConvertIfElseToTernary() {
	ternary.convertIfElseToTernary(activeEditor().document.getText(), 
		vscode.window.activeTextEditor?.selection, activeEditor().document.fileName);
}

export function executeRemoveDeadCode() {
	deadCode.removeDeadCode(activeEditor().document.getText(), 
		vscode.window.activeTextEditor?.selection, activeEditor().document.fileName);
}

export function executeExtractType() {
	extractType.extractType(activeEditor().document.getText(), 
		vscode.window.activeTextEditor?.selection, activeEditor().document.fileName);
}

export function executeExtractInterface() {
	extractInterface.extractInterface(activeEditor().document.getText(), 
		vscode.window.activeTextEditor?.selection, activeEditor().document.fileName);
}

export function executeInlineFunction() {
	inlineFunction.inlineFunction(activeEditor().document.getText(), 
		vscode.window.activeTextEditor?.selection, activeEditor().document.fileName);
}