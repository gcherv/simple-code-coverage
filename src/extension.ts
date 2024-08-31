import * as vscode from 'vscode';
import * as path from 'path';
import { calculateCodeCoverage } from './codeCoverageCalculator';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	// Create a status bar item
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -1); // new bar item with priority for position set to -1
	statusBarItem.command = 'simple-code-coverage.onBarItemClick';
	context.subscriptions.push(statusBarItem);

	const populateBarItem = async () => {
		let fileName;
	
		if(vscode.window.activeTextEditor){ // there is a file open
			fileName = path.basename(vscode.window.activeTextEditor.document.fileName).split('.')[0]; // getting current file name without its extension
		} else {
			statusBarItem.hide(); // if is currently shown, hide
			return;
		}

		statusBarItem.text = 'Loading...';
		statusBarItem.show();
		
		const codeCoverage = await calculateCodeCoverage(fileName);

		if(codeCoverage){
			statusBarItem.text = fileName + ': '+codeCoverage+'%';
		} else {
			statusBarItem.text = 'No code coverage.';
		}
	};

	populateBarItem(); // initial load
	context.subscriptions.push(vscode.commands.registerCommand('simple-code-coverage.onBarItemClick', () => {populateBarItem();})); // when the bar item is clicked
	vscode.window.onDidChangeActiveTextEditor(populateBarItem); // when editor changes
}

// This method is called when your extension is deactivated
export function deactivate() {}