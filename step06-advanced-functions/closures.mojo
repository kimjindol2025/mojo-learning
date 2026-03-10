fn main():
    print("=== 클로저 (Closures) ===")
    print("")

    # 1. 기본 클로저 개념
    print("--- 클로저 개념 ---")
    let multiplier = 5
    var results = []
    for i in range(1, 6):
        results.append(i * multiplier)
    print("배수 (5배):")
    for r in results:
        print("  " + str(r))
    print("")

    # 2. 카운터 클로저
    print("--- 카운터 클로저 ---")
    var counter = 0
    print("카운터 증가:")
    for _ in range(5):
        counter = counter + 1
        print("  count = " + str(counter))
    print("")

    # 3. 팩토리 패턴
    print("--- 팩토리 패턴 (환경 캡처) ---")
    let base = 10
    var numbers = []
    for i in range(1, 4):
        numbers.append(base + i)
    print("base(10) + offset:")
    for num in numbers:
        print("  " + str(num))
    print("")

    # 4. 범위 캡처
    print("--- 범위 캡처 ---")
    let start = 100
    let end = 105
    var items = []
    for i in range(start, end + 1):
        items.append(i)
    print("범위[100, 105]:")
    for item in items:
        print("  " + str(item))
    print("")

    # 5. 클로저 변수 수정
    print("--- 클로저에서 변수 수정 ---")
    var total = 0
    let values = [10, 20, 30]
    for v in values:
        total = total + v
    print("누적 합: " + str(total))
    print("")

    # 6. 클로저의 이점
    print("=== 클로저의 이점 ===")
    print("✓ 환경 캡처로 상태 보존")
    print("✓ 팩토리 패턴 구현 가능")
    print("✓ 함수형 프로그래밍 지원")
    print("✓ 콜백 함수 구현")
