import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import { LineChart } from 'react-d3';
require("whatwg-fetch");
/**
 *         var lineData = [
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
 */
class Sta7 extends Component{
    constructor(props){
        super(props);
        this.state = {
           lineData : []
        };
    }
    
    componentDidMount(){
      /**
       * fetch sta weak
       *       mode: 'no-cors',
       * result:'ok',
       * stalv : [
       *  '0': {date : '2017-12-16',
       *  lv : 0,
       *  count : 99}
       * ]
       */
      let b = {dd:30};
      fetch('/users/staex',{method:'POST',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      body :JSON.stringify(b)})
      .then((response)=>{
        return response.json();
      })
      .then((json)=>{
        if(json && json.result==='ok'){
          this.initData(json.stalv);
        }
      }).catch(err=>{
          console.log(err);
      });  
    }
    componentWillUnmount(){

    }
    initData(staex){
      console.log("===========staex=============");
      console.log(staex);
      let first = [];
      let second = [];
      let third = [];
      for(let i of staex){
        let c = new Date(i.date);
        first.push({x:c,y:i.firstday*100/0.6});
        second.push({x:c,y:i.secondday*100/0.6});
        third.push({x:c,y:i.thirdday*100/0.6});
      }
      this.setState({lineData:[
          {name:'次日',values:first},
          {name:'2日',values:second},
          {name:'3日',values:third}]});
    }
    colors(d){
      switch(d){
        case 0:return '#FF0000';
        case 1:return '#00FF00';
        case 2:return '#0000FF';
      }
    }    
    render(){
        let {lineData} = this.state;

        return <LineChart
        legend={true}
        data={lineData}
        width='100%'
        height={768}
        colors={this.colors.bind(this)}
        viewBoxObject={
         { x: 0,
          y: 0,
          width: 1024,
          height: 768
        }}
        title="留存"
        yAxisLabel="百分率"
        xAxisLabel="日期"
        gridHorizontal={true}
      />;
    }
};

export default Sta7;