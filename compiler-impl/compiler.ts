/**
 * Mojo Compiler - Main Pipeline
 *
 * 역할: 소스 코드를 읽어 컴파일하는 메인 엔트리포인트
 * 파이프라인: Lexer → Parser → TypeChecker → MLIRGenerator
 */

import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { TypeChecker } from "./type-checker";
import { MLIRGenerator } from "./mlir-generator";
import * as fs from "fs";
import * as path from "path";

export class MojoCompiler {
  private sourceCode: string;
  private filename: string;

  constructor(sourceCode: string, filename: string = "untitled.mojo") {
    this.sourceCode = sourceCode;
    this.filename = filename;
  }

  public compile(): {
    success: boolean;
    mlirCode?: string;
    errors: string[];
  } {
    const errors: string[] = [];

    try {
      // Phase 1: Lexing (토큰화)
      console.log("[1/4] Lexing...");
      const lexer = new Lexer(this.sourceCode);
      const tokens = lexer.tokenize();
      console.log(`  ✓ Generated ${tokens.length} tokens`);

      // Phase 2: Parsing (AST 생성)
      console.log("[2/4] Parsing...");
      const parser = new Parser(tokens);
      const program = parser.parse();
      
      if (!program) {
        errors.push("Failed to parse: Invalid syntax");
        return { success: false, errors };
      }
      console.log(`  ✓ Generated AST with ${program.items.length} items`);

      // Phase 3: Type Checking (타입 검증)
      console.log("[3/4] Type Checking...");
      const typeChecker = new TypeChecker();
      const typedProgram = typeChecker.check(program);
      
      if (typeChecker.hasErrors()) {
        const typeErrors = typeChecker.getErrors();
        errors.push(...typeErrors);
        return { success: false, errors };
      }
      console.log("  ✓ Type checking passed");

      // Phase 4: MLIR Code Generation
      console.log("[4/4] Generating MLIR...");
      const generator = new MLIRGenerator();
      const mlirCode = generator.generate(typedProgram);
      console.log("  ✓ MLIR code generated");

      return {
        success: true,
        mlirCode,
        errors: [],
      };
    } catch (e: any) {
      errors.push(`Compilation error: ${e.message}`);
      return { success: false, errors };
    }
  }

  public static compileFile(filePath: string): {
    success: boolean;
    mlirCode?: string;
    errors: string[];
  } {
    try {
      const sourceCode = fs.readFileSync(filePath, "utf-8");
      const compiler = new MojoCompiler(sourceCode, path.basename(filePath));
      return compiler.compile();
    } catch (e: any) {
      return {
        success: false,
        errors: [`Failed to read file ${filePath}: ${e.message}`],
      };
    }
  }
}

// CLI 사용법
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log("Mojo Compiler v0.1.0");
    console.log("Usage: npx ts-node compiler.ts <input.mojo> [--output output.mlir]");
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args.includes("--output") 
    ? args[args.indexOf("--output") + 1]
    : null;

  console.log(`\n═══════════════════════════════════════`);
  console.log(`📝 Compiling: ${inputFile}`);
  console.log(`═══════════════════════════════════════\n`);

  const result = MojoCompiler.compileFile(inputFile);

  if (result.success) {
    console.log("\n✅ Compilation succeeded!\n");
    console.log("Generated MLIR Code:");
    console.log("─".repeat(50));
    console.log(result.mlirCode);
    console.log("─".repeat(50));

    if (outputFile) {
      fs.writeFileSync(outputFile, result.mlirCode!);
      console.log(`\n💾 Output saved to: ${outputFile}`);
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

export default MojoCompiler;
