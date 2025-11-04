import React from 'react';
import { Match } from '../types';
import { useI18n } from '../i18n';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
  analysisContent: string;
  isLoading: boolean;
}

// Simple markdown to HTML converter
const formatMarkdown = (text: string) => {
    if (!text) return '';
    let html = text
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-green-400 mb-2 mt-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mb-3 mt-5">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-4 mt-6">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  
    // Process lists
    html = html.replace(/^\s*[-*+] (.*)/gm, '<li>$1</li>');
    html = html.replace(/((<li>.*<\/li>)+)/gs, '<ul>$1</ul>').replace(/<\/ul>\s*<ul>/g, '');
  
    // Process paragraphs based on double line breaks
    return html.split(/\n\s*\n/).map(paragraph => {
      if (paragraph.startsWith('<ul>') || paragraph.startsWith('<h')) {
        return paragraph;
      }
      return `<p class="mb-4">${paragraph.replace(/\n/g, '<br>')}</p>`;
    }).join('');
};
  

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, match, analysisContent, isLoading }) => {
  const { t } = useI18n();

  if (!isOpen || !match) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95"
        style={isOpen ? {transform: 'scale(1)'} : {}}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <header className="p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
          <h2 className="text-xl font-bold text-white">
            {t('analysisModal.analysisOf', { homeTeam: match.homeTeam, awayTeam: match.awayTeam })}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
            aria-label={t('analysisModal.close')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              <p className="mt-4 text-gray-300">{t('analysisModal.generating')}</p>
            </div>
          ) : (
            <div 
              className="text-gray-300 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(analysisContent) }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
