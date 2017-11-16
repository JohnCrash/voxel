import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import IconHome from 'material-ui/svg-icons/action/home';
import HelpIcon from 'material-ui/svg-icons/action/help';
import {Global} from './global';
import BlocklyInterface from './vox/blocklyinterface';
import {MessageBox} from './ui/messagebox';
import {TextManager} from './ui/textmanager';
import MarkdownElement from './ui/markdownelement';
import {postJson,fetchJson} from './vox/fetch';
import LevelDebug from './leveldebug';
import PropTypes from 'prop-types';

const ToggleStyle = {marginBottom: 16,marginLeft:16,width:"85%"};

class MainDrawer extends Component{
    constructor(props){
        super(props);
        this.state = {
            openMenu:false,
            music:false,
            sound:false,
            lang:false,
            landscape:Global.getLayout()==="landscape",
            blocklytoolbox:Global.getPlatfrom()==='windows'?Global.getBlocklyToolbar():"close",
            isdebug : Global.isDebug()
        };
        this.motifyConfig = false;
    }
    onReturnMain(){
        console.log('exit..');
        Global.popName('level');
        Global.pop();
        if(this.motifyConfig){
            this.motifyConfig = false;
            Global.pushConfig();
        }
        if(this.props.loc==="game"){
            location.href='#/main';
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
        Global.push(()=>{
            this.handleClose(false);
        });
        BlocklyInterface.pause();
        this.setState({openMenu:b,
            music:Global.isMusic(),
            sound:Global.isSound(),
            lang:Global.getCurrentLang()!=="zh",
            landscape:Global.getLayout()==="landscape",
            isdebug : Global.isDebug()});        
    }
    onDownload(s){
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
    onDebug(){
        Global.setDebugMode(!Global.isDebug());
        this.setState({isdebug:Global.isDebug()});
        this.motifyConfig = true;
    }    
    onLogout(){
        postJson('/users/logout',{},(json)=>{
            if(json.result==='ok'){
                location.href = '#login';
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
        let f = "scene/ui/help.md";
        TextManager.load(f,()=>{
            MessageBox.show('ok',undefined,<MarkdownElement file={f}/>,(result)=>{
                console.log(result);
            });
        });
    }
   render(){
        let {music,sound,lang,openMenu,landscape,blocklytoolbox} = this.state;
        let {loc} = this.props;
        let DebugItem = Global.isDebug()?[
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
        return <div><Drawer docked={false} open={openMenu} onRequestChange={this.handleClose.bind(this)}>
            <MenuItem primaryText={loc==="game"?"返回选择关卡":"退出游戏"} style={{marginBottom:32}} leftIcon={<IconHome /> } onClick={this.onReturnMain.bind(this)} />
            <Toggle label="背影音乐" style={ToggleStyle} defaultToggled={music} onToggle={(e,b)=>{
                this.setState({music:b});
                this.motifyConfig = true;
                Global.muteMusic(b);
            }} />
            <Toggle label="音效" style={ToggleStyle} defaultToggled={sound} onToggle={(e,b)=>{
                this.setState({sound:b});
                this.motifyConfig = true;
                Global.muteSound(b);
            }} />
            <Toggle label="使用英语" style={ToggleStyle} defaultToggled={lang} onToggle={(e,b)=>{
                this.setState({lang:b});
                this.motifyConfig = true;
                Global.setCurrentLang(b?"en":"zh");
            }} />   
            <MenuItem primaryText="帮助..." leftIcon={<HelpIcon />} onClick={this.onHelp}/> 
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