# Vercel 배포 가이드

## 🚀 Vercel에 배포하기

### 1단계: Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에 로그인
2. "Add New..." → "Project" 클릭
3. GitHub 저장소 `kccho88/airport-pass` 선택
4. "Import" 클릭

### 2단계: 환경변수 설정 (중요!)

**프로젝트 설정 화면에서:**

1. **"Environment Variables"** 섹션으로 이동
2. 다음 환경변수를 추가:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_BASE` | `https://apis.data.go.kr/B551177/passgrAnncmt` |
   | `NEXT_PUBLIC_API_KEY` | `335caaab503a2b735d35c428496dd175f2b18f43949a0d768547741397166989` |

3. 각 환경변수에 대해:
   - ✅ **Production** 체크
   - ✅ **Preview** 체크  
   - ✅ **Development** 체크 (선택사항)

4. **"Save"** 클릭

### 3단계: 배포

1. "Deploy" 버튼 클릭
2. 빌드가 완료될 때까지 대기 (약 1-2분)
3. 배포 완료 후 제공되는 URL로 접속하여 확인

## ⚠️ 문제 해결

### "API 키가 설정되지 않았습니다" 에러가 발생하는 경우

1. **환경변수 확인**
   - Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
   - `NEXT_PUBLIC_API_KEY`가 올바르게 설정되어 있는지 확인

2. **재배포**
   - 환경변수를 추가/수정한 후에는 **반드시 재배포**해야 합니다
   - Vercel 대시보드에서 "Redeploy" 클릭

3. **환경변수 이름 확인**
   - `NEXT_PUBLIC_API_KEY` (정확한 이름 사용)
   - 대소문자 구분 주의

4. **빌드 로그 확인**
   - Vercel 대시보드 → Deployments → 최신 배포 → "Build Logs" 확인
   - 에러 메시지 확인

## 📝 참고사항

- Vercel은 `.env.local` 파일을 자동으로 배포하지 않습니다
- 환경변수는 Vercel 대시보드에서 직접 설정해야 합니다
- 환경변수 변경 후에는 자동으로 재배포되거나, 수동으로 재배포해야 합니다

