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

console.info('Import Main...');
class Main extends Component{
    constructor(props){
        super(props);
        this.state = {
            title : '',
            anchorEl : null,
            isdebug : false
        }
        Global.regAppTitle((t)=>{
            this.appTitle(t);
        });
    }
    appTitle(t){
        this.setState({title:t});
    }
    componentDidMount(){
        document.title = "乐学编程";
        //出一个介绍对话栏
        if(!localStorage.guid0 && !Main.isshow)
        TextManager.load("scene/ui/guid0.md",(iserr,text)=>{
            if(!iserr)
                MessageBox.show('check',undefined,<MarkdownElement text={text}/>,
                (result)=>{
                    if(result==='noagain')localStorage.guid0 = true;
                    Main.isshow = true;
                });
        });    
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
        {cls!==0?<FloatButton src={'scene/image/tops.png'} onClick={this.onTops} style={{width:'36px',zIndex:'1500'}}/>:undefined}
        <CrownTops ref={r=>this.crowntops = r} onClose={this.handleCloseTops}/>
        </div>;
        /**
         * FixBug : iOS有一个触摸事件穿透问题，上面打开对话CrownTops滑动手指，会滚动LevelSel
         * 这里针对iOS做特殊处理
         */
    }
};

export default Main;