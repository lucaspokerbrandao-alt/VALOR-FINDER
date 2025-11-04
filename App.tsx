import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Match } from './types';
import { fetchMatchesFromGemini, getMatchAnalysis } from './services/geminiService';
import Header from './components/Header';
import Filters from './components/Filters';
import MatchList from './components/MatchList';
import Disclaimer from './components/Disclaimer';
import AnalysisModal from './components/AnalysisModal';
import { useI18n } from './i18n';

// Define a duração do cache: 1 hora em milissegundos
const CACHE_DURATION_MS = 60 * 60 * 1000;

// Adiciona uma interface para a estrutura de dados em cache para garantir a segurança de tipos.
interface CachedData {
  timestamp: number;
  matches: Match[];
}

const App: React.FC = () => {
  const { language, t } = useI18n();
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [leagues, setLeagues] = useState<string[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [selectedTime, setSelectedTime] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedConfidence, setSelectedConfidence] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para o modal de análise
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState<boolean>(false);
  const [selectedMatchForAnalysis, setSelectedMatchForAnalysis] = useState<Match | null>(null);
  const [analysisContent, setAnalysisContent] = useState<string>('');
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);

  const processMatchesForSingleBestMarket = (matches: Match[]): Match[] => {
    return matches.map(match => {
      if (!match.markets || match.markets.length === 0) {
        return { ...match, markets: [] };
      }
      const bestMarket = match.markets.reduce((best, current) => 
        current.evPercentage > best.evPercentage ? current : best
      );
      return { ...match, markets: [bestMarket] };
    });
  };

  const loadMatches = useCallback(async (dateToFetch: Date, forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    const cacheKey = `valor-finder-matches-${dateToFetch.toISOString().split('T')[0]}`;

    if (!forceRefresh) {
      const cachedItem = localStorage.getItem(cacheKey);
      if (cachedItem) {
        try {
          const { timestamp, matches: cachedMatches }: CachedData = JSON.parse(cachedItem);
          if (Date.now() - timestamp < CACHE_DURATION_MS) {
            console.info(`[Cache] Loading games for ${cacheKey} from cache.`);
            const singleBestMarketMatches = processMatchesForSingleBestMarket(cachedMatches);
            setAllMatches(singleBestMarketMatches);
            const uniqueLeagues = [...new Set(singleBestMarketMatches.map((match: Match) => match.league))];
            setLeagues(uniqueLeagues.sort());
            setIsLoading(false);
            return;
          } else {
            console.info(`[Cache] Cache for ${cacheKey} has expired. Fetching new data.`);
            localStorage.removeItem(cacheKey);
          }
        } catch (e) {
          console.error('[Cache] Failed to parse cached data. Removing item.', e);
          localStorage.removeItem(cacheKey);
        }
      }
    }

    try {
      console.info(`[API] Fetching games for ${dateToFetch.toISOString().split('T')[0]}. Force refresh: ${forceRefresh}`);
      const matchesData = await fetchMatchesFromGemini(dateToFetch, language);
      const singleBestMarketMatches = processMatchesForSingleBestMarket(matchesData);
      setAllMatches(singleBestMarketMatches);
      
      const uniqueLeagues = [...new Set(singleBestMarketMatches.map(match => match.league))];
      setLeagues(uniqueLeagues.sort());

      const cachePayload: CachedData = {
        timestamp: Date.now(),
        matches: singleBestMarketMatches,
      };
      localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
      console.info(`[Cache] Games for ${cacheKey} stored in cache.`);

    } catch (err) {
      if (err instanceof Error) {
          if (err.message.includes("Invalid API response")) {
            setError(t('app.invalidResponse'));
          } else if (err.message.includes("invalid JSON")) {
            setError(t('app.invalidJson'));
          } else {
            setError(err.message);
          }
      } else {
        setError(t('app.fetchError'));
      }
      console.error(err);
      setAllMatches([]);
    } finally {
      setIsLoading(false);
    }
  }, [language, t]);

  useEffect(() => {
    loadMatches(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]); 

  const handleRefresh = () => {
    loadMatches(selectedDate, true);
  };
  
  const handleDateChange = (dateString: string) => {
    const newDate = new Date(dateString + 'T00:00:00');
    setSelectedDate(newDate);
  };
  
  const handleAnalyzeMatch = useCallback(async (match: Match) => {
    setSelectedMatchForAnalysis(match);
    setIsAnalysisModalOpen(true);
    setIsAnalysisLoading(true);
    setAnalysisContent('');
    try {
        const analysis = await getMatchAnalysis(match, language);
        setAnalysisContent(analysis);
    } catch (error) {
        console.error("Failed to get match analysis:", error);
        setAnalysisContent(t('analysisModal.loadError'));
    } finally {
        setIsAnalysisLoading(false);
    }
  }, [language, t]);

  const handleCloseAnalysisModal = () => {
    setIsAnalysisModalOpen(false);
    setSelectedMatchForAnalysis(null);
    setAnalysisContent('');
  };

  const filteredMatches = useMemo(() => {
    const matchesWithFilteredMarkets = allMatches.map(match => {
        let markets = match.markets;
        markets = markets.filter(market => market.confidenceScore >= selectedConfidence);
        return { ...match, markets };
    });

    return matchesWithFilteredMarkets.filter(match => {
      if (match.markets.length === 0) {
        return false;
      }

      const leagueFilter = selectedLeague === 'all' || match.league === selectedLeague;
      if (!leagueFilter) return false;
      
      if (selectedTime === 'all') return true;

      const matchDate = new Date(match.matchTime);
      const hour = matchDate.getHours();

      if (selectedTime === 'morning') {
        return hour >= 6 && hour < 12;
      }
      if (selectedTime === 'afternoon') {
        return hour >= 12 && hour < 18;
      }
      if (selectedTime === 'night') {
        return hour >= 18 || hour < 6;
      }
      
      return true;
    });
  }, [allMatches, selectedLeague, selectedTime, selectedConfidence]);

  const renderContent = () => {
    if (error) return (
      <div className="text-center py-16 text-red-400 bg-red-900/20 m-4 rounded-lg">
        <h3 className="text-xl font-semibold">Ocorreu um Erro</h3>
        <p>{error}</p>
      </div>
    );
    return (
      <>
        <Filters 
          leagues={leagues}
          selectedLeague={selectedLeague}
          onLeagueChange={setSelectedLeague}
          selectedTime={selectedTime}
          onTimeChange={setSelectedTime}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          selectedConfidence={selectedConfidence}
          onConfidenceChange={setSelectedConfidence}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />
        <MatchList 
          matches={filteredMatches} 
          onAnalyze={handleAnalyzeMatch}
          isLoading={isLoading}
        />
      </>
    );
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto max-w-7xl">
        {renderContent()}
      </main>
      <Disclaimer />
      <AnalysisModal 
        isOpen={isAnalysisModalOpen}
        onClose={handleCloseAnalysisModal}
        match={selectedMatchForAnalysis}
        analysisContent={analysisContent}
        isLoading={isAnalysisLoading}
      />
    </div>
  );
};

export default App;
