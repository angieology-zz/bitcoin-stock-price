import React, { Component } from 'react';
import axios from 'axios';
import HistoryChart from './HistoryChart';

//const btceUrl = 'https://btc-e.com/api/3/ticker/btc_usd';
const poloniexUrl = 'https://poloniex.com/public?command=returnTicker';

class BitcoinData extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleTickerSubmit() {
    let tickerRow = { 
      time: Date.now(),
      LTC: this.state.litecoin,
      ETH: this.state.ethereum,
      DASH: this.state.dash
    }
    axios.post(this.props.url, tickerRow)
      .catch(err => {
        console.error(err);
      });
  }
  componentDidMount() {
    
    //best place to make network requests
    fetch(poloniexUrl)
    .then(d => d.json())
    .then(d => {
      //ethereum, litecoin, dash
      //save in database with timestamp and type of coin?
      this.setState({
        litecoin: d.BTC_LTC.last,
        ethereum: d.BTC_ETH.last,
        dash: d.BTC_DASH.last
      })
      //save the latest prices to mongo 
      this.handleTickerSubmit();
    })
  };

  handleAmountChange(e) {
    if(!isNaN(e.target.value)){
      this.setState({ bitcoinAmount: e.target.value });
    }
    
    console.log(this.state.bitcoinAmount)
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
          onChange={ this.handleAmountChanges } />
        <br/>
          litecoin { this.state.litecoin }
        <br/>
            ethereum { this.state.ethereum }
        <br/>
            dash { this.state.dash }
        <br/> 
            <HistoryChart
                url='http://localhost:3001/api/ticker'
            />
      </div>
     
    )
  }
}

export default BitcoinData;
