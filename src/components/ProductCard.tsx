import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, price, description, imageUrl } = product;
  
  // Format the date nicely
  const formattedDate = new Date(product.createdAt).toLocaleDateString();
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={imageUrl || 'https://placehold.co/600x400https://placehold.co/600x400'}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            // Handle image loading errors by replacing with placeholder
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400https://placehold.co/600x400';
          }}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{name}</h3>
          <span className="bg-blue-100 text-blue-800 text-sm px-2 py-0.5 rounded-full font-medium">
            ${price.toFixed(2)}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{description}</p>
        <div className="pt-2 border-t border-gray-100 text-gray-400 text-xs">
          Added on {formattedDate}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;