fn main():
    print("=== 딕셔너리 (Dictionary) ===")
    print("")

    # 1. 딕셔너리 생성
    print("--- 딕셔너리 생성 ---")
    var person = {}
    person["name"] = "Alice"
    person["age"] = "30"
    person["city"] = "Seoul"
    person["job"] = "Engineer"

    print("person 딕셔너리 생성")
    print("")

    # 2. 딕셔너리 접근
    print("--- 딕셔너리 접근 ---")
    print("name: " + person["name"])
    print("age: " + person["age"])
    print("city: " + person["city"])
    print("job: " + person["job"])
    print("")

    # 3. 딕셔너리 수정
    print("--- 딕셔너리 수정 ---")
    person["age"] = "31"
    person["company"] = "TechCorp"
    print("age 수정: " + person["age"])
    print("company 추가: " + person["company"])
    print("")

    # 4. 딕셔너리 크기
    print("--- 딕셔너리 크기 ---")
    print("person의 크기: " + str(len(person)))
    print("")

    # 5. 점수 매기기
    print("--- 점수 딕셔너리 ---")
    var scores = {}
    scores["math"] = "95"
    scores["english"] = "87"
    scores["science"] = "92"
    scores["history"] = "88"

    print("과목별 점수:")
    for subject in scores:
        print("  " + subject + ": " + scores[subject])
    print("")

    # 6. 학생 정보
    print("--- 학생 정보 ---")
    var student1 = {}
    student1["id"] = "001"
    student1["name"] = "Bob"
    student1["gpa"] = "3.8"

    var student2 = {}
    student2["id"] = "002"
    student2["name"] = "Carol"
    student2["gpa"] = "3.9"

    print("학생 1:")
    print("  ID: " + student1["id"])
    print("  이름: " + student1["name"])
    print("  GPA: " + student1["gpa"])
    print("")

    print("학생 2:")
    print("  ID: " + student2["id"])
    print("  이름: " + student2["name"])
    print("  GPA: " + student2["gpa"])
    print("")

    # 7. 색상 매핑
    print("--- 색상 코드 매핑 ---")
    var colors = {}
    colors["red"] = "FF0000"
    colors["green"] = "00FF00"
    colors["blue"] = "0000FF"
    colors["black"] = "000000"
    colors["white"] = "FFFFFF"

    print("색상 코드:")
    for color in colors:
        print("  " + color + " = #" + colors[color])
    print("")

    # 8. 딕셔너리 복사
    print("--- 딕셔너리 복사 ---")
    var original_dict = {}
    original_dict["x"] = "10"
    original_dict["y"] = "20"

    var copied_dict = original_dict
    copied_dict["x"] = "100"

    print("원본 x: " + original_dict["x"] + " (변경 안됨)")
    print("복사본 x: " + copied_dict["x"] + " (변경됨)")
    print("")

    # 9. 딕셔너리 활용
    print("=== 딕셔너리의 이점 ===")
    print("✓ 키-값 관계 표현")
    print("✓ O(1) 조회 성능")
    print("✓ 유연한 데이터 구조")
    print("✓ 직관적인 접근")
