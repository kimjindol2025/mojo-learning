const { Lexer } = require("./lexer");
const fs = require("fs");

const source = fs.readFileSync("./test.mojo", "utf-8");
console.log("Source code:");
console.log(source);
console.log("\nTokens:");

const lexer = new Lexer(source);
const tokens = lexer.tokenize();

tokens.forEach((token, i) => {
  console.log(`[${i}] ${token.type.padEnd(15)} "${token.value}"`);
});
