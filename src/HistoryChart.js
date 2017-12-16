import React, { Component } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const data = [
  {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
  {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
  {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
  {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
  {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
  {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
  {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

class HistoryChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }
  loadDataFromServer() {
    axios.get(this.props.url)
      .then(res=> {
        let data = this.cleanData(res.data);
        this.setState({ data: data });
        console.log(this.state.data);
      })
  }
  
  cleanData(rawData) {
    //clean for fields currency, price, time
    //should probably limit scale
    let cleanHistoryData = [];
    rawData.forEach((tickerItem)=> {
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
  componentDidMount() {
    this.loadDataFromServer()
  };
  formatTime(secs) {
    console.log(secs)
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    var datetext = t.toTimeString();
    return datetext.split(' ')[0];
  }

  render() {
    if (!this.state.data) { return <p> "Loading..." </p>}
  
    return (
      <LineChart width={600} height={300} data={this.state.data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis 
          dataKey="time" 
          />
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="LTC" stroke="#8884d8" activeDot={{r: 8}}/>
       <Line type="monotone" dataKey="ETH" stroke="#82ca9d" />
       <Line type="monotone" dataKey="DASH" stroke="#83da0f" />
      </LineChart>
     
    );
  }
}

export default HistoryChart;
