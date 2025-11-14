// API 응답 타입 정의
export interface PassengerApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: PassengerData[];
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 개별 승객 데이터 타입
export interface PassengerData {
  adate: string; // 표출일자
  atime: string; // 시간대 (예: "08_09")
  
  // T1 입국장
  t1eg1?: string; // A,B
  t1eg2?: string; // E,F
  t1eg3?: string; // C
  t1eg4?: string; // D
  t1egsum1?: string; // 합계
  
  // T1 출국장
  t1dg1?: string;
  t1dg2?: string;
  t1dg3?: string;
  t1dg4?: string;
  t1dg5?: string;
  t1dg6?: string;
  t1dgsum1?: string; // 합계
  
  // T2 입국장
  t2eg1?: string; // A
  t2eg2?: string; // B
  t2egsum1?: string; // 합계
  
  // T2 출국장
  t2dg1?: string;
  t2dg2?: string;
  t2dgsum2?: string; // 합계
}

// 변환된 승객 데이터 타입
export interface ProcessedPassengerData {
  adate: string;
  atime: string;
  t1: {
    entry: {
      eg1: number; // A,B
      eg2: number; // E,F
      eg3: number; // C
      eg4: number; // D
      sum: number; // 합계
    };
    departure: {
      dg1: number;
      dg2: number;
      dg3: number;
      dg4: number;
      dg5: number;
      dg6: number;
      sum: number; // 합계
    };
  };
  t2: {
    entry: {
      eg1: number; // A
      eg2: number; // B
      sum: number; // 합계
    };
    departure: {
      dg1: number;
      dg2: number;
      sum: number; // 합계
    };
  };
}

// 혼잡도 레벨
export type CongestionLevel = 'low' | 'medium' | 'high';

// 혼잡도 색상 매핑
export const CONGESTION_COLORS = {
  low: 'bg-green-500',      // 0~500
  medium: 'bg-yellow-500',  // 501~1500
  high: 'bg-red-500',       // 1501 이상
} as const;

// 혼잡도 레벨 계산 함수
export function getCongestionLevel(count: number): CongestionLevel {
  if (count <= 500) return 'low';
  if (count <= 1500) return 'medium';
  return 'high';
}


