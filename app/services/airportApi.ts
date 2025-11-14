import { PassengerApiResponse, PassengerData, ProcessedPassengerData } from '@/app/types/Passenger';

// 문자열을 숫자로 변환 (빈 값은 0 처리)
function parseNumber(value: string | undefined): number {
  if (!value || value.trim() === '') return 0;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}

// API 응답 데이터를 처리된 형태로 변환
export function processPassengerData(data: PassengerData): ProcessedPassengerData {
  return {
    adate: data.adate,
    atime: data.atime,
    t1: {
      entry: {
        eg1: parseNumber(data.t1eg1),
        eg2: parseNumber(data.t1eg2),
        eg3: parseNumber(data.t1eg3),
        eg4: parseNumber(data.t1eg4),
        sum: parseNumber(data.t1egsum1),
      },
      departure: {
        dg1: parseNumber(data.t1dg1),
        dg2: parseNumber(data.t1dg2),
        dg3: parseNumber(data.t1dg3),
        dg4: parseNumber(data.t1dg4),
        dg5: parseNumber(data.t1dg5),
        dg6: parseNumber(data.t1dg6),
        sum: parseNumber(data.t1dgsum1),
      },
    },
    t2: {
      entry: {
        eg1: parseNumber(data.t2eg1),
        eg2: parseNumber(data.t2eg2),
        sum: parseNumber(data.t2egsum1),
      },
      departure: {
        dg1: parseNumber(data.t2dg1),
        dg2: parseNumber(data.t2dg2),
        sum: parseNumber(data.t2dgsum2),
      },
    },
  };
}

// API 에러 처리
export class AirportApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'AirportApiError';
  }
}

// 승객 예고 데이터 조회 (Next.js API Route를 통해 호출)
export async function fetchPassengerData(selectdate: number = 0): Promise<ProcessedPassengerData[]> {
  try {
    // Next.js API Route를 통해 호출 (CORS 문제 해결)
    const response = await fetch(`/api/passengers?selectdate=${selectdate}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || '데이터를 불러올 수 없습니다';
      throw new AirportApiError(errorData.code || 'API_ERROR', errorMessage);
    }

    const apiResponse: PassengerApiResponse = await response.json();
    const resultCode = apiResponse.response.header.resultCode;

    // 에러 코드 처리
    if (resultCode !== '00') {
      let errorMessage = '현재 데이터를 불러올 수 없습니다';
      
      if (resultCode === '11') {
        errorMessage = '요청 파라미터가 잘못되었습니다';
      } else if (resultCode === '30') {
        errorMessage = '서비스 키가 등록되지 않았습니다';
      }

      throw new AirportApiError(resultCode, errorMessage);
    }

    const items = apiResponse.response.body.items;
    
    // 배열이 아닌 경우 처리
    const dataArray = Array.isArray(items) ? items : [items];
    
    return dataArray
      .filter((item) => item != null)
      .map(processPassengerData);
  } catch (error) {
    if (error instanceof AirportApiError) {
      throw error;
    }
    
    // 네트워크 오류 처리
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new AirportApiError(
        'NETWORK_ERROR',
        '네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.',
      );
    }
    
    throw new AirportApiError('UNKNOWN_ERROR', '알 수 없는 오류가 발생했습니다.');
  }
}

