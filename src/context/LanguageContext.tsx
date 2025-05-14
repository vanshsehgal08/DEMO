import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { availableLanguages } from '../services/translationService';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
  translations: Record<string, string>;
  loadingTranslations: boolean;
}

// Create the language context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  translate: async (text) => text,
  translations: {},
  loadingTranslations: false,
});

interface LanguageProviderProps {
  children: ReactNode;
}

// Common phrases that will be pre-translated and cached
const commonPhrases = {
  'Add Product': '',
  'Products List': '',
  'Product Name': '',
  'Description': '',
  'Price': '',
  'Category': '',
  'Image URL': '',
  'Add': '',
  'Edit': '',
  'Delete': '',
  'Save': '',
  'Cancel': '',
  'No products found': '',
  'ShopEasy Mini E-Commerce Platform': '',
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(
    localStorage.getItem('preferredLanguage') || 'en'
  );
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loadingTranslations, setLoadingTranslations] = useState<boolean>(false);

  const setLanguage = (lang: string) => {
    localStorage.setItem('preferredLanguage', lang);
    setLanguageState(lang);
  };

  // Function to translate text using the Google Translate API
  const translate = async (text: string): Promise<string> => {
    if (language === 'en') return text;
    if (translations[text]) return translations[text];

    // For production, you'd implement API calls to your translation service here
    // This is a placeholder that would be replaced with actual API calls
    try {
      const { translateText } = await import('../services/translationService');
      const translated = await translateText(text, language);
      
      // Cache the translation
      setTranslations(prev => ({
        ...prev,
        [text]: translated
      }));
      
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
    }
  };

  // Load common translations when language changes
  useEffect(() => {
    const loadCommonTranslations = async () => {
      if (language === 'en') {
        // For English, just use the keys as values
        const englishTranslations = Object.keys(commonPhrases).reduce((acc, key) => {
          acc[key] = key;
          return acc;
        }, {} as Record<string, string>);
        
        setTranslations(englishTranslations);
        return;
      }

      setLoadingTranslations(true);
      try {
        const { batchTranslate } = await import('../services/translationService');
        const keys = Object.keys(commonPhrases);
        const translatedValues = await batchTranslate(keys, language);
        
        const newTranslations = keys.reduce((acc, key, index) => {
          acc[key] = translatedValues[index];
          return acc;
        }, {} as Record<string, string>);
        
        setTranslations(newTranslations);
      } catch (error) {
        console.error('Error loading common translations:', error);
      } finally {
        setLoadingTranslations(false);
      }
    };

    loadCommonTranslations();
  }, [language]);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      translate, 
      translations,
      loadingTranslations
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);