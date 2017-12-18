import React, { Component } from 'react';
import axios from 'axios';
import HistoryChart from './HistoryChart';
import RatesTable from './RatesTable';
//import RatesForm from './RatesForm';
//import Select from 'react-select';
//import 'react-select/dist/react-select.css';

//loading icon
//modularize (redux?)

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
      api: '',
    };
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.calculateRates = this.calculateRates.bind(this);
    this.handleApiChange = this.handleApiChange.bind(this);
    this.getLatestRates = this.getLatestRates.bind(this);
  }

  // ============================ main network calls =================================

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
      //save the latest prices to mongo 
      this.handleTickerSubmit();
  
        //refreshes grid to show only data from selected API source
     this.loadDataFromServer();
    };

    handleTickerSubmit() {
      let tickerRow = { 
        time: Date.now(),
        LTC: this.state.litecoin,
        ETH: this.state.ethereum,
        DASH: this.state.dash,
        API: this.state.api
      }
      axios.post(this.props.url, tickerRow)
        .catch(err => {
          console.error(err);
        });
    }

    loadDataFromServer() {
      axios.get(this.props.url + '?API=' + this.state.api)
        .then(res=> {
          console.log(res.data);
          let data = this.cleanData(res.data);
          this.setState({ data: data });
        })
      
    }

//================================= end main network =============================


  //========================== various API fetches =================================
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
   //============================== end various API fetch ===================================


 

//==================================chart methods ============================
 
  
  cleanData(rawData) {
    //clean for fields currency, price, time
    //should probably limit scale
    let cleanHistoryData = [];
    rawData.forEach((tickerItem)=> {
      if (tickerItem.LTC && tickerItem.ETH && tickerItem.DASH && tickerItem.time) {
        var newCleanedTicker = {
          LTC: parseFloat(tickerItem.LTC),
          ETH: parseFloat(tickerItem.ETH),
          DASH: parseFloat(tickerItem.DASH),
          time: this.formatTime(parseInt(tickerItem.time))
        }
        cleanHistoryData.push(newCleanedTicker);
      }
    });
     return cleanHistoryData;
  }
  formatTime(secs) {
    console.log(secs)
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    var datetext = t.toTimeString();
    return datetext.split(' ')[0];
  }
  //=========================================end chart=================================

  //====================================== user form =================================

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

  calculateRates() {
    this.getLatestRates();
    this.setState({
      LtcAmount: (1 / this.state.litecoin).toFixed(3),
      EthAmount: (1 / this.state.ethereum).toFixed(3),
      DashAmount: (1 / this.state.dash).toFixed(3)
    });
  }

  // ==================================== end user form ==================================


  


 
  
  render() {
  
    return (
      <div>
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
      <RatesTable
        bitcoinAmount = {this.state.bitcoinAmount}
        litecoin = {this.state.litecoin}
        ethereum = {this.state.ethereum}
        dash = {this.state.dash}
      />
       
        <br/> 
            <HistoryChart
                url='http://localhost:3001/api/ticker'
                data = {this.state.data}
            />
      </div>
     
    )
  }
}

export default BitcoinData;
