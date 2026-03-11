# Phase 16 Step 2: Days 5-6 - Edge Case Testing & Comprehensive Validation 📋 PLAN

**Date:** 2026-03-12 (planning)
**Planned Duration:** Days 5-6 (2 days)
**Status:** Ready to Begin
**Prerequisite:** Days 3-4 validation complete ✅

---

## 🎯 Days 5-6 Objectives

### Primary Goals

1. **Test Operator Precedence Edge Cases** - Ensure precedence climbing works correctly
2. **Test Complex Nested Expressions** - Validate recursive expression parsing
3. **Test Error Handling** - Verify error recovery in edge cases
4. **Test Language Features** - All 26 AST node types exercised
5. **Performance Testing** - Large input handling
6. **Edge Case Coverage** - Boundary conditions and unusual syntax

### Success Criteria

- ✅ All edge case test files parse without errors
- ✅ AST output matches expected structure
- ✅ Operator precedence correct in all cases
- ✅ Nested expressions resolve properly
- ✅ Error messages clear and helpful
- ✅ No parser crashes or hangs
- ✅ Performance acceptable (<100ms per file)

---

## 📊 Edge Case Categories

### 1. Operator Precedence (10 test cases)

**Test 1.1: Arithmetic Precedence**
```mojo
fn test_precedence1():
    a = 2 + 3 * 4
    b = (2 + 3) * 4
    c = 5 - 2 + 1
    d = 10 / 2 * 5
    e = 2 ** 3 ** 2  # Right associative for power
```

**Expected AST:**
```
a = BinaryOp(+, 2, BinaryOp(*, 3, 4))           # ✅ * before +
b = BinaryOp(*, BinaryOp(+, 2, 3), 4)           # ✅ parentheses override
c = BinaryOp(+, BinaryOp(-, 5, 2), 1)           # ✅ left-to-right
d = BinaryOp(*, BinaryOp(/, 10, 2), 5)          # ✅ left-to-right
e = BinaryOp(**, 2, BinaryOp(**, 3, 2))         # ✅ right associative
```

**Test 1.2: Comparison Operators**
```mojo
fn test_precedence2():
    a = 5 > 3 and 2 < 4
    b = x == 5 or y != 10
    c = 1 < 2 <= 2 < 3
    d = (5 > 3) == true
```

**Expected:** Comparisons have precedence 3, and/or have 1-2

**Test 1.3: Logical Operators**
```mojo
fn test_logic():
    a = true or false and true     # and before or
    b = not (true and false)
    c = (a > b) and (c < d) or (e == f)
```

**Test 1.4: Mixed Operators**
```mojo
fn test_mixed():
    result = (a + b) * c > d and e <= f or g != h
    # Parse tree should respect: arithmetic > comparison > logical
```

**Test 1.5: Unary Operators**
```mojo
fn test_unary():
    a = -5 + 3
    b = -(3 + 4)
    c = not true and false
    d = -x * y
```

### 2. Complex Nested Expressions (8 test cases)

**Test 2.1: Function Call in Expressions**
```mojo
fn test_nested_calls():
    a = foo(bar(baz(5)))
    b = foo(a, bar(b, c), d)
    c = (foo(x) + bar(y)) * baz(z)
```

**Test 2.2: Array/Field Access Chains**
```mojo
fn test_access():
    a = arr[0]
    b = obj.field
    c = arr[i + 1]
    d = obj.field[0].nested
    e = matrix[i][j]
```

**Test 2.3: Deeply Nested Expressions**
```mojo
fn test_deep_nesting():
    a = ((((1 + 2) * 3) / 4) - 5)
    b = f(g(h(i(j(k(5))))))
    c = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
```

**Test 2.4: Conditional Expressions**
```mojo
fn test_nested_conditionals():
    if a:
        if b:
            if c:
                d = 1
            else:
                d = 2
        else:
            d = 3
    else:
        d = 4
```

**Test 2.5: Loop Nesting**
```mojo
fn test_nested_loops():
    i = 0
    while i < n:
        j = 0
        while j < m:
            sum = sum + matrix[i][j]
            j = j + 1
        i = i + 1
```

**Test 2.6: Complex Return Statements**
```mojo
fn test_complex_return():
    return (a + b) * (c - d) / (e + f)
    return foo(bar(x), baz(y), [1, 2, 3])
    return if cond: a else: b
```

**Test 2.7: Array Literals with Expressions**
```mojo
fn test_array_expressions():
    arr = [1 + 2, 3 * 4, func(5)]
    matrix = [[1, 2], [3, 4]]
    mixed = [a, b + c, foo(d)]
```

**Test 2.8: Assignment with Complex RHS**
```mojo
fn test_complex_assignment():
    x = (a + b) * (c + d)
    y = arr[i + 1] + arr[j - 1]
    z = func(a) + func(b) * func(c)
```

### 3. Error Handling Edge Cases (6 test cases)

**Test 3.1: Missing Tokens**
```mojo
fn test_syntax_errors():
    # Missing closing parenthesis
    a = (1 + 2

    # Missing operator
    b = 1 2 3

    # Missing return value
    return
```

**Expected:** Clear error messages, error recovery

**Test 3.2: Invalid Identifiers**
```mojo
fn test_invalid_names():
    123abc = 5    # Invalid: starts with number
    _reserved = 10
    name! = 20
```

**Test 3.3: Incomplete Constructs**
```mojo
fn test_incomplete():
    if x:
        y = 1
    # Missing else (is this optional?)

    while a > b:
    # Missing body
```

**Test 3.4: Type Annotation Variants**
```mojo
fn test_types(a: Int, b: List[Int], c: Dict[String, Float]) -> Bool:
    pass
```

**Test 3.5: Comment Handling**
```mojo
fn test_comments():
    # This is a comment
    x = 5  # Inline comment
    y = 10
    # Comment before function

fn next_func():
    pass
```

**Test 3.6: Whitespace Variations**
```mojo
fn test_whitespace():
    a=1
    b = 2
    c  =  3
    d=b+c
```

### 4. Language Feature Coverage (9 test cases)

**Test 4.1: All Literal Types**
```mojo
fn test_all_literals():
    i = 42
    f = 3.14
    s = "hello"
    b = true
    n = false
    arr = [1, 2, 3]
    tup = (1, 2, 3)
```

**Test 4.2: All Statement Types**
```mojo
fn test_all_statements():
    x = 5              # VariableDeclaration
    y = x + 1          # ExpressionStatement
    if x > 0:          # IfStatement
        z = 1
    while y > 0:       # WhileLoop
        y = y - 1
    return z           # ReturnStatement
```

**Test 4.3: All Expression Types**
```mojo
fn test_expressions():
    a = 1 + 2                  # BinaryOp
    b = -a                     # UnaryOp
    c = foo(5)                 # Call
    d = obj.field              # FieldAccess
    e = arr[0]                 # IndexAccess
    f = a                      # Identifier
```

**Test 4.4: Struct Declarations**
```mojo
struct Point:
    x: Int
    y: Int

struct Rectangle:
    top_left: Point
    width: Int
    height: Int
```

**Test 4.5: Generic Functions**
```mojo
fn swap<T>(a: T, b: T) -> (T, T):
    return (b, a)

fn map<T, U>(arr: List[T], f: fn(T) -> U) -> List[U]:
    result = []
    i = 0
    while i < len(arr):
        result.append(f(arr[i]))
        i = i + 1
    return result
```

**Test 4.6: For Loops**
```mojo
fn test_for():
    for i in range(10):
        print(i)

    for item in arr:
        process(item)

    for i in range(n):
        for j in range(m):
            sum = sum + matrix[i][j]
```

**Test 4.7: Break/Continue Statements**
```mojo
fn test_break_continue():
    i = 0
    while i < 10:
        if i == 5:
            break
        if i == 2:
            continue
        print(i)
        i = i + 1
```

**Test 4.8: Multiple Return Types**
```mojo
fn test_returns():
    if cond:
        return 1
    else:
        return 2

    # Implicit return
fn implicit_return():
    x = 5
```

**Test 4.9: Recursive Functions**
```mojo
fn factorial(n: Int) -> Int:
    if n <= 1:
        return 1
    else:
        return n * factorial(n - 1)

fn ackermann(m: Int, n: Int) -> Int:
    if m == 0:
        return n + 1
    elif n == 0:
        return ackermann(m - 1, 1)
    else:
        return ackermann(m - 1, ackermann(m, n - 1))
```

### 5. Performance & Stress Tests (3 test cases)

**Test 5.1: Large Number of Operations**
```mojo
fn test_large_expr():
    # 100+ operators in single expression
    result = 1 + 2 + 3 + 4 + 5 + ... + 100
```

**Expected:** Parse time < 50ms

**Test 5.2: Deep Nesting**
```mojo
fn test_deep_nesting():
    # 50+ levels of nesting
    result = (((((((...))))))))
```

**Expected:** Parse time < 50ms, no stack overflow

**Test 5.3: Large Array Literal**
```mojo
fn test_large_array():
    arr = [1, 2, 3, ..., 1000]
```

**Expected:** Parse time < 100ms

### 6. Special Cases (4 test cases)

**Test 6.1: Empty Functions**
```mojo
fn empty():
    pass
```

**Test 6.2: Single Expression Functions**
```mojo
fn double(x: Int) -> Int:
    return x * 2
```

**Test 6.3: Multiple Type Annotations**
```mojo
fn process(a: Int, b: String, c: List[Float]) -> Dict[String, Int]:
    pass
```

**Test 6.4: Unusual But Valid Syntax**
```mojo
fn unusual():
    a=b=c=5          # Chained assignment
    x=(y=10)         # Assignment expression
```

---

## 📋 Test Execution Plan

### Phase 1: Test Case Creation (Day 5, 2 hours)

Create individual test files:
```bash
step2-verification/
├── edge-cases/
│   ├── test_precedence.mojo
│   ├── test_nested_expressions.mojo
│   ├── test_error_cases.mojo
│   ├── test_all_features.mojo
│   ├── test_performance.mojo
│   └── test_special_cases.mojo
```

### Phase 2: Individual Testing (Day 5, 2 hours)

For each test file:
```bash
node verify-step2.js edge-cases/test_*.mojo
```

Verify:
- ✅ Parse completes without crash
- ✅ No unexpected errors
- ✅ AST structure is correct
- ✅ Parse time reasonable

### Phase 3: Comprehensive Report (Day 6, 1 hour)

Generate summary:
```bash
node verify-step2.js --comprehensive > edge-cases-report.txt
```

### Phase 4: Edge Case Analysis (Day 6, 1 hour)

Identify any:
- ❌ Parse errors
- ⚠️  Unexpected behaviors
- ✅ Confirmed working features

### Phase 5: Documentation (Day 6, 2 hours)

Create `PHASE16_STEP2_DAY5_6_REPORT.md` with:
- Test results summary
- Any issues found and fixed
- Operator precedence validation results
- Error handling quality assessment
- Performance metrics
- Recommendations for Days 7+

---

## ✅ Expected Outcomes

### Quality Metrics (Target)

| Metric | Target | Status |
|--------|--------|--------|
| Edge cases passing | 40/40 | ⬜ Pending |
| Operator precedence errors | 0 | ⬜ Pending |
| Parser crashes | 0 | ⬜ Pending |
| Average parse time | <50ms | ⬜ Pending |
| Error message clarity | 95%+ | ⬜ Pending |

### Validation Coverage

```
Test Category                Tests  Target Status
─────────────────────────────────────────────────
Operator Precedence           10    ⬜ Pending
Complex Nesting               8     ⬜ Pending
Error Handling                6     ⬜ Pending
Language Features             9     ⬜ Pending
Performance & Stress          3     ⬜ Pending
Special Cases                 4     ⬜ Pending
────────────────────────────────────────────────
TOTAL                        40     ⬜ Pending
```

---

## 🎯 Success Criteria

### Day 5 Completion
- ✅ All 40 test files created
- ✅ All tests parse successfully
- ✅ No unexpected errors
- ✅ Performance acceptable

### Day 6 Completion
- ✅ Comprehensive test report generated
- ✅ All edge cases analyzed
- ✅ Issues documented (if any)
- ✅ Ready for Day 7 documentation
- ✅ Ready for Mojo compilation testing

---

## 📊 Integration with Previous Work

### Connection to Days 3-4

```
Days 3-4 Results:
├── ✅ Perfect match with reference AST
├── ✅ 7 test functions validated
├── ✅ 229 tokens processed correctly
└── ✅ 0 parser errors

Days 5-6 Objective:
├── Extend testing to 40+ edge cases
├── Validate operator precedence
├── Test error handling
├── Verify performance
└── Document comprehensive coverage
```

### Connection to Day 7

```
Days 5-6 Results → Day 7 Documentation
├── Complete edge case report
├── Performance metrics
├── Known limitations (if any)
├── Recommendations
└── Ready for Mojo compilation

Final Outcome:
└── PHASE16_STEP2_REPORT.md (comprehensive)
```

---

## ⚠️ Potential Issues & Mitigation

### Issue 1: Operator Precedence Bugs
**Mitigation:** Detailed validation of each operator in combination

### Issue 2: Deep Nesting Stack Overflow
**Mitigation:** Progressive depth testing (10 → 25 → 50 levels)

### Issue 3: Error Recovery Incomplete
**Mitigation:** Document error handling behavior clearly

### Issue 4: Performance Degradation
**Mitigation:** Monitor parse time per test case

---

## 📈 Timeline

```
Day 5 (4 hours):
  0-2h:  Create all 40 test cases
  2-4h:  Run individual tests, document results

Day 6 (4 hours):
  0-2h:  Comprehensive edge case analysis
  2-3h:  Performance metrics collection
  3-4h:  Generate final report

Total: 8 hours (1 full day equivalent)
```

---

## 🎓 Success Indicator

**Days 5-6 will be considered COMPLETE when:**

1. ✅ All 40 test cases parse without crashes
2. ✅ Operator precedence correct in all scenarios
3. ✅ Error handling graceful and informative
4. ✅ All language features exercised successfully
5. ✅ Performance acceptable (<100ms per file)
6. ✅ Comprehensive report generated and reviewed
7. ✅ Ready to proceed to Day 7 documentation

---

**Ready to Begin Days 5-6? YES ✅**

Next action: Create edge case test files and execute testing protocol.
