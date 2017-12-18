import React, { Component } from 'react';


class RatesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  calculateRates() {
    this.props.getLatestRates();
    this.setState({
      LtcAmount: (1 / this.state.litecoin).toFixed(3),
      EthAmount: (1 / this.state.ethereum).toFixed(3),
      DashAmount: (1 / this.state.dash).toFixed(3)
    });
  }
  componentDidMount() {
    this.calculateRates()
  };

  render() {
    return(
    <table>
          <tbody>
          <tr>
            <th>Currency</th>
            <th>BTC Unit Price</th>
            <th>Result</th>
          </tr>
          <tr>
            <td>Litecoin</td>
            <td>{ (1 / this.props.litecoin).toFixed(3) }</td>
            <td>{ this.state.LtcAmount? this.state.LtcAmount : ''}</td>
          </tr>
          <tr>
            <td>Ethereum</td>
            <td>{ (1 / this.props.ethereum).toFixed(3)}</td>
            <td>{ this.state.EthAmount? this.state.EthAmount : ''}</td>
          </tr>
          <tr>
            <td>Dash</td>
            <td>{ (1 / this.props.dash).toFixed(3)}</td>
            <td>{ this.state.DashAmount? this.state.DashAmount : ''}</td>
          </tr>
          </tbody>
      </table>
    )
  }
}

export default RatesTable;

