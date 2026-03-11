#!/usr/bin/env node
/**
 * Extract AST from JS Parser for Step 2 validation
 * Outputs JSON array of AST nodes
 */

const path = require('path');
const { IndentationLexer } = require('../lexer-indent');
const { ParserIndent } = require('../parser-indent');
const fs = require('fs');

if (process.argv.length < 3) {
  console.log('Usage: node extract-ast-js.js <input.mojo>');
  process.exit(1);
}

const inputFile = process.argv[2];
const sourceCode = fs.readFileSync(inputFile, 'utf-8');

// Tokenize
const lexer = new IndentationLexer(sourceCode);
const tokens = lexer.tokenize();

// Parse
const parser = new ParserIndent(tokens);
const ast = parser.parseProgram();

// Output
if (ast) {
  console.log(JSON.stringify(ast, null, 2));
} else {
  console.error('Parse failed');
  process.exit(1);
}
