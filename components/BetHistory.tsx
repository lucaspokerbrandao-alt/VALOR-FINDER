import React from 'react';
import { Bet } from '../types';
import BetHistoryCard from './BetHistoryCard';
import BetSummary from './BetSummary';

interface BetHistoryProps {
  bets: Bet[];
  onResolveBet: (betId: string, outcome: 'won' | 'lost') => void;
  onDeleteBet: (betId: string) => void;
}

const BetHistory: React.FC<BetHistoryProps> = ({ bets, onResolveBet, onDeleteBet }) => {
  const sortedBets = [...bets].sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());

  return (
    <div>
      <BetSummary bets={bets} />
      {bets.length === 0 ? (
        <div className="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-white">Nenhuma aposta registrada</h3>
          <p className="mt-1 text-sm text-gray-400">
            Vá para a tela de "Jogos com Valor" para registrar sua primeira aposta.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
          {sortedBets.map((bet) => (
            <BetHistoryCard 
                key={bet.id} 
                bet={bet} 
                onResolve={onResolveBet}
                onDelete={onDeleteBet}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BetHistory;
