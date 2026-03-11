// Test case: Built-in Functions
// Tests: all 10 built-in functions called, mixed with user-defined, in nested scopes

// Test all 10 built-in functions
fn test_all_builtins():
    // I/O functions
    print("hello")
    print(42)

    // Type functions
    let x = int("123")
    let y = float("3.14")
    let z = str(42)

    // Array/String functions
    let length = len([1, 2, 3])
    let range_val = range(10)

    // Math functions
    let abs_val = abs(-5)
    let min_val = min(1, 2, 3)
    let max_val = max(1, 2, 3)

    return length

// Mixed built-ins with user-defined
fn user_function() -> Int:
    return 100

fn test_mixed_functions():
    let x = user_function()
    let y = len([x])
    let z = abs(-y)
    return min(x, z)

// Built-in in nested scope
fn test_builtin_nested():
    let outer = 1

    if outer > 0:
        print("in if")
        let inner = len([1, 2, 3])

        while inner < 10:
            print(inner)
            inner = inner + 1

    return outer

// Built-in shadowed by user variable
fn test_builtin_shadow():
    // Define variable with same name as built-in
    let print = "hello"  // This shadows the print function
    // Using built-in would now be an error
    return 42

// Multiple builtins in expression
fn test_builtin_expression():
    let arr = range(10)
    let length = len(arr)
    let absolute = abs(-length)
    let minimum = min(absolute, 5)
    let maximum = max(minimum, 10)
    return str(maximum)

// Built-in as function argument
fn test_builtin_argument():
    let values = [1, 2, 3, 4, 5]
    let len_val = len(values)
    print(len_val)
    return abs(-len_val)

// Type conversion chain
fn test_type_chain():
    let str_val = "123"
    let int_val = int(str_val)
    let float_val = float(str_val)
    let str_again = str(int_val)
    return int_val
