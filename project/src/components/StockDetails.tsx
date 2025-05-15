import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react';
import { getStockQuote } from '../services/api';
import { GlobalQuote } from '../types';
import { useTheme } from '../context/ThemeContext';

interface StockDetailsProps {
  symbol: string;
}

const StockDetails: React.FC<StockDetailsProps> = ({ symbol }) => {
  const { theme } = useTheme();
  const [quoteData, setQuoteData] = useState<GlobalQuote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockQuote = async () => {
      if (!symbol) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getStockQuote(symbol);
        if (response.success && response.data) {
          setQuoteData(response.data as GlobalQuote);
        } else {
          setError(response.error || 'Failed to fetch stock quote');
        }
      } catch (err) {
        setError('An error occurred while fetching stock quote');
      } finally {
        setLoading(false);
      }
    };

    fetchStockQuote();
    // Refresh every minute
    const intervalId = setInterval(fetchStockQuote, 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [symbol]);

  const refreshData = () => {
    setLoading(true);
    getStockQuote(symbol)
      .then((response) => {
        if (response.success && response.data) {
          setQuoteData(response.data as GlobalQuote);
          setError(null);
        } else {
          setError(response.error || 'Failed to fetch stock quote');
        }
      })
      .catch(() => {
        setError('An error occurred while fetching stock quote');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading && !quoteData) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Stock Details</h2>
        </div>
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error && !quoteData) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Stock Details: {symbol}</h2>
        <div className="flex items-center justify-center text-red-500">
          <AlertCircle className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!quoteData || !quoteData['Global Quote']) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Stock Details: {symbol}</h2>
        <p>No data available for this symbol</p>
      </div>
    );
  }

  const quote = quoteData['Global Quote'];
  const isPositive = !quote['10. change percent'].includes('-');
  const changeColorClass = isPositive ? 'text-green-500' : 'text-red-500';
  const changeIcon = isPositive ? 
    <TrendingUp className={`${changeColorClass} mr-2`} size={24} /> : 
    <TrendingDown className={`${changeColorClass} mr-2`} size={24} />;

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(parseFloat(value));
  };

  const formatVolume = (value: string) => {
    return parseInt(value).toLocaleString();
  };

  const metricClass = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';
  const valueClass = theme === 'dark' ? 'bg-gray-750' : 'bg-white';

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Stock Details: {quote['01. symbol']}</h2>
        <button 
          onClick={refreshData} 
          className="p-1 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Refresh stock data"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center">
          <h3 className="text-3xl font-bold">{formatCurrency(quote['05. price'])}</h3>
          <div className={`flex items-center ml-3 ${changeColorClass}`}>
            {changeIcon}
            <span className="font-semibold">
              {quote['09. change']} ({quote['10. change percent']})
            </span>
          </div>
        </div>
        <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
          As of {quote['07. latest trading day']}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className={`p-3 rounded ${metricClass}`}>
          <div className="text-sm text-gray-500 dark:text-gray-400">Previous Close</div>
          <div className="font-semibold">{formatCurrency(quote['08. previous close'])}</div>
        </div>
        <div className={`p-3 rounded ${metricClass}`}>
          <div className="text-sm text-gray-500 dark:text-gray-400">Open</div>
          <div className="font-semibold">{formatCurrency(quote['02. open'])}</div>
        </div>
        <div className={`p-3 rounded ${metricClass}`}>
          <div className="text-sm text-gray-500 dark:text-gray-400">High</div>
          <div className="font-semibold">{formatCurrency(quote['03. high'])}</div>
        </div>
        <div className={`p-3 rounded ${metricClass}`}>
          <div className="text-sm text-gray-500 dark:text-gray-400">Low</div>
          <div className="font-semibold">{formatCurrency(quote['04. low'])}</div>
        </div>
        <div className={`p-3 rounded ${metricClass} col-span-2`}>
          <div className="text-sm text-gray-500 dark:text-gray-400">Volume</div>
          <div className="font-semibold">{formatVolume(quote['06. volume'])}</div>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;