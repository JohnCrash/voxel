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
class Sta6 extends Component{
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
      let b = {dd:14};
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
      let lastDD = -1;
      let curSubmit,curClick,curLogin;
      let lastDate;
      for(let i of au){
        let c = new Date(i.date);
        if(c.getDate()!==lastDD){
          if(lastDD!==-1){
            c.setMinutes(0);
            c.setHours(0);
            c.setSeconds(0);
            c.setMilliseconds(0);
            login.push({x:c,y:curLogin});
            submit.push({x:c,y:curSubmit});
            click.push({x:c,y:curClick});
          }
          lastDD = c.getDate();
          lastDate = c;
          curLogin = 0;
          curSubmit = 0;
          curClick = 0;
        }
        curLogin += i.login;
        curSubmit += i.submit;
        curClick += i.click;
      }
      console.log('================');
      console.log(login);
      console.log(submit);
      console.log(click);
      console.log('================');
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
        title="日活跃"
        yAxisLabel="人数"
        xAxisLabel="时间"
        gridHorizontal={true}
      />;
    }
};

export default Sta6;