/**
 * 排行榜
 */
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import LevelOf from './levelof';
import {postJson} from './vox/fetch';
import {Global} from './global';
import {TextManager} from './ui/textmanager';
import MarkdownElement from './ui/markdownelement';
import md from './mdtemplate';
import BlocklyInterface from './vox/blocklyinterface';
import Unlock from './unlock';

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
class Tops extends Component{
    constructor(props){
        super(props);
        this.state={
            open:false,
            loading:true,
        };
        this.initText();  
    }
    initText(){
        TextManager.load('scene/ui/Top_title.md',(iserr,text)=>{
            this.title = !iserr ? text : "";
        });
        TextManager.load('scene/ui/Top_content.md',(iserr,text)=>{
            this.content = !iserr ? text : "";
        });
        TextManager.load('scene/ui/Top_bottom.md',(iserr,text)=>{
            this.bottom = !iserr ? text : "";
        });
    }
    handleAction(result){
        BlocklyInterface.resume();
        this.setState({open: false});
        let info = Global.appGetLevelInfo(this.props.level);
        if(!info){
            console.log("Global.appGetLevelInfo return null! tops.js");
            //可能全部打通了
            location.href='#/main';
            return;
        }
        let p = {
            unlock_gold:info.next_unlock_gold,
            seg_begin:info.next_begin,
            seg_end:info.next_end,
            need_unlock:info.next_need_unlock
        };
        Global.pop();  
        switch(result){
            case 'exit':
                Global.popName('level');
                location.href='#/main';
                break;
            case 'agin':
                if(this._isagin)this._isagin();
                break;
            case 'next':
                Global.popName('level');
                if(p.need_unlock && info.nextName && info.next < info.closed && info.next < info.total){
                    this.unlock.open(p,(b)=>{
                        if(b){
                            this.gonext(info);
                        }else{
                            location.href='#/main';
                        }
                    });
                }else{
                    this.gonext(info);
                }
                break;
        }
    }
    gonext(info){
        //info.next < info.closed 全部做完
        if(info && info.nextName && info.next < info.closed && info.next < info.total){
            location.href=`#/level/${info.nextName}`;
        }else{//打通了全部
            //提示通关了
            TextManager.load('scene/ui/completed.md',(iserr,text)=>{
                if(iserr)
                    MessageBox.show("ok",undefined,<MarkdownElement text={text}/>,(result)=>{
                        location.href='#/main';
                    });
                else location.href='#/main';
            });            
            
        }
    }
    open(blocks,method,total,each,cb){
        this._isagin = cb;
        this.initText();
        this.setState({open: true,loading:true});
        Global.push(()=>{
            this.handleAction('agin');
        });
        let info = Global.appGetLevelInfo(this.props.level);   
        if(!info)return; 
        Global.passLevel(info.next);
        //commit
        this.blocks = blocks;
        BlocklyInterface.pause();
        postJson('/users/commit',
            {uid:Global.getUID(),
             lv:info.next-1,
             lname:this.props.level,
             blocks,
             total,
             each,
             method},(json)=>{
            if(json.tops){
                this.tops = json.tops.sort((a,b)=>{
                    return a.blocks > b.blocks;
                });
            }else{
                this.tops = [];
            }
            this.cls = json.cls||[];
            //console.log(json);
            this.setState({loading:false});
        });
    }
    componentDidMount(){
        this._clslvlistener = ()=>{
            this.forceUpdate();
        };
        Global.on('clslv',this._clslvlistener);        
    }
    componentWillUnmount(){
        Global.removeListener('clslv',this._clslvlistener);
    }    
    render(){
        let {level} = this.props;
        let {open,loading} = this.state;
        let actions = [
            <FlatButton
            label="退出"
            primary={true}
            onClick={this.handleAction.bind(this,'exit')}/>,            
            <FlatButton
            label="再玩一次"
            primary={true}
            onClick={this.handleAction.bind(this,'agin')}/>,
            <FlatButton
            label="下一关"
            primary={true}
            onClick={this.handleAction.bind(this,'next')}/>            
        ];
        let tops = [];
        let best_block_num = this.blocks;
        let rank = 6;
        if(!loading&&this.tops){
            let bcls = {};
            let uid = Global.getUID();
            /**
             * this.tops 是一个最多前5的块数排行榜，表明这种块数排多少名
             *  lname | lv | blocks | count(使用的次数)
             * this.cls 返回和玩家同班的玩家在这关的成绩表
             *  lname | lv | uid | cls | uname | blocks | try 
             */
            for(let i=0;i<this.cls.length;i++){
                if(this.cls[i].uname){
                    if(!bcls[this.cls[i].blocks])
                        bcls[this.cls[i].blocks] = [];
                    if(uid===this.cls[i].uid)
                        bcls[this.cls[i].blocks] = [this.cls[i],...bcls[this.cls[i].blocks]];
                    else{
                        bcls[this.cls[i].blocks].push(this.cls[i]);
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
            for(let i=0;i<this.tops.length;i++){
                if(this.tops[i].blocks < best_block_num){
                    best_block_num = this.tops[i].blocks;
                }
                if(this.tops[i].blocks===this.blocks){
                    rank = i+1;
                }
                //当前选择 selected={this.tops[i].blocks===this.blocks}
                tops.push(<TableRow selectable={false} key={"top"+i} style={this.tops[i].blocks===this.blocks?HighLightStyle:{}} >
                    <TableRowColumn  style={FixedWidthStyle}>{i+1}</TableRowColumn>
                    <TableRowColumn  style={FixedWidthStyle}><span style={{verticalAlign:"middle"}}>{this.tops[i].blocks}×</span><img src="media/title-beta.png" style={{height:"24px",verticalAlign:"middle"}} /></TableRowColumn>
                    <TableRowColumn  style={FixedWidthStyle}>{this.tops[i].count}</TableRowColumn>
                    <TableRowColumn style={{width:"320px"}}><div>{clsblockMap(this.tops[i].blocks)}</div></TableRowColumn>
                </TableRow>);
            }
        }
        //textOverflow : "unset"
        let dict = {
            level_name:level,
            best_block_num,
            block_num : this.blocks,
            rank,
            method_num : this.tops?this.tops.length:0,
        };

        return <div><Dialog
            actions={actions}
            open={open}
            autoScrollBodyContent={true}
            contentStyle={Global.getPlatfrom()!=="windows"?{width:"95%"}:undefined}>
            <MarkdownElement text={md(this.title,dict)}/>
            <MarkdownElement file={`scene/${level}-top.md`}/>
            {loading?<LinearProgress />:<Table bodyStyle={{overflowX:"initial",overflowY:"initial"}}>
                <TableHeader style={{height:"24px"}} displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow style={{height:"24px"}}>
                        <TableHeaderColumn style={FixedHeaderStyle}>排名</TableHeaderColumn>
                        <TableHeaderColumn style={FixedHeaderStyle}>块数</TableHeaderColumn>
                        <TableHeaderColumn style={FixedHeaderStyle}>人数</TableHeaderColumn>
                        <TableHeaderColumn style={FixedHeaderStyle2}>并列</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {tops}
                </TableBody>
            </Table>}
            <MarkdownElement text={md(this.content,dict)}/>
            <LevelOf level={level} other={ Global.getLoginJson()? Global.getLoginJson().cls:null} />
            <MarkdownElement text={md(this.bottom,dict)}/>
        </Dialog>
        <Unlock ref={ref=>this.unlock=ref} />
        </div>
    }
};

export default Tops;