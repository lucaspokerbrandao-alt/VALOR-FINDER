import React, { useMemo } from 'react';
import { Bet } from '../types';

interface BetSummaryProps {
  bets: Bet[];
}

const BetSummary: React.FC<BetSummaryProps> = ({ bets }) => {
  const summary = useMemo(() => {
    const settledBets = bets.filter(b => b.outcome !== 'pending');
    
    const totalStaked = settledBets.reduce((acc, bet) => acc + bet.stake, 0);
    const totalProfit = settledBets.reduce((acc, bet) => acc + bet.profit, 0);
    const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;
    
    const wins = settledBets.filter(b => b.outcome === 'won').length;
    const winRate = settledBets.length > 0 ? (wins / settledBets.length) * 100 : 0;

    return { totalStaked, totalProfit, roi, winRate, pendingCount: bets.length - settledBets.length };
  }, [bets]);

  const StatCard: React.FC<{ title: string, value: string, colorClass?: string }> = ({ title, value, colorClass = 'text-white' }) => (
    <div className="bg-gray-800 p-4 rounded-lg text-center">
      <p className="text-sm text-gray-400">{title}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
  
  return (
    <div className="p-4 md:p-6 bg-gray-900">
      <h2 className="text-xl font-bold text-white mb-4 text-center">Resumo do Desempenho</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Apostado" value={`R$ ${summary.totalStaked.toFixed(2)}`} />
        <StatCard 
          title="Lucro/Prejuízo" 
          value={`${summary.totalProfit >= 0 ? '+' : ''}R$ ${summary.totalProfit.toFixed(2)}`}
          colorClass={summary.totalProfit > 0 ? 'text-green-400' : summary.totalProfit < 0 ? 'text-red-400' : 'text-white'} 
        />
        <StatCard 
          title="ROI" 
          value={`${summary.roi.toFixed(2)}%`}
          colorClass={summary.roi > 0 ? 'text-green-400' : summary.roi < 0 ? 'text-red-400' : 'text-white'} 
        />
        <StatCard title="Taxa de Acerto" value={`${summary.winRate.toFixed(2)}%`} />
      </div>
      {summary.pendingCount > 0 && (
         <p className="text-center text-sm text-yellow-400 mt-4">
            {summary.pendingCount} aposta{summary.pendingCount > 1 ? 's' : ''} pendente{summary.pendingCount > 1 ? 's' : ''}.
        </p>
      )}
    </div>
  );
};

export default BetSummary;
