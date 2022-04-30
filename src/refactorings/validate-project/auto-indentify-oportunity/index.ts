import * as vscode from 'vscode';
import * as ternary from "../../../refactorings/convert-if-else-to-ternary/convert-if-else-to-ternary";
import * as deadCode from "../../../refactorings/remove-dead-code/remove-dead-code";
import * as extractType from "../../../refactorings/extract-type/extract-type";
import * as extractInterface from "../../../refactorings/extract-interface/extract-interface";
import * as inlineFunction from "../../../refactorings/inline-function/inline-function";

const activeEditor = () => vscode.window.activeTextEditor!;

export function countRefactorsAvaliable(sourceCode: any, readFile: any) {

	let refatoracoes: any = [];

	refatoracoes.push(ternary.hasCodeChanged(sourceCode, vscode.window.activeTextEditor?.selection, ""));

	refatoracoes.push(deadCode.hasCodeChanged(sourceCode, vscode.window.activeTextEditor?.selection, ""));

	refatoracoes.push(extractInterface.hasCodeChanged(sourceCode, vscode.window.activeTextEditor?.selection, ""));

	try {
		refatoracoes.push(inlineFunction.hasCodeChanged(sourceCode, vscode.window.activeTextEditor?.selection, ""));
	} catch {
		console.log("Erro executeConvertIfElseToTernary arquivo: " + readFile);
	}

	refatoracoes.push(inlineFunction.hasCodeChanged(sourceCode, vscode.window.activeTextEditor?.selection, ""));

	let formatedRefactors = 0; 	

	refatoracoes.forEach((item: string) => {
		formatedRefactors += item !== undefined ? 1 : 0;
	});

	return formatedRefactors;
}

export function executeIdentifyOportunity(sourceCode: any, readFile: any) {
	let hasRefactors = countRefactorsAvaliable(sourceCode, readFile);

	if (hasRefactors > 0) {
		try {
			executeConvertIfElseToTernary(sourceCode, readFile);
		} catch {
			console.log("Erro executeConvertIfElseToTernary arquivo: " + readFile);
		}

		try {
			executeRemoveDeadCode(sourceCode, readFile);
		} catch {
			console.log("Erro executeRemoveDeadCode arquivo: " + readFile);
		}

		try {
			executeExtractInterface(sourceCode, readFile);
		} catch {
			console.log("Erro executeExtractInterface arquivo: " + readFile);
		}

		try {
			executeInlineFunction(sourceCode, readFile);
		} catch {
			console.log("Erro executeInlineFunction arquivo: " + readFile);
		}
	}
}

export function executeConvertIfElseToTernary(sourceCode: any, readFile: any) {
	ternary.convertIfElseToTernary(sourceCode, vscode.window.activeTextEditor?.selection, readFile);
}

export function executeRemoveDeadCode(sourceCode: any, readFile: any) {
	deadCode.removeDeadCode(sourceCode, vscode.window.activeTextEditor?.selection, readFile);
}

export function executeExtractType(sourceCode: any, readFile: any) {
	extractType.extractType(sourceCode, vscode.window.activeTextEditor?.selection, readFile);
}

export function executeExtractInterface(sourceCode: any, readFile: any) {
	extractInterface.extractInterface(sourceCode, vscode.window.activeTextEditor?.selection, readFile);
}

export function executeInlineFunction(sourceCode: any, readFile: any) {
	inlineFunction.inlineFunction(sourceCode, vscode.window.activeTextEditor?.selection, readFile);
}