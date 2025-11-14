'use client';

interface TerminalTabsProps {
  selectedTerminal: 'T1' | 'T2';
  onTerminalChange: (terminal: 'T1' | 'T2') => void;
}

export default function TerminalTabs({ selectedTerminal, onTerminalChange }: TerminalTabsProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => onTerminalChange('T1')}
          className={`flex-1 py-3 px-4 rounded-md font-medium text-sm transition-all ${
            selectedTerminal === 'T1'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          제1여객터미널 (T1)
        </button>
        <button
          onClick={() => onTerminalChange('T2')}
          className={`flex-1 py-3 px-4 rounded-md font-medium text-sm transition-all ${
            selectedTerminal === 'T2'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          제2여객터미널 (T2)
        </button>
      </div>
    </div>
  );
}


