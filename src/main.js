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
import {TextManager} from './ui/textmanager';
import MarkdownElement from './ui/markdownelement';
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

let app;

/**
 * 全局函数为应用指定一个标题
 */
global.appTitle = function(t){
    app.appTitle(t);
}

/**
 * 当有加载界面时,加载界面提供这几个函数
 * closeLoadingUI 关闭加载界面
 * loadingProgressBar 进度条函数
 */
let root = document.getElementById('root');
if(window.closeLoadingUI)root.style.display="none";

function loadingBar(b){
    if(window.loadingProgressBar)loadingProgressBar(b);
}
function closeLoading(){
    if(window.closeLoadingUI){
        setTimeout(()=>{
            root.style.display="";
            closeLoadingUI();
        },200);
    }
}
/**
 * NAVTIVE 界面
 */
if(window.native){
    if(native.quit){
        native.onBack = function(){
            Global.callTop();
        }
        if(native.registerOnBack)
            native.registerOnBack(true);
        Global.push(()=>{
            MessageBox.show("okcancel","游戏退出","你确定要退出游戏吗？",(result)=>{
                if(result==='ok'){
                    native.quit();
                }
            },undefined,true);
        },true);
    }
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
        let {router} = this.props;
        let content = "未定义的页面";
        let s = router.split('#');
        console.log('Platfrom : '+Global.getPlatfrom());
        switch(s[0]){
            case '':
            case 'login':
                loadingBar(100);
                content = <Login />;
                break;            
            case 'main':
                closeLoading();
                content = [<AppBar key='mainbar' title={this.state.title} onLeftIconButtonTouchTap={this.onMenu.bind(this)}/>,
                            <Popover
                            open={this.state.openMenu}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            onRequestClose={this.handleRequestClose.bind(this)}>
                            <Menu>
                                <MenuItem primaryText="下载Windows版本"  onClick={this.onDownload.bind(this,'windows')}/>
                                <MenuItem primaryText="下载Android版本"  onClick={this.onDownload.bind(this,'android')}/>
                                <MenuItem primaryText="关卡调试"  onClick={this.onDebug.bind(this)} checked={this.state.isdebug}/>
                                <MenuItem primaryText={`登出(${Global.getUserName()})`} onClick={this.onLogout.bind(this)}/>
                            </Menu>
                        </Popover>,
                        <LevelSel key='levelselect' index='main' current={Global.getMaxPassLevel()} />];
                break;
            case 'setting':
                break;
            case 'level':
                closeLoading();
                Global.setLayout(window.innerWidth>window.innerHeight?"landscape":"portrait");
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
    ReactDOM.render(<App />,root);
}
  
  window.addEventListener('hashchange', render);
  render();