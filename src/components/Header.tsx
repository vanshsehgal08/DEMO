import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import TranslatedText from './TranslatedText';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Title */}
        <div className="text-2xl font-semibold">
          <TranslatedText text="ShopEasy" />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 text-lg">
          <div className="hover:text-yellow-400 transition duration-200 cursor-pointer">
            <TranslatedText text="Home" />
          </div>
          <div className="hover:text-yellow-400 transition duration-200 cursor-pointer">
            <TranslatedText text="Products" />
          </div>
          <div className="hover:text-yellow-400 transition duration-200 cursor-pointer">
            <TranslatedText text="About" />
          </div>
          <div className="hover:text-yellow-400 transition duration-200 cursor-pointer">
            <TranslatedText text="Contact" />
          </div>
        </div>

        {/* Language Selector */}
        <div className="ml-6 hidden md:block">
          <LanguageSelector />
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center" onClick={toggleMenu}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white py-4">
          <div className="flex flex-col space-y-4 items-center">
            <div className="hover:text-yellow-400 transition duration-200 cursor-pointer">
              <TranslatedText text="Home" />
            </div>
            <div className="hover:text-yellow-400 transition duration-200 cursor-pointer">
              <TranslatedText text="Products" />
            </div>
            <div className="hover:text-yellow-400 transition duration-200 cursor-pointer">
              <TranslatedText text="About" />
            </div>
            <div className="hover:text-yellow-400 transition duration-200 cursor-pointer">
              <TranslatedText text="Contact" />
            </div>
            <div className="mt-4">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
