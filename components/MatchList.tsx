import React from 'react';
import { Match } from '../types';
import MatchCard from './MatchCard';
import LoadingSpinner from './LoadingSpinner';
import { useI18n } from '../i18n';

interface MatchListProps {
  matches: Match[];
  onAnalyze: (match: Match) => void;
  isLoading: boolean;
}

const MatchList: React.FC<MatchListProps> = ({ matches, onAnalyze, isLoading }) => {
  const { t } = useI18n();
  // If loading and there are no matches yet, show the main spinner.
  if (isLoading && matches.length === 0) {
    return <LoadingSpinner />;
  }

  // If not loading and still no matches, show the empty state message.
  if (!isLoading && matches.length === 0) {
    return (
      <div className="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-white">{t('matchList.noGamesFound')}</h3>
        <p className="mt-1 text-sm text-gray-400">
          {t('matchList.noGamesForFilters')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
      {matches.map((match) => (
        <MatchCard 
          key={match.id} 
          match={match} 
          onAnalyze={onAnalyze}
        />
      ))}
    </div>
  );
};

export default MatchList;
