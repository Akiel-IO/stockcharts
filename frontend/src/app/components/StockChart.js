"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const stockSymbols = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'NFLX', name: 'Netflix, Inc.' },
  { symbol: 'IBM', name: 'International Business Machines Corporation' },
  { symbol: 'ORCL', name: 'Oracle Corporation' },
  { symbol: 'INTC', name: 'Intel Corporation' }
];

const StockChart = () => {
  const [data, setData] = useState([]);
  const [symbol, setSymbol] = useState('AAPL');
  const [name, setName] = useState('Apple Inc');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [symbol]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/stocks/${symbol}`);
      console.log('API response:', response.data);

      if (response.data.results && Array.isArray(response.data.results)) {
        const chartData = response.data.results.map(item => ({
          date: new Date(item.t).toISOString().split('T')[0],
          close: item.c
        })).slice(-30);  // Get last 30 days

        setData(chartData);
        setError(null);
      } else {
        throw new Error('Unexpected data format from API');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError(error.message);
    }
  };

  const handleSymbolChange = (event) => {
    const selectedSymbol = event.target.value;
    const selectedStock = stockSymbols.find(stock => stock.symbol === selectedSymbol);

    setSymbol(selectedSymbol);
    setName(selectedStock ? selectedStock.name : '');

  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Stock for {name}</h1>
      <select value={symbol} onChange={handleSymbolChange}>
        {stockSymbols.map((stock) => (
          <option key={stock.symbol} value={stock.symbol}>
            {stock.name} ({stock.symbol})
          </option>
        ))}
      </select>
      {data.length > 0 ? (
        <LineChart width={800} height={400} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="close" stroke="#8884d8" />
        </LineChart>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default StockChart;