import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Global} from './global';
import {MessageBox} from './ui/MessageBox';
import {fetchJson,postJson} from './vox/fetch';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import { cross } from 'gl-matrix/src/gl-matrix/vec2';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';

const HighLightStyle = {
    backgroundColor : "#b0e0e6"
};
const FixedWidthStyle = {
    width : "16px",
    textOverflow:'unset',
    overflow:'initial'
};
const FixedHeaderStyle = {
    fontSize : "normal",
    fontWeight:"bold",
    width : "16px",
    height : "24px",
    paddingTop : "0px",
    paddingBottom : "0px"
};

class CrownTops extends Component{
    constructor(props){
        super(props);
        this.state={
            open:false,
            body:null
        }
    }
    handleOk = (event)=>{
        this.setState({open:false});
        Global.pop();
        if(this.props.onClose)
            this.props.onClose(event);
    }
    show(){
        Global.push(this.handleOk);
        //MessageBox.showLoading('LOADING...');
        postJson('/users/crowns',{uid:Global.getUID()},(json)=>{
            //MessageBox.closeLoading();
            console.log(json);
            if(json.result==='ok'){
                this.calcTops(json.crowns);
            }else{
                this.setState({open:true,body:json.result});
            }
        })
    }
    calcTops(crowns){
        /**
         * crowns 
         * [
         *  {count,people}, 块数，和人数
         * ]
         */
        //计算排名
        let mycrown = Global.getLoginJson().crown;
        let ranks = [];

        if(!crowns){
            this.setState({open:true,body:'用户没有排行数据'});
            return;
        }
        /**
         * FIXBUG : 自己的皇冠数量不在排行榜中,这种情况往往是people=0导致的
         * 如论如何有自己的排名
         */
        for(let i=0;i<crowns.length;i++){
            let a = crowns[i];
            if(a.count === mycrown && a.people <= 0){
                a.people = 1;
                break;
            }
        }
        //=====================================
        for(let i=0;i<crowns.length;i++){
            let a = crowns[crowns.length-i-1];
            if(a.people>0){
                if(mycrown===a.count) //标记我在这个排名
                    a.ismy = true;
                ranks.push(a);
            }
        }
        //将同班同学的成绩标上,这包括自己
        let cls = Global.getLoginJson().cls;
        if(cls){
            for(let item of cls){
                let c = crowns[item.crown];
                if( c ){
                    c.cls = c.cls?c.cls:[];
                    c.cls.push(item);
                }
            }
        }
        let icon = [
            'rank_frist',
            'rank_second',
            'rank_third'
        ];
        let tops = ranks.map((item,i)=>{
            return <TableRow selectable={false} key={i} style={item.ismy?HighLightStyle:{}}>
                <TableRowColumn  style={FixedWidthStyle}>
                    {i>2?<b style={{marginLeft:'12px'}}>{i+1}</b>:undefined}
                    {i<3?<img src={Global.getCDNURL(`scene/image/${icon[i]}.png`)} style={{height:"32px",verticalAlign:"middle"}} />:undefined}
                </TableRowColumn>
                <TableRowColumn  style={FixedWidthStyle}>
                    <img src={Global.getCDNURL("scene/image/crown.png")} style={{height:"24px",verticalAlign:"middle"}} />
                    <span style={{verticalAlign:"middle"}}>×{item.count}</span>
                </TableRowColumn>
                <TableRowColumn  style={FixedWidthStyle}>
                    {item.people}
                </TableRowColumn>
                <TableRowColumn  style={FixedWidthStyle}>
                    {item.cls?item.cls.map((it,i)=>{
                        /**
                         * ios cache bug ,ios 浏览器会缓存图片
                         * Global.getRandom() 确保每次启动的随机数相同，避免重复加载
                         */          
                        let userlogo = `http://image-static.lejiaolexue.com/userlogo/${it?it.uid:0}_99.jpg?p=${Global.getRandom()}`;
                        return <div><Avatar src={userlogo}/></div>;
                    }):undefined}
                </TableRowColumn>
            </TableRow>;
        });
        let topNode = <div>
            <img style={{width:'100%'}} src={Global.getCDNURL('scene/image/tops_title.png')}/>
            <Table bodyStyle={{overflowX:"initial",overflowY:"initial"}}>
                <TableHeader style={{height:"24px"}} displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow style={{height:"24px"}}>
                        <TableHeaderColumn style={FixedHeaderStyle}>排名</TableHeaderColumn>
                        <TableHeaderColumn style={FixedHeaderStyle}>皇冠</TableHeaderColumn>
                        <TableHeaderColumn style={FixedHeaderStyle}>人数</TableHeaderColumn>
                        <TableHeaderColumn style={FixedHeaderStyle}>同学</TableHeaderColumn>
                    </TableRow>
                </TableHeader>            
                <TableBody displayRowCheckbox={false}>
                    {tops}
                </TableBody>
        </Table></div>;
        this.setState({open:true,body:topNode});
    }
    render(){
        let {open,body} = this.state;
        return <Dialog
                actions={<FlatButton
                    label="确定"
                    primary={true}
                    onClick={this.handleOk}
                    />}
                repositionOnUpdate={true}
                open={open}
                modal={true}
                autoScrollBodyContent={true}
                onRequestClose={this.handleOk}
                bodyStyle={{height:"100%"}}
                contentStyle={Global.getPlatfrom()!=="windows"?{width:"95%"}:undefined}>
                {body}
            </Dialog>;
    }
}

export default CrownTops;