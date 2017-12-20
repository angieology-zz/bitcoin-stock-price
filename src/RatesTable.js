import React, { Component } from 'react';

import { Table } from 'react-bootstrap';

class RatesTable extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    // ========================= rate calculations for display  ==============================

    convertRateToBitcoinPrice(rate) {
        if (isNaN(rate)) {
            return ''
        }
        else {
            return (1 / rate).toFixed(3)
        }

    }

    calculateTotalInBitcoin(rate) {
        if (isNaN(rate)) {
            return ''
        }
        var total = this.convertRateToBitcoinPrice(rate) * this.props.bitcoinAmount
        return total.toFixed(2);
    }

    render() {
        return (
            <Table striped bordered condensed hover>
                <tbody>
                    <tr>
                        <th>Currency</th>
                        <th>Unit Price (BTC)</th>
                        <th>Conversion Result</th>
                    </tr>
                    <tr>
                        <td>Litecoin</td>
                        <td>{this.props.litecoin ? this.convertRateToBitcoinPrice(this.props.litecoin) : ''}</td>
                        <td>{this.props.bitcoinAmount ? this.calculateTotalInBitcoin(this.props.litecoin) : ''}</td>
                    </tr>
                    <tr>
                        <td>Ethereum</td>
                        <td>{this.props.ethereum ? this.convertRateToBitcoinPrice(this.props.ethereum) : ''}</td>
                        <td>{this.props.bitcoinAmount ? this.calculateTotalInBitcoin(this.props.ethereum) : ''}</td>
                    </tr>
                    <tr>
                        <td>Dash</td>
                        <td>{this.props.dash ? this.convertRateToBitcoinPrice(this.props.dash) : ''}</td>
                        <td>{this.props.bitcoinAmount ? this.calculateTotalInBitcoin(this.props.dash) : ''}</td>
                    </tr>
                </tbody>
            </Table>
        )
    }
}

export default RatesTable;

