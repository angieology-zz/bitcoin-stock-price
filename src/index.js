import React from 'react';
import ReactDOM from 'react-dom';
import BitcoinData from './BitcoinData';

ReactDOM.render(
  <BitcoinData
  url='http://localhost:3001/api/ticker'
    />,
  document.getElementById('root')
);
