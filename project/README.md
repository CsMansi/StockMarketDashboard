# 📈 Stock Market Dashboard

A React-based stock market dashboard that provides real-time stock data, market status, top gainers and losers, and detailed company overviews using the AlphaVantage API.

---

## 🎯 Objective

This dashboard allows users to:

- 🔍 Search and view **real-time stock data** (price, volume, high/low, change %)
- 📊 View **current market status** (open/closed, timings)
- 🚀 See the **top gainers and losers** in the market
- 🏢 Get a detailed **company overview** for any stock symbol
- ⚠️ Get clear, user-friendly error messages for invalid inputs or network issues

---

## 🛠 Tech Stack

- **Frontend**: React.js, HTML, CSS
- **APIs**: [AlphaVantage API](https://www.alphavantage.co/)
- **State Management**: React Hooks (`useState`, `useEffect`)

---

## 🔗 API Endpoints Used

1. **Real-Time Stock Data (GLOBAL_QUOTE)**  
   `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo`

2. **Market Status**  
   `https://www.alphavantage.co/query?function=MARKET_STATUS&apikey=demo`

3. **Top Gainers & Losers**  
   `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=demo`

4. **Company Overview**  
   `https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=demo`

---

## 🔑 Features

### ✅ Real-Time Stock Data
- Current Price  
- Previous Close  
- Today’s High/Low  
- Volume  
- Change Percentage

### ✅ Market Status
- Market Open/Closed  
- Opening and Closing Times

### ✅ Top Gainers and Losers
- Stock Symbols  
- Percentage Change

### ✅ Company Overview
- Company Name  
- Industry  
- Market Capitalization  
- PE Ratio  
- Dividend Yield  

### ✅ Error Handling
- Invalid Symbol  
- Network Issues  
- User-friendly error messages

### ✅ Responsive UI
- Clean and mobile-friendly layout  
- Well-organized sections and tables

