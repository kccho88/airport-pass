'use client';

import { getCongestionLevel, CONGESTION_COLORS, type CongestionLevel } from '@/app/types/Passenger';

interface TimeCardProps {
  time: string; // 시간대 (예: "08_09")
  count: number; // 승객 수
  label: string; // 표시할 라벨 (예: "T1 입국장")
}

export default function TimeCard({ time, count, label }: TimeCardProps) {
  const congestionLevel: CongestionLevel = getCongestionLevel(count);
  const colorClass = CONGESTION_COLORS[congestionLevel];
  
  // 시간대 포맷팅 (08_09 -> 08:00-09:00)
  const formatTime = (timeStr: string): string => {
    const [start, end] = timeStr.split('_');
    return `${start}:00-${end}:00`;
  };

  // 바 너비 계산 (최대값 2000 기준)
  const maxCount = 2000;
  const barWidth = Math.min((count / maxCount) * 100, 100);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{formatTime(time)}</h3>
          <p className="text-sm text-gray-600 mt-1">{label}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{count.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">명</p>
        </div>
      </div>
      
      {/* 혼잡도 바 */}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-300 rounded-full`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      
      {/* 혼잡도 레벨 표시 */}
      <div className="mt-2 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${colorClass}`} />
        <span className="text-xs text-gray-600">
          {congestionLevel === 'low' && '여유'}
          {congestionLevel === 'medium' && '보통'}
          {congestionLevel === 'high' && '혼잡'}
        </span>
      </div>
    </div>
  );
}


