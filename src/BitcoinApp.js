



import React, { Component } from 'react';
import ExchangeRate from './ExchangeRate';
import WalletForm from './WalletForm';
import {
 
  Col,
  Row,
  Grid
} from 'react-bootstrap';

class BitcoinApp extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col sm={10}>
              <ExchangeRate />
            </Col>
          </Row>
          <Row>
            <Col sm={10}>
              <WalletForm />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default BitcoinApp;

