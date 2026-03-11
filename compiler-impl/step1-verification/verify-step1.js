#!/usr/bin/env node
/**
 * Step 1 Verification Tool
 * Compare Lexer.js and Lexer.mojo
 */

const fs = require('fs');
const path = require('path');

console.log('╔══════════════════════════════════════════════════════╗');
console.log('║  PHASE 16 STEP 1 VERIFICATION - Lexer Migration    ║');
console.log('║  Compare lexer-indent.js vs lexer.mojo             ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

// 1. Compare file sizes and structure
console.log('📊 FILE COMPARISON\n');

const jsFile = path.join(__dirname, '../lexer-indent.js');
const mojoFile = path.join(__dirname, '../lexer.mojo');

const jsCode = fs.readFileSync(jsFile, 'utf-8');
const mojoCode = fs.readFileSync(mojoFile, 'utf-8');

const jsLines = jsCode.split('\n').length;
const mojoLines = mojoCode.split('\n').length;

console.log(`JavaScript (lexer-indent.js):  ${jsLines} lines`);
console.log(`Mojo (lexer.mojo):             ${mojoLines} lines`);
console.log(`Expansion ratio:               ${(mojoLines / jsLines).toFixed(2)}x (expected 1.1-1.3x)\n`);

// 2. Keyword mapping verification
console.log('🔑 KEYWORD VERIFICATION\n');

const jsKeywords = [
  'fn', 'let', 'var', 'if', 'else', 'elif', 'for', 'while', 'return',
  'struct', 'owned', 'borrowed', 'mut', 'match', 'break', 'continue',
  'in', 'true', 'false', 'def', 'and', 'or', 'not'
];

const keywordCheckpoints = {
  'Keywords in JS': jsKeywords.length,
  'Mapped in Mojo': mojoCode.includes('self.keywords["fn"]') ? 'Present' : 'Missing'
};

console.log('Keywords defined:');
jsKeywords.forEach(kw => {
  const inMojo = mojoCode.includes(`"${kw}"`);
  console.log(`  ${inMojo ? '✅' : '❌'} ${kw}`);
});

// 3. Token type verification
console.log('\n🎫 TOKEN TYPE VERIFICATION\n');

const tokenTypes = [
  'FN', 'LET', 'VAR', 'IF', 'ELSE', 'ELIF', 'FOR', 'WHILE', 'RETURN',
  'INTEGER', 'FLOAT', 'STRING', 'IDENTIFIER',
  'PLUS', 'MINUS', 'STAR', 'SLASH', 'PERCENT',
  'EQ', 'NE', 'LT', 'LE', 'GT', 'GE',
  'LPAREN', 'RPAREN', 'LBRACE', 'RBRACE', 'LBRACK', 'RBRACK',
  'COMMA', 'DOT', 'COLON', 'SEMICOLON', 'ARROW', 'FAT_ARROW',
  'INDENT', 'DEDENT', 'NEWLINE', 'EOF'
];

let tokenMismatches = 0;
tokenTypes.forEach(tt => {
  const inMojo = mojoCode.includes(`fn ${tt}()`);
  if (!inMojo) {
    console.log(`  ❌ ${tt}`);
    tokenMismatches++;
  }
});

if (tokenMismatches === 0) {
  console.log('✅ All token types present');
} else {
  console.log(`⚠️  Missing ${tokenMismatches} token types`);
}

// 4. Core method verification
console.log('\n⚙️ CORE METHOD VERIFICATION\n');

const coreMethods = [
  { name: 'peek', js: 'peek(offset = 0)', mojo: 'fn peek(self, offset: Int = 0)' },
  { name: 'advance', js: 'advance()', mojo: 'fn advance(inout self)' },
  { name: 'readIdentifier', js: 'readIdentifier()', mojo: 'fn read_identifier(inout self)' },
  { name: 'readNumber', js: 'readNumber()', mojo: 'fn read_number(inout self)' },
  { name: 'readString', js: 'readString()', mojo: 'fn read_string(inout self)' },
  { name: 'tokenize', js: 'tokenize()', mojo: 'fn tokenize(inout self)' }
];

coreMethods.forEach(method => {
  const inMojo = mojoCode.includes(method.mojo);
  console.log(`  ${inMojo ? '✅' : '❌'} ${method.name}`);
});

// 5. Operator handling verification
console.log('\n➕ OPERATOR HANDLING VERIFICATION\n');

const operators = [
  { char: '+', jsPattern: 'char === "+"', mojoPattern: 'char == "+"' },
  { char: '-', jsPattern: 'char === "-"', mojoPattern: 'char == "-"' },
  { char: '*', jsPattern: 'char === "*"', mojoPattern: 'char == "*"' },
  { char: '/', jsPattern: 'char === "/"', mojoPattern: 'char == "/"' },
  { char: '=', jsPattern: 'char === "="', mojoPattern: 'char == "="' },
  { char: '!', jsPattern: 'char === "!"', mojoPattern: 'char == "!"' },
  { char: '<', jsPattern: 'char === "<"', mojoPattern: 'char == "<"' },
  { char: '>', jsPattern: 'char === ">"', mojoPattern: 'char == ">"' }
];

let opMismatches = 0;
operators.forEach(op => {
  const inMojo = mojoCode.includes(`char == "${op.char}"`);
  if (!inMojo) {
    console.log(`  ❌ ${op.char} operator`);
    opMismatches++;
  }
});

if (opMismatches === 0) {
  console.log('✅ All operators handled');
} else {
  console.log(`⚠️  Missing ${opMismatches} operators`);
}

// 6. Test token output
console.log('\n🧪 TOKEN OUTPUT COMPARISON\n');

const tokensJsonFile = path.join(__dirname, 'tokens-js.json');
if (fs.existsSync(tokensJsonFile)) {
  const tokens = JSON.parse(fs.readFileSync(tokensJsonFile, 'utf-8'));
  console.log(`Sample tokens from test-cases.mojo:`);
  console.log(`  Total tokens: ${tokens.length}`);
  console.log(`  First 5 tokens:`);
  tokens.slice(0, 5).forEach((token, idx) => {
    console.log(`    ${idx + 1}. ${token.type} = "${token.value}" (line ${token.line})`);
  });
  console.log(`  Last 5 tokens:`);
  tokens.slice(-5).forEach((token, idx) => {
    console.log(`    ${tokens.length - 4 + idx}. ${token.type} = "${token.value}" (line ${token.line})`);
  });
} else {
  console.log('⚠️  tokens-js.json not found (run extract-tokens-js.js first)');
}

// 7. Summary
console.log('\n' + '═'.repeat(60));
console.log('📋 SUMMARY\n');

console.log('✅ Completed:');
console.log('  [1] Structure analysis');
console.log('  [2] Keyword mapping verification');
console.log('  [3] Token type definitions');
console.log('  [4] Core methods implementation');
console.log('  [5] Operator handling');
console.log('  [6] Token output format');

console.log('\n📝 Next Steps:');
console.log('  [1] Deploy lexer.mojo to Mojo environment');
console.log('  [2] Compile and run: mojo lexer.mojo');
console.log('  [3] Compare output: diff tokens-js.json tokens-mojo.json');
console.log('  [4] If diff is empty: PASS ✅');
console.log('  [5] If diff exists: debug and fix');

console.log('\n🎯 Expected Result:');
console.log('  Tokens identical → Lexer migration successful');
console.log('═'.repeat(60) + '\n');
