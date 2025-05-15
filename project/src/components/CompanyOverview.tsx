import React, { useEffect, useState } from 'react';
import { AlertCircle, Globe, Users, TrendingUp, DollarSign, Percent, BarChart2 } from 'lucide-react';
import { getCompanyOverview } from '../services/api';
import { CompanyOverview as CompanyOverviewType } from '../types';
import { useTheme } from '../context/ThemeContext';

interface CompanyOverviewProps {
  symbol: string;
}

const CompanyOverview: React.FC<CompanyOverviewProps> = ({ symbol }) => {
  const { theme } = useTheme();
  const [overview, setOverview] = useState<CompanyOverviewType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyOverview = async () => {
      if (!symbol) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getCompanyOverview(symbol);
        if (response.success && response.data) {
          setOverview(response.data as CompanyOverviewType);
        } else {
          setError(response.error || 'Failed to fetch company overview');
        }
      } catch (err) {
        setError('An error occurred while fetching company overview');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyOverview();
  }, [symbol]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-xl font-bold mb-4">Company Overview</h2>
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Company Overview: {symbol}</h2>
        <div className="flex items-center justify-center text-red-500">
          <AlertCircle className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Company Overview: {symbol}</h2>
        <p>No data available for this symbol</p>
      </div>
    );
  }

  const formatMarketCap = (marketCap: string) => {
    const num = parseFloat(marketCap);
    if (isNaN(num)) return 'N/A';
    
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const metricClass = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Company Overview: {overview.Name}</h2>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <div className={`px-3 py-1 rounded-full text-sm ${metricClass}`}>
            {overview.Exchange}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${metricClass}`}>
            {overview.Sector}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${metricClass}`}>
            {overview.Industry}
          </div>
        </div>
        
        <p className="text-sm mb-4 line-clamp-4">
          {overview.Description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded ${metricClass}`}>
          <div className="flex items-center mb-2">
            <DollarSign size={16} className="mr-1" />
            <span className="font-medium">Market Cap</span>
          </div>
          <div className="text-lg font-semibold">
            {formatMarketCap(overview.MarketCapitalization)}
          </div>
        </div>
        
        <div className={`p-4 rounded ${metricClass}`}>
          <div className="flex items-center mb-2">
            <TrendingUp size={16} className="mr-1" />
            <span className="font-medium">P/E Ratio</span>
          </div>
          <div className="text-lg font-semibold">
            {parseFloat(overview.PERatio) > 0 ? parseFloat(overview.PERatio).toFixed(2) : 'N/A'}
          </div>
        </div>
        
        <div className={`p-4 rounded ${metricClass}`}>
          <div className="flex items-center mb-2">
            <Percent size={16} className="mr-1" />
            <span className="font-medium">Dividend Yield</span>
          </div>
          <div className="text-lg font-semibold">
            {parseFloat(overview.DividendYield) > 0 
              ? `${(parseFloat(overview.DividendYield) * 100).toFixed(2)}%` 
              : 'N/A'}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="text-sm">
          <div className="text-gray-500 dark:text-gray-400">52 Week High</div>
          <div className="font-medium">${parseFloat(overview['52WeekHigh']).toFixed(2)}</div>
        </div>
        
        <div className="text-sm">
          <div className="text-gray-500 dark:text-gray-400">52 Week Low</div>
          <div className="font-medium">${parseFloat(overview['52WeekLow']).toFixed(2)}</div>
        </div>
        
        <div className="text-sm">
          <div className="text-gray-500 dark:text-gray-400">50 Day Avg</div>
          <div className="font-medium">${parseFloat(overview['50DayMovingAverage']).toFixed(2)}</div>
        </div>
        
        <div className="text-sm">
          <div className="text-gray-500 dark:text-gray-400">200 Day Avg</div>
          <div className="font-medium">${parseFloat(overview['200DayMovingAverage']).toFixed(2)}</div>
        </div>
        
        <div className="text-sm">
          <div className="text-gray-500 dark:text-gray-400">EPS</div>
          <div className="font-medium">${parseFloat(overview.EPS).toFixed(2)}</div>
        </div>
        
        <div className="text-sm">
          <div className="text-gray-500 dark:text-gray-400">Beta</div>
          <div className="font-medium">{parseFloat(overview.Beta).toFixed(2)}</div>
        </div>
      </div>
      
      <div className="mt-6 text-sm">
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <Globe size={14} className="mr-1" />
          <a href={`https://${overview.Name.toLowerCase().replace(/\s+/g, '')}.com`} 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-blue-500 hover:underline">
            Company Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;