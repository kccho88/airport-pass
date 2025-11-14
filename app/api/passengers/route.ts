import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { PassengerApiResponse } from '@/app/types/Passenger';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const selectdate = searchParams.get('selectdate') || '0';

    // 환경변수 읽기 - Vercel에서는 모든 가능한 변수명 시도
    const baseURL = 
      process.env.NEXT_PUBLIC_API_BASE || 
      process.env.API_BASE || 
      'https://apis.data.go.kr/B551177/passgrAnncmt';
    
    // 여러 가능한 환경변수 이름 시도
    const serviceKey = 
      process.env.NEXT_PUBLIC_API_KEY || 
      process.env.API_KEY ||
      process.env.SERVICE_KEY ||
      process.env.PUBLIC_API_KEY;

    if (!serviceKey) {
      // 디버깅 정보 수집
      const envDebug = {
        NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY ? `설정됨 (길이: ${process.env.NEXT_PUBLIC_API_KEY.length})` : '없음',
        API_KEY: process.env.API_KEY ? `설정됨 (길이: ${process.env.API_KEY.length})` : '없음',
        SERVICE_KEY: process.env.SERVICE_KEY ? `설정됨 (길이: ${process.env.SERVICE_KEY.length})` : '없음',
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        // 모든 환경변수 키 목록 (보안상 값은 제외)
        availableEnvKeys: Object.keys(process.env).filter(key => 
          key.includes('API') || key.includes('KEY') || key.includes('SERVICE')
        ),
      };
      
      console.error('환경변수 확인 실패:', JSON.stringify(envDebug, null, 2));
      
      // Vercel 배포 환경인지 확인
      const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
      const errorMessage = isVercel
        ? `API 키가 설정되지 않았습니다. Vercel 대시보드의 Environment Variables에서 NEXT_PUBLIC_API_KEY를 설정하고, Production/Preview/Development 모두 체크한 후 재배포해주세요. (디버그: ${JSON.stringify(envDebug.availableEnvKeys)})`
        : 'API 키가 설정되지 않았습니다. .env.local 파일을 확인하거나 Vercel 환경변수를 설정해주세요.';
      
      return NextResponse.json(
        { 
          error: errorMessage, 
          code: 'MISSING_API_KEY',
          debug: isVercel ? envDebug : undefined // Vercel 환경에서만 디버그 정보 제공
        },
        { status: 500 }
      );
    }

    // 공공데이터포털 API 호출
    const apiUrl = `${baseURL}/getPassgrAnncmt`;
    const apiParams = {
      serviceKey,
      selectdate,
      type: 'json',
      numOfRows: '999',
      pageNo: '1',
    };

    console.log('API 호출 시작:', {
      url: apiUrl,
      params: { ...apiParams, serviceKey: serviceKey ? `${serviceKey.substring(0, 10)}...` : '없음' },
    });

    const response = await axios.get<PassengerApiResponse>(apiUrl, {
      params: apiParams,
      timeout: 10000, // 10초 타임아웃
      validateStatus: (status) => status < 500, // 500 이상만 에러로 처리
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
  } catch (error: any) {
    // 상세한 에러 로깅
    console.error('API 호출 오류 상세:', {
      message: error?.message,
      code: error?.code,
      response: error?.response?.data,
      status: error?.response?.status,
      stack: error?.stack,
    });
    
    if (axios.isAxiosError(error)) {
      // Axios 에러 처리
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

      // API 응답 에러
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        return NextResponse.json(
          { 
            error: '외부 API 서버 오류가 발생했습니다.', 
            code: 'EXTERNAL_API_ERROR',
            status,
            details: typeof data === 'string' ? data.substring(0, 200) : data,
          },
          { status: status >= 500 ? 502 : status }
        );
      }

      return NextResponse.json(
        { 
          error: 'API 서버와 통신 중 오류가 발생했습니다.', 
          code: 'API_ERROR', 
          message: error.message,
          details: error.code,
        },
        { status: 500 }
      );
    }

    // 일반 에러 처리
    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다.', 
        code: 'UNKNOWN_ERROR',
        message: error?.message || '알 수 없는 오류',
        type: error?.constructor?.name,
      },
      { status: 500 }
    );
  }
}
