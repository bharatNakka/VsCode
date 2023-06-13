/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

var updateGrammar = require('vscode-grammar-updater');

function adaptJSON(grammar, name, replacementScope, replaceeScope = 'json') {
	grammar.name = name;
	grammar.scopeName = `source${replacementScope}`;
	const regex = new RegExp(`\.${replaceeScope}`, 'g');
	var fixScopeNames = function (rule) {
		if (typeof rule.name === 'string') {
			rule.name = rule.name.replace(regex, replacementScope);
		}
		if (typeof rule.contentName === 'string') {
			rule.contentName = rule.contentName.replace(regex, replacementScope);
		}
		for (var property in rule) {
			var value = rule[property];
			if (typeof value === 'object') {
				fixScopeNames(value);
			}
		}
	};

	var repository = grammar.repository;
	for (var key in repository) {
		fixScopeNames(repository[key]);
	}
}

var tsGrammarRepo = 'microsoft/vscode-JSON.tmLanguage';
updateGrammar.update(tsGrammarRepo, 'JSON.tmLanguage', './syntaxes/JSON.tmLanguage.json');
updateGrammar.update(tsGrammarRepo, 'JSON.tmLanguage', './syntaxes/JSONC.tmLanguage.json', grammar => adaptJSON(grammar, 'JSON with Comments', '.json.comments'));
updateGrammar.update(tsGrammarRepo, 'JSON.tmLanguage', './syntaxes/JSONL.tmLanguage.json', grammar => adaptJSON(grammar, 'JSON Lines', '.json.lines'));

updateGrammar.update('jeff-hykin/better-snippet-syntax', 'autogenerated/jsonc.tmLanguage.json', './syntaxes/snippets.tmLanguage.json', grammar => adaptJSON(grammar, 'Snippets', '.json.snippets', 'json.comments'));
