import React, { Component } from 'react';
import axios from 'axios';
import HistoryChart from './HistoryChart';

const coincapUrl = 'http://coincap.io/page/ETH';
//price_btc
const poloniexUrl = 'https://poloniex.com/public?command=returnTicker';//have to query all coins
const krakenUrl = 'https://api.kraken.com/0/public/Trades?pair=ETHXBT';
//first number of the last 
//this needs to call its own fetch method
//pairs are ETHXBT, LTCXBT, DASHXBT
class BitcoinData extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.calculateRates = this.calculateRates.bind(this);
  }
  handleTickerSubmit() {
    let tickerRow = { 
      time: Date.now(),
      LTC: this.state.litecoin,
      ETH: this.state.ethereum,
      DASH: this.state.dash,
      API: this.state.selectedApi
    }
    axios.post(this.props.url, tickerRow)
      .catch(err => {
        console.error(err);
      });
  }

  getLatestRates() {
    fetch(poloniexUrl)
    .then(d => d.json())
    .then(d => {
      //ethereum, litecoin, dash
      //save in database with timestamp and type of coin?
      this.setState({
        litecoin: d.BTC_LTC.last,
        ethereum: d.BTC_ETH.last,
        dash: d.BTC_DASH.last
      });
    });

    
  };

  componentDidMount() {
  
    //best place to make network requests
    this.getLatestRates();
    //save the latest prices to mongo 
    this.handleTickerSubmit();
    
  };

  handleAmountChange(e) {
    if(!isNaN(e.target.value)){
      this.setState({ bitcoinAmount: e.target.value });
    }
    
    console.log(this.state.bitcoinAmount)
  }
  calculateRates() {
    this.getLatestRates();
    this.setState({
      LtcAmount: (1 / this.state.litecoin).toFixed(3),
      EthAmount: (1 / this.state.ethereum).toFixed(3),
      DashAmount: (1 / this.state.dash).toFixed(3)
    });
  }
    
  render() {
    if (!this.state.litecoin) { return <p> "Loading..." </p>}
  
    return (
      <div>
        bitcoin: 
        <input
          type='text'
          placeholder='bitcoins to convert...'
          value={ this.state.bitcoinAmount }
          onChange={ this.handleAmountChange } />
          <button onClick={this.calculateRates}>get conversion rates</button>
        <br/>
        <table>
        <tr>
          <th>Currency</th>
          <th>BTC Unit Price</th>
          <th>Result</th>
        </tr>
        <tr>
          <td>Litecoin</td>
          <td>{ (1 / this.state.litecoin).toFixed(3) }</td>
          <td>{ this.state.LtcAmount? this.state.LtcAmount : ''}</td>
        </tr>
        <tr>
          <td>Ethereum</td>
          <td>{ (1 / this.state.ethereum).toFixed(3)}</td>
          <td>{ this.state.EthAmount? this.state.EthAmount : ''}</td>
        </tr>
        <tr>
          <td>Dash</td>
          <td>{ (1 / this.state.dash).toFixed(3)}</td>
          <td>{ this.state.DashAmount? this.state.DashAmount : ''}</td>
        </tr>
      </table>
        <br/> 
            <HistoryChart
                url='http://localhost:3001/api/ticker'
            />
      </div>
     
    )
  }
}

export default BitcoinData;
