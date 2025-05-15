import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import StockSearch from './StockSearch';
import MarketStatus from './MarketStatus';
import TopMovers from './TopMovers';
import StockDetails from './StockDetails';
import CompanyOverview from './CompanyOverview';


const Dashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchSymbol, setSearchSymbol] = useState<string>('');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');

  const handleSearch = (symbol: string) => {
    setSelectedSymbol(symbol.toUpperCase());
  };

  const bgClass = theme === 'dark' 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-100 text-gray-900';

  const cardBgClass = theme === 'dark'
    ? 'bg-gray-800'
    : 'bg-white';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <header className="border-b border-gray-700 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stock Market Dashboard</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <StockSearch onSearch={handleSearch} />
        </section>

        {selectedSymbol && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <section className={`p-6 rounded-lg shadow-lg ${cardBgClass} transition-colors duration-300`}>
              <StockDetails symbol={selectedSymbol} />
            </section>
            <section className={`p-6 rounded-lg shadow-lg ${cardBgClass} transition-colors duration-300 lg:col-span-2`}>
              <CompanyOverview symbol={selectedSymbol} />
            </section>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <section className={`p-6 rounded-lg shadow-lg ${cardBgClass} transition-colors duration-300`}>
            <MarketStatus />
          </section>
          <section className={`p-6 rounded-lg shadow-lg ${cardBgClass} transition-colors duration-300 lg:col-span-2`}>
            <TopMovers />
          </section>
        </div>


      </main>

      <footer className={`py-4 px-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} text-center text-sm`}>
        <p>&copy; {new Date().getFullYear()} Stock Market Dashboard. Powered by Alpha Vantage.</p>
      </footer>
    </div>
  );
};

export default Dashboard;