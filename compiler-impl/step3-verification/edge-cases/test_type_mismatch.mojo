// Test case: Type System & Type Mismatch
// Tests: type annotations, type checking patterns, implicit conversions

// Variables with explicit types
fn type_declared() -> Int:
    let x: Int = 10
    let y: Float = 3.14
    let z: String = "hello"
    return x

// Variable reassignment with type checking
fn variable_reassign():
    let x: Int = 10
    x = 20            // OK - same type
    x = 30            // OK - same type
    print(x)

// Function with typed parameters
fn typed_function(a: Int, b: Float) -> Int:
    let sum = a + int(b)
    return sum

fn call_typed():
    let result1 = typed_function(10, 3.14)
    return result1

// Return type checking
fn returns_int() -> Int:
    return 42

fn returns_string() -> String:
    return "hello"

fn returns_bool() -> Bool:
    return true

// Type in conditional
fn conditional_type():
    let x: Int = 10

    if x > 0:
        let positive = true
        return positive

    return false

// Array type annotations
fn array_types():
    let int_arr = [1, 2, 3]
    let str_arr = ["a", "b", "c"]
    let mixed = [1, "two", 3.0]
    return len(int_arr)

// Type in loops
fn loop_types():
    for i in range(10):
        let doubled = i * 2
        print(doubled)

// Function overloading by type
fn process(x: Int) -> String:
    return str(x)

fn process(x: String) -> Int:
    return int(x)

fn process(x: Float) -> String:
    return str(x)

// Using overloaded functions
fn overload_type_check():
    let r1 = process(10)
    let r2 = process("42")
    let r3 = process(3.14)
    return 0

// Type conversion chain
fn type_chain():
    let str_val = "123"
    let int_val = int(str_val)
    let float_val = float(str_val)
    let str_again = str(int_val)
    return int_val

// Nested type annotations
fn nested_types():
    if true:
        let x: Int = 1
        if x > 0:
            let y: String = str(x)
            print(y)

// Type in function parameters
fn multi_param(a: Int, b: String, c: Float) -> String:
    let result = str(a) + b + str(c)
    return result

// Using built-in type functions
fn type_conversions():
    let i = int("100")
    let f = float("3.14")
    let s = str(42)
    let b = bool(1)
    return i

// Type consistency in returns
fn consistent_return(flag: Bool) -> Int:
    if flag:
        return 1
    else:
        return 2
    return 0
