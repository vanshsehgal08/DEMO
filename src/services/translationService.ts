// Translation Service using Google Translate API

// Available languages in the application
export const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
  ];
  
  // API Key for Google Translate
  const API_KEY = 'AIzaSyC4Bvq7CAXqsFCbDH6sSndiPx0_kGmgBCE';
  const BASE_URL = 'https://translation.googleapis.com/language/translate/v2';
  
  /**
   * Translates text to the target language
   * @param text Text to translate
   * @param targetLanguage Language code to translate to
   * @returns Promise with translated text
   */
  export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    if (targetLanguage === 'en') {
      return text; // No need to translate if target is English (assuming source is English)
    }
    
    try {
      const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          format: 'text'
        }),
      });
  
      if (!response.ok) {
        throw new Error('Translation failed');
      }
  
      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text on error
    }
  };
  
  /**
   * Batch translate multiple texts at once
   * @param texts Array of texts to translate
   * @param targetLanguage Language code to translate to
   * @returns Promise with array of translated texts
   */
  export const batchTranslate = async (texts: string[], targetLanguage: string): Promise<string[]> => {
    if (targetLanguage === 'en') {
      return texts; // No need to translate if target is English
    }
    
    try {
      const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: texts,
          target: targetLanguage,
          format: 'text'
        }),
      });
  
      if (!response.ok) {
        throw new Error('Batch translation failed');
      }
  
      const data = await response.json();
      return data.data.translations.map((t: any) => t.translatedText);
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts; // Fallback to original texts on error
    }
  };