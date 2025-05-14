import React from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import { PackageOpen } from 'lucide-react';

const ProductsList: React.FC = () => {
  const { products, searchResults } = useProducts();
  
  const displayProducts = searchResults !== null ? searchResults : products;
  const sortedProducts = [...displayProducts].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div>
      <SearchBar />
      
      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <PackageOpen size={48} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No products yet</h3>
          <p className="text-gray-500">
            Try adding some products using the "Add Product" tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;