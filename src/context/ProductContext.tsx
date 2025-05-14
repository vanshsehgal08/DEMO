import React, { createContext, useState, useEffect, useContext } from 'react';
import { Product } from '../types';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  searchProducts: (query: string, useContextual?: boolean) => Promise<Product[]>;
  searchResults: Product[] | null;
  isSearching: boolean;
  clearSearch: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Failed to parse saved products:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setSearchResults(null);
  };

  const performBasicSearch = (query: string, products: Product[]): Product[] => {
    const searchTerms = query.toLowerCase().split(' ');
    return products.filter((product) => {
      const searchText = `${product.name} ${product.description}`.toLowerCase();
      return searchTerms.every(term => searchText.includes(term));
    });
  };

  // Track last search to prevent duplicate requests
  const [lastQuery, setLastQuery] = useState<string>('');
  const [lastResults, setLastResults] = useState<Product[]>([]);
  
  // Add debounce timer ref
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const searchProducts = async (query: string, useContextual = false): Promise<Product[]> => {
    if (!query.trim()) {
      setSearchResults(null);
      return products;
    }
    
    // If the exact same search was just performed, return cached results
    if (query === lastQuery) {
      console.log('Using cached search results for query:', query);
      setSearchResults(lastResults);
      return lastResults;
    }
    
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new timer (300ms debounce)
    return new Promise((resolve) => {
      debounceTimerRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const basicResults = performBasicSearch(query, products);

          if (!useContextual) {
            setSearchResults(basicResults);
            setIsSearching(false);
            setLastQuery(query);
            setLastResults(basicResults);
            resolve(basicResults);
            return;
          }

          try {
            // Try contextual search first (only once)
            const contextualResults = await performContextualSearch(query, products);
            setSearchResults(contextualResults);
            setIsSearching(false);
            setLastQuery(query);
            setLastResults(contextualResults);
            resolve(contextualResults);
          } catch (error) {
            console.warn('Contextual search failed, falling back to basic search:', error);
            setSearchResults(basicResults);
            setIsSearching(false);
            setLastQuery(query);
            setLastResults(basicResults);
            resolve(basicResults);
          }
        } catch (error) {
          console.error('Search error:', error);
          setIsSearching(false);
          resolve([]);
        }
      }, 300);
    });
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        searchProducts,
        searchResults,
        isSearching,
        clearSearch,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Updated function with correct endpoint, error handling, and request throttling
async function performContextualSearch(query: string, products: Product[]): Promise<Product[]> {
  if (products.length === 0) return [];

  // Updated API endpoint and model name for Gemini
  const API_KEY = 'AIzaSyC4Bvq7CAXqsFCbDH6sSndiPx0_kGmgBCE'; // Consider using environment variables
  const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';

  const prompt = `
    Given these products:
    ${products.map((p) => `- ${p.id}: ${p.name} - ${p.description} (Price: ${p.price})`).join('\n')}

    User search query: "${query}"

    Task: Find products that match the search intent. Consider synonyms, use cases, and context.
    Return ONLY a JSON array of matching product IDs. Example: ["id1", "id2"]
    If no matches found, return: []
  `;

  // Create a controller to be able to abort the request if needed
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    console.log(`Starting contextual search for query: "${query}"`);
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt,
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 1,
          topP: 1,
          maxOutputTokens: 100,
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      // If we're getting 404s, fall back to basic search
      if (response.status === 404) {
        console.warn('API endpoint not found. Falling back to basic search.');
        return performBasicSearch(query, products);
      }
      
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    // Log once, not repeatedly
    console.log('Received API Response:', data);

    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!generatedText) {
      console.warn('Empty or invalid response from API');
      return performBasicSearch(query, products);
    }

    try {
      // Try parsing the direct response
      const parsed = JSON.parse(generatedText);
      if (Array.isArray(parsed)) {
        console.log(`Found ${parsed.length} matching products from AI search`);
        return products.filter(p => parsed.includes(p.id));
      }
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON array
      const match = generatedText.match(/\[.*?\]/s);
      if (match) {
        try {
          const ids = JSON.parse(match[0]);
          console.log(`Found ${ids.length} matching products from AI search (extracted)`);
          return products.filter(p => ids.includes(p.id));
        } catch (extractError) {
          console.error('Failed to parse extracted JSON:', extractError);
        }
      }
    }

    // If all parsing attempts fail, fall back to basic search
    console.warn('Failed to parse API response. Falling back to basic search.');
    return performBasicSearch(query, products);
    
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.warn('API request timed out after 10 seconds');
    } else {
      console.error('Error during contextual search:', error);
    }
    // Fall back to basic search on any error
    return performBasicSearch(query, products);
  }
}

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};