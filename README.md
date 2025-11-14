# 인천공항 시간대별 예상 승객 수 조회 서비스

인천국제공항 제1·2여객터미널의 시간대별 예상 승객 수를 조회하는 Next.js 웹 애플리케이션입니다.

## 🚀 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Axios**

## 📋 기능

- ✅ 오늘/내일 날짜 선택
- ✅ 제1여객터미널(T1) / 제2여객터미널(T2) 선택
- ✅ 입국장 / 출국장 토글
- ✅ 시간대별 예상 승객 수 표시
- ✅ 혼잡도 시각화 (색상 바)
  - 🟢 여유 (0~500명)
  - 🟡 보통 (501~1500명)
  - 🔴 혼잡 (1501명 이상)
- ✅ 모바일/PC 반응형 디자인

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
NEXT_PUBLIC_API_BASE=https://apis.data.go.kr/B551177/passgrAnncmt
NEXT_PUBLIC_API_KEY=여기에_인증키_입력
```

> **참고**: API 인증키는 [공공데이터포털](https://www.data.go.kr/)에서 발급받을 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
/app
  /components
    DateSelector.tsx      # 날짜 선택 컴포넌트
    TerminalTabs.tsx      # 터미널 탭 컴포넌트
    DirectionToggle.tsx   # 입국/출국 토글 컴포넌트
    TimeCard.tsx          # 시간대별 카드 컴포넌트
  /services
    airportApi.ts         # API 서비스 모듈
  /types
    Passenger.ts          # 타입 정의
  page.tsx                # 메인 페이지
  layout.tsx              # 레이아웃
  globals.css             # 글로벌 스타일
```

## 🔌 API 정보

### 공공데이터포털 - 인천국제공항공사 승객예고 API

- **Base URL**: `https://apis.data.go.kr/B551177/passgrAnncmt`
- **Endpoint**: `/getPassgrAnncmt`
- **요청 파라미터**:
  - `serviceKey`: API 인증키 (필수)
  - `selectdate`: 0 = 오늘, 1 = 내일 (기본값: 0)
  - `type`: json (고정)
  - `numOfRows`: 999 (고정)
  - `pageNo`: 1 (고정)

## 📝 주요 기능 설명

### 데이터 처리

- API 응답의 문자열 숫자를 Number 타입으로 변환
- 빈 값은 0으로 처리
- 시간대는 "HH_HH" 형식 그대로 사용 (예: "08_09")

### 에러 처리

- `resultCode`가 "00"이 아닌 경우 에러 메시지 표시
- 에러 코드별 안내:
  - `11`: 요청 파라미터 오류
  - `30`: 서비스 키 미등록
  - 기타: 일반 오류 메시지

## 🎨 UI/UX 특징

- 모바일 우선 반응형 디자인
- 직관적인 탭 및 토글 인터페이스
- 시각적 혼잡도 표시 (색상 바)
- 로딩 및 에러 상태 표시

## 📄 라이선스

이 프로젝트는 공공데이터를 활용한 개인/교육용 프로젝트입니다.

## 🔗 참고 링크

- [공공데이터포털](https://www.data.go.kr/)
- [인천국제공항공사](https://www.airport.kr/)


