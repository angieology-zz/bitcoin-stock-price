import React, { Component } from 'react';
import axios from 'axios';
import {
  PageHeader, Form, Button,
  FormControl,
  ControlLabel,
  FormGroup,
  Col,
  Row,
  Grid
} from 'react-bootstrap'
import HistoryChart from './HistoryChart';
import RatesTable from './RatesTable';
import WalletForm from './WalletForm';

const url = 'http://localhost:3001/api/ticker';
const coincapUrl = 'http://coincap.io/page/';
const poloniexUrl = 'https://poloniex.com/public?command=returnTicker';
const krakenUrl = 'https://api.kraken.com/0/public/Trades?pair=';
const wexUrl = 'https://wex.nz/api/3/ticker/';

class ExchangeRate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bitcoinAmount: '',
      api: '',
    };
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.calculateRates = this.calculateRates.bind(this);
    this.handleApiChange = this.handleApiChange.bind(this);
    this.getLatestRates = this.getLatestRates.bind(this);
  }
  // ============================ main network calls =================================

  getLatestRates() {
    switch (this.state.api) {
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
    axios.post(url, tickerRow)
      .catch(err => {
        console.error(err);
      })
      .catch(error => {
        console.log(error.response)
    });
  }

  loadDataFromServer() {
    axios.get(url + '?API=' + this.state.api)
      .then(res => {
        console.log(res.data);
        let data = this.cleanData(res.data);
        this.setState({ data: data });
      })
      .catch(error => {
        console.log(error.response)
    });

  }

  //================================= end main network =============================


  //========================== various API fetches =================================
  getLatestRatesPoloniex() {
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
      })
      .catch(error => {
        console.log(error.response)
    });
  }

  getLatestRatesCoinCap() {
    fetch(coincapUrl + 'ETH')
      .then(d => d.json())
      .then(d => {
        this.setState({
          ethereum: d.price_btc
        })
      })
      .catch(error => {
        console.log(error.response)
    });
    fetch(coincapUrl + 'LTC')
      .then(d => d.json())
      .then(d => {
        this.setState({
          litecoin: d.price_btc
        })
      })
      .catch(error => {
        console.log(error.response)
    });
    fetch(coincapUrl + 'DASH')
      .then(d => d.json())
      .then(d => {
        this.setState({
          dash: d.price_btc
        })
      })
      .catch(error => {
        console.log(error.response)
    });
  };
  getLatestRatesKraken() {
    //if allow-access-control-origin errors prevent fetch, add chrome extention 
    //https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en-US
    fetch(krakenUrl + 'ETHXBT')
      .then(d => d.json())
      .then(d => {
        var price = d.result.XETHXXBT[d.result.XETHXXBT.length - 1][0]
        this.setState({
          ethereum: price
        })
      })
      .catch(error => {
        console.log(error.response)
    });
    fetch(krakenUrl + 'LTCXBT')
      .then(d => d.json())
      .then(d => {
        var price = d.result.XLTCXXBT[d.result.XLTCXXBT.length - 1][0]
        this.setState({
          litecoin: price
        })
      })
      .catch(error => {
        console.log(error.response)
    });
    fetch(krakenUrl + 'DASHXBT')
      .then(d => d.json())
      .then(d => {
        var price = d.result.DASHXBT[d.result.DASHXBT.length - 1][0]
        this.setState({
          dash: price
        })
      })
      .catch(error => {
        console.log(error.response)
    });

  }
  getLatestRatesWex() {

    fetch(wexUrl + 'eth_btc')
      .then(d => d.json())
      .then(d => {
        this.setState({
          ethereum: d.eth_btc.last
        })
      })
      .catch(error => {
        console.log(error.response)
    });
    fetch(wexUrl + 'ltc_btc')
      .then(d => d.json())
      .then(d => {
        this.setState({
          litecoin: d.ltc_btc.last
        })
      })
      .catch(error => {
        console.log(error.response)
    });
    fetch(wexUrl + 'dsh_btc')
      .then(d => d.json())
      .then(d => {
        this.setState({
          dash: d.dsh_btc.last
        })
      })
      .catch(error => {
        console.log(error.response)
    });
  }
  //============================== end various API fetch ===================================




  //==================================chart methods ============================


  cleanData(rawData) {
    //clean for fields currency, price, time
    //should probably limit scale
    let cleanHistoryData = [];
    rawData.forEach((tickerItem) => {
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
    var t = new Date(1970, 0, 1); // Epoch---todo fix
    t.setSeconds(secs);
    var datetext = t.toTimeString();
    return datetext.split(' ')[0];
  }
  //=========================================end chart=================================

  //====================================== user form =================================

  handleAmountChange(e) {
    var newVal = e.target.value
    this.setState((state, props) => {
      return { bitcoinAmount: newVal }
    });
  }

  handleApiChange(e) {
    var newVal = e.target.value
    this.setState((state, props) => {
      return { api: newVal }
    });

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

  getValidationState() {
    const amt = this.state.bitcoinAmount;
    if (isNaN(amt)) return 'error';
    //else return 'success';
    return null;
  }

  render() {

    return (
      <div>
       
          <Row>
            <Col sm={10}>
              <PageHeader>Bitcoin Exchange Rates <small> Litecoin, Ethereum, and Dash</small></PageHeader>
            </Col>
          </Row>
          <Form horizontal>

            <FormGroup
              controlId="formBasicText"
              validationState={this.getValidationState()}
            >
              <Col componentClass={ControlLabel} sm={2}>
                Amount
            </Col>
              <Col sm={6}>
                <FormControl
                  type="text"
                  value={this.state.bitcoinAmount}
                  placeholder="quantity to convert..."
                  onChange={this.handleAmountChange}
                />
              </Col>
            </FormGroup>



            <FormGroup controlId="formControlsSelect">
              <Col componentClass={ControlLabel} sm={2}>
                Api Source
            </Col>
              <Col sm={6}>
                <FormControl componentClass="select" placeholder="select" onChange={this.handleApiChange} value={this.state.api}>
                  <option value="" disabled="disabled" selected="selected">Please select an api</option>
                  <option value="coincap">CoinCap</option>
                  <option value="poloniex">Poloniex</option>
                  <option value="kraken">Kraken</option>
                  <option value="wex">Wex (BTC-E)</option>
                </FormControl>
              </Col>
            </FormGroup>

            <FormGroup>
              <Col smOffset={2} sm={8}>
                <Button onClick={this.calculateRates} >
                  get conversion rates
            </Button>
              </Col>
            </FormGroup>

          </Form>
          <Col sm={8}>
            <RatesTable
              bitcoinAmount={this.state.bitcoinAmount}
              litecoin={this.state.litecoin}
              ethereum={this.state.ethereum}
              dash={this.state.dash}
            />
          </Col>
          <Col sm={10}>
            <HistoryChart
              data={this.state.data}
            />
          </Col>
       
      </div>

    )
  }
}

export default ExchangeRate;
