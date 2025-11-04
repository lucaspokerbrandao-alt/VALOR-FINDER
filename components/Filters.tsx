import React from 'react';
import { useI18n } from '../i18n';

interface FiltersProps {
  leagues: string[];
  selectedLeague: string;
  onLeagueChange: (league: string) => void;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  selectedDate: Date;
  onDateChange: (date: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  selectedConfidence: number;
  onConfidenceChange: (confidence: number) => void;
}

const Filters: React.FC<FiltersProps> = ({ 
  leagues, 
  selectedLeague, 
  onLeagueChange,
  selectedTime, 
  onTimeChange, 
  selectedDate,
  onDateChange,
  onRefresh, 
  isLoading,
  selectedConfidence,
  onConfidenceChange
}) => {
  const { t } = useI18n();
  const dateValue = selectedDate.toISOString().split('T')[0];

  const handleDateNavigation = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    onDateChange(newDate.toISOString().split('T')[0]);
  };

  return (
    <div className="p-4 flex flex-wrap gap-4 justify-center items-center sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10 border-b border-gray-800">
      <div className="w-full sm:w-auto">
          <label htmlFor="date-filter" className="sr-only">{t('filters.filterByDate')}</label>
          <div className="flex items-center">
            <button
              onClick={() => handleDateNavigation('prev')}
              className="p-2 bg-gray-800 border border-gray-600 text-white rounded-l-lg hover:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              aria-label={t('filters.previousDay')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <input
              type="date"
              id="date-filter"
              value={dateValue}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full sm:w-40 bg-gray-800 border-t border-b border-gray-600 text-white p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 relative"
            />
            <button
              onClick={() => handleDateNavigation('next')}
              className="p-2 bg-gray-800 border border-gray-600 text-white rounded-r-lg hover:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              aria-label={t('filters.nextDay')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      <div className="w-full sm:w-auto">
        <label htmlFor="league-filter" className="sr-only">{t('filters.filterByLeague')}</label>
        <select
          id="league-filter"
          value={selectedLeague}
          onChange={(e) => onLeagueChange(e.target.value)}
          className="w-full sm:w-56 bg-gray-800 border border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="all">{t('filters.allLeagues')}</option>
          {leagues.map((league) => (
            <option key={league} value={league}>
              {league}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full sm:w-auto">
        <label htmlFor="time-filter" className="sr-only">{t('filters.filterByTime')}</label>
        <select
          id="time-filter"
          value={selectedTime}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full sm:w-56 bg-gray-800 border border-gray-600 text-white rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="all">{t('filters.allTimes')}</option>
          <option value="morning">{t('filters.morning')}</option>
          <option value="afternoon">{t('filters.afternoon')}</option>
          <option value="night">{t('filters.night')}</option>
        </select>
      </div>
      <div className="w-full sm:w-auto">
        <label htmlFor="confidence-filter" className="block text-sm font-medium text-gray-300 mb-1">
            {t('filters.minConfidence')} <span className="font-bold text-green-400">{selectedConfidence}</span>
        </label>
        <input
          id="confidence-filter"
          type="range"
          min="0"
          max="100"
          step="5"
          value={selectedConfidence}
          onChange={(e) => onConfidenceChange(Number(e.target.value))}
          className="w-full sm:w-56 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
      </div>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm12 14a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 111.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )}
        {isLoading ? t('filters.updating') : t('filters.refreshGames')}
      </button>
    </div>
  );
};

export default Filters;
