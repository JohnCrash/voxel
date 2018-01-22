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
           total : 0,
           haslv : 0,
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
          console.log('=============');
          console.log(json);
          console.log('=============');
          this.initData(json.stalv,json.haslv[0].hasLV,json.total[0].allUser);
        }
      }).catch(err=>{
          console.log(err);
      });  
    }
    componentWillUnmount(){

    }
    initData(stalv,haslv,total){
      let m = {};
      console.log(stalv);
      for(let o of stalv){
        if(typeof o.date === 'string'){
          let e = o.date.match(/(\d+)-(\d+)-(\d+).*/);
          if(e){
            let key = e[2]+'-'+e[3];
            m[key] = m[key] || [];
            if(o.lv===+o.lv && o.lv <= 60){
              if(o.lv === 0 )o.count = 0;
              m[key].push({x:o.lv,y:o.count});
            }  
          }
        }
      }
      console.log(m);
      let data = [];
      for(let k in m){
        if(m[k] && m[k].length>0){
          m[k].sort(function(a,b){return a.x-b.x});
          data.push({
            name : k,
            values : m[k]
          });  
        }
      }
      console.log(data);
      data.reverse();
      console.log(data);
      this.setState({lineData:data,haslv,total});
    }
    colors(d){
      let mc = ['#0D47A1','#1565C0','#1976D2','#1E88E5','#2196F3','#42A5F5','#64B5F6','#90CAF9','#BBDEFB'];
      return mc[d] || '#FF5252';
    }    
    render(){
        let {lineData,haslv,total} = this.state;

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
        title={`人数分布 (有关卡/总人数) = ${haslv}/${total}`}
        yAxisLabel="人数"
        xAxisLabel="关卡"
        gridHorizontal={true}
      />;
    }
};

export default Sta1;