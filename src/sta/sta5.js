import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import { LineChart } from 'react-d3';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import EChart from './echart';

export const QUERY = gql`
  query ActiveUserOfDay($day:Int){
    dau(lastday:$day){
      date,
      login,
      submit,
      click,
      slogin,
      ssubmit
    }
  }
`;
export default graphql(QUERY,{options: { variables: { day: 7 } }})((props)=>{
  let {data} = props;
  if (data.loading) {
      return <div>Loading</div>;
  }
  if (data.error) {
      return <h1>ERROR {data.error.toString()}</h1>;
  }
  const {dau} = data;
  return <EChart width='100%' height={768} options={{
      title:{text:`日活跃`},
      xAxis:{
          data:dau.map(item=>{return item.date})
      },
      yAxis:{
          splitLine: {
              show: false
          }
      },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
          data:['登录','提交','点击']
      },            
      series: [{
          name: '登录',
          type: 'line',
          data: dau.map(item=>{return item.login})
      },
      {
          name: '提交',
          type: 'line',
          data: dau.map(item=>{return item.submit})
      },        
      {
          name: '点击',
          type: 'line',
          data: dau.map(item=>{return item.click})
      }]
  }}/>;
});