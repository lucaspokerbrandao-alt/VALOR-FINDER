import React from 'react';
import { Match, Market } from '../types';
import { useI18n } from '../i18n';

interface MatchCardProps {
  match: Match;
  onAnalyze: (match: Match) => void;
}

const MarketDetails: React.FC<{ market: Market }> = ({ market }) => {
    const { t } = useI18n();
    const evColor = market.evPercentage > 5 ? 'text-green-400' : 'text-yellow-400';
    const confidenceColor = market.confidenceScore > 70 ? 'text-green-400' : market.confidenceScore > 50 ? 'text-yellow-400' : 'text-orange-400';
    const impliedProbability = (1 / market.bookmakerOdds) * 100;

    return (
        <div className="bg-gray-900/50 rounded-lg p-3">
            <h4 className="text-green-400 text-center font-semibold text-sm mb-3">{market.market}</h4>
            
            {/* Main EV display */}
            <div className="text-center mb-4 p-2 rounded-md bg-gray-800">
                <p className="text-xs text-gray-400 uppercase tracking-wider">EV+</p>
                <p className={`text-2xl font-bold ${evColor}`}>+{market.evPercentage.toFixed(2)}%</p>
            </div>

            {/* Supporting stats grid */}
            <div className="grid grid-cols-2 gap-3 text-center mb-4">
                <div>
                    <p className="text-xs text-gray-400">{t('matchCard.realProb')}</p>
                    <p className="text-base font-bold text-white">{(market.realProbability * 100).toFixed(1)}%</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">{t('matchCard.impliedProb')}</p>
                    <p className="text-base font-bold text-white">{impliedProbability.toFixed(1)}%</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">{t('matchCard.odds')}</p>
                    <p className="text-base font-bold text-white">{market.bookmakerOdds.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">{t('matchCard.confidence')}</p>
                    <p className={`text-base font-bold ${confidenceColor}`}>{market.confidenceScore}/100</p>
                </div>
            </div>

             <a
                href={market.bookmakerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 text-white font-bold py-2 px-3 rounded-md hover:bg-green-700 transition-colors text-xs flex items-center justify-center gap-2"
                >
                {t('matchCard.viewOddsOn', { bookmakerName: market.bookmakerName })}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
            </a>
        </div>
    );
};


const MatchCard: React.FC<MatchCardProps> = ({ match, onAnalyze }) => {
  const { t, language } = useI18n();
  const locale = language === 'pt' ? 'pt-BR' : language; // Map to valid locales
  const matchDate = new Date(match.matchTime);
  const formattedTime = matchDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  const formattedDate = matchDate.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', timeZone: 'UTC' });

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(match.location)}`;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col justify-between transition-transform transform hover:scale-105 duration-300">
      {/* Header do Card */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{match.league}</p>
          <p className="text-xs text-gray-400">{formattedDate} - {formattedTime} (UTC)</p>
        </div>
        <h3 className="text-lg font-bold text-white text-center">{match.homeTeam} vs {match.awayTeam}</h3>
        <a 
            href={mapsSearchUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-green-400 transition-colors duration-200 mt-1"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {match.location}
        </a>
      </div>

      {/* Mercado de Maior Valor */}
      <div className="p-4 pt-0">
        {match.markets.length > 0 ? (
          <MarketDetails market={match.markets[0]} />
        ) : (
          <div className="text-center text-sm text-gray-500 p-4">
              {t('matchCard.noMarketWithValue')}
          </div>
        )}
      </div>
      
      {/* Footer do Card */}
      <div className="p-3 bg-gray-900/50">
        <button
            onClick={() => onAnalyze(match)}
            className="text-gray-500 hover:text-green-400 transition-colors text-xs flex items-center gap-1.5"
            aria-label={t('matchCard.analyzeMatch')}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {t('matchCard.analyzeWithGemini')}
        </button>
      </div>
    </div>
  );
};

export default MatchCard;