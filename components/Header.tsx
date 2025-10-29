
import React from 'react';
import { SparklesIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <SparklesIcon className="h-8 w-8 text-pink-500 mr-3" />
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
          AI Fashion Stylist
        </h1>
      </div>
    </header>
  );
};

export default Header;
