//var blockchain = require('blockchain.info')
//import Blockcy from 'blockcypher'




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
} from 'react-bootstrap';
import WalletList from './WalletList';


const mytoken = process.env.BLOCKCY_TOKEN;
class WalletForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wallets: {},
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.getValidationState = this.getValidationState.bind(this);
        this.createWallet = this.createWallet.bind(this);
        this.deleteWallet = this.deleteWallet.bind(this);
        this.addAddress = this.addAddress.bind(this);
    }

    componentDidMount() {
        this.loadWalletNames();
    }
    handleNameChange(e) {
        var newName = e.target.value
        this.setState((state, props) => {
            return { name: newName }
        });
    }

    loadWalletNames() {
        axios.get('https://api.blockcypher.com/v1/btc/main/wallets?token=' + mytoken)
            .then((d) => {
                console.log(d.data.wallet_names)
                this.loadWalletAddresses(d.data.wallet_names);
            })
            .catch(error => {
                console.log(error.response)
            });
    }

    loadWalletAddresses(names) {
        names.forEach((name => {
            axios.get('https://api.blockcypher.com/v1/btc/main/wallets/' + name + '/addresses?token=' + mytoken)
                .then((d) => {
                    console.log(d)
                    let walletsCopy = this.state.wallets
                    //got address for name in the wallet
                    walletsCopy[name] = d.data.addresses;
                    this.setState({ wallets: walletsCopy })
                })
                .catch(error => {
                    console.log(error.response)
                });
        }))

    }

    createWallet() {
        if (!this.state.name || this.state.name == '') {
            alert("name required");
        }
        if (this.state.name in this.state.wallets) {
            alert("this name already exists");
        }
        else {
            var data = { "name": this.state.name, "addresses": [] };
            axios.post('https://api.blockcypher.com/v1/btc/main/wallets?token=' + mytoken, JSON.stringify(data))
                .then(d => {
                    console.log(d)
                    if (d.status == 201) {
                        let walletsCopy = this.state.wallets
                        walletsCopy[this.state.name] = d.data.addresses
                        this.setState({
                            wallets: walletsCopy
                        })
                    }
                })
                .catch(error => {
                    console.log(error.response)
                });
        }

    }

    deleteWallet(name) {
        axios.delete("https://api.blockcypher.com/v1/btc/main/wallets/" + name + "?token=" + mytoken)
            .then(d => {
                console.log(d);
                let walletsCopy = this.state.wallets
                delete walletsCopy[name]
                this.setState({ wallets: walletsCopy });
            })
            .catch(error => {
                console.log(error.response)
            });
    }

    addAddress(name) {
        axios.post('https://api.blockcypher.com/v1/btc/main/wallets/' + name + '/addresses/generate?token=' + mytoken)
            .then((d) => {
                console.log(d)
                let walletsCopy = this.state.wallets
                //got address for name in the wallet
                walletsCopy[name] = d.data.addresses;
                this.setState({ wallets: walletsCopy })
            })
            .catch(error => {
                console.log(error.response)
            });
    }

    getValidationState() {
        //todo: cannot start with number
        if (!isNaN(this.state.name)) { return 'error' }
    }

    render() {
        return (
            <div>
                 <h2>My Wallet </h2>
          
                <Form horizontal>
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.getValidationState()}
                    >
                        <Col componentClass={ControlLabel} sm={2}>
                            Account Name
                      </Col>
                        <Col sm={6}>
                            <FormControl
                                type="text"
                                value={this.state.name}
                                placeholder="Name of wallet..."
                                onChange={this.handleNameChange}
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col smOffset={2} sm={8}>
                            <Button onClick={this.createWallet} >
                                Create Wallet
                    </Button>
                        </Col>
                    </FormGroup>
                </Form>
                <WalletList
                    wallets={this.state.wallets}
                    deleteWallet={this.deleteWallet}
                    addAddress={this.addAddress}
                />
                
            </div>
        );
    }
}

export default WalletForm;
