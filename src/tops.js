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

class Tops extends Component{
    constructor(props){
        super(props);
        this.state={
            open:false,
            loading:true,
        };
    }
    handleAction(result){
        this.setState({open: false});
        let info = Global.appGetLevelInfo(this.props.level);
        if(!info)return;

        switch(result){
            case 'exit':
                location.href='#main#'+info.next;
                break;
            case 'agin':
                if(this._isagin)this._isagin();
                break;
            case 'next':
                if(info.nextName){
                    location.href=`#level#${info.nextName}`;
                }else{//打通了全部
                    location.href='#main#'+info.next;
                }
                break;
        }
    }
    open(blocks,method,total,each,cb){
        this._isagin = cb;
        this.setState({open: true,loading:true});
        let info = Global.appGetLevelInfo(this.props.level);   
        if(!info)return; 
        Global.passLevel(info.next);
        //commit
        this.blocks = blocks;
        postJson('/users/commit',
            {lv:info.next-1,
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
                tops.push(<TableRow selectable={false} selected={this.tops[i].blocks===this.blocks} key={"top"+i}>
                    <TableRowColumn>{i+1}</TableRowColumn>
                    <TableRowColumn><span style={{verticalAlign:"top"}}>{this.tops[i].blocks}×</span><img src="media/title-beta.png" height="22px" /></TableRowColumn>
                    <TableRowColumn>{this.tops[i].count}</TableRowColumn>
                    <TableRowColumn>{clsblock(this.tops[i].blocks)}</TableRowColumn>
                </TableRow>);
            }
        }

        return <Dialog
            actions={actions}
            open={open}
        >
            <h3>成功完成任务</h3>
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
            <LevelOf level={level}/>
        </Dialog>
    }
};

export default Tops;