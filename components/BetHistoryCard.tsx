
import React from 'react';
import { Bet } from '../types';

interface BetHistoryCardProps {
  bet: Bet;
  onResolve: (betId: string, outcome: 'won' | 'lost') => void;
  onDelete: (betId: string) => void;
}

const BetHistoryCard: React.FC<BetHistoryCardProps> = ({ bet, onResolve, onDelete }) => {
  // Fix: Destructure `market` from `bet` to access market-specific details.
  const { match, market, stake, outcome, profit, placedAt } = bet;

  const getStatusBadge = () => {
    switch (outcome) {
      case 'won':
        return <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Ganha</span>;
      case 'lost':
        return <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">Perdida</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Pendente</span>;
    }
  };

  const getProfitColor = () => {
    if (outcome === 'pending') return 'text-gray-400';
    return profit > 0 ? 'text-green-400' : 'text-red-400';
  };
  
  const placedDate = new Date(placedAt);
  const formattedPlacedDate = `${placedDate.toLocaleDateString('pt-BR')} ${placedDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{match.league}</p>
          <h4 className="font-bold text-white">{match.homeTeam} vs {match.awayTeam}</h4>
          {/* Fix: Access the market name from the `market` object, not the `match` object. */}
          <p className="text-green-400 font-semibold">{market.market}</p>
        </div>
        <div className="flex-shrink-0">{getStatusBadge()}</div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center border-t border-b border-gray-700 py-3">
        <div>
          <p className="text-xs text-gray-400">Aposta</p>
          <p className="font-semibold text-white">R$ {stake.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Odds</p>
          {/* Fix: Access the bookmaker odds from the `market` object, not the `match` object. */}
          <p className="font-semibold text-white">{market.bookmakerOdds.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Lucro/Prejuízo</p>
          <p className={`font-semibold ${getProfitColor()}`}>
            {outcome === 'pending' ? '---' : `${profit >= 0 ? '+' : ''}R$ ${profit.toFixed(2)}`}
          </p>
        </div>
      </div>
      
      {outcome === 'pending' && (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => onResolve(bet.id, 'won')}
            className="flex-1 bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            Marcar como Ganha
          </button>
          <button
            onClick={() => onResolve(bet.id, 'lost')}
            className="flex-1 bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            Marcar como Perdida
          </button>
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Apostado em: {formattedPlacedDate}</span>
        <button 
          onClick={() => onDelete(bet.id)}
          className="text-gray-500 hover:text-red-400 transition-colors"
          aria-label="Deletar aposta"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BetHistoryCard;
