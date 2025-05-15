import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface StockSearchProps {
  onSearch: (symbol: string) => void;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSearch }) => {
  const { theme } = useTheme();
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.trim());
    }
  };

  const inputClass = theme === 'dark'
    ? 'bg-gray-800 text-white border-gray-700 focus:border-blue-500'
    : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500';

  const buttonClass = theme === 'dark'
    ? 'bg-blue-600 hover:bg-blue-700'
    : 'bg-blue-500 hover:bg-blue-600';

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={20} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
          </div>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className={`w-full py-3 pl-10 pr-4 border rounded-l-lg focus:outline-none ${inputClass} transition-colors duration-300`}
            placeholder="Enter stock symbol (e.g., AAPL, MSFT, AMZN)"
            aria-label="Stock symbol"
          />
        </div>
        <button
          type="submit"
          className={`px-6 py-3 font-medium text-white rounded-r-lg transition-colors duration-300 ${buttonClass}`}
        >
          Search
        </button>
      </form>
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Try popular symbols: AAPL (Apple), MSFT (Microsoft), AMZN (Amazon), GOOGL (Google)
      </div>
    </div>
  );
};

export default StockSearch;