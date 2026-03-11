# Test Case 1: Simple function
fn add(a: Int, b: Int) -> Int:
    return a + b

# Test Case 2: Variables and operators
fn test_vars():
    x = 5
    y = 10
    z = x + y
    result = z * 2

# Test Case 3: Control flow
fn test_if(n: Int) -> Int:
    if n > 0:
        return 1
    else:
        return 0

# Test Case 4: Loops
fn test_loop(n: Int) -> Int:
    sum = 0
    i = 1
    while i <= n:
        sum = sum + i
        i = i + 1
    return sum

# Test Case 5: Strings and literals
fn test_literals():
    name = "hello"
    count = 42
    ratio = 3.14
    flag = true
    items = [1, 2, 3]

# Test Case 6: Complex nesting
fn fibonacci(n: Int) -> Int:
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

fn main():
    x = add(5, 3)
    result = fibonacci(10)
