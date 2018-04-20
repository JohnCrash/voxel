import React,{Component} from 'react';
import { graphql,Query } from 'react-apollo';
import gql from 'graphql-tag';
import { LineChart } from 'react-d3';
import EChart from './echart';

export const GOLD_QUERY = gql`
  query IncomeGold($day:Int){
    income(lastday:$day){
        total,
        income{
            date,
            unlock,
            tips
        }
    }
  }
`;
//Query 不能正常工作
/*
const GoldQuery = ({day}) => (
    <Query query={GOLD_QUERY}
        render={result=>{
            if (result.loading) {
                return <div>Loading</div>;
            }
            if (result.error) {
                return <h1>ERROR</h1>;
            }
            return <div>good</div>;
        }}
    />
);
export default ()=>{
    return <GoldQuery day={30} />;
};
*/

export default graphql(GOLD_QUERY,{options: { variables: { day: 30 } }})((props)=>{
    let {data} = props;
    if (data.loading) {
        return <div>Loading</div>;
    }
    if (data.error) {
        return <h1>ERROR {data.error.toString()}</h1>;
    }
    const {income} = data;
    return <EChart width='100%' height={768} options={{
        title:{text:`总收入(${income.total})`},
        xAxis:{
            data:income.income.map(item=>{return item.date})
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
            data:['提示收入','解锁收入','总收入']
        },            
        series: [{
            name: '提示收入',
            type: 'line',
            data: income.income.map(item=>{return item.unlock})
        },
        {
            name: '解锁收入',
            type: 'line',
            data: income.income.map(item=>{return item.tips})
        },        
        {
            name: '总收入',
            type: 'line',
            data: income.income.map(item=>{return item.tips+item.unlock})
        }]
    }}/>;
});