const { IndentationLexer } = require("./compiler-impl/lexer-indent");
const fs = require("fs");

const code = fs.readFileSync("/tmp/test-return-match.mojo", "utf-8");
const lexer = new IndentationLexer(code);
const tokens = lexer.tokenize();

console.log("=== All tokens ===");
for (let i = 0; i < tokens.length; i++) {
  const t = tokens[i];
  const fn = i === 12 ? " <- RETURN" : i === 13 ? " <- MATCH" : "";
  console.log(`${i}: ${t.type} = "${t.value}"${fn}`);
}

// Trace parseFunction -> get_day function
console.log("\n=== Tracing get_day function ===");
let pos = 12; // RETURN
const returnToken = tokens[pos];
console.log(`pos=${pos}: ${returnToken.type} (parseReturnStatement)`);

pos++; // MATCH
const matchToken = tokens[pos];
console.log(`pos=${pos}: ${matchToken.type} (parseExpression)`);
console.log(`  - match(MATCH)? ${matchToken.type === 'MATCH'}`);

pos++; // d
console.log(`pos=${pos}: ${tokens[pos].type} = "${tokens[pos].value}" (parseMultiplicative)`);

pos++; // LBRACE
console.log(`pos=${pos}: ${tokens[pos].type} (after parseMultiplicative)`);
console.log(`  - Should call parseMatchBraceBased because next is LBRACE`);
