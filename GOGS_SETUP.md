# Gogs 저장소 설정 가이드

## 🚀 단계별 설정

### 1단계: Gogs 웹 UI에서 저장소 생성

**URL:** http://gogs.dclub.kr
**사용자:** kim

**저장소 생성 정보:**
```
저장소명: mojo-learning
설명: Mojo programming language complete learning
가시성: Public
.gitignore: Go (기본값)
라이선스: MIT
```

### 2단계: 로컬 저장소 푸시

#### 방법 1: HTTPS (권장, 패스워드 필요)

```bash
cd /home/kimjin/Desktop/kim/mojo-learning

# Remote URL 설정
git remote set-url origin https://gogs.dclub.kr/kim/mojo-learning.git

# 푸시
git push -u origin master

# 입력 프롬프트:
# - Username: kim
# - Password: [Gogs 계정 비밀번호]
```

#### 방법 2: SSH (키 설정 필수)

```bash
# SSH 키 확인
cat ~/.ssh/id_rsa.pub

# Remote URL 설정
git remote set-url origin git@gogs.dclub.kr:kim/mojo-learning.git

# 푸시
git push -u origin master
```

### 3단계: 확인

생성된 저장소 확인:
```
https://gogs.dclub.kr/kim/mojo-learning
```

---

## ⚙️ 트러블슈팅

### SSH 연결 실패

```bash
# SSH 키 생성 (없을 경우)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa

# Gogs에 공개키 등록:
# 1. http://gogs.dclub.kr 로그인
# 2. Settings → SSH Keys
# 3. Add Key (~/.ssh/id_rsa.pub 내용 붙여넣기)
```

### HTTPS 인증 실패

```bash
# 자격증명 저장
git config --global credential.helper store

# 다시 푸시 (한 번만 입력)
git push -u origin master
```

### 저장소가 없음 에러

```bash
# 1. Gogs 웹 UI에서 저장소가 생성되었는지 확인
# 2. 저장소 URL이 정확한지 확인
git remote -v
# 출력: origin  https://gogs.dclub.kr/kim/mojo-learning.git (fetch)
#       origin  https://gogs.dclub.kr/kim/mojo-learning.git (push)

# 3. Gogs 서버 상태 확인
ping gogs.dclub.kr
```

---

## 📝 자동 설정 스크립트

다음 스크립트로 자동 푸시 가능:

```bash
#!/bin/bash

# Mojo Learning Gogs 푸시 스크립트

cd /home/kimjin/Desktop/kim/mojo-learning

# Remote 설정
git remote set-url origin https://gogs.dclub.kr/kim/mojo-learning.git 2>/dev/null || \
git remote add origin https://gogs.dclub.kr/kim/mojo-learning.git

# 푸시
git push -u origin master

echo "✅ Gogs 저장소 푸시 완료!"
echo "📍 https://gogs.dclub.kr/kim/mojo-learning"
```

---

## 🔗 관련 저장소

| 저장소 | URL |
|--------|-----|
| freelang-v2 | gogs.dclub.kr/kim/freelang-v2 |
| vlang-learning | gogs.dclub.kr/kim/vlang-learning |
| pyfree | gogs.dclub.kr/kim/pyfree |
| **mojo-learning** | **gogs.dclub.kr/kim/mojo-learning** |

---

**작성일:** 2026-03-10
