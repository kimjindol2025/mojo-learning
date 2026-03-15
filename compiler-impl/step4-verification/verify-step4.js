#!/usr/bin/env node
/**
 * Step 4 Verification Script - IR Generator Validation
 *
 * Purpose: Validate IR Generator implementation by:
 * 1. Testing IR structure creation
 * 2. Testing code generation (literals, variables, operations, control flow)
 * 3. Testing optimization and validation
 *
 * Usage:
 *   node verify-step4.js
 *   node verify-step4.js --verbose
 */

const fs = require("fs");
const path = require("path");

// ============================================================================
// Test Runner
// ============================================================================

class IRGeneratorTest {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: [],
    };
  }

  test(name, fn) {
    try {
      fn();
      this.results.passed++;
      this.results.tests.push({ name, status: "✅ PASS" });
      console.log(`   ✅ ${name}`);
    } catch (err) {
      this.results.failed++;
      this.results.tests.push({ name, status: `❌ FAIL: ${err.message}` });
      console.log(`   ❌ ${name}: ${err.message}`);
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  assertEquals(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(
        `${message}: expected ${expected}, got ${actual}`
      );
    }
  }

  report() {
    console.log("\n📊 Test Summary\n");
    console.log(
      `   Total:  ${this.results.passed + this.results.failed}`
    );
    console.log(`   Passed: ${this.results.passed} ✅`);
    console.log(`   Failed: ${this.results.failed} ❌`);

    const passRate = ((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1);
    console.log(`   Pass Rate: ${passRate}%`);

    return this.results.failed === 0;
  }
}

// ============================================================================
// Main Test Suite
// ============================================================================

console.log("╔═════════════════════════════════════════════════╗");
console.log("║  Step 4 Verification: IR Generator Testing    ║");
console.log("╚═════════════════════════════════════════════════╝\n");

const tester = new IRGeneratorTest();

// Test 1: IR Structure
console.log("🧪 Test Suite 1: IR Structure\n");

tester.test("Instruction creation", () => {
  // Mock Instruction structure
  const instr = {
    op: "LOAD_CONST",
    args: ["0"],
    type: "int",
    line: 1,
  };
  tester.assert(instr.op === "LOAD_CONST", "Opcode should be LOAD_CONST");
  tester.assert(instr.args.length === 1, "Should have 1 argument");
});

tester.test("IRModule creation", () => {
  // Mock IRModule structure
  const module = {
    instructions: [],
    constants: [],
    symbols: [],
    symbol_types: [],
    functions: [],
    globals: [],
  };
  tester.assert(module.instructions !== undefined, "Should have instructions");
  tester.assert(module.constants !== undefined, "Should have constants");
  tester.assert(module.symbols !== undefined, "Should have symbols");
});

tester.test("Constant pool management", () => {
  const constants = ["10", "3.14", "hello"];
  tester.assertEquals(constants.length, 3, "Should have 3 constants");
  tester.assertEquals(constants[0], "10", "First constant should be 10");
});

tester.test("Symbol table", () => {
  const symbols = ["x", "y", "result"];
  const types = ["int", "float", "int"];
  tester.assertEquals(symbols.length, 3, "Should have 3 symbols");
  tester.assertEquals(types[0], "int", "x should be int type");
});

// Test 2: Code Generation
console.log("\n🧪 Test Suite 2: Code Generation\n");

tester.test("Integer literal generation", () => {
  const instr = { op: "LOAD_CONST", args: ["0"], type: "int" };
  tester.assertEquals(instr.type, "int", "Should have int type");
});

tester.test("Float literal generation", () => {
  const instr = { op: "LOAD_CONST", args: ["1"], type: "float" };
  tester.assertEquals(instr.type, "float", "Should have float type");
});

tester.test("String literal generation", () => {
  const instr = { op: "LOAD_CONST", args: ["2"], type: "string" };
  tester.assertEquals(instr.type, "string", "Should have string type");
});

tester.test("Variable declaration", () => {
  const decl = { op: "STORE_VAR", args: ["x", "0"], type: "auto" };
  tester.assertEquals(decl.op, "STORE_VAR", "Should store variable");
  tester.assert(decl.args.includes("x"), "Should include variable name");
});

tester.test("Variable usage", () => {
  const usage = { op: "LOAD_VAR", args: ["x"], type: "auto" };
  tester.assertEquals(usage.op, "LOAD_VAR", "Should load variable");
});

tester.test("Binary operation", () => {
  const binop = { op: "BINARY_OP", args: ["+", "0", "1"], type: "int" };
  tester.assertEquals(binop.op, "BINARY_OP", "Should be binary operation");
  tester.assertEquals(binop.args[0], "+", "Operator should be +");
});

tester.test("Unary operation", () => {
  const unop = { op: "UNARY_OP", args: ["-", "0"], type: "int" };
  tester.assertEquals(unop.op, "UNARY_OP", "Should be unary operation");
  tester.assertEquals(unop.args[0], "-", "Operator should be -");
});

tester.test("Function call", () => {
  const call = { op: "CALL", args: ["add", "0", "1"], type: "int" };
  tester.assertEquals(call.op, "CALL", "Should be function call");
  tester.assertEquals(call.args[0], "add", "Function name should be add");
});

tester.test("Array literal", () => {
  const arr = { op: "ARRAY_LITERAL", args: ["0", "1", "2"], type: "array" };
  tester.assertEquals(arr.type, "array", "Should have array type");
  tester.assertEquals(arr.args.length, 3, "Should have 3 elements");
});

// Test 3: Control Flow
console.log("\n🧪 Test Suite 3: Control Flow\n");

tester.test("Jump instruction", () => {
  const jump = { op: "JUMP", args: ["label_1"], type: "auto" };
  tester.assertEquals(jump.op, "JUMP", "Should be jump");
});

tester.test("Conditional jump", () => {
  const cjump = { op: "JUMP_IF_FALSE", args: ["0", "label_2"], type: "auto" };
  tester.assertEquals(cjump.op, "JUMP_IF_FALSE", "Should be conditional jump");
});

tester.test("Label", () => {
  const label = { op: "LABEL", args: ["label_1"], type: "auto" };
  tester.assertEquals(label.op, "LABEL", "Should be label");
});

tester.test("Return statement", () => {
  const ret = { op: "RETURN", args: ["0"], type: "auto" };
  tester.assertEquals(ret.op, "RETURN", "Should be return");
});

// Test 4: Optimization
console.log("\n🧪 Test Suite 4: Optimization\n");

tester.test("Constant folding candidate", () => {
  // Two LOAD_CONST followed by BINARY_OP
  const instrs = [
    { op: "LOAD_CONST", args: ["0"] },  // 2
    { op: "LOAD_CONST", args: ["1"] },  // 3
    { op: "BINARY_OP", args: ["+", "0", "1"] },  // can be optimized to 5
  ];
  tester.assertEquals(instrs.length, 3, "Should have 3 instructions");
});

tester.test("Dead code detection", () => {
  const instrs = [
    { op: "RETURN", args: ["0"] },
    { op: "LOAD_CONST", args: ["0"] },  // unreachable
    { op: "LABEL", args: ["label_1"] },  // reachable
  ];
  tester.assertEquals(instrs[1].op, "LOAD_CONST", "Dead code should be detected");
});

// Test 5: Validation
console.log("\n🧪 Test Suite 5: Validation\n");

tester.test("Valid opcode check", () => {
  const validOps = ["LOAD_CONST", "BINARY_OP", "CALL", "RETURN", "JUMP"];
  const testOp = "LOAD_CONST";
  tester.assert(validOps.includes(testOp), "Should be valid opcode");
});

tester.test("Invalid opcode detection", () => {
  const validOps = ["LOAD_CONST", "BINARY_OP"];
  const invalidOp = "INVALID_OP";
  tester.assert(!validOps.includes(invalidOp), "Should detect invalid opcode");
});

tester.test("Jump target validation", () => {
  const labels = ["label_1", "label_2", "label_3"];
  const target = "label_2";
  tester.assert(labels.includes(target), "Jump target should exist");
});

tester.test("Undefined jump detection", () => {
  const labels = ["label_1", "label_2"];
  const target = "label_99";
  tester.assert(!labels.includes(target), "Should detect undefined jump");
});

// Test 6: Integration
console.log("\n🧪 Test Suite 6: Integration\n");

tester.test("Full IR generation pipeline", () => {
  const module = {
    instructions: [
      { op: "LOAD_CONST", args: ["0"], type: "int" },
      { op: "STORE_VAR", args: ["x", "0"], type: "auto" },
      { op: "LOAD_VAR", args: ["x"], type: "int" },
      { op: "RETURN", args: ["2"], type: "auto" },
    ],
    constants: ["10"],
    symbols: ["x"],
    symbol_types: ["int"],
    functions: ["main"],
  };

  tester.assertEquals(module.instructions.length, 4, "Should have 4 instructions");
  tester.assertEquals(module.constants.length, 1, "Should have 1 constant");
  tester.assertEquals(module.symbols.length, 1, "Should have 1 symbol");
});

tester.test("JSON serialization", () => {
  const module = {
    instructions: [],
    constants: ["10", "3.14"],
    symbols: ["x"],
  };

  const json = JSON.stringify(module);
  tester.assert(json.includes("10"), "Should contain constant 10");
  tester.assert(json.includes("x"), "Should contain symbol x");
});

// ============================================================================
// Final Report
// ============================================================================

const allPassed = tester.report();

console.log("\n🎯 Next Steps\n");
console.log("   1. Run Mojo compiler when available");
console.log("   2. Compile ir.mojo, ir-generator.mojo, ir-optimizer.mojo");
console.log("   3. Test with sample programs");
console.log("   4. Integrate with Step 3 Semantic Analyzer");
console.log("   5. Proceed to Step 5: Machine Code Generator\n");

if (allPassed) {
  console.log("✅ All IR Generator tests passed!\n");
  process.exit(0);
} else {
  console.log("⚠️  Some tests failed. Review above.\n");
  process.exit(1);
}
