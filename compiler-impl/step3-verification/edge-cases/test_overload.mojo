// Test case: Function Overloading
// Tests: same function name with different signatures, calling overloaded functions, parameter type variations

// Function overloading with different parameter counts
fn add(a: Int, b: Int) -> Int:
    return a + b

fn add(a: Int, b: Int, c: Int) -> Int:
    return a + b + c

// Calling both overloads
fn test_overload_arity():
    let result1 = add(1, 2)
    let result2 = add(1, 2, 3)
    return result1 + result2

// Function overloading with different types
fn process(value: Int) -> Int:
    return value * 2

fn process(value: Float) -> Float:
    return value * 2.0

fn process(value: String) -> String:
    return value

// Calling type-based overloads
fn test_overload_types():
    let int_result = process(10)
    let float_result = process(3.14)
    let string_result = process("hello")
    return int_result

// Overload with different return types
fn convert(x: Int) -> String:
    return str(x)

fn convert(x: String) -> Int:
    return int(x)

// Using overloaded converts
fn test_convert_overload():
    let s = convert(42)
    let i = convert("99")
    return i

// Generic-like overloading (using auto types)
fn pair_first(a: Int, b: Int) -> Int:
    return a

fn pair_first(a: String, b: String) -> String:
    return a

fn pair_first(a: Float, b: Float) -> Float:
    return a

// Using generic overloads
fn test_generic_overload():
    let int_first = pair_first(1, 2)
    let str_first = pair_first("a", "b")
    let float_first = pair_first(1.5, 2.5)
    return int_first

// Overload with optional parameters (via different arities)
fn greet(name: String) -> String:
    return "Hello, " + name

fn greet(name: String, title: String) -> String:
    return "Hello, " + title + " " + name

// Using greet overloads
fn test_greet_overload():
    let msg1 = greet("Alice")
    let msg2 = greet("Alice", "Dr.")
    return 0

// Complex overload pattern
fn transform(x: Int, y: Int) -> Int:
    return x + y

fn transform(x: Float, y: Float) -> Float:
    return x + y

fn transform(x: String, y: String) -> String:
    return x + y

fn transform(x: Int, y: Float) -> Float:
    return Float(x) + y

// Using complex overloads
fn test_complex_overload():
    let result1 = transform(10, 20)
    let result2 = transform(1.5, 2.5)
    let result3 = transform("hello", "world")
    let result4 = transform(10, 2.5)
    return result1

// Function name conflict with variable (should error or warn)
fn conflict_test():
    let add = 10  // shadows the add function
    return add  // This is now a variable, not a function
