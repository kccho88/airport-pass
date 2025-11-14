'use client';

interface DirectionToggleProps {
  direction: 'entry' | 'departure';
  onDirectionChange: (direction: 'entry' | 'departure') => void;
}

export default function DirectionToggle({ direction, onDirectionChange }: DirectionToggleProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => onDirectionChange('entry')}
          className={`flex-1 py-3 px-4 rounded-md font-medium text-sm transition-all ${
            direction === 'entry'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          입국장
        </button>
        <button
          onClick={() => onDirectionChange('departure')}
          className={`flex-1 py-3 px-4 rounded-md font-medium text-sm transition-all ${
            direction === 'departure'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          출국장
        </button>
      </div>
    </div>
  );
}


