# Nested Expressions and Complex Structures

# Test 1: Function call nesting
fn test_nested_calls():
    a = foo(bar(5))
    b = foo(bar(baz(x)))
    c = foo(a, bar(b), baz(c))

# Test 2: Array and field access
fn test_access_chains():
    a = arr[0]
    b = obj.field
    c = arr[i]
    d = obj.field[0]

# Test 3: Deep expression nesting
fn test_deep_expr():
    a = ((((1 + 2) * 3) / 4) - 5)
    b = (a + (b * (c - d)))

# Test 4: Nested conditionals
fn test_nested_if():
    if a:
        if b:
            if c:
                x = 1
            else:
                x = 2
        else:
            x = 3
    else:
        x = 4

# Test 5: Nested loops
fn test_nested_loops():
    i = 0
    while i < n:
        j = 0
        while j < m:
            sum = sum + 1
            j = j + 1
        i = i + 1

# Test 6: Array literals with expressions
fn test_array_expr():
    a = [1 + 2, 3 * 4]
    b = [[1, 2], [3, 4]]
    c = [foo(1), bar(2)]

# Test 7: Complex assignment
fn test_complex_assign():
    x = (a + b) * (c + d)
    y = arr[i + 1] + arr[j - 1]

# Test 8: Return with complex expression
fn test_return_complex():
    return (a + b) * (c - d) / e

# Test 9: If-elif-else chains
fn test_elif():
    if x == 1:
        y = a
    elif x == 2:
        y = b
    elif x == 3:
        y = c
    else:
        y = d

# Test 10: Mixed nesting
fn test_mixed():
    if arr[0] > 0:
        sum = sum + arr[i]
        i = i + 1
    else:
        sum = sum - arr[i]
