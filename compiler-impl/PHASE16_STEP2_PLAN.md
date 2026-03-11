# Phase 16 Step 2: Parser → Mojo Migration Plan

**Status:** Planning
**Complexity:** ⭐⭐⭐ (Most complex module)
**Estimated Time:** 5-7 days
**Lines:** 982 lines (JavaScript) → ~1,180 lines (Mojo, 1.2x expansion)

---

## Parser Architecture Overview

### Core Components

```
ParserIndent (982 lines)
├── Token stream handling
│   ├── peek() - Look at current token
│   ├── advance() - Move to next token
│   ├── match(types) - Check if current matches types
│   └── consume(type, msg) - Expect specific token
│
├── Recursive descent parsing
│   ├── parseProgram() - Entry point
│   ├── parseFunction() - fn/def declarations
│   ├── parseStruct() - struct definitions
│   ├── parseStatement() - statements
│   ├── parseExpression() - expressions
│   └── ... (15+ parse methods)
│
├── Expression handling
│   ├── parsePrimary() - literals, identifiers
│   ├── parsePostfix() - function calls, indexing
│   ├── parseUnary() - operators like -x, !x
│   ├── parseBinary() - binary operators with precedence
│   └── ... (precedence climbing)
│
└── Error handling
    ├── errors[] - error collection
    └── error reporting
```

---

## Detailed Method Analysis

### Token Stream Methods (5 methods)
1. `peek(offset = 0)` - Return token at position + offset
2. `advance()` - Move to next token, return current
3. `match(...types)` - Check if current token matches types
4. `consume(type, msg)` - Expect token, error if not
5. `skipNewlines()` - Skip NEWLINE tokens

### Core Parsing Methods (15+ methods)
1. `parseProgram()` - Main entry
2. `parseFunction()` - Function definitions
3. `parseStruct()` - Struct definitions
4. `parseStatement()` - All statement types
5. `parseReturn()` - Return statements
6. `parseVarDeclaration()` - let/var declarations
7. `parseIf()` - if/elif/else statements
8. `parseWhile()` - While loops
9. `parseFor()` - For loops
10. `parseMatch()` - Pattern matching (if implemented)
11. `parseBlock()` - Block statements with indentation
12. `parseExpression()` - Expression entry
13. `parseBinary()` - Binary operations
14. `parseUnary()` - Unary operations
15. `parsePostfix()` - Call expressions, indexing
16. `parsePrimary()` - Literals, variables

### Helper Methods (5+ methods)
1. `getOperatorPrecedence(op)` - Operator precedence table
2. `isBinaryOperator(token)` - Check if binary op
3. `isUnaryOperator(token)` - Check if unary op
4. `parseArgumentList()` - Function call arguments
5. `parseTypeAnnotation()` - Type hints

---

## Key Challenges

### 1. Recursive Descent Structure
- **Challenge:** Methods call each other recursively
- **Solution:** Direct line-by-line mapping, same logic
- **Mojo Consideration:** Stack depth should be fine

### 2. AST Node Creation
- **JavaScript:** Create plain objects: `{ type: "...", ... }`
- **Mojo:** Need struct definitions for each AST node type
- **Plan:** Define AST struct hierarchy first

### 3. Error Handling
- **JavaScript:** Errors collected in array, return null on failure
- **Mojo:** Same approach (no exceptions in this pattern)
- **Plan:** Preserve error collection

### 4. Binary Operator Precedence
- **JavaScript:** Precedence climbing algorithm
- **Mojo:** Same algorithm, different syntax
- **Plan:** Direct mapping of precedence table

### 5. Indentation Tracking
- **JavaScript:** INDENT/DEDENT tokens in stream
- **Mojo:** Same token stream (from Lexer.mojo)
- **Plan:** Handle same logic

---

## Step 2 Implementation Plan

### Phase 1: AST Structure Definition (Day 1)
```
Define all AST node types as Mojo structs:
├── ASTNode (base trait/struct)
├── Program
├── FunctionDeclaration
├── StructDeclaration
├── Parameter
├── ReturnStatement
├── VariableDeclaration
├── IfStatement
├── WhileStatement
├── ForStatement
├── Block
├── ExpressionStatement
├── IntLiteral
├── FloatLiteral
├── StringLiteral
├── BoolLiteral
├── Identifier
├── BinaryOp
├── UnaryOp
├── Call
├── Index
├── Array
└── ... (20+ node types)
```

### Phase 2: Parser Skeleton (Day 2)
```
Create ParserIndent struct:
├── Token stream management (5 methods)
├── Error handling
├── Main parsing methods (15+ methods)
└── Operator precedence table
```

### Phase 3: Core Methods Implementation (Days 3-4)
```
Implement in order:
1. Token stream methods (easy)
2. parseProgram() (simple)
3. parseFunction() (medium)
4. parseStatement() (complex)
5. parseExpression() / parseBinary() (most complex)
6. parseBlock() (indentation handling)
```

### Phase 4: Testing & Validation (Days 5-6)
```
Create test harness:
1. Extract AST from JS parser
2. Compare with Mojo parser
3. Generate diff report
4. Debug any discrepancies
```

### Phase 5: Documentation (Day 7)
```
Create PHASE16_STEP2_REPORT.md
```

---

## AST Structure Example

### JavaScript
```javascript
{
  type: "FunctionDeclaration",
  name: "add",
  parameters: [
    { name: "a", type: "Int" },
    { name: "b", type: "Int" }
  ],
  returnType: "Int",
  body: [
    {
      type: "ReturnStatement",
      value: {
        type: "BinaryOp",
        operator: "+",
        left: { type: "Identifier", name: "a" },
        right: { type: "Identifier", name: "b" }
      }
    }
  ]
}
```

### Mojo Struct
```mojo
struct FunctionDeclaration:
    var name: String
    var parameters: List[Parameter]
    var return_type: String
    var body: List[String]  # or Statement list
    
struct Parameter:
    var name: String
    var type_annotation: String
```

---

## Validation Strategy

### Test Case: `test-cases.mojo`
- 6 functions with varying complexity
- 3 control flow types (if, while, for)
- Nested expressions
- Type annotations

### Expected AST Nodes Count
- Program: 1
- FunctionDeclaration: 6
- IfStatement: 2
- WhileStatement: 1
- ForStatement: 1
- Expressions: ~50+
- Total: ~100+ AST nodes

### Verification Process
```bash
# 1. Parse with JS parser
node extract-ast-js.js test-cases.mojo > ast-js.json

# 2. Parse with Mojo parser
mojo parser.mojo test-cases.mojo > ast-mojo.json

# 3. Compare
diff ast-js.json ast-mojo.json
```

---

## Risk Mitigation

### High Risk Areas
1. **Recursive descent implementation**
   - Mitigation: Direct code translation, same structure
   
2. **Expression precedence**
   - Mitigation: Copy precedence table exactly
   
3. **Block/indentation handling**
   - Mitigation: Use same INDENT/DEDENT logic
   
4. **Error recovery**
   - Mitigation: Preserve error handling logic

### Medium Risk Areas
1. **Complex AST node creation**
   - Mitigation: Define all structs upfront
   
2. **Generic type parameters**
   - Mitigation: String representation (same as JS)
   
3. **Pattern matching clauses**
   - Mitigation: Simplified for now

### Low Risk Areas
1. **Token stream management** (already verified)
2. **Helper functions** (mostly math/lookup)
3. **Error collection** (simple append)

---

## Success Criteria

### Code Completion
- [x] All AST nodes defined
- [ ] All 15+ parsing methods implemented
- [ ] All operator precedence handled
- [ ] Indentation parsing correct
- [ ] Error handling preserved

### Validation
- [ ] AST output matches JS parser (100% or identified differences)
- [ ] All test cases parse correctly
- [ ] No panics or runtime errors
- [ ] Diff report <= 5% expected variation

### Documentation
- [ ] PHASE16_STEP2_REPORT.md complete
- [ ] AST structure documented
- [ ] Known differences listed

---

## Timeline

| Day | Task | Subtasks | Status |
|-----|------|----------|--------|
| 1 | Design AST | Define 25+ node types | ⬜ |
| 2 | Skeleton | Token methods, main structure | ⬜ |
| 3 | Core parsing (1) | parseProgram, parseFunction | ⬜ |
| 4 | Core parsing (2) | parseStatement, parseExpression | ⬜ |
| 5 | Testing | Extract AST, generate diffs | ⬜ |
| 6 | Debug | Fix discrepancies | ⬜ |
| 7 | Documentation | Write final report | ⬜ |

**Ready to start:** Day 1 (AST structure definition)

---

## Next Steps

1. Define complete AST struct hierarchy
2. Create parser.mojo skeleton
3. Implement token stream methods
4. Implement parseProgram()
5. Implement parseFunction()
6. ... (continue with other parse methods)
7. Create validation harness
8. Compare outputs and debug
