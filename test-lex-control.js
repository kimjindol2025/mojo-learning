const { IndentationLexer } = require("./compiler-impl/lexer-indent");
const fs = require("fs");

const code = fs.readFileSync("step02-basics/control_flow.mojo", "utf-8");
const lexer = new IndentationLexer(code);
const tokens = lexer.tokenize();

// Print first 100 tokens to see tokenization
console.log("First 100 tokens:");
for (let i = 0; i < Math.min(100, tokens.length); i++) {
  const t = tokens[i];
  console.log(`${i}: ${t.type} = "${t.value}"`);
}

// Find match token
const matchIdx = tokens.findIndex((t) => t.value === "match");
console.log("\n\nTokens around MATCH (10 before, 10 after):");
for (let i = Math.max(0, matchIdx - 10); i < Math.min(tokens.length, matchIdx + 10); i++) {
  const t = tokens[i];
  const marker = i === matchIdx ? " <== MATCH" : "";
  console.log(`${i}: ${t.type} = "${t.value}"${marker}`);
}
