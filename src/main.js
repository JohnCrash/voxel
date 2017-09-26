import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import LevelSel from './levelsel';
import Level from './level';
import {Global} from './global';
import Login from './login';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {MessageBox} from './ui/messagebox';
import {postJson,fetchJson} from './vox/fetch';
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
    onDownload(s){
        switch(s){
            case 'windows':
            location.href = 'http://60.205.177.108:3000/html5_windows.zip';
            break;
            case 'android':
            location.href = 'http://60.205.177.108:3000/html5_android.zip';
            break;
        }
    }
    render(){
        let {router} = this.props;
        let content = "未定义的页面";
        let s = router.split('#');
        console.log('Platfrom : '+Global.getPlatfrom());
        switch(s[0]){
            case '':
            case 'login':
                content = <Login />;
                break;            
            case 'main':
                content = [<AppBar key='mainbar' title={this.state.title} onLeftIconButtonTouchTap={this.onMenu.bind(this)}/>,
                            <Popover
                            open={this.state.openMenu}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            onRequestClose={this.handleRequestClose.bind(this)}>
                            <Menu>
                                <MenuItem primaryText="下载Windows版本"  onClick={this.onDownload.bind(this,'windows')} checked={this.state.isdebug}/>
                                <MenuItem primaryText="下载Android版本"  onClick={this.onDownload.bind(this,'android')} checked={this.state.isdebug}/>
                                <MenuItem primaryText="关卡调试"  onClick={this.onDebug.bind(this)} checked={this.state.isdebug}/>
                                <MenuItem primaryText={`登出(${Global.getUserName()})`} onClick={this.onLogout.bind(this)}/>
                            </Menu>
                        </Popover>,
                        <LevelSel key='levelselect' index='main' current={Global.getMaxPassLevel()} />];
                break;
            case 'setting':
                break;
            case 'level':
                content = <Level level={s[1]}/>;
                break;
            default:
                break;
        }
        return <div>{content}</div>;
    }
};

function App(){
    let route = window.location.hash.substr(1);
    console.log(`ruter "${route}"`);
    return <MuiThemeProvider>
        <div>
            <Main router={route}/>
            <MessageBox/>
        </div>
    </MuiThemeProvider>;
}

function render(){
    ReactDOM.render(<App />,document.getElementById('root'));
  }
  
  window.addEventListener('hashchange', render);
  render();