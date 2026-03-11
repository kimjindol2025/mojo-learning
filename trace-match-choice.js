const { IndentationLexer } = require("./compiler-impl/lexer-indent");
const { ParserIndent } = require("./compiler-impl/parser-indent");
const fs = require("fs");

const code = fs.readFileSync("/tmp/test-return-match.mojo", "utf-8");
const lexer = new IndentationLexer(code);
const tokens = lexer.tokenize();

const originalParseMatchExpression = ParserIndent.prototype.parseMatchExpression;
ParserIndent.prototype.parseMatchExpression = function() {
  console.log(`\n[parseMatchExpression] START`);
  console.log(`  pos=${this.current}, token=${tokens[this.current].type}`);
  
  this.consume(this.tokens[this.current].type === 'MATCH' ? 'MATCH' : '', "Expected 'match'");
  console.log(`  after consume(MATCH): pos=${this.current}, token=${tokens[this.current].type}`);
  
  const discriminant = this.parseMultiplicative();
  console.log(`  after parseMultiplicative: pos=${this.current}, token=${tokens[this.current].type}`);
  
  this.skipNewlines();
  console.log(`  after skipNewlines: pos=${this.current}, token=${tokens[this.current].type}`);
  
  while (this.match(this.tokens[this.current].type === 'INDENT' || this.tokens[this.current].type === 'DEDENT' ? 'INDENT' : 'NONE')) {
    this.advance();
  }
  console.log(`  after skip INDENT/DEDENT: pos=${this.current}, token=${tokens[this.current].type}`);
  
  this.skipNewlines();
  console.log(`  after skipNewlines again: pos=${this.current}, token=${tokens[this.current].type}`);
  
  if (this.match(this.tokens[this.current].type === 'LBRACE' ? 'LBRACE' : 'NONE')) {
    console.log(`  -> Calling parseMatchBraceBased`);
    return this.parseMatchBraceBased(discriminant);
  }
  
  console.log(`  -> Calling parseMatchIndentationBased`);
  return this.parseMatchIndentationBased(discriminant);
};

const parser = new ParserIndent(tokens);
try {
  parser.parseProgram();
} catch (e) {
  console.log(`Error: ${e.message}`);
}
