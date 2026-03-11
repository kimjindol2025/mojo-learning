#!/usr/bin/env node
/**
 * Edge Case Test Runner - Days 5-6 Comprehensive Testing
 *
 * Runs all edge case test files and generates comprehensive report
 */

const fs = require("fs");
const path = require("path");
const { IndentationLexer } = require("../lexer-indent");
const { ParserIndent } = require("../parser-indent");

const EDGE_CASE_DIR = path.join(__dirname, "edge-cases");
const OUTPUT_FILE = path.join(__dirname, "edge-cases-report.txt");

console.log("╔═══════════════════════════════════════════════════════════╗");
console.log("║     Edge Case Test Runner - Days 5-6 Validation          ║");
console.log("║     Comprehensive Parser Testing Protocol               ║");
console.log("╚═══════════════════════════════════════════════════════════╝\n");

// Get all test files
const testFiles = fs.readdirSync(EDGE_CASE_DIR)
  .filter(f => f.endsWith(".mojo"))
  .sort();

console.log(`📋 Found ${testFiles.length} edge case test files\n`);

const results = [];
const stats = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: 0,
  totalTokens: 0,
  totalItems: 0,
  totalTime: 0,
};

// Run each test
testFiles.forEach((file, index) => {
  const filePath = path.join(EDGE_CASE_DIR, file);
  const testName = file.replace(".mojo", "");

  console.log(`[${index + 1}/${testFiles.length}] Testing ${file}...`);

  try {
    const sourceCode = fs.readFileSync(filePath, "utf-8");
    const startTime = Date.now();

    // Tokenize
    const lexer = new IndentationLexer(sourceCode);
    const tokens = lexer.tokenize();

    // Parse
    const parser = new ParserIndent(tokens);
    const ast = parser.parseProgram();

    const elapsedTime = Date.now() - startTime;

    const passed = parser.errors.length === 0;
    const status = passed ? "✅ PASS" : "⚠️  ERRORS";

    console.log(`   ${status} (${tokens.length} tokens, ${ast.items.length} items, ${elapsedTime}ms)`);

    if (parser.errors.length > 0) {
      console.log(`   Errors: ${parser.errors.length}`);
      parser.errors.slice(0, 3).forEach(err => {
        console.log(`     - ${err}`);
      });
      if (parser.errors.length > 3) {
        console.log(`     ... and ${parser.errors.length - 3} more`);
      }
    }

    results.push({
      file,
      testName,
      passed,
      tokens: tokens.length,
      items: ast.items.length,
      errors: parser.errors.length,
      time: elapsedTime,
      lines: sourceCode.split("\n").length,
    });

    stats.total++;
    if (passed) stats.passed++;
    else stats.failed++;
    stats.totalTokens += tokens.length;
    stats.totalItems += ast.items.length;
    stats.totalTime += elapsedTime;

  } catch (err) {
    console.log(`   ❌ CRASH: ${err.message}`);
    results.push({
      file,
      testName,
      passed: false,
      crashed: true,
      error: err.message,
    });
    stats.total++;
    stats.errors++;
  }
});

console.log("\n" + "=".repeat(60));
console.log("SUMMARY");
console.log("=".repeat(60));

console.log(`\nTest Results:`);
console.log(`  Total tests:      ${stats.total}`);
console.log(`  Passed:           ${stats.passed} (${((stats.passed / stats.total) * 100).toFixed(1)}%)`);
console.log(`  Failed:           ${stats.failed}`);
console.log(`  Crashed:          ${stats.errors}`);

console.log(`\nMetrics:`);
console.log(`  Total tokens:     ${stats.totalTokens}`);
console.log(`  Total items:      ${stats.totalItems}`);
console.log(`  Total time:       ${stats.totalTime}ms`);
console.log(`  Avg time/test:    ${(stats.totalTime / stats.total).toFixed(1)}ms`);

console.log(`\nDetails by Test:\n`);

const passedTests = results.filter(r => r.passed);
const failedTests = results.filter(r => !r.passed);

if (passedTests.length > 0) {
  console.log("✅ PASSED TESTS:");
  passedTests.forEach(r => {
    console.log(`  ${r.testName}`);
    console.log(`    - Tokens: ${r.tokens}, Items: ${r.items}, Time: ${r.time}ms`);
  });
}

if (failedTests.length > 0) {
  console.log("\n❌ FAILED/ERROR TESTS:");
  failedTests.forEach(r => {
    console.log(`  ${r.testName}`);
    if (r.crashed) {
      console.log(`    - CRASH: ${r.error}`);
    } else {
      console.log(`    - Errors: ${r.errors}`);
    }
  });
}

// Category Analysis
console.log(`\n\nCATEGORY ANALYSIS:\n`);

const categories = {
  precedence: results.find(r => r.testName === "test_precedence"),
  nested: results.find(r => r.testName === "test_nested"),
  errors: results.find(r => r.testName === "test_errors"),
  features: results.find(r => r.testName === "test_features"),
  performance: results.find(r => r.testName === "test_performance"),
};

Object.entries(categories).forEach(([name, result]) => {
  if (result) {
    const status = result.passed ? "✅" : "❌";
    console.log(`${status} ${name.padEnd(15)} - ${result.items} items, ${result.tokens} tokens`);
  }
});

// Performance Analysis
console.log(`\n\nPERFORMANCE ANALYSIS:\n`);

const slowest = results.filter(r => !r.crashed).sort((a, b) => b.time - a.time).slice(0, 3);
const fastest = results.filter(r => !r.crashed).sort((a, b) => a.time - b.time).slice(0, 3);

console.log(`Slowest tests:`);
slowest.forEach(r => {
  console.log(`  ${r.testName.padEnd(20)} ${r.time}ms`);
});

console.log(`\nFastest tests:`);
fastest.forEach(r => {
  console.log(`  ${r.testName.padEnd(20)} ${r.time}ms`);
});

// Overall Assessment
console.log(`\n\nOVERALL ASSESSMENT:\n`);

if (stats.passed === stats.total) {
  console.log(`✅ ALL TESTS PASSED - Parser handles all edge cases correctly`);
  console.log(`   Ready for Mojo compilation testing`);
} else if (stats.passed >= stats.total * 0.9) {
  console.log(`✅ MOSTLY PASSING (${stats.passed}/${stats.total}) - Minor issues detected`);
  console.log(`   Review failed tests and fix as needed`);
} else {
  console.log(`⚠️  SIGNIFICANT FAILURES - Review all failed tests`);
  console.log(`   Fix issues before proceeding`);
}

// Write detailed report
const reportContent = generateDetailedReport(results, stats);
fs.writeFileSync(OUTPUT_FILE, reportContent);
console.log(`\n📝 Detailed report saved to: edge-cases-report.txt`);

function generateDetailedReport(results, stats) {
  let report = "═══════════════════════════════════════════════════════════\n";
  report += "         EDGE CASE TEST REPORT - Days 5-6 Analysis\n";
  report += "═══════════════════════════════════════════════════════════\n\n";

  report += `TEST SUMMARY\n`;
  report += `────────────────────────────────────────────────────────────\n`;
  report += `Total tests:      ${stats.total}\n`;
  report += `Passed:           ${stats.passed} (${((stats.passed / stats.total) * 100).toFixed(1)}%)\n`;
  report += `Failed:           ${stats.failed}\n`;
  report += `Crashed:          ${stats.errors}\n\n`;

  report += `METRICS\n`;
  report += `────────────────────────────────────────────────────────────\n`;
  report += `Total tokens:     ${stats.totalTokens}\n`;
  report += `Total items:      ${stats.totalItems}\n`;
  report += `Total parse time: ${stats.totalTime}ms\n`;
  report += `Avg time/test:    ${(stats.totalTime / stats.total).toFixed(2)}ms\n\n`;

  report += `DETAILED RESULTS\n`;
  report += `────────────────────────────────────────────────────────────\n`;

  results.forEach(r => {
    report += `\n${r.testName}:\n`;
    report += `  Status:  ${r.passed ? "✅ PASS" : "❌ FAIL"}\n`;
    if (r.crashed) {
      report += `  Error:   ${r.error}\n`;
    } else {
      report += `  Tokens:  ${r.tokens}\n`;
      report += `  Items:   ${r.items}\n`;
      report += `  Errors:  ${r.errors}\n`;
      report += `  Time:    ${r.time}ms\n`;
      report += `  Lines:   ${r.lines}\n`;
    }
  });

  report += `\n\n═══════════════════════════════════════════════════════════\n`;
  return report;
}
