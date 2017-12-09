import React, { Component } from 'react';
const btceUrl = 'https://btc-e.com/api/3/ticker/btc_usd';
const poloniexUrl = 'https://poloniex.com/public?command=returnTicker';

class BitcoinData extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
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
      //save this stuff to mongo dood
    })

    
  };
  render() {
    if (!this.state.litecoin) { return <p> "Loading..." </p>}
  
    return (
      <div>litecoin { this.state.litecoin }
        <br/>
            ethereum { this.state.ethereum }
        <br/>
            dash { this.state.dash }
      </div>
     
    )
  }
}

export default BitcoinData;
