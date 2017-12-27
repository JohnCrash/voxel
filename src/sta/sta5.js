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
class Sta5 extends Component{
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
      let b = {dd:7};
      fetch('/users/stalau',{method:'POST',
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
    /**
     * au
     * {
     *  date    : 日期
     *  login   : 登录
     *  submit  : 提交
     *  click   : 点击数量
     *  slogin  : 不重复登录
     *  ssubmit : 不重复提交
     *  type    : 0小时，1天
     * }
     */
    initData(au){
      let m = {};
      let login = [];
      let submit = [];
      let click = [];
      console.log("===========au=============");
      console.log(au);
      for(let i of au){
        login.push({x:new Date(i.date),y:i.login});
      }
      for(let i of au){
        submit.push({x:new Date(i.date),y:i.submit});
      }
      for(let i of au){
        click.push({x:new Date(i.date),y:i.click});
      }            
      this.setState({lineData:[
          {name:'登录',values:login},
          {name:'提交',values:submit},
          {name:'点击',values:click}]});
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
        title="7日活跃"
        yAxisLabel="人数"
        xAxisLabel="时间"
        gridHorizontal={true}
      />;
    }
};

export default Sta5;