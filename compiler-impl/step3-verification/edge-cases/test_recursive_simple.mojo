// Simple recursion tests (parser-friendly)

fn factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

fn fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

fn is_even(n):
    if n == 0:
        return true
    return is_odd(n - 1)

fn is_odd(n):
    if n == 0:
        return false
    return is_even(n - 1)

fn deep_call_a():
    return deep_call_b() + 1

fn deep_call_b():
    return deep_call_c() + 1

fn deep_call_c():
    return 10

fn tail_recursive(n, acc):
    if n <= 0:
        return acc
    return tail_recursive(n - 1, acc + n)

fn mutual_sum(n):
    if n == 0:
        return 0
    return n + mutual_sum(n - 1)
