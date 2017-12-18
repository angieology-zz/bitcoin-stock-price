import React from 'react';
import ReactDOM from 'react-dom';
import BitcoinApp from './BitcoinApp';

ReactDOM.render(
  <BitcoinApp
  url='http://localhost:3001/api/ticker'
    />,
  document.getElementById('root')
);
