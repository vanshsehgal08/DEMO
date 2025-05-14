import React, { useState, useEffect } from 'react';
import { Search, X, Brain } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { SearchState } from '../types';

const SearchBar: React.FC = () => {
  const { searchProducts, isSearching, clearSearch, searchResults } = useProducts();
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    useContextual: false
  });
  const [debouncedSearch, setDebouncedSearch] = useState<SearchState>(searchState);

  // Debounce the search state
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchState);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchState]);

  // Execute search when debounced state changes
  useEffect(() => {
    if (debouncedSearch.query) {
      searchProducts(debouncedSearch.query, debouncedSearch.useContextual);
    } else {
      clearSearch();
    }
  }, [debouncedSearch, searchProducts, clearSearch]);

  const handleClear = () => {
    setSearchState({ query: '', useContextual: false });
    clearSearch();
  };

  const toggleContextual = () => {
    setSearchState(prev => ({
      ...prev,
      useContextual: !prev.useContextual
    }));
  };

  return (
    <div className="relative mb-6">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchState.query}
            onChange={(e) => setSearchState(prev => ({ ...prev, query: e.target.value }))}
            placeholder="Search products by name, description or context..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          {searchState.query && (
            <button
              onClick={handleClear}
              className="absolute right-3 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <button
          onClick={toggleContextual}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            searchState.useContextual
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={searchState.useContextual ? 'Contextual search enabled' : 'Enable contextual search'}
        >
          <Brain size={18} />
          <span className="text-sm font-medium">AI Search</span>
        </button>
      </div>

      {isSearching && (
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}
      
      {searchResults && searchResults.length === 0 && debouncedSearch.query && !isSearching && (
        <p className="mt-2 text-sm text-gray-500">
          No products found matching "{debouncedSearch.query}"
          {searchState.useContextual && " using AI search"}
        </p>
      )}
      
      {searchResults && searchResults.length > 0 && (
        <p className="mt-2 text-sm text-blue-600">
          Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} matching "{debouncedSearch.query}"
          {searchState.useContextual && " using AI search"}
        </p>
      )}
    </div>
  );
};

export default SearchBar;