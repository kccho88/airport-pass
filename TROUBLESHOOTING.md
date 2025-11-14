# 문제 해결 가이드

## 🔴 인터넷/VPN 연동 오류 해결 방법

### 문제 원인

"인터넷이나 VPN 연동이 안된다"는 오류는 주로 다음과 같은 이유로 발생합니다:

1. **CORS (Cross-Origin Resource Sharing) 문제**
   - 브라우저에서 직접 외부 API를 호출할 때 발생하는 보안 정책
   - 공공데이터포털 API는 브라우저에서 직접 호출 시 CORS 오류 발생 가능

2. **네트워크 방화벽/프록시 설정**
   - 회사나 학교 네트워크에서 외부 API 접근 차단
   - VPN 사용 시 특정 도메인 차단

3. **API 키 문제**
   - 잘못된 API 키
   - 만료된 API 키
   - API 키 인코딩 문제

### ✅ 해결 방법

#### 1. Next.js API Route를 통한 프록시 사용 (권장)

현재 코드는 이미 이 방법을 사용하도록 수정되었습니다:

- **서버 사이드에서 API 호출**: `app/api/passengers/route.ts`
- **클라이언트는 내부 API 호출**: `/api/passengers` 엔드포인트 사용

이 방법의 장점:
- ✅ CORS 문제 해결
- ✅ API 키를 서버에서만 사용 (보안 강화)
- ✅ 네트워크 오류 처리 개선

#### 2. 환경변수 확인

`.env.local` 파일이 올바르게 설정되었는지 확인:

```env
NEXT_PUBLIC_API_BASE=https://apis.data.go.kr/B551177/passgrAnncmt
NEXT_PUBLIC_API_KEY=335caaab503a2b735d35c428496dd175f2b18f43949a0d768547741397166989
```

**중요**: 
- 파일명이 정확히 `.env.local`인지 확인
- 띄어쓰기나 특수문자 없이 작성
- 개발 서버 재시작 필요 (`npm run dev`)

#### 3. 개발 서버 재시작

환경변수를 변경한 경우 반드시 개발 서버를 재시작하세요:

```bash
# 서버 중지 (Ctrl + C)
# 그 다음 다시 시작
npm run dev
```

#### 4. 네트워크 연결 확인

터미널에서 직접 API 호출 테스트:

```bash
# PowerShell에서 실행
curl "https://apis.data.go.kr/B551177/passgrAnncmt/getPassgrAnncmt?serviceKey=335caaab503a2b735d35c428496dd175f2b18f43949a0d768547741397166989&selectdate=0&type=json&numOfRows=10&pageNo=1"
```

응답이 오면 네트워크는 정상입니다.

#### 5. 브라우저 콘솔 확인

개발자 도구(F12)를 열고 Console 탭에서 오류 메시지 확인:

- **CORS 오류**: `Access to fetch at ... has been blocked by CORS policy`
- **네트워크 오류**: `Failed to fetch` 또는 `NetworkError`
- **API 오류**: `resultCode`가 "00"이 아닌 경우

#### 6. 방화벽/프록시 설정

회사나 학교 네트워크를 사용하는 경우:
- IT 관리자에게 `apis.data.go.kr` 도메인 접근 허용 요청
- VPN 설정 확인
- 프록시 서버 설정 확인

### 🔍 디버깅 방법

#### API Route 테스트

브라우저에서 직접 테스트:

```
http://localhost:3000/api/passengers?selectdate=0
```

정상 응답 예시:
```json
{
  "response": {
    "header": {
      "resultCode": "00",
      ...
    },
    "body": {
      "items": [...]
    }
  }
}
```

#### 로그 확인

터미널에서 서버 로그 확인:
- API 호출 성공/실패 메시지
- 에러 스택 트레이스
- 네트워크 타임아웃 메시지

### 📞 추가 도움

문제가 계속되면 다음 정보를 확인하세요:

1. **에러 메시지 전체 내용** (브라우저 콘솔)
2. **네트워크 탭**에서 API 요청 상태 (200, 400, 500 등)
3. **터미널 로그** 전체 내용
4. **환경 정보**: Windows 버전, Node.js 버전, 네트워크 환경

### ⚠️ 주의사항

- API 키는 절대 공개 저장소(GitHub 등)에 업로드하지 마세요
- `.env.local` 파일은 `.gitignore`에 포함되어 있어야 합니다
- 프로덕션 배포 시 환경변수를 서버에 별도로 설정해야 합니다

