import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, BarChart2 } from 'lucide-react';
import { getTopMovers } from '../services/api';
import { TopMoversResponse, StockMover } from '../types';
import { useTheme } from '../context/ThemeContext';

const TopMovers: React.FC = () => {
  const { theme } = useTheme();
  const [topMovers, setTopMovers] = useState<TopMoversResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'active'>('gainers');

  useEffect(() => {
    const fetchTopMovers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getTopMovers();
        if (response.success && response.data) {
          setTopMovers(response.data as TopMoversResponse);
        } else {
          setError(response.error || 'Failed to fetch top movers');
        }
      } catch (err) {
        setError('An error occurred while fetching top movers');
      } finally {
        setLoading(false);
      }
    };

    fetchTopMovers();
    // Refresh every 5 minutes
    const intervalId = setInterval(fetchTopMovers, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-xl font-bold mb-4">Market Movers</h2>
        <div className="h-60 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Market Movers</h2>
        <div className="flex items-center justify-center text-red-500">
          <AlertCircle className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!topMovers) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Market Movers</h2>
        <p>No data available</p>
      </div>
    );
  }

  const activeData = 
    activeTab === 'gainers' 
      ? topMovers.top_gainers 
      : activeTab === 'losers' 
        ? topMovers.top_losers 
        : topMovers.most_actively_traded;

  const tabClass = (tab: string) => {
    return `px-4 py-2 font-medium rounded-t-lg cursor-pointer ${
      activeTab === tab 
        ? theme === 'dark'
          ? 'bg-gray-700 text-white'
          : 'bg-white text-gray-900 border-b-2 border-blue-500'
        : theme === 'dark'
          ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
          : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'
    }`;
  };

  const thClass = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Market Movers</h2>
      
      <div className="flex border-b border-gray-700 mb-4">
        <div className={tabClass('gainers')} onClick={() => setActiveTab('gainers')}>
          <div className="flex items-center">
            <TrendingUp size={16} className="mr-1 text-green-500" />
            Top Gainers
          </div>
        </div>
        <div className={tabClass('losers')} onClick={() => setActiveTab('losers')}>
          <div className="flex items-center">
            <TrendingDown size={16} className="mr-1 text-red-500" />
            Top Losers
          </div>
        </div>
        <div className={tabClass('active')} onClick={() => setActiveTab('active')}>
          <div className="flex items-center">
            <BarChart2 size={16} className="mr-1 text-blue-500" />
            Most Active
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className={`px-4 py-2 text-left ${thClass}`}>Symbol</th>
              <th className={`px-4 py-2 text-right ${thClass}`}>Price</th>
              <th className={`px-4 py-2 text-right ${thClass}`}>Change</th>
              <th className={`px-4 py-2 text-right ${thClass}`}>% Change</th>
              <th className={`px-4 py-2 text-right ${thClass}`}>Volume</th>
            </tr>
          </thead>
          <tbody>
            {activeData.slice(0, 10).map((stock: StockMover, index: number) => {
              const isPositive = !stock.change_percentage.includes('-');
              const changeColorClass = isPositive ? 'text-green-500' : 'text-red-500';
              
              return (
                <tr key={index} className={`${
                  theme === 'dark' 
                    ? index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750' 
                    : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } transition-colors duration-100 hover:bg-opacity-80`}>
                  <td className="px-4 py-3 font-medium">{stock.ticker}</td>
                  <td className="px-4 py-3 text-right">${parseFloat(stock.price).toFixed(2)}</td>
                  <td className={`px-4 py-3 text-right ${changeColorClass}`}>
                    {stock.change_amount}
                  </td>
                  <td className={`px-4 py-3 text-right ${changeColorClass} font-medium`}>
                    {stock.change_percentage}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {parseInt(stock.volume).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-2 text-right text-sm text-gray-500 dark:text-gray-400">
        Last updated: {topMovers.last_updated}
      </div>
    </div>
  );
};

export default TopMovers;