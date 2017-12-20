


import React, { Component } from 'react';

//purpose is to avoid nested loops in a render
class AddressList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
      var addresses = this.props.addressList? this.props.addressList.map((address)=>{
          return <li key={address}> {address} </li>
      }) : '';

    return (
        <ul>{addresses}</ul>
    );
  }
}

export default AddressList;

