import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md">
      <div className="container mx-auto py-4 px-4 flex items-center">
        <ShoppingBag className="mr-2" size={28} />
        <h1 className="text-2xl font-bold">ShopEasy</h1>
      </div>
    </header>
  );
};

export default Header;