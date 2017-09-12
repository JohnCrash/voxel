/**
 * 排行榜
 */
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
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
    open(blocks,method){
        this.setState({open: true,loading:true});
        let info = Global.appGetLevelInfo(this.props.level);   
        if(!info)return; 
        Global.passLevel(info.next);
        //commit
        postJson('/users/commit',
            {lv:info.next-1,
             lname:this.props.level,
             blocks,
             method},(json)=>{
            this.tops = json.tops.sort((a,b)=>{
                return a.blocks > b.blocks;
            });
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
            for(let i=0;i<this.tops.length;i++){
                tops.push(<TableRow selectable={false} selected={i==3}>
                    <TableRowColumn>{i+1}</TableRowColumn>
                    <TableRowColumn>{this.tops[i].blocks}</TableRowColumn>
                    <TableRowColumn>{this.tops[i].count}</TableRowColumn>
                </TableRow>);
            }
        }
        /*
        let title;
        if(typeof appGetLevelInfo !== 'undefined'){
            let info = appGetLevelInfo(level);
            title = info.name
        }*/
        return <Dialog
            actions={actions}
            open={open}
        >
            <h3>成功完成任务</h3>
            {loading?<CircularProgress />:
            <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>排名</TableHeaderColumn>
                        <TableHeaderColumn>使用的块数</TableHeaderColumn>
                        <TableHeaderColumn>使用该方法的人数</TableHeaderColumn>
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