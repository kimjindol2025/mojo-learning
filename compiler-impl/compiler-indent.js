#!/usr/bin/env node
/**
 * Mojo Compiler - Indentation-Based Syntax (Python Style)
 *
 * Pipeline: Indentation Lexer → Indentation Parser → Code Generator
 *
 * 역할: Python 스타일 들여쓰기 구문을 지원하는 Mojo 컴파일러
 */

const fs = require("fs");
const path = require("path");
const { IndentationLexer } = require("./lexer-indent");
const { ParserIndent } = require("./parser-indent");
const { CodeGenerator } = require("./codegen");
const { SemanticAnalyzer } = require("./semantic-analyzer");
const { IRGenerator } = require("./ir-generator");

class MojoCompilerIndent {
  constructor(sourceCode, filename = "untitled.mojo", options = {}) {
    this.sourceCode = sourceCode;
    this.filename = filename;
    this.options = options; // { llvm: true/false }
  }

  compile() {
    const errors = [];

    try {
      // Phase 1: Indentation Lexing
      console.log("[1/3] Lexing with indentation support...");
      const lexer = new IndentationLexer(this.sourceCode);
      const tokens = lexer.tokenize();
      console.log(`  ✓ Generated ${tokens.length} tokens`);

      // Phase 2: Parsing with indentation awareness
      console.log("[2/3] Parsing...");
      const parser = new ParserIndent(tokens);
      const program = parser.parseProgram();

      if (!program || parser.errors.length > 0) {
        if (parser.errors.length > 0) {
          errors.push(...parser.errors);
        }
        return { success: false, errors };
      }
      console.log(`  ✓ Generated AST with ${program.items.length} items`);

      // Phase 2.5: Semantic Analysis
      console.log("[2.5/4] Performing semantic analysis...");
      const semanticAnalyzer = new SemanticAnalyzer();
      const semanticResult = semanticAnalyzer.analyze(program);
      if (semanticResult.warnings.length > 0) {
        semanticResult.warnings.forEach((warn) => {
          console.log(`  ⚠ ${warn}`);
        });
      }
      if (!semanticResult.success) {
        errors.push(...semanticResult.errors);
        return { success: false, errors };
      }
      console.log("  ✓ Semantic analysis complete");

      // Phase 3: LLVM IR Generation (if requested)
      if (this.options.llvm) {
        console.log("[3/4] Generating LLVM IR...");
        const irGenerator = new IRGenerator();
        const llvmIR = irGenerator.generate(program);
        console.log("  ✓ LLVM IR generation complete");

        return {
          success: true,
          llvmIR,
          pythonCode: null,
          errors: [],
        };
      }

      // Phase 3: Code Generation (Python) - default
      console.log("[3/4] Generating Python code...");
      const generator = new CodeGenerator();
      const pythonCode = generator.generate(program);
      console.log("  ✓ Code generation complete");

      return {
        success: true,
        pythonCode,
        llvmIR: null,
        errors: [],
      };
    } catch (e) {
      errors.push(`Compilation error: ${e.message}`);
      return { success: false, errors };
    }
  }

  static compileFile(filePath, options = {}) {
    try {
      const sourceCode = fs.readFileSync(filePath, "utf-8");
      const compiler = new MojoCompilerIndent(
        sourceCode,
        path.basename(filePath),
        options
      );
      return compiler.compile();
    } catch (e) {
      return {
        success: false,
        errors: [`Failed to read file ${filePath}: ${e.message}`],
      };
    }
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Mojo Compiler (Indentation-Based) v0.2.0");
    console.log(
      "Usage: node compiler-indent.js <input.mojo> [--output output.py] [--llvm]"
    );
    console.log("Options:");
    console.log("  --output <file>  Write output to file");
    console.log("  --llvm           Generate LLVM IR instead of Python");
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args.includes("--output")
    ? args[args.indexOf("--output") + 1]
    : null;
  const llvmMode = args.includes("--llvm");
  const options = { llvm: llvmMode };

  console.log("\n╔════════════════════════════════════════════╗");
  console.log(`║ 🔥 Compiling: ${inputFile.padEnd(38)} ║`);
  if (llvmMode) {
    console.log(`║ Mode: LLVM IR Generation${" ".repeat(17)} ║`);
  }
  console.log("╚════════════════════════════════════════════╝\n");

  const result = MojoCompilerIndent.compileFile(inputFile, options);

  if (result.success) {
    console.log("\n✅ Compilation succeeded!\n");

    if (llvmMode) {
      console.log("Generated LLVM IR:");
      console.log("─".repeat(50));
      console.log(result.llvmIR);
      console.log("─".repeat(50));

      if (outputFile) {
        fs.writeFileSync(outputFile, result.llvmIR);
        console.log(`\n💾 Output saved to: ${outputFile}`);
      }
    } else {
      console.log("Generated Python Code:");
      console.log("─".repeat(50));
      console.log(result.pythonCode);
      console.log("─".repeat(50));

      if (outputFile) {
        fs.writeFileSync(outputFile, result.pythonCode);
        console.log(`\n💾 Output saved to: ${outputFile}`);
      }
    }
  } else {
    console.log("\n❌ Compilation failed!\n");
    console.log("Errors:");
    result.errors.forEach((err) => {
      console.log(`  ✗ ${err}`);
    });
    process.exit(1);
  }
}

module.exports = { MojoCompilerIndent };
