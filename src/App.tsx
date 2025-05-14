import React, { useState } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import AddProductForm from './components/AddProductForm';
import ProductsList from './components/ProductsList';
import { ProductProvider } from './context/ProductContext';
import { LanguageProvider } from './context/languageContext';
import { TabType } from './types';
import TranslatedText from './components/TranslatedText';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('add');

  return (
    <LanguageProvider>
      <ProductProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          
          <main className="flex-grow container mx-auto px-4 py-6">
            <div className="max-w-5xl mx-auto">
              <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
              
              <div className="py-4">
                {activeTab === 'add' ? <AddProductForm /> : <ProductsList />}
              </div>
            </div>
          </main>
          
          <footer className="bg-gray-800 text-gray-300 py-4 text-center text-sm">
            <div className="container mx-auto">
              &copy; {new Date().getFullYear()} <TranslatedText text="ShopEasy Mini E-Commerce Platform" />
            </div>
          </footer>
        </div>
      </ProductProvider>
    </LanguageProvider>
  );
}

export default App;