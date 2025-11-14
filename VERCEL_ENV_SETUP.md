# Vercel 환경변수 설정 완벽 가이드

## 🔴 문제: "API 키가 설정되지 않았습니다" 에러

이 에러는 Vercel에서 환경변수가 제대로 읽히지 않을 때 발생합니다.

## ✅ 해결 방법 (단계별)

### 1단계: Vercel 대시보드에서 환경변수 확인

1. **Vercel 대시보드** 접속: https://vercel.com
2. 프로젝트 선택 → **Settings** → **Environment Variables** 클릭

### 2단계: 환경변수 정확히 설정

**반드시 다음 2개의 환경변수를 설정하세요:**

#### 환경변수 1:
- **Key**: `NEXT_PUBLIC_API_BASE`
- **Value**: `https://apis.data.go.kr/B551177/passgrAnncmt`
- **Environments**: 
  - ✅ Production
  - ✅ Preview  
  - ✅ Development

#### 환경변수 2:
- **Key**: `NEXT_PUBLIC_API_KEY`
- **Value**: `335caaab503a2b735d35c428496dd175f2b18f43949a0d768547741397166989`
- **Environments**:
  - ✅ Production
  - ✅ Preview
  - ✅ Development

### 3단계: 저장 및 재배포

1. **Save** 버튼 클릭
2. **Deployments** 탭으로 이동
3. 최신 배포 옆 **"..."** 메뉴 클릭
4. **"Redeploy"** 선택
5. **"Use existing Build Cache"** 체크 해제 (중요!)
6. **"Redeploy"** 클릭

### 4단계: 빌드 로그 확인

재배포 후:
1. **Deployments** → 최신 배포 클릭
2. **"Build Logs"** 탭 확인
3. 에러 메시지가 있는지 확인

## 🔍 문제 진단

### 체크리스트

- [ ] 환경변수 이름이 정확히 `NEXT_PUBLIC_API_BASE`인가요? (대소문자 정확히)
- [ ] 환경변수 이름이 정확히 `NEXT_PUBLIC_API_KEY`인가요? (대소문자 정확히)
- [ ] Value에 공백이나 줄바꿈이 없나요?
- [ ] Production, Preview, Development 모두 체크했나요?
- [ ] Save 버튼을 클릭했나요?
- [ ] 재배포를 했나요? (환경변수 변경 후 필수!)

### 자주 하는 실수

1. ❌ **Key와 Value를 반대로 입력**
   - Key에 API 키 값을 넣고, Value를 비워둠
   - ✅ Key는 변수 이름, Value는 실제 값

2. ❌ **환경변수 이름 오타**
   - `NEXT_PUBLIC_API_KEY` (올바름)
   - `NEXT_PUBLIC_APIKEY` (오타)
   - `NEXT_PUBLIC_API_KEY_` (오타)

3. ❌ **환경 선택 안 함**
   - Production만 체크하고 Preview/Development 미체크
   - ✅ 모든 환경에 체크 필요

4. ❌ **재배포 안 함**
   - 환경변수 저장 후 재배포 안 함
   - ✅ 환경변수 변경 후 반드시 재배포 필요

## 🛠️ 수동 테스트

배포 후 다음 URL로 직접 테스트:

```
https://your-app.vercel.app/api/passengers?selectdate=0
```

정상 응답 예시:
```json
{
  "response": {
    "header": {
      "resultCode": "00",
      ...
    }
  }
}
```

에러 응답 예시:
```json
{
  "error": "API 키가 설정되지 않았습니다...",
  "code": "MISSING_API_KEY"
}
```

## 📞 여전히 문제가 있다면

1. **Vercel 빌드 로그 확인**
   - Deployments → Build Logs
   - 환경변수 관련 에러 메시지 확인

2. **환경변수 다시 확인**
   - Settings → Environment Variables
   - 각 환경변수가 정확히 설정되어 있는지 확인

3. **캐시 삭제 후 재배포**
   - Redeploy 시 "Use existing Build Cache" 체크 해제

4. **코드 확인**
   - GitHub 저장소의 코드가 최신인지 확인
   - Vercel이 최신 코드를 배포하고 있는지 확인

