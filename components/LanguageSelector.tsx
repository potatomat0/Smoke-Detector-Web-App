
import React from 'react';
import type { LanguageCode, TranslationSet } from '../localization/translations';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  translations: Pick<TranslationSet, 'languageEnglish' | 'languageVietnamese'>;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onChangeLanguage, translations }) => {
  const languages: { code: LanguageCode; name: string }[] = [
    { code: 'en', name: translations.languageEnglish },
    { code: 'vi', name: translations.languageVietnamese },
  ];

  return (
    <div className="flex space-x-2 items-center">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => onChangeLanguage(lang.code)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200
            ${currentLanguage === lang.code 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:bg-purple-500 focus:text-white'
            }
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75`}
          aria-pressed={currentLanguage === lang.code}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};
