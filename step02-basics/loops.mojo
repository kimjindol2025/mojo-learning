fn main():
    print("=== for 루프 (범위) ===")
    for i in range(5):
        print("i = " + str(i))
    print("")

    # range(시작, 끝, 스텝)
    print("=== range(시작, 끝, 스텝) ===")
    for i in range(0, 10, 2):
        print(str(i))
    print("")

    # 역순 루프
    print("=== 역순 루프 ===")
    for i in range(5, 0, -1):
        print(str(i))
    print("")

    # 배열 순회
    print("=== 배열 순회 ===")
    let numbers = [1, 2, 3, 4, 5]
    for num in numbers:
        print(str(num))
    print("")

    # 배열 인덱스와 값 동시 순회
    print("=== 인덱스와 값 동시 순회 ===")
    let fruits = ["apple", "banana", "cherry"]
    for i in range(len(fruits)):
        print(str(i) + ": " + fruits[i])
    print("")

    # 중첩 루프 (구구단)
    print("=== 중첩 루프 (2단 ~ 5단) ===")
    for i in range(2, 6):
        for j in range(1, 10):
            print(str(i) + " * " + str(j) + " = " + str(i * j))
        print("")
    print("")

    # while 루프
    print("=== while 루프 ===")
    var n = 1
    while n <= 5:
        print("n = " + str(n))
        n += 1
    print("")

    # while 루프 - 합계
    print("=== while로 합계 구하기 ===")
    var sum_val = 0
    var k = 1
    while k <= 10:
        sum_val += k
        k += 1
    print("1부터 10까지의 합 = " + str(sum_val))
    print("")

    # while 루프 - 누승
    print("=== while로 누승 구하기 ===")
    var result = 2
    var count = 1
    while count < 10:
        result *= 2
        count += 1
    print("2^10 = " + str(result))
    print("")

    # break 문
    print("=== break 문 ===")
    for i in range(10):
        if i == 5:
            print("5에서 루프 탈출")
            break
        print("i = " + str(i))
    print("")

    # continue 문
    print("=== continue 문 ===")
    for i in range(10):
        if i % 2 == 0:
            continue
        print("홀수: " + str(i))
