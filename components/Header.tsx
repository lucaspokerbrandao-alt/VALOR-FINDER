import React from 'react';
import { useI18n } from '../i18n';

const Header: React.FC = () => {
  const { t } = useI18n();

  return (
    <header className="text-center p-4 md:p-6 border-b border-gray-700">
      <h1 className="text-3xl md:text-4xl font-bold text-green-400">
        Valor Finder
      </h1>
      <p className="text-gray-400 mt-2">
        {t('header.title')}
      </p>
      <div className="mt-4 bg-yellow-900/30 border border-yellow-500 text-yellow-300 px-4 py-2 rounded-lg text-sm max-w-2xl mx-auto">
        <strong className="font-semibold">{t('header.responsibleGaming')}</strong> {t('header.responsibleGamingText')}
      </div>
    </header>
  );
};

export default Header;
