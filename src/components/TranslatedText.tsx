import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/languageContext';

interface TranslatedTextProps {
  text: string;
  className?: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'button';
}

const TranslatedText: React.FC<TranslatedTextProps> = ({ 
  text, 
  className = '', 
  as = 'span' 
}) => {
  const { language, translate, translations } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>(text);

  useEffect(() => {
    // If the text is already in our translations cache, use that
    if (translations[text]) {
      setTranslatedText(translations[text]);
      return;
    }

    // Otherwise, translate it
    const performTranslation = async () => {
      const result = await translate(text);
      setTranslatedText(result);
    };

    performTranslation();
  }, [text, language, translate, translations]);

  const Component = as;
  return <Component className={className}>{translatedText}</Component>;
};

export default TranslatedText;