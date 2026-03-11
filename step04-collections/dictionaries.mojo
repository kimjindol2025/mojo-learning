fn main():
    print("=== 딕셔너리 (Dictionary) ===")
    print("")

    # 1. 딕셔너리 개념
    print("--- 딕셔너리란 ---")
    print("키-값 쌍으로 이루어진 데이터 구조")
    print("접근: dict[key] 형태")
    print("")

    # 2. 사람 정보 (배열로 표현)
    print("--- 사람 정보 (배열 표현) ---")
    let names = ["Alice", "Bob", "Carol"]
    let ages = ["30", "25", "28"]
    let cities = ["Seoul", "Busan", "Daegu"]
    let jobs = ["Engineer", "Designer", "Manager"]

    print("Alice: age=30, city=Seoul, job=Engineer")
    print("Bob: age=25, city=Busan, job=Designer")
    print("Carol: age=28, city=Daegu, job=Manager")
    print("")

    # 3. 데이터 검색
    print("--- 데이터 검색 ---")
    print("첫 번째 사람:")
    print("  이름: " + names[0])
    print("  나이: " + ages[0])
    print("  도시: " + cities[0])
    print("  직업: " + jobs[0])
    print("")

    # 4. 과목별 점수
    print("--- 과목별 점수 ---")
    let subjects = ["Math", "English", "Science", "History"]
    let scores = ["95", "87", "92", "88"]

    print("과목별 점수:")
    for i in range(len(subjects)):
        print("  " + subjects[i] + ": " + scores[i])
    print("")

    # 5. 색상 코드
    print("--- 색상 코드 ---")
    let color_names = ["Red", "Green", "Blue", "Black", "White"]
    let color_codes = ["FF0000", "00FF00", "0000FF", "000000", "FFFFFF"]

    print("색상 코드:")
    for i in range(len(color_names)):
        print("  " + color_names[i] + " = #" + color_codes[i])
    print("")

    # 6. 학생 정보
    print("--- 학생 정보 ---")
    let student_ids = ["001", "002", "003"]
    let student_names = ["Bob", "Carol", "David"]
    let student_gpas = ["3.8", "3.9", "3.7"]

    for i in range(len(student_ids)):
        print("학생 " + str(i + 1) + ":")
        print("  ID: " + student_ids[i])
        print("  이름: " + student_names[i])
        print("  GPA: " + student_gpas[i])
    print("")

    # 7. 딕셔너리의 개념
    print("=== 딕셔너리의 이점 ===")
    print("✓ 키-값 관계 표현")
    print("✓ O(1) 조회 성능")
    print("✓ 유연한 데이터 구조")
    print("✓ 직관적인 접근")
