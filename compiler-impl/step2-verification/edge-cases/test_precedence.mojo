# Operator Precedence Edge Cases
# Tests: +,-,*,/,%, comparisons, logical operators, unary

# Test 1: Arithmetic precedence
fn test_arithmetic_precedence():
    a = 2 + 3 * 4
    b = (2 + 3) * 4
    c = 5 - 2 + 1
    d = 10 / 2 * 5
    e = 2 * 3 + 4 * 5
    f = 20 - 5 - 3

# Test 2: Comparison operators
fn test_comparisons():
    a = 5 > 3
    b = 5 >= 5
    c = 3 < 10
    d = 3 <= 3
    e = 5 == 5
    f = 5 != 3

# Test 3: Logical operators
fn test_logical():
    a = true and false
    b = true or false
    c = true and true or false
    d = true or false and false
    e = not true
    f = not false

# Test 4: Mixed operators
fn test_mixed():
    a = 5 > 3 and 2 < 4
    b = (5 > 3) and (2 < 4)
    c = 5 > 3 or 2 > 4
    d = 1 + 2 > 2 and 3 - 1 < 3

# Test 5: Unary operators
fn test_unary():
    a = -5
    b = -5 + 3
    c = -(3 + 4)
    d = not true

# Test 6: Power operator
fn test_power():
    a = 2 ** 3
    b = 2 ** 3 ** 2

# Test 7: Modulo operator
fn test_modulo():
    a = 10 % 3
    b = 10 % 3 + 2
    c = (10 + 5) % 3

# Test 8: Complex mixed precedence
fn test_complex():
    a = 2 + 3 * 4 - 5
    b = 10 / 2 + 3 * 4
    c = 5 > 3 and 2 < 4 or 1 > 5

# Test 9: Nested parentheses
fn test_nested_parens():
    a = ((2 + 3) * (4 - 1))
    b = (((5 + 3) / 2) - 1)

# Test 10: Chained comparisons
fn test_chained():
    a = 1 < 2
    b = 2 < 3
    c = 1 < 2 and 2 < 3
