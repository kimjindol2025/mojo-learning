const { IndentationLexer } = require("./compiler-impl/lexer-indent");
const { ParserIndent } = require("./compiler-impl/parser-indent");
const fs = require("fs");

const code = fs.readFileSync("/tmp/test-return-match.mojo", "utf-8");
const lexer = new IndentationLexer(code);
const tokens = lexer.tokenize();

// Monkey patch to trace
const originalParseReturnStatement = ParserIndent.prototype.parseReturnStatement;
ParserIndent.prototype.parseReturnStatement = function() {
  console.log(`\n[parseReturnStatement] pos=${this.current}, token=${this.peek().type}`);
  const result = originalParseReturnStatement.call(this);
  console.log(`[parseReturnStatement] after: pos=${this.current}, token=${this.peek().type}`);
  return result;
};

const originalParseExpression = ParserIndent.prototype.parseExpression;
ParserIndent.prototype.parseExpression = function() {
  const token = this.peek().type;
  console.log(`[parseExpression] pos=${this.current}, token=${token}`);
  if (token === 'MATCH') console.log('  -> calling parseMatchExpression');
  const result = originalParseExpression.call(this);
  console.log(`[parseExpression] after: pos=${this.current}, token=${this.peek().type}`);
  return result;
};

const originalParseMatchExpression = ParserIndent.prototype.parseMatchExpression;
ParserIndent.prototype.parseMatchExpression = function() {
  console.log(`[parseMatchExpression] start, pos=${this.current}`);
  const result = originalParseMatchExpression.call(this);
  console.log(`[parseMatchExpression] end, result.type=${result.type}`);
  return result;
};

const parser = new ParserIndent(tokens);
try {
  const ast = parser.parseProgram();
  console.log("\n✅ Parsing succeeded!");
} catch (e) {
  console.log(`\n❌ Parsing failed: ${e.message}`);
}
console.log(`\nFinal pos=${parser.current}, token=${tokens[parser.current].type}`);
console.log(`Errors: ${parser.errors.length}`);
parser.errors.forEach(err => console.log(`  - ${err}`));
