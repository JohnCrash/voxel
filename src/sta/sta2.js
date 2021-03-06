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
class Sta2 extends Component{
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
      fetch('/users/stalv',{method:'POST',
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
      for(let o of stalv){
        if(typeof o.date === 'string'){
          let e = o.date.match(/(\d+)-(\d+)-(\d+).*/);
          if(e){
            let key = e[2]+'-'+e[3];
            m[key] = m[key] || [];
            if(o.lv===+o.lv && o.lv <= 60)
              m[key].push({x:o.lv,y:o.count});  
          }
        }
      }
      let data = [];
      for(let k in m){
        m[k].sort(function(a,b){return a.x-b.x});
        data.push({
          name : k,
          values : m[k],
          strokeWidth:1,
          strokeColor : '#FF00FF',
        });
      }
      this.setState({lineData:data});
    }
    colors(d){
      let mc = ['#0D47A1','#1565C0','#1976D2','#1E88E5','#2196F3','#42A5F5','#64B5F6','#90CAF9','#BBDEFB'];
      return mc[d] || '#FF5252';
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
        title="人数分布"
        yAxisLabel="人数"
        xAxisLabel="关卡"
        gridHorizontal={true}
      />;
    }
};

export default Sta2;