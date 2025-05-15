import { ApiResponse } from '../types';

const API_KEY = 'BBEEPWFKD5CQLB30';
const BASE_URL = 'https://www.alphavantage.co/query';

export async function fetchData<T>(endpoint: string, params: Record<string, string> = {}): Promise<ApiResponse<T>> {
  try {
    const queryParams = new URLSearchParams({
      ...params,
      apikey: API_KEY
    });
    
    const response = await fetch(`${BASE_URL}?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for API error messages
    if (data.hasOwnProperty('Error Message')) {
      return { 
        success: false, 
        error: data['Error Message'] 
      };
    }
    
    if (data.hasOwnProperty('Information')) {
      return {
        success: false,
        error: data['Information']
      };
    }

    if (data.hasOwnProperty('Note')) {
      return {
        success: false,
        error: data['Note']
      };
    }
    
    return { 
      success: true, 
      data: data as T 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function getStockQuote(symbol: string) {
  return fetchData('', {
    function: 'GLOBAL_QUOTE',
    symbol
  });
}

export async function getMarketStatus() {
  return fetchData('', {
    function: 'MARKET_STATUS'
  });
}

export async function getTopMovers() {
  return fetchData('', {
    function: 'TOP_GAINERS_LOSERS'
  });
}

export async function getCompanyOverview(symbol: string) {
  return fetchData('', {
    function: 'OVERVIEW',
    symbol
  });
}