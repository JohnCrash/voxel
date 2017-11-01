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
        switch(result){
            case 'exit':
                //location.href='/main/'+info.next;
                location.href='#/main';
                break;
            case 'agin':
                if(this._isagin)this._isagin();
                break;
            case 'next':
                if(p.need_unlock){
                    this.unlock.open(p,(b)=>{
                        if(b){
                            this.gonext(info.nextName,info);
                        }else{
                            location.href='#/main';
                        }
                    });
                }else{
                    this.gonext(info.nextName,info);
                }
                break;
        }
    }
    gonext(nextName){
        //info.next < info.closed 全部做完
        if(nextName && info.next < info.closed){
            location.href=`#/level/${nextName}`;
        }else{//打通了全部
            location.href='#/main';
        }
    }
    open(blocks,method,total,each,cb){
        this._isagin = cb;
        this.initText();
        this.setState({open: true,loading:true});
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
            console.log(json);
            this.setState({loading:false});
        });
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
            for(let i=0;i<this.cls.length;i++){
                if(this.cls[i].uname){
                    if(bcls[this.cls[i].blocks]){
                        bcls[this.cls[i].blocks] += ",";
                    }else{
                        bcls[this.cls[i].blocks] = "";
                    }
                    bcls[this.cls[i].blocks] += this.cls[i].uname;
                }
            }
            function clsblock(b){
                if(bcls[b])return bcls[b];
            }
            for(let i=0;i<this.tops.length;i++){
                if(this.tops[i].blocks < best_block_num){
                    best_block_num = this.tops[i].blocks;
                }
                if(this.tops[i].blocks===this.blocks){
                    rank = i+1;
                }
                tops.push(<TableRow selectable={false} selected={this.tops[i].blocks===this.blocks} key={"top"+i}>
                    <TableRowColumn>{i+1}</TableRowColumn>
                    <TableRowColumn><span style={{verticalAlign:"top"}}>{this.tops[i].blocks}×</span><img src="media/title-beta.png" height="22px" /></TableRowColumn>
                    <TableRowColumn>{this.tops[i].count}</TableRowColumn>
                    <TableRowColumn>{clsblock(this.tops[i].blocks)}</TableRowColumn>
                </TableRow>);
            }
        }
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
            {loading?<LinearProgress />:
            <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>排名</TableHeaderColumn>
                        <TableHeaderColumn>块数</TableHeaderColumn>
                        <TableHeaderColumn>人数</TableHeaderColumn>
                        <TableHeaderColumn>使用者</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {tops}
                </TableBody>
            </Table>}
            <MarkdownElement text={md(this.content,dict)}/>
            <LevelOf level={level}/>
            <MarkdownElement text={md(this.bottom,dict)}/>
        </Dialog>
        <Unlock ref={ref=>this.unlock=ref} />
        </div>
    }
};

export default Tops;