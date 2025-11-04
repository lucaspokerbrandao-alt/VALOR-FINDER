import React from 'react';

type View = 'matches' | 'history';

interface ViewSwitcherProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  const baseClasses = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 transition-colors duration-200 w-1/2";
  const activeClasses = "bg-green-600 text-white";
  const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";

  return (
    <div className="p-4 flex justify-center items-center bg-gray-900 border-b border-gray-800">
      <div className="w-full max-w-xs inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          onClick={() => onViewChange('matches')}
          className={`${baseClasses} rounded-l-lg ${currentView === 'matches' ? activeClasses : inactiveClasses}`}
        >
          Jogos com Valor
        </button>
        <button
          type="button"
          onClick={() => onViewChange('history')}
          className={`${baseClasses} rounded-r-lg ${currentView === 'history' ? activeClasses : inactiveClasses}`}
        >
          Histórico de Apostas
        </button>
      </div>
    </div>
  );
};

export default ViewSwitcher;
