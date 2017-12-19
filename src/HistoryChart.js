import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


class HistoryChart extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    if (!this.props.data) { return <div></div> }

    return (
      <div>
        <h3>Historical Trend</h3>
        <LineChart width={600} height={300} data={this.props.data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="time"
          />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="LTC" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="ETH" stroke="#82ca9d" />
          <Line type="monotone" dataKey="DASH" stroke="#83da0f" />
        </LineChart>
      </div>
    );
  }
}

export default HistoryChart;
