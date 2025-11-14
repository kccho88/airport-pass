'use client';

interface DateSelectorProps {
  selectedDate: number; // 0 = 오늘, 1 = 내일
  onDateChange: (date: number) => void;
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  return (
    <div className="w-full mb-6">
      <label htmlFor="date-select" className="block text-sm font-medium text-gray-700 mb-2">
        날짜 선택
      </label>
      <select
        id="date-select"
        value={selectedDate}
        onChange={(e) => onDateChange(Number(e.target.value))}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-base"
      >
        <option value={0}>오늘</option>
        <option value={1}>내일</option>
      </select>
    </div>
  );
}


