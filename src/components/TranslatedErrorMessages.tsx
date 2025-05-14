import React from 'react';
import { useLanguage } from '../context/languageContext';

interface ErrorMessageProps {
  message?: string;
  defaultMessage?: string;
}

/**
 * Component for translating form error messages
 */
const TranslatedErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  defaultMessage = 'This field is required' 
}) => {
  const { translate } = useLanguage();
  const [translatedMessage, setTranslatedMessage] = React.useState<string>(message || defaultMessage);
  
  React.useEffect(() => {
    const msg = message || defaultMessage;
    const performTranslation = async () => {
      const translated = await translate(msg);
      setTranslatedMessage(translated);
    };
    
    performTranslation();
  }, [message, defaultMessage, translate]);
  
  return (
    <p className="mt-1 text-sm text-red-600">{translatedMessage}</p>
  );
};

export default TranslatedErrorMessage;