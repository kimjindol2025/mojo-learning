# Language Feature Coverage
# Exercises all major language features and AST node types

# Feature 1: All literal types
fn test_literals():
    i = 42
    f = 3.14
    s = "hello world"
    b_true = true
    b_false = false
    arr = [1, 2, 3, 4]
    empty_arr = []

# Feature 2: Variable declarations
fn test_variables():
    x = 5
    y = x + 1
    z = y * 2

# Feature 3: Function calls
fn test_calls():
    a = foo()
    b = bar(1)
    c = baz(1, 2, 3)
    d = nested(foo(bar(5)))

# Feature 4: Binary operations
fn test_binary_ops():
    a = 1 + 2
    b = 3 - 4
    c = 5 * 6
    d = 7 / 8
    e = 9 % 10
    f = 2 ** 3

# Feature 5: Unary operations
fn test_unary_ops():
    a = -5
    b = not true

# Feature 6: Comparisons
fn test_comparisons():
    a = 1 < 2
    b = 2 <= 3
    c = 4 > 3
    d = 5 >= 4
    e = 6 == 6
    f = 7 != 8

# Feature 7: Logical operations
fn test_logical():
    a = true and false
    b = true or false
    c = not true

# Feature 8: If statements
fn test_if():
    if x > 0:
        y = 1
    else:
        y = 2

# Feature 9: If-elif-else
fn test_if_elif():
    if x == 1:
        y = a
    elif x == 2:
        y = b
    else:
        y = c

# Feature 10: While loops
fn test_while():
    i = 0
    while i < 10:
        i = i + 1

# Feature 11: For loops (if supported)
fn test_for():
    for i in range(10):
        print(i)

# Feature 12: Break and continue
fn test_control():
    i = 0
    while i < 10:
        if i == 5:
            break
        i = i + 1

# Feature 13: Return statements
fn test_returns():
    if x > 0:
        return x
    else:
        return -x

# Feature 14: Recursion
fn factorial(n: Int) -> Int:
    if n <= 1:
        return 1
    else:
        return n * factorial(n - 1)

# Feature 15: Array access
fn test_array_access():
    a = arr[0]
    b = arr[i + 1]

# Feature 16: Field access
fn test_field_access():
    a = obj.x
    b = obj.field.nested

# Feature 17: Struct declarations
struct Point:
    x: Int
    y: Int

struct Rectangle:
    width: Int
    height: Int

# Feature 18: Generic functions
fn swap<T>(a: T, b: T) -> (T, T):
    return (b, a)

# Feature 19: Multiple parameters and return types
fn process(a: Int, b: Int, c: Int) -> Int:
    return a + b + c

# Feature 20: Complex expressions
fn complex():
    result = (a + b) * (c - d) / e + f - g
