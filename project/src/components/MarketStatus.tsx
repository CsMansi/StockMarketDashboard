import React, { useEffect, useState } from 'react';
import { Clock, Check, AlertCircle } from 'lucide-react';
import { getMarketStatus } from '../services/api';
import { MarketStatusResponse, MarketStatus } from '../types';
import { useTheme } from '../context/ThemeContext';

const MarketStatusComponent: React.FC = () => {
  const { theme } = useTheme();
  const [marketStatus, setMarketStatus] = useState<MarketStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMarketStatus();
        if (response.success && response.data) {
          setMarketStatus((response.data as MarketStatusResponse).markets);
        } else {
          setError(response.error || 'Failed to fetch market status');
        }
      } catch (err) {
        setError('An error occurred while fetching market status');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketStatus();
    // Refresh every 5 minutes
    const intervalId = setInterval(fetchMarketStatus, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <h2 className="text-xl font-bold mb-4">Market Status</h2>
        <div className="h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Market Status</h2>
        <div className="flex items-center justify-center text-red-500">
          <AlertCircle className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const statusColorClass = (status: string) => {
    if (status.toLowerCase().includes('open')) {
      return 'text-green-500';
    } else if (status.toLowerCase().includes('closed')) {
      return 'text-red-500';
    }
    return 'text-yellow-500';
  };

  const textClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Market Status</h2>
      <div className="space-y-4">
        {marketStatus.map((market, index) => (
          <div key={index} className="border-b border-gray-700 pb-3 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{market.market_type} ({market.region})</span>
              <span className={`flex items-center ${statusColorClass(market.current_status)}`}>
                {market.current_status.toLowerCase().includes('open') ? (
                  <Check size={16} className="mr-1" />
                ) : (
                  <Clock size={16} className="mr-1" />
                )}
                {market.current_status}
              </span>
            </div>
            <div className={`text-sm ${textClass}`}>
              <p>Trading Hours: {market.local_open} - {market.local_close}</p>
              {market.notes && <p className="mt-1 italic">{market.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketStatusComponent;