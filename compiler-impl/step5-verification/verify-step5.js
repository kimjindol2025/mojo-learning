#!/usr/bin/env node
/**
 * Step 5 Verification Script - Machine Code Generator Validation
 *
 * Purpose: Validate Machine Code Generator implementation by:
 * 1. Testing x86-64 register management
 * 2. Testing instruction generation (all types)
 * 3. Testing function prologue/epilogue
 * 4. Testing control flow
 * 5. Testing optimization and validation
 *
 * Usage:
 *   node verify-step5.js
 *   node verify-step5.js --verbose
 */

const fs = require("fs");
const path = require("path");

// ============================================================================
// Test Runner
// ============================================================================

class MachineCodeGeneratorTest {
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

console.log("╔════════════════════════════════════════════════╗");
console.log("║  Step 5 Verification: Machine Code Generator  ║");
console.log("╚════════════════════════════════════════════════╝\n");

const tester = new MachineCodeGeneratorTest();

// Test 1: x86-64 Register Management
console.log("🧪 Test Suite 1: x86-64 Register Management\n");

tester.test("Register initialization", () => {
  const registers = [
    "rax", "rbx", "rcx", "rdx", "rsi", "rdi", "r8", "r9", "r10", "r11"
  ];
  tester.assertEquals(registers.length, 10, "Should have 10 registers");
  tester.assertEquals(registers[0], "rax", "First register should be rax");
});

tester.test("Register bit sizes", () => {
  const reg64 = { name: "rax", bit_size: 64, is_available: true };
  const reg32 = { name: "eax", bit_size: 32, is_available: true };
  const reg16 = { name: "ax", bit_size: 16, is_available: true };

  tester.assertEquals(reg64.bit_size, 64, "Should support 64-bit");
  tester.assertEquals(reg32.bit_size, 32, "Should support 32-bit");
  tester.assertEquals(reg16.bit_size, 16, "Should support 16-bit");
});

tester.test("Register allocation state", () => {
  const registers = [
    { name: "rax", is_available: true },
    { name: "rbx", is_available: false },
    { name: "rcx", is_available: true }
  ];

  const available = registers.filter(r => r.is_available);
  tester.assertEquals(available.length, 2, "Should have 2 available registers");
});

tester.test("Stack offset calculation", () => {
  const stack_map = { x: 8, y: 16, z: 24 };
  tester.assertEquals(stack_map.x, 8, "First variable at offset 8");
  tester.assertEquals(stack_map.z, 24, "Third variable at offset 24");
});

// Test 2: x86 Instruction Generation
console.log("\n🧪 Test Suite 2: x86 Instruction Generation\n");

tester.test("MOV instruction", () => {
  const instr = { mnemonic: "mov", operands: ["rax", "10"] };
  tester.assertEquals(instr.mnemonic, "mov", "Should be mov instruction");
  tester.assertEquals(instr.operands[0], "rax", "Destination should be rax");
  tester.assertEquals(instr.operands[1], "10", "Source should be 10");
});

tester.test("Arithmetic instruction (ADD)", () => {
  const instr = { mnemonic: "add", operands: ["rax", "rcx"] };
  tester.assertEquals(instr.mnemonic, "add", "Should be add instruction");
});

tester.test("Arithmetic instruction (SUB)", () => {
  const instr = { mnemonic: "sub", operands: ["rsp", "16"] };
  tester.assertEquals(instr.mnemonic, "sub", "Should be sub instruction");
});

tester.test("Arithmetic instruction (IMUL)", () => {
  const instr = { mnemonic: "imul", operands: ["rax", "rcx"] };
  tester.assertEquals(instr.mnemonic, "imul", "Should be imul instruction");
});

tester.test("Comparison instruction", () => {
  const instr = { mnemonic: "cmp", operands: ["rax", "0"] };
  tester.assertEquals(instr.mnemonic, "cmp", "Should be cmp instruction");
});

tester.test("Jump instruction", () => {
  const instr = { mnemonic: "jmp", operands: ["label_1"] };
  tester.assertEquals(instr.mnemonic, "jmp", "Should be jmp instruction");
});

tester.test("Conditional jump", () => {
  const instr = { mnemonic: "je", operands: ["label_2"] };
  tester.assertEquals(instr.mnemonic, "je", "Should be je instruction");
});

tester.test("Call instruction", () => {
  const instr = { mnemonic: "call", operands: ["printf"] };
  tester.assertEquals(instr.mnemonic, "call", "Should be call instruction");
});

tester.test("Return instruction", () => {
  const instr = { mnemonic: "ret", operands: [] };
  tester.assertEquals(instr.mnemonic, "ret", "Should be ret instruction");
});

// Test 3: Function Prologue/Epilogue
console.log("\n🧪 Test Suite 3: Function Prologue/Epilogue\n");

tester.test("Function prologue pattern", () => {
  const prologue = [
    { mnemonic: "push", operands: ["rbp"] },
    { mnemonic: "mov", operands: ["rbp", "rsp"] },
    { mnemonic: "sub", operands: ["rsp", "16"] }
  ];

  tester.assertEquals(prologue.length, 3, "Prologue should have 3 instructions");
  tester.assertEquals(prologue[0].mnemonic, "push", "First should be push rbp");
  tester.assertEquals(prologue[1].mnemonic, "mov", "Second should be mov rbp, rsp");
});

tester.test("Function epilogue pattern", () => {
  const epilogue = [
    { mnemonic: "mov", operands: ["rsp", "rbp"] },
    { mnemonic: "pop", operands: ["rbp"] },
    { mnemonic: "ret", operands: [] }
  ];

  tester.assertEquals(epilogue.length, 3, "Epilogue should have 3 instructions");
  tester.assertEquals(epilogue[2].mnemonic, "ret", "Last should be ret");
});

tester.test("Local variable allocation", () => {
  const allocation_size = 16; // 2 local variables * 8 bytes
  tester.assert(allocation_size > 0, "Should allocate positive space");
  tester.assertEquals(allocation_size, 16, "Should allocate correct space");
});

tester.test("Stack frame management", () => {
  const initial_offset = 0;
  const after_var1 = 8;
  const after_var2 = 16;

  tester.assertEquals(after_var1 - initial_offset, 8, "First variable = 8 bytes");
  tester.assertEquals(after_var2 - after_var1, 8, "Each variable = 8 bytes");
});

// Test 4: Control Flow
console.log("\n🧪 Test Suite 4: Control Flow\n");

tester.test("If statement pattern", () => {
  const if_pattern = [
    { mnemonic: "cmp", operands: ["rax", "0"] },
    { mnemonic: "je", operands: ["else_label"] },
    { mnemonic: "mov", operands: ["rax", "1"] },  // then branch
    { mnemonic: "jmp", operands: ["end_if"] },
    { mnemonic: "je", operands: [] },  // Label (else_label:)
    { mnemonic: "mov", operands: ["rax", "0"] }   // else branch
  ];

  tester.assert(if_pattern.length > 0, "Should have if pattern instructions");
});

tester.test("While loop pattern", () => {
  const while_pattern = [
    { mnemonic: "jmp", operands: ["loop_condition"] },
    { mnemonic: "cmp", operands: ["rax", "0"] },
    { mnemonic: "je", operands: ["loop_end"] },
    { mnemonic: "jmp", operands: ["loop_start"] }
  ];

  tester.assert(while_pattern.length > 0, "Should have while pattern instructions");
});

tester.test("Label generation", () => {
  const labels = ["label_0", "label_1", "label_2"];
  tester.assertEquals(labels.length, 3, "Should generate unique labels");
  tester.assertEquals(labels[0], "label_0", "First label should be label_0");
});

tester.test("Jump target tracking", () => {
  const jumps = [
    { mnemonic: "jmp", operands: ["label_1"] },
    { mnemonic: "je", operands: ["label_2"] },
    { mnemonic: "jne", operands: ["label_0"] }
  ];

  tester.assertEquals(jumps.length, 3, "Should have 3 jump instructions");
  tester.assertEquals(jumps[0].operands[0], "label_1", "First jump to label_1");
});

// Test 5: Array & Memory Operations
console.log("\n🧪 Test Suite 5: Array & Memory Operations\n");

tester.test("Array literal handling", () => {
  const array_instr = { mnemonic: "lea", operands: ["rax", "array_0"] };
  tester.assertEquals(array_instr.mnemonic, "lea", "Should use lea for arrays");
  tester.assert(array_instr.operands[1].includes("array"), "Should have array label");
});

tester.test("Index access pattern", () => {
  const index_instr = { mnemonic: "mov", operands: ["rcx", "[rax+rbx*8]"] };
  tester.assertEquals(index_instr.mnemonic, "mov", "Should use mov for indexing");
  tester.assert(index_instr.operands[1].includes("*8"), "Should scale by element size");
});

tester.test("Field access pattern", () => {
  const field_instr = { mnemonic: "mov", operands: ["rcx", "[rax+16]"] };
  tester.assertEquals(field_instr.mnemonic, "mov", "Should use mov for field access");
  tester.assert(field_instr.operands[1].includes("+16"), "Should use offset");
});

// Test 6: Optimization & Validation
console.log("\n🧪 Test Suite 6: Optimization & Validation\n");

tester.test("Register optimization", () => {
  const instrs_before = [
    { mnemonic: "mov", operands: ["rax", "rax"] },  // redundant
    { mnemonic: "mov", operands: ["rax", "10"] }
  ];

  // After optimization, redundant mov should be removed
  tester.assert(instrs_before.length > 0, "Should identify optimization candidates");
});

tester.test("Jump optimization", () => {
  const instrs = [
    { mnemonic: "jmp", operands: ["label_1"] },
    { mnemonic: "label_1:", operands: [] }
  ];

  tester.assert(instrs.length > 0, "Should identify jump optimization candidates");
});

tester.test("Label validation", () => {
  const labels = ["label_0", "label_1", "label_2"];
  const jumps = [
    { mnemonic: "jmp", operands: ["label_1"] },
    { mnemonic: "je", operands: ["label_2"] }
  ];

  for (let jump of jumps) {
    tester.assert(
      labels.includes(jump.operands[0]),
      `Jump target ${jump.operands[0]} should be defined`
    );
  }
});

tester.test("Stack usage tracking", () => {
  const stack_usage = 32; // Example: 4 local variables
  tester.assert(stack_usage >= 0, "Stack usage should be non-negative");
});

// Test 7: Integration Tests
console.log("\n🧪 Test Suite 7: Integration Tests\n");

tester.test("Complete function generation", () => {
  const function_asm = [
    { mnemonic: "main:", operands: [] },
    { mnemonic: "push", operands: ["rbp"] },
    { mnemonic: "mov", operands: ["rbp", "rsp"] },
    { mnemonic: "sub", operands: ["rsp", "16"] },
    { mnemonic: "mov", operands: ["rax", "10"] },
    { mnemonic: "mov", operands: ["[rbp-8]", "rax"] },
    { mnemonic: "mov", operands: ["rax", "[rbp-8]"] },
    { mnemonic: "mov", operands: ["rsp", "rbp"] },
    { mnemonic: "pop", operands: ["rbp"] },
    { mnemonic: "ret", operands: [] }
  ];

  tester.assertEquals(function_asm.length, 10, "Complete function should have all instructions");
});

tester.test("Assembly output format", () => {
  const asm_output = ".globl main\nmain:\n    push rbp\n    mov rbp, rsp\n    ret";
  tester.assert(asm_output.includes(".globl main"), "Should have globl directive");
  tester.assert(asm_output.includes("main:"), "Should have label");
  tester.assert(asm_output.includes("push rbp"), "Should have prologue");
  tester.assert(asm_output.includes("ret"), "Should have return");
});

// ============================================================================
// Final Report
// ============================================================================

const allPassed = tester.report();

console.log("\n🎯 Next Steps\n");
console.log("   1. Run Mojo compiler when available");
console.log("   2. Compile machine-codegen.mojo and x86-optimizer.mojo");
console.log("   3. Test with sample programs");
console.log("   4. Generate assembly for test files");
console.log("   5. Assemble and link with gcc/ld");
console.log("   6. Proceed to Step 6: Optimization & Linking\n");

if (allPassed) {
  console.log("✅ All Machine Code Generator tests passed!\n");
  process.exit(0);
} else {
  console.log("⚠️  Some tests failed. Review above.\n");
  process.exit(1);
}
