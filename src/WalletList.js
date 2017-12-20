
import React, { Component } from 'react';
import axios from 'axios';
import {
    Button,
    FormControl,
    Col,
    Row,
    Grid,
    Panel
} from 'react-bootstrap'
import AddressList from './AddressList';

class WalletList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        var wallets = Object.keys(this.props.wallets).map((name) => {
            return <Panel key={name} header={name}>
                <AddressList addressList={this.props.wallets[name]} />
                <Button onClick={() => this.props.addAddress(name)}>Add address</Button>
                <Button onClick={() => this.props.deleteWallet(name)}>Delete Wallet</Button>
            </Panel>
        })
        return (
            <div>
                <Row>
                    <Col sm={8}>
                        {wallets}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default WalletList;
