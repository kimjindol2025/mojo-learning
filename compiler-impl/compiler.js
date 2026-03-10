#!/usr/bin/env node

/**
 * Mojo Compiler v0.1.0
 * 파이프라인: Lexer → Parser → CodeGenerator
 */

const fs = require("fs");
const path = require("path");
const { Lexer } = require("./lexer");
const { Parser } = require("./parser");
const { CodeGenerator } = require("./codegen");

class MojoCompiler {
  constructor(sourceCode, filename = "untitled.mojo") {
    this.sourceCode = sourceCode;
    this.filename = filename;
  }

  compile() {
    const errors = [];

    try {
      // Phase 1: Lexing
      console.log("[1/3] Lexing...");
      const lexer = new Lexer(this.sourceCode);
      const tokens = lexer.tokenize();
      console.log(`  ✓ Generated ${tokens.length} tokens`);

      // Phase 2: Parsing
      console.log("[2/3] Parsing...");
      const parser = new Parser(tokens);
      const program = parser.parse();

      if (!program) {
        errors.push("Failed to parse: Invalid syntax");
        return { success: false, errors, code: null };
      }
      console.log(`  ✓ Generated AST with ${program.items.length} items`);

      // Phase 3: Code Generation
      console.log("[3/3] Generating Python code...");
      const generator = new CodeGenerator();
      const code = generator.generate(program);
      console.log("  ✓ Code generation complete");

      return {
        success: true,
        code,
        errors: [],
      };
    } catch (e) {
      errors.push(`Compilation error: ${e.message}`);
      return { success: false, errors, code: null };
    }
  }

  static compileFile(filePath) {
    try {
      const sourceCode = fs.readFileSync(filePath, "utf-8");
      const compiler = new MojoCompiler(sourceCode, path.basename(filePath));
      return compiler.compile();
    } catch (e) {
      return {
        success: false,
        errors: [`Failed to read file ${filePath}: ${e.message}`],
        code: null,
      };
    }
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("╔════════════════════════════════════════════╗");
    console.log("║      Mojo Compiler v0.1.0                 ║");
    console.log("╚════════════════════════════════════════════╝");
    console.log("");
    console.log("Usage:");
    console.log("  node compiler.js <input.mojo>");
    console.log("  node compiler.js <input.mojo> --output output.py");
    console.log("  node compiler.js <input.mojo> --run");
    console.log("");
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args.includes("--output")
    ? args[args.indexOf("--output") + 1]
    : path.basename(inputFile, ".mojo") + ".py";
  const shouldRun = args.includes("--run");

  console.log("");
  console.log("╔════════════════════════════════════════════╗");
  console.log(`║ 🔥 Compiling: ${inputFile.padEnd(33)} ║`);
  console.log("╚════════════════════════════════════════════╝");
  console.log("");

  const result = MojoCompiler.compileFile(inputFile);

  if (result.success) {
    console.log("");
    console.log("✅ Compilation succeeded!\n");
    console.log("Generated Python Code:");
    console.log("─".repeat(50));
    console.log(result.code);
    console.log("─".repeat(50));

    fs.writeFileSync(outputFile, result.code);
    console.log(`\n💾 Output saved to: ${outputFile}`);

    if (shouldRun) {
      console.log("\n🚀 Running Python code...");
      console.log("─".repeat(50));
      const { execSync } = require("child_process");
      try {
        const output = execSync(`python3 ${outputFile}`, { encoding: "utf-8" });
        console.log(output);
      } catch (e) {
        console.log(e.stdout || e.message);
      }
      console.log("─".repeat(50));
    }
  } else {
    console.log("");
    console.log("❌ Compilation failed!\n");
    console.log("Errors:");
    result.errors.forEach((err) => {
      console.log(`  ✗ ${err}`);
    });
    process.exit(1);
  }
}

module.exports = { MojoCompiler };
