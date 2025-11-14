import { NextRequest, NextResponse } from 'next/server';

// 환경변수 디버깅용 엔드포인트 (개발/디버깅용)
export async function GET(request: NextRequest) {
  // 보안: 프로덕션에서는 비활성화 권장
  const isVercel = process.env.VERCEL === '1';
  
  const envInfo = {
    // 환경변수 존재 여부만 확인 (값은 노출하지 않음)
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE ? `설정됨 (길이: ${process.env.NEXT_PUBLIC_API_BASE.length})` : '없음',
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY ? `설정됨 (길이: ${process.env.NEXT_PUBLIC_API_KEY.length})` : '없음',
    API_KEY: process.env.API_KEY ? `설정됨 (길이: ${process.env.API_KEY.length})` : '없음',
    SERVICE_KEY: process.env.SERVICE_KEY ? `설정됨 (길이: ${process.env.SERVICE_KEY.length})` : '없음',
    
    // 환경 정보
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
    
    // 관련 환경변수 키 목록
    availableEnvKeys: Object.keys(process.env)
      .filter(key => 
        key.includes('API') || 
        key.includes('KEY') || 
        key.includes('SERVICE') ||
        key.includes('VERCEL')
      )
      .sort(),
  };

  return NextResponse.json({
    message: '환경변수 디버깅 정보',
    ...envInfo,
    note: '이 엔드포인트는 디버깅용입니다. 프로덕션에서는 제거하는 것을 권장합니다.',
  });
}

