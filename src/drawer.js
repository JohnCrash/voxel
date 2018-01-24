/*global Blockly,Interpreter,VConsole*/
import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import IconHome from 'material-ui/svg-icons/action/home';
import HelpIcon from 'material-ui/svg-icons/action/help';
//import IconMusic from 'material-ui/svg-icons/image/music-note';
//import IconAudio from 'material-ui/svg-icons/image/audiotrack';
//import IconLang from 'material-ui/svg-icons/action/language';
import IconDebug from 'material-ui/svg-icons/action/bug-report';
import IconAbout from 'material-ui/svg-icons/action/face';
import IconTips from 'material-ui/svg-icons/communication/live-help';
import {Global} from './global';
import BlocklyInterface from './vox/blocklyinterface';
import {MessageBox} from './ui/MessageBox';
import {TextManager} from './ui/TextManager';
import MarkdownElement from './ui/MarkdownElement';
import {postJson,fetchJson} from './vox/fetch';
import LevelDebug from './leveldebug';
import PropTypes from 'prop-types';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import { setTimeout } from 'timers';
import {TeamIcon,TipsIcon} from './ui/myicon';

const ToggleStyle = {marginTop: 16,marginBottom: 16,marginLeft:16,width:"85%"};
const SpanStyle = {marginTop: 16,marginLeft:16,marginRight:8};
const RadioStyle = {marginBottom: 16,marginLeft:32,marginRight:8};
const BlodStyle = {fontWeight:'bold'};
const RadioStyle2 = {marginTop:'6px',marginBottom:'6px'};

function GrayBlock(){
    return <div style={{width:'100%',height:'24px',backgroundColor:'gainsboro'}}>
    </div>;
}
class MainDrawer extends Component{
    constructor(props){
        super(props);
        this.state = {
            openMenu:false,
            music:Global.isMusic(),
            sound:Global.isSound(),
            lang:Global.getCurrentLang()!=="zh",
            landscape:Global.getLayout()==="landscape",
            blocklytoolbox:Global.getPlatfrom()==='windows'?Global.getBlocklyToolbar():"close",
            isdebug : Global.isDebug(),
            openDebug : false,
            uistyle : Global.getUIStyle()
        };
        this.motifyConfig = false;
        this.debugClick = 0;
    }
    onReturnMain(){
        console.log('exit..');
        //保存当前操作为草稿
        let level = Global.getCurrentLevelComponent();
        if(level)level.saveTrash();

        Global.popName('level');
        Global.pop();
        if(this.motifyConfig){
            this.motifyConfig = false;
            Global.pushConfig();
        }
        if(this.props.loc==="game"){
            location.href='#/main';//eslint-disable-line
        }else{
            //...
            //退出游戏
        }
    }
    handleClose(open){
        Global.pop();
        BlocklyInterface.resume();
        this.setState({openMenu:open});
        if(this.motifyConfig){
            this.motifyConfig = false;
            Global.pushConfig();
        }
    }
    open(b){
        //可能有blockly菜单
        if(Global.closeBlocklyMenu){
            try{
                Global.closeBlocklyMenu();
            }catch(e){console.error(e);}
        }

        Global.push(()=>{
            this.handleClose(false);
        });
        BlocklyInterface.pause();
        this.setState({openMenu:b,
            music:Global.isMusic(),
            sound:Global.isSound(),
            lang:Global.getCurrentLang()!=="zh",
            landscape:Global.getLayout()==="landscape",
            uistyle : Global.getUIStyle(),
            isdebug : Global.isDebug()});        
    }
    onDownload(s){
        switch(s){
            case 'windows':
            TextManager.load('scene/ui/download_windows.md',(iserr,text)=>{
                MessageBox.show('okcancel',undefined,<MarkdownElement text={text}/>,(result)=>{
                    if(result==='ok')
                        location.href = 'http://60.205.177.108:3000/html5_windows.zip';//eslint-disable-line
                });                
            });
            break;
            case 'android':
            TextManager.load('scene/ui/download_android.md',(iserr,text)=>{
                MessageBox.show('okcancel',undefined,<MarkdownElement text={text}/>,(result)=>{
                    if(result==='ok')
                        location.href = 'http://60.205.177.108:3000/html5_android.apk';//eslint-disable-line
                });                
            });
            break;
        }
    }    
    onDebug(){
        Global.setDebugMode(!Global.isDebug());
        this.setState({isdebug:Global.isDebug()});
        this.motifyConfig = true;
    }    
    onLogout(){
        postJson('/users/logout',{},(json)=>{
            if(json.result==='ok'){
                location.href = '#login';//eslint-disable-line
            }
        });
    }    
    onLevelDebug(){
        this.levelDbg.open((result)=>{
            if(result==='ok')
                this.forceUpdate();
        })
    }
    onHelp = (event)=>{
        this.setState({openMenu:false});
        TextManager.load("scene/ui/help.md",(iserr,text)=>{
            MessageBox.show('ok',undefined,<MarkdownElement text={text}/>,(result)=>{
                console.log(result);
            });
        });
    }
    onAbout = (event)=>{
        this.setState({openMenu:false});
        TextManager.load("scene/ui/about.md",(iserr,text)=>{
            MessageBox.show('ok',undefined,<MarkdownElement text={text}/>,(result)=>{
                console.log(result);
            });
            setTimeout(()=>{
                window.dispatchEvent(new Event('resize'));
            },100);
            setTimeout(()=>{
                let img = document.getElementById('me');
                if(img){
                    window.dispatchEvent(new Event('resize'));
                    img.onclick = this.handleOpenDebug.bind(this);
                }
            },1000);
        });        
    }
    handleOpenDebug=(event)=>{
        if(this.debugClick===0){
            setTimeout(()=>{
                if(this.debugClick>3){
                    if(localStorage.isdebug!=='true'){
                        localStorage.isdebug = true;
                        if(!window.vConsole){
                            window.vConsole = new VConsole();
                        }
                        window.vConsole.show();
                    }else{
                        localStorage.isdebug = false;
                        if(window.vConsole){
                            window.vConsole.destroy();
                            window.vConsole = null;
                        }
                    }
                    this.setState({openDebug:!this.state.openDebug});
                }
                this.debugClick = 0;
            },600);
        }
        this.debugClick++;
    }
    onTip = (event)=>{
        this.setState({openMenu:false});
        Global.openLevelTips('drawer');
    }
    SkinChange = (event,value)=>{
        this.motifyConfig = true;
        Global.setBlocklySkin(value);
    }
   render(){
        let {music,sound,lang,uistyle,openMenu,landscape,blocklytoolbox,openDebug} = this.state;
        let {loc} = this.props;
        let DebugItem = window.LOCALHOST?[
                <hr key='drawerhr' />,
                <Toggle key='drawerlayout' label="使用竖屏" style={ToggleStyle} defaultToggled={!landscape} onToggle={(e,b)=>{
                    this.setState({landscape:!b});
                    this.motifyConfig = true;
                    Global.setLayout(!b?"landscape":"portrait");
                }} />,
                <Toggle key='drawertoolbar' label="Blockly紧凑工具条" style={ToggleStyle} defaultToggled={blocklytoolbox!=="expand"} onToggle={(e,b)=>{
                    this.setState({blocklytoolbox:b?"close":"expand"});
                    this.motifyConfig = true;
                    Global.setBlocklyToolbar(b?"close":"expand");
                }} />,
                <MenuItem key='downloadwindows' primaryText="下载Windows版本"  onClick={this.onDownload.bind(this,'windows')}/>,
                <MenuItem key='downloadandroid' primaryText="下载Android版本"  onClick={this.onDownload.bind(this,'android')}/>,
                <MenuItem key='drawerleveldebug' primaryText="关卡调试界面"  onClick={this.onLevelDebug.bind(this)} />,  
                <MenuItem key='drawerdebug' primaryText="关卡调试"  onClick={this.onDebug.bind(this)} checked={this.state.isdebug}/>,
                <MenuItem key='drawerlogout' primaryText={`登出(${Global.getUserName()})`} onClick={this.onLogout.bind(this)}/> 
            ]:[];

        return <div><Drawer 
            docked={false} 
            open={openMenu} 
            disableSwipeToOpen={true}
            onRequestChange={this.handleClose.bind(this)}>
            <MenuItem primaryText={loc==="game"?"返回选择关卡":"退出游戏"} style={{marginBottom:0,fontWeight:'bold'}} leftIcon={<IconHome /> } onClick={
                    (event)=>{
                        if(loc==="game")
                            this.onReturnMain();
                        else{
                            if(this.motifyConfig){
                                this.motifyConfig = false;
                                Global.pushConfig();
                            }                            
                            if(window.ljAppObject)
                                window.ljAppObject.back();
                        }
                    }
                } />
            <GrayBlock />
            <Toggle label={'背景音乐'} style={ToggleStyle} defaultToggled={music} onToggle={(e,b)=>{
                this.setState({music:b});
                this.motifyConfig = true;
                Global.muteMusic(b);
            }} />
            <Toggle label={'游戏音效'} style={ToggleStyle} defaultToggled={sound} onToggle={(e,b)=>{
                this.setState({sound:b});
                this.motifyConfig = true;
                Global.muteSound(b);
            }} />
            <Toggle label={'英语编程'} style={ToggleStyle} defaultToggled={lang} onToggle={(e,b)=>{
                this.setState({lang:b});
                this.motifyConfig = true;
                Global.setCurrentLang(b?"en":"zh");
            }} />
            <Toggle label={'精简界面'} style={ToggleStyle} defaultToggled={uistyle==='simple'} onToggle={(e,b)=>{
                this.setState({uistyle:b?"simple":"features"});
                this.motifyConfig = true;
                Global.setUIStyle(b?"simple":"features");
            }} />
            <GrayBlock />
            <div style={{marginTop:'16px'}}><span style={SpanStyle}><b>编程块样式</b></span></div>
            <RadioButtonGroup style={RadioStyle}
                name="BlockSkin" defaultSelected={Global.getBlocklySkin()} labelPosition="left" onChange={this.SkinChange}>
                <RadioButton
                    value="Scratch"
                    label="多彩"
                    style={RadioStyle2}
                />
                <RadioButton
                    value="MakeBlock"
                    label="绚丽"
                    style={RadioStyle2}
                />
                <RadioButton
                    value="Black"
                    label="黑色"
                    style={RadioStyle2}
                />
            </RadioButtonGroup>
            <GrayBlock />
            {this.props.loc==="game"?<MenuItem primaryText="任务提示" leftIcon={<TipsIcon />} style={BlodStyle} onClick={this.onTip}/>:undefined}
            <MenuItem primaryText="操作帮助" leftIcon={<HelpIcon />} style={BlodStyle} onClick={this.onHelp}/> 
            <MenuItem primaryText="制作团队" leftIcon={<TeamIcon />} style={BlodStyle} onClick={this.onAbout}/> 
            <div style={{margin:16}}>版本:{Global.version}</div> 
            {openDebug?<MenuItem primaryText="DEBUG..." leftIcon={<IconDebug />} onClick={(event)=>{
                window.location = `http://192.168.2.83:3001/#/login/${Global.getUID()}/${Global.getUserName()}/${Global.getCookie()}`
            }}/>:undefined}
            {DebugItem}
        </Drawer>
        <LevelDebug ref={ref=>this.levelDbg=ref} />
        </div>;
    }
}
MainDrawer.defaultProps = {
    loc : 'game'
};
MainDrawer.propTypes = {
    loc : PropTypes.string
};
export default MainDrawer;