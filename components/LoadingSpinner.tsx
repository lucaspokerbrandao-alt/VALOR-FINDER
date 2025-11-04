import React from 'react';
import { useI18n } from '../i18n';

const LoadingSpinner: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col justify-center items-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      <p className="mt-4 text-white text-lg">{t('loading.analyzing')}</p>
      <p className="text-gray-400 text-sm">{t('loading.pleaseWait')}</p>
    </div>
  );
};

export default LoadingSpinner;
