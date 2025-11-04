import React from 'react';
import { useI18n } from '../i18n';

const Disclaimer: React.FC = () => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center p-6 mt-8 border-t border-gray-800">
      <h3 className="font-semibold text-lg text-gray-300">{t('disclaimer.title')}</h3>
      <p className="text-xs text-gray-500 max-w-3xl mx-auto mt-2">
        {t('disclaimer.text')}
      </p>
      <p className="text-xs text-gray-600 mt-4">
        {t('disclaimer.copyright', { year: currentYear })}
      </p>
    </footer>
  );
};

export default Disclaimer;
