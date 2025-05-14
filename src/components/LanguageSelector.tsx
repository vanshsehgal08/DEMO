import React from 'react';
import { useLanguage } from '../context/languageContext';
import { availableLanguages } from '../services/translationService';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, loadingTranslations } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="relative flex items-center">
      {loadingTranslations && (
        <div className="absolute -left-6">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <select
        value={language}
        onChange={handleLanguageChange}
        className="bg-gray-700 text-white text-sm rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;