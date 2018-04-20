import React,{Component} from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { LineChart } from 'react-d3';
import EChart from './echart';

export const GOLD_QUERY = gql`
query{
     incomeDistribLv{
        lv,
        gold
    }   
}
`;

export default graphql(GOLD_QUERY,{options: { variables: { day: 30 } }})((props)=>{
    let {data} = props;
    if (data.loading) {
        return <div>Loading</div>;
    }
    if (data.error) {
        return <h1>ERROR {data.error.toString()}</h1>;
    }
    const { incomeDistribLv } = data;
    return <EChart width='100%' height={768} options={{
            title:{text:'提示金币收入分布'},
            xAxis:{
                data:incomeDistribLv.map(item=>{return item.lv})
            },
            yAxis:{
                splitLine: {
                    show: false
                }
            },
            tooltip: {
                trigger: 'axis'
            },            
            series: {
                type: 'bar',
                data: incomeDistribLv.map(item=>{return item.gold})
            }
        }}/>;
});