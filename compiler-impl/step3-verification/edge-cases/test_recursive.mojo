// Test case: Recursion & Deep Call Chains
// Tests: recursive functions, mutual recursion, deep call chains, recursive with state

// Simple recursion - factorial
fn factorial(n: Int) -> Int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

// Mutual recursion
fn is_even(n: Int) -> Bool:
    if n == 0:
        return true
    return is_odd(n - 1)

fn is_odd(n: Int) -> Bool:
    if n == 0:
        return false
    return is_even(n - 1)

// Deep call chain (a → b → c → d → e)
fn call_a() -> Int:
    return call_b() + 1

fn call_b() -> Int:
    return call_c() + 1

fn call_c() -> Int:
    return call_d() + 1

fn call_d() -> Int:
    return call_e() + 1

fn call_e() -> Int:
    return 10

// Fibonacci - expensive recursion
fn fibonacci(n: Int) -> Int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

// Recursive with closure/inner function
fn outer_recursive(n: Int) -> Int:
    fn inner(x: Int) -> Int:
        if x <= 0:
            return 1
        return x * inner(x - 1)
    return inner(n)

// Tail-recursive style with accumulator
fn tail_recursive(n: Int, acc: Int) -> Int:
    if n <= 0:
        return acc
    let new_acc = acc + n
    return tail_recursive(n - 1, new_acc)

// Mutual recursion with parameters
fn even_sum(n: Int) -> Int:
    if n == 0:
        return 0
    return n + odd_sum(n - 1)

fn odd_sum(n: Int) -> Int:
    if n == 0:
        return 0
    return even_sum(n - 1)

// Triple mutual recursion
fn func_a(n: Int) -> Int:
    if n <= 0:
        return 1
    return func_b(n - 1) + 1

fn func_b(n: Int) -> Int:
    if n <= 0:
        return 2
    return func_c(n - 1) + 2

fn func_c(n: Int) -> Int:
    if n <= 0:
        return 3
    return func_a(n - 1) + 3

// Recursive used in expression
fn recursive_expr(n: Int) -> Int:
    return factorial(n) + fibonacci(n) + tail_recursive(n, 0)

// Recursive with multiple base cases
fn multi_base(n: Int) -> Int:
    if n == 0:
        return 0
    if n == 1:
        return 1
    if n == 2:
        return 1
    return multi_base(n - 1) + multi_base(n - 2) + multi_base(n - 3)

// Unused recursive function (should warn)
fn unused_recursive(n: Int) -> Int:
    if n <= 0:
        return 1
    return unused_recursive(n - 1) * 2
