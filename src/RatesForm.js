


import React, { Component } from 'react';


class RatesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  handleInputChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
        <form className="reactForm">
            <input type='text' onChange={this.handleInputChange.bind(this)}
                   value={this.props.amount} />
        </form>
    );
  }
}

export default RatesForm;

