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
    width : "16px"
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
    }
    show(){
        //MessageBox.showLoading('LOADING...');
        postJson('/users/crowns',{},(json)=>{
            //MessageBox.closeLoading();
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
        let tops = ranks.map((item,i)=>{
            return <TableRow selectable={false} key={i} style={item.ismy?HighLightStyle:{}}>
                <TableRowColumn  style={FixedWidthStyle}>
                    <b>{i+1}</b>
                    {i===0?<img src="scene/image/tops.png" style={{height:"32px",verticalAlign:"middle"}} />:undefined}
                </TableRowColumn>
                <TableRowColumn  style={FixedWidthStyle}>
                    <span style={{verticalAlign:"middle"}}>{item.count}×</span>
                    <img src="scene/image/crown.png" style={{height:"24px",verticalAlign:"middle"}} />
                </TableRowColumn>
                <TableRowColumn  style={FixedWidthStyle}>
                    {item.people}
                </TableRowColumn>
                <TableRowColumn  style={FixedWidthStyle}>
                    {item.cls?item.cls.map((it,i)=>{
                        return <Avatar src={`http://image-static.lejiaolexue.com/userlogo/${it.uid}_99.jpg`} />
                                {it.UserName};
                    }):undefined}
                </TableRowColumn>
            </TableRow>;
        });
        let topNode = <div onClick={this.handleOk}>
            <img style={{width:'100%'}} src={'scene/image/tops_title.png'}/>
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
        return open?<Dialog
                open={open}
                modal={false}
                autoScrollBodyContent={true}
                onRequestClose={this.handleOk}
                contentStyle={Global.getPlatfrom()!=="windows"?{width:"95%"}:undefined}>
                {body}
            </Dialog>:null;
    }
}

export default CrownTops;