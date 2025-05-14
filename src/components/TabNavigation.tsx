import React from 'react';
import { PlusCircle, ShoppingCart } from 'lucide-react';
import { TabType } from '../types';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        className={`flex items-center px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
          activeTab === 'add'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
        onClick={() => setActiveTab('add')}
      >
        <PlusCircle className="mr-2" size={20} />
        Add Product
      </button>
      <button
        className={`flex items-center px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
          activeTab === 'view'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }`}
        onClick={() => setActiveTab('view')}
      >
        <ShoppingCart className="mr-2" size={20} />
        My Products
      </button>
    </div>
  );
};

export default TabNavigation;