const { IndentationLexer } = require("./compiler-impl/lexer-indent");
const fs = require("fs");

const code = fs.readFileSync("/tmp/test-return-match.mojo", "utf-8");
const lexer = new IndentationLexer(code);
const tokens = lexer.tokenize();

console.log("All tokens:");
for (let i = 0; i < tokens.length; i++) {
  const t = tokens[i];
  console.log(`${i}: ${t.type} = "${t.value}"`);
}
