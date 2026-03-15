/**
 * Bootstrap Test: Simple Programs
 * Day 2: Basic functionality
 */

// Test 1: Hello World
fn test_hello():
    print("Hello, World!")

// Test 2: Arithmetic
fn test_arithmetic():
    var a = 10
    var b = 20
    print(a + b)      // 30
    print(a - b)      // -10
    print(a * b)      // 200
    print(a / b)      // 0

// Test 3: String operations
fn test_strings():
    var s = "Hello"
    print(s)
    print(s + " World")
    print(len(s))     // 5

// Test 4: Variables
fn test_variables():
    var x = 42
    var y = "test"
    var z = 3.14
    print(x)
    print(y)
    print(z)

// Test 5: Type inference
fn test_inference():
    var num = 100
    var str = "auto"
    var list = [1, 2, 3]
    print(num)
    print(str)
    print(len(list))  // 3

fn main():
    print("╔═══════════════════════════════════════════╗")
    print("║  Bootstrap Test: Simple Programs         ║")
    print("╚═══════════════════════════════════════════╝")
    print()

    print("Test 1: Hello World")
    test_hello()
    print()

    print("Test 2: Arithmetic")
    test_arithmetic()
    print()

    print("Test 3: Strings")
    test_strings()
    print()

    print("Test 4: Variables")
    test_variables()
    print()

    print("Test 5: Type Inference")
    test_inference()
    print()

    print("✅ All simple tests completed")
