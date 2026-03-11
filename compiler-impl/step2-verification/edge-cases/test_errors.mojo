# Error Handling Edge Cases
# These test how parser handles incomplete or invalid input

# Test 1: Missing closing parenthesis (this should produce error but parser recovers)
fn test_missing_close():
    a = (1 + 2

# Test 2: Unusual spacing
fn test_spacing():
    a=1
    b = 2
    c  =  3
    d = a+b+c

# Test 3: Comments mixed in
fn test_comments():
    # Comment at start
    x = 5  # Inline comment
    y = 10

# Test 4: Multiple statements
fn test_multiple():
    x = 1
    y = 2
    z = x + y

# Test 5: Empty function
fn empty():
    pass

# Test 6: Single statement functions
fn single(x: Int) -> Int:
    return x * 2

# Test 7: Missing type annotations (if parser supports)
fn maybe_types(a, b):
    return a + b

# Test 8: Complex type annotations
fn complex_types(a: List[Int], b: Dict[String, Float]) -> Bool:
    x = true

# Test 9: Chained assignments (if supported)
fn chained():
    a = b = c = 5

# Test 10: Expression as statement
fn expr_statement():
    1 + 2
    foo()
    bar(1, 2, 3)
