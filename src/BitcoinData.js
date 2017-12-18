import React, { Component } from 'react';
import axios from 'axios';
import HistoryChart from './HistoryChart';
//import RatesTable from './RatesTable';
//import RatesForm from './RatesForm';
//import Select from 'react-select';
//import 'react-select/dist/react-select.css';

const coincapUrl = 'http://coincap.io/page/';//ETH';
//price_btc
const poloniexUrl = 'https://poloniex.com/public?command=returnTicker';//have to query all coins
const krakenUrl = 'https://api.kraken.com/0/public/Trades?pair=';
const wexUrl = 'https://wex.nz/api/3/ticker/';//formerly BTC-E
//first number of the last 
//this needs to call its own fetch method
//pairs are ETHXBT, LTCXBT, DASHXBT
class BitcoinData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bitcoinAmount:'',
      api: ''
    };
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.calculateRates = this.calculateRates.bind(this);
    this.handleApiChange = this.handleApiChange.bind(this);
    this.getLatestRates = this.getLatestRates.bind(this);
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
  getLatestRatesPoloniex(){
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
  }

  convertRateToBitcoinPrice(rate){
    return   (1 / rate).toFixed(3)
  }

  calculateTotalInBitcoin(rate){
     var total = this.convertRateToBitcoinPrice(rate) * this.state.bitcoinAmount 
     return total.toFixed(2);
  }

  getLatestRatesCoinCap(){

    fetch(coincapUrl + 'ETH')
    .then(d => d.json())
    .then(d => {
      this.setState({
        ethereum: d.price_btc
      })
    });
    fetch(coincapUrl + 'LTC')
    .then(d => d.json())
    .then(d => {
      this.setState({
        litecoin: d.price_btc
      })
    });
    fetch(coincapUrl + 'DASH')
    .then(d => d.json())
    .then(d => {
      this.setState({
        dash: d.price_btc
      })
    });
  };
  getLatestRatesKraken(){
    //if allow-access-control-origin errors prevent fetch, add chrome extention 
    //https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en-US
    fetch(krakenUrl + 'ETHXBT')
    .then(d => d.json())
    .then(d => {
      var price = d.result.XETHXXBT[d.result.XETHXXBT.length -1 ][0]
      this.setState({
        ethereum: price
      })
    });
    fetch(krakenUrl + 'LTCXBT')
    .then(d => d.json())
    .then(d => {
      var price = d.result.XLTCXXBT[d.result.XLTCXXBT.length -1 ][0]
      this.setState({
        litecoin: price
      })
    });
    fetch(krakenUrl + 'DASHXBT')
    .then(d => d.json())
    .then(d => {
      var price = d.result.DASHXBT[d.result.DASHXBT.length -1 ][0]
      this.setState({
        dash: price
      })
    });
   
  }
  getLatestRatesWex(){

    fetch(wexUrl + 'eth_btc')
    .then(d => d.json())
    .then(d => {
      this.setState({
        ethereum: d.eth_btc.last
      })
    });
    fetch(wexUrl + 'ltc_btc')
    .then(d => d.json())
    .then(d => {
      this.setState({
        litecoin: d.ltc_btc.last
      })
    });
    fetch(wexUrl + 'dsh_btc')
    .then(d => d.json())
    .then(d => {
      this.setState({
        dash: d.dsh_btc.last
      })
    });
  }

  getLatestRates() {
  
   switch(this.state.api){
     case 'coincap':
        this.getLatestRatesCoinCap();
        break;
     case 'poloniex':
        this.getLatestRatesPoloniex();
        break;
     case 'kraken':
        this.getLatestRatesKraken();
        break;
     case 'wex':
        this.getLatestRatesWex();
        break;
   }
  };

  

  componentDidMount() {
  
    //best place to make network requests
    this.getLatestRates();
    //save the latest prices to mongo 
    this.handleTickerSubmit();
    
  };

  handleAmountChange(e) {
    if(!isNaN(e.target.value)){
      var newVal = e.target.value
      this.setState((state, props)=>{ 
        return {bitcoinAmount: newVal }});
    } else {
      alert("Please enter a numerical value")
    }
  }

  handleApiChange(e) {
      var newVal = e.target.value
      this.setState((state, props)=>{ 
        return {api: newVal }});
    
  }



  appHandleSubmit(text) {
    this.setState({bitcoinAmount: text});
    console.log(this.state.bitcoinAmount)
  }
  calculateRates() {
    console.log(this.state.bitcoinAmount)
    console.log(this.state.api)
    this.getLatestRates();
    this.setState({
      LtcAmount: (1 / this.state.litecoin).toFixed(3),
      EthAmount: (1 / this.state.ethereum).toFixed(3),
      DashAmount: (1 / this.state.dash).toFixed(3)
    });
  }
  
  render() {
  
    return (
      <div>
        bitcoin: 
        
        <input
          type='text'
          placeholder='quantity to convert...'
          value={ this.state.bitcoinAmount }
          onChange={ this.handleAmountChange } />

      <select onChange={ this.handleApiChange} value={this.state.api}>
          <option value="" disabled="disabled" selected="selected">Please select an api</option>
          <option value="coincap">CoinCap</option>
          <option value="poloniex">Poloniex</option>
          <option value="kraken">Kraken</option>
          <option value="wex">Wex (BTC-E)</option>
      </select>
          <button onClick={this.calculateRates}>get conversion rates</button> 
          
        <br/>
        <table>
          <tbody>
          <tr>
            <th>Currency</th>
            <th>Unit Price (BTC)</th>
            <th>Conversion Result</th>
          </tr>
          <tr>
            <td>Litecoin</td>
            <td>{ this.state.litecoin? this.convertRateToBitcoinPrice(this.state.litecoin) : ''}</td>
            <td>{ this.state.bitcoinAmount? this.calculateTotalInBitcoin(this.state.litecoin) : ''}</td>
          </tr>
          <tr>
            <td>Ethereum</td>
            <td>{ this.state.ethereum? this.convertRateToBitcoinPrice(this.state.ethereum) : ''}</td>
            <td>{ this.state.bitcoinAmount? this.calculateTotalInBitcoin(this.state.ethereum) : ''}</td>
          </tr>
          <tr>
            <td>Dash</td>
            <td>{ this.state.dash? this.convertRateToBitcoinPrice(this.state.dash) : ''}</td>
            <td>{ this.state.bitcoinAmount? this.calculateTotalInBitcoin(this.state.dash)  : ''}</td>
          </tr>
          </tbody>
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
