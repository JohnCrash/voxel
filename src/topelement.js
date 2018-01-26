import React, {Component} from 'react';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import {Global} from './global';
import {postJson} from './vox/fetch';

const HighLightStyle = {
    backgroundColor : "#b0e0e6"
}
const FixedWidthStyle = {
    width : "32px"
}
const FixedHeaderStyle = {
    fontSize : "normal",
    fontWeight:"bold",
    width : "32px",
    height : "24px",
    paddingTop : "0px",
    paddingBottom : "0px"
}
const FixedHeaderStyle2 = {
    fontSize : "normal",
    fontWeight:"bold",
    height : "24px",
    paddingTop : "0px",
    paddingBottom : "0px"
}

class TopElement extends Component{
    constructor(props){
        super(props);
        this.state = {
            topsElement : undefined
        };
        this.clsid = Global.getLoginJson().clsid;
    }
    componentDidMount(){
        this.fetchData(this.props.lv);
    }
    componentWillReceiveProps(nextProps){
        if(this.props.lv != nextProps.lv){
            this.fetchData(nextProps.lv);
        }
    }
    initUI(cls,tops){
        /**
         * tops 关卡lv的前5种方法[{blocks,count},...]
         * cls  班级中lv关卡的完成情况[{uid,blocks,uname},...]
         * blocks 我的成绩
         */
        tops = tops.sort((a,b)=>{
            return a.blocks - b.blocks;
        });
        let topsElement = [];
        let {blocks} = this.props;
        let best_block_num = blocks;
        let bcls = {};
        let uid = Global.getUID();
        let rank = 6;
        /**
         * this.tops 是一个最多前5的块数排行榜，表明这种块数排多少名
         *  lname | lv | blocks | count(使用的次数)
         * this.cls 返回和玩家同班的玩家在这关的成绩表
         *  lname | lv | uid | cls | uname | blocks | try 
         */
        for(let i=0;i<cls.length;i++){
            if(cls[i].uname){
                if(!bcls[cls[i].blocks])
                    bcls[cls[i].blocks] = [];
                if(uid===cls[i].uid)
                    bcls[cls[i].blocks] = [cls[i],...bcls[cls[i].blocks]];
                else{
                    bcls[cls[i].blocks].push(cls[i]);
                }
            }
        }
        function clsblockMap(b){
            if(bcls[b]){
                let i = 1;
                return bcls[b].map((stu)=>{
                    if(stu.uid===uid){
                        return <b key={i++}>{stu.uname}</b>
                    }else{
                        return <span key={i++}>{stu.uname}</span>
                    }
                });
            }
        }
        for(let i=0;i<tops.length;i++){
            if(tops[i].blocks < best_block_num){
                best_block_num = tops[i].blocks;
            }
            if(tops[i].blocks===blocks){
                rank = i+1;
            }
            //当前选择 selected={this.tops[i].blocks===this.blocks}
            topsElement.push(<TableRow selectable={false} key={"top"+i} style={tops[i].blocks===blocks?HighLightStyle:{}} >
                <TableRowColumn  style={FixedWidthStyle}>{i+1}</TableRowColumn>
                <TableRowColumn  style={FixedWidthStyle}><span style={{verticalAlign:"middle"}}>{tops[i].blocks}×</span><img src={Global.getCDNURL("media/title-beta.png")} style={{height:"24px",verticalAlign:"middle"}} /></TableRowColumn>
                <TableRowColumn  style={FixedWidthStyle}>{tops[i].count}</TableRowColumn>
                <TableRowColumn style={{width:"320px"}}><div>{clsblockMap(tops[i].blocks)}</div></TableRowColumn>
            </TableRow>);
        }
        this.setState({topsElement});
    }
    fetchData(lv){
        if(this.clsid!==0){
            postJson('/users/tops',{lv,cls:this.clsid},(json)=>{
                if(json.result==='ok' && json.cls && json.tops){
                    this.initUI(json.cls,json.tops);
                }
            });
        }
    }
    render(){
        return this.clsid!=0?<Table bodyStyle={{overflowX:"initial",overflowY:"initial"}}>
                <TableHeader style={{height:"24px"}} displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow style={{height:"24px"}}>
                        <TableHeaderColumn style={FixedHeaderStyle}>排名</TableHeaderColumn>
                        <TableHeaderColumn style={FixedHeaderStyle}>块数</TableHeaderColumn>
                        <TableHeaderColumn style={FixedHeaderStyle}>次数</TableHeaderColumn>
                        <TableHeaderColumn style={FixedHeaderStyle2}>并列</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {this.state.topsElement}
                </TableBody>
            </Table>:<span></span>;
    }
};

export default TopElement;