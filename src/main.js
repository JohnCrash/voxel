import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import LevelSel from './levelsel';
import Level from './level';
import {Global} from './global';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {MessageBox} from './ui/messagebox';
import {postJson,fetchJson} from './vox/fetch';
import {TextManager} from './ui/textmanager';
import MarkdownElement from './ui/markdownelement';
import {
    Redirect
  } from 'react-router-dom';
import LevelDebug from './leveldebug';

let app;
/**
 * 全局函数为应用指定一个标题
 */
global.appTitle = function(t){
    app.appTitle(t);
}

class Main extends Component{
    constructor(props){
        super(props);
        this.state = {
            title : '',
            openMenu : false,
            anchorEl : null,
            isdebug : false,
        }
        app = this;
    }
    appTitle(t){
        this.setState({title:t});
    }
    componentDidMount(){
        document.title = "学编程";
    }
    onMenu(event){
        event.preventDefault();
        
        this.setState({
            openMenu: true,
            isdebug : Global.isDebug(),
            anchorEl: event.currentTarget,
        });
    }
    handleRequestClose(){
        this.setState({
            openMenu: false,
        });
    }
    onLogout(){
        postJson('/users/logout',{},(json)=>{
            if(json.result==='ok'){
                location.href = '#login';
            }
        });
        this.handleRequestClose();
    }
    onDebug(){
        Global.setDebugMode(!Global.isDebug());
        this.handleRequestClose();
        Global.pushConfig();
    }
    onLevelDebug(){
        this.levelDbg.open((result)=>{
            if(result==='ok')
                this.forceUpdate();
        })
    }
    onDownload(s){
        this.handleRequestClose();
        switch(s){
            case 'windows':
            TextManager.load('scene/ui/download_windows.md',(iserr,text)=>{
                MessageBox.show('okcancel',undefined,<MarkdownElement text={text}/>,(result)=>{
                    if(result==='ok')
                        location.href = 'http://60.205.177.108:3000/html5_windows.zip';
                });                
            });
            break;
            case 'android':
            TextManager.load('scene/ui/download_android.md',(iserr,text)=>{
                MessageBox.show('okcancel',undefined,<MarkdownElement text={text}/>,(result)=>{
                    if(result==='ok')
                        location.href = 'http://60.205.177.108:3000/html5_android.apk';
                });                
            });
            break;
        }
    }
    render(){
        if(Global.getMaxPassLevel()===null){
            return <Redirect to='/login' />;
        }
        return <div><AppBar key='mainbar' title={this.state.title} onLeftIconButtonTouchTap={this.onMenu.bind(this)}/>
            <Popover
            open={this.state.openMenu}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose.bind(this)}>
            <Menu>
                <MenuItem primaryText="下载Windows版本"  onClick={this.onDownload.bind(this,'windows')}/>
                <MenuItem primaryText="下载Android版本"  onClick={this.onDownload.bind(this,'android')}/>
                <MenuItem primaryText="关卡调试界面"  onClick={this.onLevelDebug.bind(this)} />
                <MenuItem primaryText="关卡调试"  onClick={this.onDebug.bind(this)} checked={this.state.isdebug}/>
                <MenuItem primaryText={`登出(${Global.getUserName()})`} onClick={this.onLogout.bind(this)}/>
            </Menu>
        </Popover>
        <LevelSel key='levelselect' index='main' current={Global.getMaxPassLevel()} unlock={Global.getMaxUnlockLevel()}/>
        <LevelDebug ref={ref=>this.levelDbg=ref} />
        </div>;
    }
};

export default Main;