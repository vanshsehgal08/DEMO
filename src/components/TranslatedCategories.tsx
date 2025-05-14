import React from 'react';
import { useLanguage } from '../context/languageContext';

// Define category options
export const categories = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home' },
  { value: 'books', label: 'Books' },
  { value: 'other', label: 'Other' }
];

interface TranslatedCategoryOptionProps {
  value: string;
  label: string;
}

// Component for a single translated category option
export const TranslatedCategoryOption: React.FC<TranslatedCategoryOptionProps> = ({ value, label }) => {
  const { translate } = useLanguage();
  const [translatedLabel, setTranslatedLabel] = React.useState<string>(label);
  
  React.useEffect(() => {
    const performTranslation = async () => {
      const translated = await translate(label);
      setTranslatedLabel(translated);
    };
    
    performTranslation();
  }, [label, translate]);
  
  return (
    <option value={value}>{translatedLabel}</option>
  );
};

// Component to render all category options with translations
export const TranslatedCategoryOptions: React.FC = () => {
  return (
    <>
      <option value="">-- <TranslatedSelectOption label="Select" /> --</option>
      {categories.map(category => (
        <TranslatedCategoryOption 
          key={category.value} 
          value={category.value} 
          label={category.label} 
        />
      ))}
    </>
  );
};

// Component for translating the "Select" option
const TranslatedSelectOption: React.FC<{label: string}> = ({ label }) => {
  const { translate } = useLanguage();
  const [translatedLabel, setTranslatedLabel] = React.useState<string>(label);
  
  React.useEffect(() => {
    const performTranslation = async () => {
      const translated = await translate(label);
      setTranslatedLabel(translated);
    };
    
    performTranslation();
  }, [label, translate]);
  
  return <>{translatedLabel}</>;
};