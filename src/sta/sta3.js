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
class Sta1 extends Component{
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
      fetch('/users/stalvt',{method:'POST',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      body :''})
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
    initData(stalv){
      let m = {};
      console.log(stalv);
      for(let o of stalv){
        if(typeof o.date === 'string'){
          let e = o.date.match(/(\d+)-(\d+)-(\d+).*/);
          if(e){
            let key = e[2]+'-'+e[3];
            m[key] = m[key] || [];
            if(o.lv===+o.lv && o.lv <= 60 && o.avg){
              m[key].push({x:o.lv,y:o.avg/1000});
            }  
          }
        }
      }
      console.log(m);
      let data = [];
      for(let k in m){
        if(m[k] && m[k].length>0){
          data.push({
            name : k,
            values : m[k]
          });  
        }
      }
      console.log(data);
      data.reverse();
      console.log(data);
      this.setState({lineData:data});
    }
    render(){
        let {lineData} = this.state;

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
        title="人数分布"
        yAxisLabel="人数"
        xAxisLabel="关卡"
        gridHorizontal={true}
      />;
    }
};

export default Sta1;