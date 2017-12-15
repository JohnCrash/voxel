import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import { LineChart } from 'react-d3';

/**
 * 
 */
class Sta1 extends Component{
    constructor(props){
        super(props);
    }
    
    render(){
        var lineData = [
            {
              name: "登录次数",
              values: [ { x: 0, y: 20 }, { x: 24, y: 30 } ],
              strokeWidth: 3,
              strokeColor:'#FF0000',
              strokeDashArray: "5,5",
            },
            {
              name: "登录人数",
              strokeWidth: 3,
              values: [ { x: 0, y: 2 },{ x: 10, y: 32 }, { x: 76, y: 82 } ]
            }
          ];        
        return <LineChart
        legend={true}
        data={lineData}
        width='100%'
        height={768}
        viewBoxObject={
         { x: 0,
          y: 0,
          width: 1024,
          height: 768
        }}
        title="日用户统计信息"
        yAxisLabel="人次"
        xAxisLabel="日期"
        gridHorizontal={true}
      />;
    }
};

export default Sta1;