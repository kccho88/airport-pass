'use client';

import { useState, useEffect } from 'react';
import DateSelector from './components/DateSelector';
import TerminalTabs from './components/TerminalTabs';
import DirectionToggle from './components/DirectionToggle';
import TimeCard from './components/TimeCard';
import { fetchPassengerData, AirportApiError } from './services/airportApi';
import { ProcessedPassengerData } from './types/Passenger';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<number>(0); // 0 = 오늘, 1 = 내일
  const [selectedTerminal, setSelectedTerminal] = useState<'T1' | 'T2'>('T1');
  const [direction, setDirection] = useState<'entry' | 'departure'>('entry');
  const [data, setData] = useState<ProcessedPassengerData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // API 데이터 가져오기
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchPassengerData(selectedDate);
        setData(result);
      } catch (err) {
        if (err instanceof AirportApiError) {
          setError(err.message);
        } else {
          console.error('API 호출 오류:', err);
          setError('현재 데이터를 불러올 수 없습니다. 콘솔을 확인해주세요.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedDate]);

  // 필터링된 데이터 가져오기
  const getFilteredData = (): ProcessedPassengerData[] => {
    return data.filter((item) => {
      const terminalData = selectedTerminal === 'T1' ? item.t1 : item.t2;
      const directionData = direction === 'entry' ? terminalData.entry : terminalData.departure;
      return directionData.sum > 0; // 합계가 0보다 큰 데이터만 표시
    });
  };

  // 현재 선택된 터미널/방향의 합계 데이터 가져오기
  const getCurrentData = (item: ProcessedPassengerData): number => {
    const terminalData = selectedTerminal === 'T1' ? item.t1 : item.t2;
    const directionData = direction === 'entry' ? terminalData.entry : terminalData.departure;
    return directionData.sum;
  };

  // 라벨 텍스트 생성
  const getLabel = (): string => {
    const terminalName = selectedTerminal === 'T1' ? '제1여객터미널' : '제2여객터미널';
    const directionName = direction === 'entry' ? '입국장' : '출국장';
    return `${terminalName} ${directionName}`;
  };

  const filteredData = getFilteredData();

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            인천공항 시간대별 예상 승객 수
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            인천국제공항 제1·2여객터미널 시간대별 예상 승객 수 정보
          </p>
        </header>

        {/* 컨트롤 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
          <TerminalTabs selectedTerminal={selectedTerminal} onTerminalChange={setSelectedTerminal} />
          <DirectionToggle direction={direction} onDirectionChange={setDirection} />
        </div>

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 데이터 리스트 */}
        {!loading && !error && filteredData.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">표시할 데이터가 없습니다.</p>
          </div>
        )}

        {!loading && !error && filteredData.length > 0 && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {selectedDate === 0 ? '오늘' : '내일'} - {getLabel()}
              </h2>
              <p className="text-sm text-gray-600">
                총 {filteredData.length}개 시간대 데이터
              </p>
            </div>

            {filteredData.map((item) => (
              <TimeCard
                key={`${item.adate}-${item.atime}`}
                time={item.atime}
                count={getCurrentData(item)}
                label={getLabel()}
              />
            ))}
          </div>
        )}

        {/* 푸터 */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>데이터 제공: 인천국제공항공사 (공공데이터포털)</p>
        </footer>
      </div>
    </main>
  );
}


