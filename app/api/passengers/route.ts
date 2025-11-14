import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { PassengerApiResponse } from '@/app/types/Passenger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const selectdate = searchParams.get('selectdate') || '0';

    // 환경변수 읽기 (서버 사이드에서는 NEXT_PUBLIC_ 접두사 없이도 접근 가능)
    const baseURL = process.env.NEXT_PUBLIC_API_BASE || process.env.API_BASE || 'https://apis.data.go.kr/B551177/passgrAnncmt';
    const serviceKey = process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY;

    if (!serviceKey) {
      console.error('환경변수 확인:', {
        NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY ? '설정됨' : '없음',
        API_KEY: process.env.API_KEY ? '설정됨' : '없음',
      });
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.', code: 'MISSING_API_KEY' },
        { status: 500 }
      );
    }

    // 공공데이터포털 API 호출
    const response = await axios.get<PassengerApiResponse>(`${baseURL}/getPassgrAnncmt`, {
      params: {
        serviceKey,
        selectdate,
        type: 'json',
        numOfRows: '999',
        pageNo: '1',
      },
      timeout: 10000, // 10초 타임아웃
    });

    const resultCode = response.data.response.header.resultCode;
    const resultMsg = response.data.response.header.resultMsg;

    // 에러 코드 처리
    if (resultCode !== '00') {
      let errorMessage = '현재 데이터를 불러올 수 없습니다';
      
      if (resultCode === '11') {
        errorMessage = '요청 파라미터가 잘못되었습니다';
      } else if (resultCode === '30') {
        errorMessage = '서비스 키가 등록되지 않았습니다';
      }

      return NextResponse.json(
        { error: errorMessage, code: resultCode, resultMsg },
        { status: 400 }
      );
    }

    // 성공 응답
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('API 호출 오류:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return NextResponse.json(
          { error: '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.', code: 'TIMEOUT' },
          { status: 504 }
        );
      }
      
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { error: '네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.', code: 'NETWORK_ERROR' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: 'API 서버와 통신 중 오류가 발생했습니다.', code: 'API_ERROR', message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '알 수 없는 오류가 발생했습니다.', code: 'UNKNOWN_ERROR' },
      { status: 500 }
    );
  }
}
