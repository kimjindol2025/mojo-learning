# Performance and Stress Tests

# Test 1: Large expression (many additions)
fn test_large_expr():
    result = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12 + 13 + 14 + 15 + 16 + 17 + 18 + 19 + 20

# Test 2: Deep nesting (deeply nested parentheses)
fn test_deep_nesting():
    result = (((((((((((((((((((((((((((((((((((((((((((((((((1 + 2))))))))))))))))))))))))))))))))))))))))))))))))))

# Test 3: Large function parameter list
fn many_params(a: Int, b: Int, c: Int, d: Int, e: Int, f: Int, g: Int, h: Int, i: Int, j: Int) -> Int:
    return a + b + c + d + e + f + g + h + i + j

# Test 4: Large array literal
fn test_large_array():
    arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

# Test 5: Long function body
fn long_function():
    x = 1
    y = 2
    z = 3
    a = 4
    b = 5
    c = 6
    d = 7
    e = 8
    f = 9
    g = 10
    h = 11
    i = 12
    j = 13
    k = 14
    l = 15
    m = 16
    n = 17
    o = 18
    p = 19
    q = 20

# Test 6: Complex nested loops
fn nested_loops():
    i = 0
    while i < 10:
        j = 0
        while j < 10:
            k = 0
            while k < 10:
                sum = sum + 1
                k = k + 1
            j = j + 1
        i = i + 1

# Test 7: Deep if-elif chains
fn deep_if_else():
    if x == 1:
        y = 1
    elif x == 2:
        y = 2
    elif x == 3:
        y = 3
    elif x == 4:
        y = 4
    elif x == 5:
        y = 5
    elif x == 6:
        y = 6
    elif x == 7:
        y = 7
    elif x == 8:
        y = 8
    elif x == 9:
        y = 9
    elif x == 10:
        y = 10
    else:
        y = 0

# Test 8: Large matrix-like structure
fn matrix_test():
    matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12], [13, 14, 15]]

# Test 9: Many function calls
fn many_calls():
    a = foo()
    b = bar()
    c = baz()
    d = qux()
    e = quux()
    f = corge()
    g = grault()
    h = garply()
    i = waldo()
    j = fred()

# Test 10: Complex expression with many operators
fn complex_expr():
    result = a + b - c * d / e % f + g - h * i / j
