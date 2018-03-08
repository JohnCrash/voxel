import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import LevelSel from './levelsel';
import Level from './level';
import {Global} from './global';
import {
    Redirect
  } from 'react-router-dom';
import MainDrawer from './drawer';
import FloatButton from './ui/floatbutton';
import CrownTops from './crowntops';
import MarkdownElement from './ui/MarkdownElement';
import {MessageBox} from './ui/MessageBox';
import {TextManager} from './ui/TextManager';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import {DotIcon} from "./ui/myicon";
import {postJson,fetchJson} from './vox/fetch';
import IconTimer from 'material-ui/svg-icons/image/timer';
import TipMenu from 'material-ui/svg-icons/action/lightbulb-outline';
import { setInterval, clearInterval } from 'timers';

console.info('Import Main...');

class Main extends Component{
    constructor(props){
        super(props);
        this.state = {
            title : '',
            anchorEl : null,
            isdebug : false,
            msgcount : 0,
            readmsg :[],
            cooldown : 0,
            coolv : 0
        }
        Global.regAppTitle((t)=>{
            this.appTitle(t);
        });
    }
    initLogin(){
        let json = Global.getLoginJson();
        if(json){
            let readmsg = json.readmsg || [];
            let message = json.message || [];
            this.setState({msgcount:message.length-readmsg.length,readmsg});    
        }
    }
    appTitle(t){
        this.setState({title:t});
    }
    componentDidMount(){
        document.title = "乐学编程";
        //出一个介绍对话栏
        /*
        if(!localStorage.guid0 && !Main.isshow)
        TextManager.load("scene/ui/guid0.md",(iserr,text)=>{
            if(!iserr)
                MessageBox.show('check',undefined,<MarkdownElement text={text}/>,
                (result)=>{
                    if(result==='noagain')localStorage.guid0 = true;
                    Main.isshow = true;
                });
        }); */
        //打开一个通知消息栏
        if(Global.getLoginJson()){
            let notice = Global.getLoginJson().notice;
            let text;
            try{
                function colorBoldText(t,c){
                    return t.replace(/^\*\*(.*)\*\*(.*)/,($0,$1,$2)=>{
                        return `<font color=${c}>${$1}</font>${$2}`;
                    });
                }
                notice = JSON.parse(notice);
                text = '<div id="rootnode" style="display:flex;justify-content:center"> <div id="secend" style="text-align:left;">';
                for(let msg of notice.msg){
                    text+=`<img src="scene/image/beyond${msg.type}.png" width=32 style="vertical-align:middle"/>`;
                    text += colorBoldText(msg.msg,'#1E90FF');
                    text += '</br>';
                }
                text += '</div></div>';
            }catch(e){}
            if(notice&&text){
                Global.getLoginJson().notice = null;
                MessageBox.show('ok-center',undefined,<MarkdownElement text={text}/>,
                (result)=>{});
            }
        }

        this.initLogin();  
        Global.lvtips((json)=>{
            if(json.result==='ok'){
                /**
                 * 这里如果还在时间解锁中点击购买，这时cooldown还在有但是tipbit已经设置
                 * 因此这里根据tipcd和tipbit做出判断
                 */
                let unlocked = json.tipcd===+json.tipcd && json.tipbit&(1<<json.tipcd);
                if(unlocked && json.cooldown>0){ //还在计时但是已经解锁了
                    json.lv = 0;
                }else if(json.cooldown>0){
                    this._id = setInterval(()=>{
                        json.cooldown--;
                        this.setState({cooldown:json.cooldown,coolv:json.lv});
                    },1000);
                }else if(localStorage.coolv===String(json.lv)){
                    json.lv = 0; //关闭tips提示
                }
                this.setState({
                    cooldown:json.cooldown,
                    coolv :json.lv
                });
            }
        });        
    }
    handleTipsClick(){
        let {cooldown,coolv} = this.state;
        if(coolv && localStorage.coolv!==String(coolv)){
            if(cooldown<=0)
                localStorage.coolv=String(coolv);
            location.href=`#/level/${Global.levelToLeveName(coolv)}/true`;//eslint-disable-line
        }
    }
    componentWillUnmount(){
        if(this._id){
            clearInterval(this._id);
            this._id = null;
        }
    }
    onMenu(event){
        event.preventDefault();
        this.drawer.open(true);
    }
    onTops=(event)=>{
        this.crowntops.show();
        if(Global.getPlatfrom()==='ios')
            this.levelSel.enableScroll(false); //关闭
    }
    handleCloseTops=(event)=>{
        if(Global.getPlatfrom()==='ios')
            this.levelSel.enableScroll(true); //打开
    }
    render(){
        if(Global.getMaxPassLevel()===null){
            return <Redirect to='/login' />;
        }
        //ios关闭滚动
        let appbarStyle = Global.getPlatfrom()==='ios'?{position:"fixed"}:undefined;
        let cls;
        try{
            cls = Number(Global.getLoginJson().clsid);
        }catch(e){
            cls = 0;
        }
        let lvideo;
        if(this.props.location && this.props.location.pathname){
            let m = this.props.location.pathname.match(/\/main\/(\d*)/);
            if(m && m[1]){
                lvideo = m[1];
            }
        }
        let {readmsg,msgcount,cooldown,coolv} = this.state;
        let message = Global.getLoginJson().message || [];
        let menuitems = message.map((item,index)=>{
            let isreaded = readmsg.includes(item.id);
            return <MenuItem key={index} rightIcon={isreaded?undefined:<DotIcon />}
                style={{color:isreaded?'gray':'dodgerblue',fontWeight:'bold'}} 
                primaryText={item.title}
                onClick={()=>{
                    if(!isreaded){
                        readmsg.push(item.id);
                        postJson('/users/readmsg',{readed:item.id,uid:Global.getUID()},(json)=>{});
                        this.setState({readmsg,msgcount:msgcount-1})
                    }
                    TextManager.load(item.msgmd,(iserr,text)=>{
                        if(!iserr)
                            MessageBox.show('ok',undefined,<MarkdownElement text={text}/>,(result)=>{});
                    });                    
                }}/>;
        });
        return <div><AppBar 
            title={this.state.title}
            style={appbarStyle}
            onLeftIconButtonTouchTap={this.onMenu.bind(this)}/>
            <MainDrawer key='mydrawer' loc='main' ref={ref=>this.drawer=ref}/>
        <LevelSel key='levelselect' index='main' current={Global.getMaxPassLevel()} 
            other={Global.getLoginJson()? Global.getLoginJson().cls:null} 
            lvs={Global.getLoginJson()? Global.getLoginJson().lvs:null} 
            lvideo={lvideo}
            unlock={Global.getMaxUnlockLevel()}
            ref={r=>{this.levelSel=r}}/>
        <div style={{position:'fixed',display:'flex',alignItems:'center',
            top:'16px',right:'16px',zIndex:1100,fontSize:'x-large',color:'white'}}>
            <span onClick={this.onTops}>{Global.getCrowns()}×</span>
            <FloatButton src={Global.getCDNURL('scene/image/crown.png')} onClick={this.onTops} style={{width:'36px'}}/>
            {message.length>0?<IconMenu
                ref={(ref)=>{this.msgbox = ref;}}
                iconButtonElement={<FloatButton src={Global.getCDNURL('scene/image/message.png')} style={{width:'36px',marginLeft:'16px',marginRight:'8px'}}/>}
                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                >
                {menuitems}
            </IconMenu>:undefined}
            {message.length>0&&msgcount>0?<div style={{pointerEvents:'none',position:'absolute',top:'-6px',right:'-6px',width:'24px',height:'24px',borderRadius:'12px',background:'red',fontSize:'18px',fontWeight:'bold',textAlign:'center'}}>{this.state.msgcount}</div>:undefined}
        </div>
        <CrownTops ref={r=>this.crowntops = r} onClose={this.handleCloseTops}/>
        {coolv?<div style={{position:'fixed',display:'flex',top:'72px',right:'6px',zIndex:1100,alignItems:'center',
                    width:'128px',height:'48px',background:cooldown<=0?'green':'red',borderRadius:'6px'}} onClick={this.handleTipsClick.bind(this)}>
            {cooldown<=0?<TipMenu color='white' style={{width:'36px',height:'36px'}}/>:<IconTimer color='white' style={{width:'36px',height:'36px'}}/>}
            <div style={{color:'white',fontWeight:'bold',textAlign:'center'}}><span>{cooldown<=0?'提示':'提示解锁中'}</span><br/><span>{cooldown<=0?'已解锁':Global.timeString(cooldown)}</span></div>
        </div>:undefined}
        </div>;
        /**
         * FixBug : iOS有一个触摸事件穿透问题，上面打开对话CrownTops滑动手指，会滚动LevelSel
         * 这里针对iOS做特殊处理
         */
    }
};

export default Main;