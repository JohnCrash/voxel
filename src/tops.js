/**
 * 排行榜
 */
import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import LevelOf from './ui/levelof';

class Tops extends Component{
    constructor(props){
        super(props);
        this.state={
            open:false
        };
    }
    handleAction(result){
        this.setState({open: false});
        switch(result){
            case 'exit':
                location.href='#main';
                break;
            case 'agin':
                break;
            case 'next':
                if(typeof appGetLevelInfo !== 'undefined'){
                    let info = appGetLevelInfo(this.props.level);
                    if(info && info.nextName){
                        location.href=`#level#${info.nextName}`;
                    }else{//打通了全部
                        location.href='#main';
                    }
                }else{
                    location.href='#main';
                }
                break;
        }
    }
    open(){
        this.setState({open: true});
    }
    render(){
        let {level} = this.props;
        let {open} = this.state;

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
        /*
        for(let i=0;i<10;i++){
            tops.push(<TableRow selectable={false} selected={i==3}>
                <TableRowColumn>{i+1}</TableRowColumn>
                <TableRowColumn>John Smith</TableRowColumn>
                <TableRowColumn>Employed</TableRowColumn>
            </TableRow>);
        }*/
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
            <LevelOf level={level}/>
            {/*
            <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>排名</TableHeaderColumn>
                        <TableHeaderColumn>使用的块数</TableHeaderColumn>
                        <TableHeaderColumn>使用该方法的人</TableHeaderColumn>
                    </TableRow>                    
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {tops}
                </TableBody>
            </Table>*/}
        </Dialog>
    }
};

export default Tops;