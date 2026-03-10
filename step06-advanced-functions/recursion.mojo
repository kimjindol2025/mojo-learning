fn factorial(n: Int) -> Int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

fn fibonacci(n: Int) -> Int:
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

fn power(base: Int, exp: Int) -> Int:
    if exp == 0:
        return 1
    else:
        return base * power(base, exp - 1)

fn sum_range(n: Int) -> Int:
    if n <= 0:
        return 0
    else:
        return n + sum_range(n - 1)

fn main():
    print("=== 재귀 함수 (Recursion) ===")
    print("")

    # 1. 팩토리얼
    print("--- 팩토리얼 ---")
    for i in range(1, 7):
        let fact = factorial(i)
        print(str(i) + "! = " + str(fact))
    print("")

    # 2. 피보나치
    print("--- 피보나치 수열 ---")
    print("처음 10개의 피보나치 수:")
    for i in range(10):
        let fib = fibonacci(i)
        print("  fib(" + str(i) + ") = " + str(fib))
    print("")

    # 3. 거듭제곱
    print("--- 거듭제곱 ---")
    print("2^3 = " + str(power(2, 3)))
    print("2^5 = " + str(power(2, 5)))
    print("3^4 = " + str(power(3, 4)))
    print("")

    # 4. 범위 합
    print("--- 범위 합 ---")
    print("1부터 5까지의 합: " + str(sum_range(5)))
    print("1부터 10까지의 합: " + str(sum_range(10)))
    print("1부터 100까지의 합: " + str(sum_range(100)))
    print("")

    # 5. 재귀의 특징
    print("=== 재귀의 특징 ===")
    print("✓ 문제를 부분 문제로 분해")
    print("✓ 기저 조건 필수 (무한 루프 방지)")
    print("✓ 스택 메모리 사용")
    print("✓ 동적 프로그래밍과 결합 가능")
