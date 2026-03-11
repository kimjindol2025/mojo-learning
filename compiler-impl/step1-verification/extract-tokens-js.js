#!/usr/bin/env node
/**
 * Extract tokens from JS Lexer for validation
 * Outputs JSON array of tokens
 */

const path = require('path');
const { IndentationLexer } = require('../lexer-indent');
const fs = require('fs');

if (process.argv.length < 3) {
  console.log('Usage: node extract-tokens-js.js <input.mojo>');
  process.exit(1);
}

const inputFile = process.argv[2];
const sourceCode = fs.readFileSync(inputFile, 'utf-8');

const lexer = new IndentationLexer(sourceCode);
const tokens = lexer.tokenize();

const output = tokens.map(token => ({
  type: token.type,
  value: token.value === null ? null : String(token.value),
  line: token.line,
  column: token.column
}));

console.log(JSON.stringify(output, null, 2));
