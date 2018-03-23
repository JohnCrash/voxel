import React, {Component} from 'react';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import VoxView from './voxview';
import BlockView from './blockview';
import IconButton from 'material-ui/IconButton';
import MarkdownElement from './ui/MarkdownElement';
import {MessageBox} from './ui/MessageBox';
import {IconPlayArrow,IconPause,IconReplay,IconRotateLeft,IconRotateRight,IconHelp,IconStep} from './ui/myicon';
//import IconPlayArrow from 'material-ui/svg-icons/av/play-arrow';
//import IconPause from 'material-ui/svg-icons/av/pause';
//import IconReplay from 'material-ui/svg-icons/av/replay';
//import IconRotateLeft from 'material-ui/svg-icons/image/rotate-left';
//import IconRotateRight from 'material-ui/svg-icons/image/rotate-right';
import IconMenu from 'material-ui/svg-icons/navigation/menu';
import TipMenu from 'material-ui/svg-icons/action/lightbulb-outline';
import ContentCut from 'material-ui/svg-icons/content/content-cut';
//import IconStep from 'material-ui/svg-icons/maps/directions-walk';
//import IconHelp from 'material-ui/svg-icons/action/help';
import AddTest from 'material-ui/svg-icons/content/add';
import RemoveTest from 'material-ui/svg-icons/content/remove';
import BlocklyInterface from './vox/blocklyinterface';
import {ScriptManager} from './vox/scriptmanager';
import {TextManager} from './ui/TextManager';
import {ItemTemplate} from './vox/itemtemplate';
import {fetchJson,postJson} from './vox/fetch';
import {Global} from './global';
import Tops from './tops';
import {
    Redirect
  } from 'react-router-dom';
import MainDrawer from "./drawer";
import PropTypes from 'prop-types';
import { setTimeout } from 'timers';
import md from './mdtemplate';
import Unlock from './unlock';
import TopElement from './topelement';
import RaisedButton from 'material-ui/RaisedButton';
import Tips from './tips';
import Mgr from './mgr';
import Confetti from 'react-confetti';

console.info('Import Level...');
/*global Blockly*/
const redIcon = {color:"#F44336"};

function parserXML(id,text){
    let result;
    let regx = new RegExp(`<xml\\s+id="${id}">([^]*?)<\/xml>`,"g");
    let regx2 = new RegExp(`^<xml id="${id}">([^]*)<\/xml>$`);
    text.replace(regx,(a,t)=>{result = a});
    if(result)
        return result.replace(regx2,(a,b)=>{
            return b;
        });
}

const LOADING = 'loading';
const READY = 'ready';
const ERROR = 'error';

const playNormalStyle = {width:"70px",height:"70px",padding:"12px"};
const playIconNormalStyle = {width:"36px",height:"36px",color:"#F44336"};
const playLargStyle = {width:"76px",height:"76px",padding:"12px"};
const playIconLargStyle = {width:"42px",height:"42px",color:"#F44336"};

class Level extends Component{
    constructor(props){
        super(props);
        BlocklyInterface.setCurrentLevel(this);
        //让工具条根据屏幕的宽度来自己觉得是否展开
        let toolboxMode;
        if(window.innerWidth < 500){//展开模式
            toolboxMode = 'close'; 
        }else{
            toolboxMode = 'expand'; //工具条精简模式
        }
        this._isrunning = false;
        this.state={
            playPause:true,
            levelDesc:'',
            curSelectTest:-1,
            openTops:true,
            isDebug:Global.isDebug(),
            landscape:Global.getLayout()==="landscape",
            blocklytoolbox:toolboxMode, //展开blockly工具条
            switchSize:false,
            uiStyle:Global.getUIStyle(),
            uiColor:'#000000',
            confetti:false,
            numberOfPieces:100
        }
    }
    componentDidMount(){
        Global.setCurrentLevelComponent(this);
        this.onGameStart(this.props);
        Global._immLayout = ((layout)=>{
            this.setState({landscape:layout==="landscape"});
        }).bind(this);
        Global._immBlocklytoolbox = ((b)=>{
            this.setState({blocklytoolbox:Global.getPlatfrom()==='windows'?b:"close"});
        }).bind(this);
        Global._immDebug = ((b)=>{
            this.setState({isDebug:b});
        }).bind(this);        
    }
    componentWillUnmount(){
        Global.setCurrentLevelComponent(null);
        Global._immLayout = null;
        Global._immBlocklytoolbox = null;
        Global._immDebug = null;
    }
    setUIStyle(s){
        this.setState({uiStyle:s});
    }
    setUIColor(c){
        this.setState({uiColor:c});
    }
    Menu(event){
        event.stopPropagation();
        this.drawer.open(true);
    }
    Reset(event){
        if(this._ready === LOADING)
            return;
        if(event)event.stopPropagation();
        if(Global.isDebug()){
            //重新加载全部资源
            ItemTemplate.reset();
            TextManager.reset();
            ScriptManager.reset();
        }
        this._isrunning = false;
        this._isgameover = false;
        this.voxview.reset();
        this.blockview.reset();
        this.setState({playPause:true,confetti:false});
    }
    RotationRight(event){
        if(event)event.stopPropagation();
        this.voxview.RotationRight();
    }
    RotationLeft(event){
        if(event)event.stopPropagation();
        this.voxview.RotationLeft();
    }
    /**
     * 当游戏失败时
     */
    onGameOver(event){
        let md;
        let now = Date.now();
        let lj = Global.levelJson();
        this._isgameover = true;
        switch(event){
            case 'OutOfBounds':
            case 'Dead':
                md = 'scene/ui/gameover.md';
                this._isrunning = false;
                this.needReset = true;
                this.setState({playPause:true});
                Global.playSound(lj.failSound);
                break;
            case 'MissionCompleted':
                //如果有指南这里需要先处理指南
                //指南提示
                this._isrunning = false;
                this.needReset = true;
                console.log(`FPS : ${Global.getVoxFPS()}`);
                this.setState({
                    playPause:true,
                    confetti:true, //打开彩带
                    numberOfPieces:Global.getVoxFPS()*2
                });
                Global.playSound(lj.successSound);
                BlocklyInterface.pause();
                setTimeout(()=>{
                    if(this.isPlayAgin()){
                        this.commitAgin();
                    }else{
                        this.blockview.openGuid(6,()=>{//GUID_SUCCESS
                            this.Tops.open(this.blockview.getBlockCount(),
                            this.blockview.toXML(),now-this.btms,now-this.btpms,
                            ()=>{this.Reset();});
                            this.btpms = now;    
                        });    
                    }
                },2500);

                return;
            case 'WrongAction':
                md = 'scene/ui/wrongaction.md';
                this._isrunning = false;
                this.needReset = true;
                this.setState({playPause:true});
                Global.playSound(lj.wrongSound);
                break;
            case 'FallDead':
                md = 'scene/ui/falldead.md';
                this._isrunning = false;
                this.needReset = true;
                this.setState({playPause:true});
                Global.playSound(lj.fallDeadSound);
                break;
        }
        this.btpms = now;
        TextManager.load(md,(iserr,text)=>{
            MessageBox.show('ok',undefined,<MarkdownElement text={text}/>,(result)=>{
                this.Reset();
            });    
        });
    }
    isPlayAgin(){
        let name = this.props.level;
        let info = Global.appGetLevelInfo(name);
        return (name!=='L1-1' && info && info.next-1 < Global.getMaxPassLevel());
    }
    PlayPause(event){
        event.stopPropagation();
        if(this._ready!==READY)return;
        
        if(this.needReset){
            this.Reset();
            this.needReset = false;
        }
        if(this.state.playPause){
            if(!this._isrunning){
                this.voxview.readyPromise.then(()=>{
                    this._isrunning = true;
                    this._isgameover = false;
                    this.blockview.run(10,(state)=>{//执行完成
                        if(state === 'end'||state === 'error'||state==='nolink'){
                            this._isrunning = false;
                            if(state === 'error'){
                                MessageBox.show('ok',undefined,<MarkdownElement file={'scene/ui/program_error.md'}/>,(result)=>{});
                            }else if(state === 'nolink'){
                                MessageBox.show('ok',undefined,<MarkdownElement file={'scene/ui/link_error.md'}/>,(result)=>{});
                            }else if(state==='end'){
                                //FIXBUG : 程序已经结束(需要结束声音)，但是宝箱还未打开。
                                //简单的解决方案，等一秒钟如果还没成功就播放
                                setTimeout(()=>{
                                    if(!this._isgameover)
                                        Global.playSound(Global.levelJson().failSound);
                                },1000);
                            }
                            this.setState({playPause:true});
                            this.needReset = true;
                        }
                    });
                });
                this.setState({playPause:!this.state.playPause});
            }
        }else{
            if(this._isrunning){
                this._isrunning = false;
                this.Reset();    
                this.setState({playPause:!this.state.playPause});
            }
        }
    }
    Step(event){
        event.stopPropagation();
        if(this._ready!==READY)return;

        if(this.needReset || this.blockview.needReset){
            this.Reset();
            this.needReset = false;
        }
        this.blockview.setEndCB((state)=>{
            if(state === 'end'||state === 'error'){
                if(state==='end'){
                    Global.playSound(Global.levelJson().failSound);
                }
                this.needReset = true;
            }
            if(state === 'error'){
                MessageBox.show('ok',undefined,<MarkdownElement file={'scene/ui/program_error.md'}/>,(result)=>{});
            }            
        });
        this.voxview.readyPromise.then(()=>{
            this.blockview.step();
        });
    }
    saveTrash(prop){
        try{
            let props = prop?prop:this.props;
            let info = Global.appGetLevelInfo(props.level);
            if(info && info.next-1 === Global.getMaxPassLevel() && this.blockview){
                if(this.blockview.getBlockCount() !== this.blockview.getBeginBlockCount())
                    Global.setTrash(info.next-1,this.blockview.toXML());
            }
        }catch(e){
            console.log(e);
        }
    }
    onGameStart(props){
        if(!this.voxview)return;
        this._isrunning = false;
        this._isgameover = false;
        //加载voxview的时候uiColor必须为白色
        this.setState({uiColor:'#FFFFFF',confetti:false});
        /**
         * 统计第一关的平均用时
         */
        let info = Global.appGetLevelInfo(props.level);
        if(info)
            postJson('/users/levelplaytime',{uid:Global.getUID(),lv:info.next-1,action:'enter'},(result)=>{});

        Global.push(()=>{
            MessageBox.show("okcancel","游戏退出","你确定要返回主界面吗？",(result)=>{
                if(result==='ok'){
                    //保存当前操作为草稿
                    this.saveTrash(props);
                    if(info)
                        postJson('/users/levelplaytime',{uid:Global.getUID(),lv:info.next-1,action:'exit'},(result)=>{});
                    Global.popName('level');
                    location.href='#/main'; //eslint-disable-line
                }
            });
        },'level');

        this._ready = LOADING;
//        MessageBox.showLoading('正在加载请稍后...');
        
        this.loadLastCommitMethod(props.level);
        this.loadTest(props.level);

        this.btms = Date.now();
        this.btpms = this.btms;

        console.info("==============onGameStart================");
        setTimeout(()=>{ //10秒后如果缓慢加载出来，就重新加载.
            console.info("onGameStart timeout");
            try{
                if(this._ready !== READY){
                    console.info("==>RE onGameStart...");
                    if(this.voxview && this.blockview){
                        this.voxview.load(props.level);
                        this.blockview.load(`scene/${props.level}.toolbox`);
                        this.onGameStart(props);
                    }else{
                        console.error('==> voxview blockview = null');
                    }
                }    
            }catch(e){
                console.error(e);   
            }
        },10*1000);
        if(this.voxview.readyPromise){
            this.voxview.readyPromise.then(()=>{
                TextManager.load(`scene/${props.level}.md`,(iserr,text)=>{
                    //如果voxview ready
                    if(this.voxview)
                    this.voxview.readyPromise.then(()=>{
                        this._ready = READY;

                        /**
                         * 取得关卡段,加载完成使用关卡指定的颜色
                         */
                        if(window.innerWidth<window.innerHeight){
                            //portrait
                            let info = Global.appGetLevelInfo(props.level);
                            if(info ){
                                this.setState({uiColor:info.uicolor?info.uicolor:'#000000'});
                            }else this.setState({uiColor:'#FFFF00'});
                        }

    //                    MessageBox.closeLoading();
                        setTimeout(()=>{
                            //MessageBox.show('ok',undefined,<MarkdownElement text={text}/>,(result)=>{
                            //    console.log(result);
                            //});    
                            this.Help();
                        },200);
                    });
                });
            }).catch((err)=>{
                this._ready = ERROR;
            });
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.level!=this.props.level){
            this.onGameStart(nextProps);
            this.setState({playPause:true,landscape:Global.getLayout()==="landscape"});         
        }
    }
    //如果是一个已经通关的关卡，这里加载以前自己提交的最好玩法
    loadLastCommitMethod(name){
        let info = Global.appGetLevelInfo(name);
        if(this.isPlayAgin()){
            //加载本关方法
            let json = {
                uid:Global.getUID(),
                lname:name
            };
            let _this = this;
            let load = (method)=>{
                if(_this.voxview.readyPromise){
                    _this.voxview.readyPromise.then(()=>{
                        if(_this.blockview){
                            _this.blockview.loadXML(method);
                        }
                    }).catch((e)=>{
                        console.error(e);
                    });
                }else setTimeout(load,100);
            };
            postJson(`/users/levelmethod`,json,(json)=>{
                if(json.result==='ok' && json.method){//成功
                    load(json.method);
                }else{//失败
                    console.error(json.result);
                }
            });
        }else if(info && info.next-1===Global.getMaxPassLevel()){
            let method = Global.getTrash(Global.getMaxPassLevel());
            if(method && this.voxview.readyPromise){
                this.voxview.readyPromise.then(()=>{
                    if(this.blockview)
                        this.blockview.loadXML(method);
                }).catch((e)=>{
                    console.error(e);
                });
            }
        }
    }
    loadTest(name){
        if(!Global.isDebug())return;
        console.log('LOADTEST '+name);
        fetchJson(`scene/test/${name}.json`,(json)=>{
            this.testXML = [];
            let text = json.workspace;
            for(let i=0;i<100;i++){
                let it = parserXML(`${i}`,text);
                if(it)
                    this.testXML.push(it);
                else break;
            }
            this.forceUpdate();
            if(this.testXML.length>0&&this.testXML[0]){
                if(this.blockview.readyPromise){
                    this.blockview.readyPromise.then(()=>{
                        if(this.blockview){
                            this.blockview.loadXML(this.testXML[0]);
                        }
                        this.setState({curSelectTest:0});
                    }).catch((e)=>{
                        console.error(e);
                    });
                }
            }
        },(err)=>{
            this.testXML = [];
            this.setState({curSelectTest:-1});
            console.log(err);
        });
    }
    SaveTest(){
        let i = 0;
        let file = this.testXML.map(xml=>`<xml id="${i++}">\n${xml}\n</xml>`).join('\n');
        let json = {
            workspace:file
        };
        postJson(`/save?file=scene/test/${this.props.level}.json`,json,(json)=>{
            if(json.result==='ok'){//成功
                console.log('add workspace xml success');
            }else{//失败
                window.alert(json.result);
            }
        });
    }
    AddTest(){
        let xml = this.blockview.toXML();
        this.testXML = this.testXML || [];
        this.testXML.push(xml);
        this.SaveTest();
        this.setState({curSelectTest:this.testXML.length-1});
    }
    RemoveTest(){
        if(this.testXML&&this.testXML[this.state.curSelectTest]){
            this.testXML.splice(this.state.curSelectTest,1);
            let i = this.state.curSelectTest-1;
            if(this.testXML[i]){
                this.blockview.loadXML(this.testXML[i]);
                this.setState({curSelectTest:i});
            }else{
                this.blockview.initWorkspace();
                this.setState({curSelectTest:-1});
            }
            this.SaveTest();
        }
    }
    handleTestChange(event,index,value){
        if(this.testXML[index]){
            this.blockview.loadXML(this.testXML[index]);
            this.setState({curSelectTest:index});
        }
    }
    onBlockCount(count){
        if(this.blockcount)
            this.blockcount.innerText = `${count}×`;
    }
    Help(from,event){
        if(event)event.stopPropagation();
        if(this.props.opentips && !from && !event){
            this.Tips();
            return;
        }
        /**
         * 如果是第一个就是一个指南关卡
         */
        if(this.props.level==='L1-1'){
            /* //帮助提示
            TextManager.load(`scene/ui/help.md`,()=>{
                MessageBox.show('help',undefined,[<MarkdownElement file={`scene/ui/help.md`}/>,
                    <MarkdownElement file={`scene/${this.props.level}.md`}/>],(result)=>{
                    console.log(result);
                });
            }); */
            TextManager.load('scene/ui/guid.md',(iserr,text)=>{
                this.title = !iserr ? text : "";
                MessageBox.show('',undefined,[<MarkdownElement text={text}/>],(result)=>{
                    setTimeout(()=>{
                        TextManager.load('scene/ui/guid2.md',(iserr,text)=>{
                            MessageBox.show('',undefined,[<MarkdownElement text={text}/>],(result)=>{
                                if(this.blockview && this.blockview.openGuid)
                                    this.blockview.openGuid();
                            },'tips');
                        });                        
                    },200);
                },'tips');                   
            });
        }else{
            let name = this.props.level;
            let info = Global.appGetLevelInfo(name);
            /**
             * 其他关卡如果没玩过就提示，如果已经玩过加载最好成绩并且显示你和最少块数的差距
             */                
            if(this.isPlayAgin()){
                //已经玩过的，你可以优化代码了
                let lvs = Global.getLoginJson().lvs;
                if(lvs && lvs[info.next-1]){
                    let lv = Global.getLoginJson().lv;
                    let unlock_crown;
                    if(lv<=20)
                        unlock_crown = 15;
                    else if(lv<=30)
                        unlock_crown = 25;
                    else if(lv<=40)
                        unlock_crown = 35;
                    else if(lv<=50)
                        unlock_crown = 45;
                    else
                        unlock_crown = 55;
                    let blocks = lvs[info.next-1].blocks;
                    let best = lvs[info.next-1].best;
                    let dict={name,lv:info.next-1,blocks,best,
                        unlock_crown,current_crown:Global.getCrowns()};
                    TextManager.load(`scene/ui/play_again.md`,(iserr,text)=>{
                        if(!iserr){
                            let ele = <div>
                                <TopElement lv={info.next-1} blocks={blocks}/>
                                <MarkdownElement text={md(text,dict)} />
                                <RaisedButton label="学习内容" primary={true} style={{display:"block"}} onClick={()=>{
                                    setTimeout(()=>{
                                        MessageBox.show('ok',undefined,[<MarkdownElement file={`scene/${this.props.level}.md`}/>],(result)=>{
                                            console.log(result); 
                                        });    
                                    },100);
                                }}/>
                            </div>
                            MessageBox.show('',undefined,ele,(result)=>{
                                if(this.voxview)this.voxview.rotateAnimation();    
                            },'tips');
                        }
                    });
                }else{
                    MessageBox.show('ok',undefined,[<MarkdownElement file={`scene/${this.props.level}.md`}/>],(result)=>{
                        console.log(result);
                        if(this.voxview)this.voxview.rotateAnimation();    
                    }); 
                }
            }else if(info && info.next-1===Global.getMaxPassLevel() && Global.hasTrash(Global.getMaxPassLevel())){
                //已经玩过但是没有通过，这里不显示提示了
                //但是从Drawer类的提示还是要显示
                if(from){
                    MessageBox.show('ok',undefined,[<MarkdownElement file={`scene/${this.props.level}.md`}/>],(result)=>{
                        console.log(result);
                        if(this.voxview)this.voxview.rotateAnimation();    
                    }); 
                }
                console.log('net need tips');
            }else{
                MessageBox.show('ok',undefined,[<MarkdownElement file={`scene/${this.props.level}.md`}/>],(result)=>{
                    console.log(result);
                    if(this.voxview)this.voxview.rotateAnimation();
                }); 
            } 
        }
    }
    //如果再一次成功完成任务
    commitAgin(){
        let name = this.props.level;
        let info = Global.appGetLevelInfo(name);
        let lvs = Global.getLoginJson().lvs;
        let now = Date.now();
        let lj = Global.levelJson();
        if(lvs && lvs[info.next-1]){
            let blocks = lvs[info.next-1].blocks;
            let best = lvs[info.next-1].best;
            let cur = this.blockview.getBlockCount();
            let dict={name,lv:info.next-1,blocks:cur,best};
            if(cur < blocks){
                //成功提高
                TextManager.load(`scene/ui/best_again.md`,(iserr,text)=>{
                    if(!iserr)MessageBox.show('',undefined,<MarkdownElement text={md(text,dict)} />,(result)=>{
                        this.Tops.open(this.blockview.getBlockCount(),
                        this.blockview.toXML(),now-this.btms,now-this.btpms,
                        ()=>{this.Reset();});
                        this.btpms = now;
                    },'tips');                    
                });
            }else{
                //没有成功
                this.btpms = now;
                TextManager.load(`scene/ui/fail_again.md`,(iserr,text)=>{
                    if(!iserr)MessageBox.show('',undefined,<MarkdownElement text={md(text,dict)} />,(result)=>{
                        if(result==='again'){
                            this.Reset();
                        }else if(result==='next'){
                            //FIXBUG: 这里有可能需要解锁 ,见:tops.js
                            let p = {
                                unlock_gold:info.next_unlock_gold,
                                unlock_crown:info.next_unlock_crown,
                                seg_begin:info.next_begin,
                                seg_end:info.next_end,
                                need_unlock:info.next_need_unlock
                            };
                            console.log('============next===========');
                            console.log(info);
                            console.log(p);
                            console.log('===========================');
                            if(p.need_unlock && info.nextName && info.next < info.closed && info.next < info.total){
                                this.unlock.open(p,(b)=>{
                                    if(b){
                                        this.gonext(info);
                                    }else{
                                        location.href='#/main';//eslint-disable-line
                                    }
                                });
                            }else{
                                this.gonext(info);
                            }
                        }else if(result==='close'){
                            this.setState({confetti:false});
                        }
                    },'tips_again');                    
                });                
            }
        }else{
            MessageBox.show('ok',undefined,`因为你是再次玩第${info.next-1}关，但是系统没有你本关的过往成绩。`,(result)=>{

            });
            console.error(`commit lvs error ? ${info.next-1}`);
            console.log(lvs);
            this.btpms = now;
        }
    }
    //重复 tops.gonext
    gonext(info){
         //info.next < info.closed 全部做完
         if(info && info.nextName && info.next < info.closed && info.next < info.total){
            location.href=`#/level/${info.nextName}`;//eslint-disable-line
        }else{//打通了全部
            //提示通关了
            TextManager.load('scene/ui/completed.md',(iserr,text)=>{
                if(iserr)
                    MessageBox.show("ok",undefined,<MarkdownElement text={text}/>,(result)=>{
                        location.href='#/main';//eslint-disable-line
                    });
                else location.href='#/main';//eslint-disable-line
            });            
            
        }       
    }
    //块数提示
    blockTips = (event)=>{
        TextManager.load('scene/ui/blockcount.md',(iserr,text)=>{
            if(!iserr)
                MessageBox.show('',undefined,[<MarkdownElement text={text}/>],(result)=>{
                },'tips');
        });
    }
    /**
     * 打开提示对话栏
     */
    Tips(){
        let info = Global.appGetLevelInfo(this.props.level);
        if(info){
            this.tips.open(info.next-1);
        } 
    }
    /**
     * 看看当前关卡有没有提示
     */
    hasTips(){
        let levelTips = Global.getLevelTips();
        let info = Global.appGetLevelInfo(this.props.level);
        if(levelTips && info){
            return levelTips[info.next-1];
        }else return false;
    }
    toolbarEle(portrait){
        let {uiColor,playPause,curSelectTest,isDebug} = this.state;   
        let tests = [];
        isDebug = false;
        if(this.testXML){
            for(let i=0;i<this.testXML.length;i++)
                tests.push(<MenuItem value={i} key={i} primaryText={`test ${i}`} />);
        }
        let debugTool = isDebug?
        [<IconButton touch={true} key='add' onClick={this.AddTest.bind(this)}>
            <AddTest />
        </IconButton>,
        <IconButton touch={true} key='remove' onClick={this.RemoveTest.bind(this)}>
            <RemoveTest />
        </IconButton>,
        <SelectField
            key = 'test'
            value={curSelectTest}
            onChange={this.handleTestChange.bind(this)}
            maxHeight={200}
            style={{width:'120px'}}>
            {tests}
        </SelectField>]:[];
        let b = Global.getPlatfrom()==='windows';
        let styles = {color:b?'#0000000':uiColor};
        /*
            <IconButton touch={true} iconStyle = {styles} onClick={this.RotationLeft.bind(this)} tooltip={b?"向左转动视角":undefined} tooltipPosition="top-center">
                <IconRotateLeft />
            </IconButton>  
            <IconButton touch={true} iconStyle = {styles} onClick={this.RotationRight.bind(this)} tooltip={b?"向右转动视角":undefined} tooltipPosition="top-center">
                <IconRotateRight />
            </IconButton>  
        */
        return <Toolbar style={portrait?{width:"100%",
                background:"rgba(0,0,0,0)",
                bottom:"0px",
                left:'32px',
                position:"absolute"}:undefined}>
                    {portrait?undefined:<ToolbarGroup>
                        <IconButton touch={true} onClick={this.Menu.bind(this)} tooltip={b?"菜单...":undefined} tooltipPosition="top-center">
                            <IconMenu />
                        </IconButton>
                    </ToolbarGroup>}
                    <ToolbarGroup lastChild={true}>
                        {debugTool}
                        {portrait?undefined:this.hasTips()?
                            <IconButton touch={true} onClick={this.Tips.bind(this)} tooltip={b?"任务提示":undefined} tooltipPosition="top-center">
                                <TipMenu/>}
                            </IconButton>:undefined}
                        {portrait?undefined:this.isMgr()?
                            <IconButton touch={true} onClick={this.Mgr.bind(this)}>
                                <ContentCut/>}
                            </IconButton>:undefined}                            
                        <IconButton touch={true} iconStyle = {styles} onClick={this.Help.bind(this,'toolbar')} tooltip={b?"打开帮助":undefined} tooltipPosition="top-center">
                            <IconHelp />
                        </IconButton>                                                                        
                        <IconButton touch={true} iconStyle = {styles} onClick={this.Reset.bind(this)} tooltip={b?"重新开始":undefined} tooltipPosition="top-center">
                            <IconReplay />
                        </IconButton>                                                
                        <IconButton touch={true} iconStyle = {styles} onClick={this.Step.bind(this)} tooltip={b?"单步执行你的程序":undefined} tooltipPosition="top-center">
                            <IconStep />
                        </IconButton>
                        {portrait?undefined:
                        <IconButton touch={true} onClick={this.PlayPause.bind(this)} iconStyle={redIcon} tooltip={b?"执行你的程序":undefined} tooltipPosition="top-center">
                            {playPause?<IconPlayArrow/>:<IconPause/>}
                        </IconButton>}
                    </ToolbarGroup>
                </Toolbar>;
    }
    //横屏
    landscape(){
        let {uiColor,uiStyle,playPause,levelDesc,curSelectTest,
            openTops,blocklytoolbox,switchSize,confetti,numberOfPieces} = this.state;
        let {level} = this.props;
        let divStyle = Global.getPlatfrom()==='ios'?{position:"fixed",left:'0px',right:'0px',top:'0px',bottom:'0px'}:undefined;
        return <div>
            <div style={{position:"absolute",left:"0px",top:"0px",right:"50%",bottom:"56px"}}>
                <VoxView file={level} ref={ref=>this.voxview=ref}  layout="landscape"/>
            </div>
            <div style={{position:"absolute",left:"50%",top:"0px",right:"0px",bottom:"0px"}}>
                <div style={{position:"absolute",left:"0px",right:"0px",top:"0px",bottom:"0px"}}>
                <BlockView ref={ref=>this.blockview=ref} 
                    file={`scene/${level}.toolbox?p=${Global.getRandom()}`} 
                    onBlockCount={this.onBlockCount.bind(this)}
                    layout="landscape"
                    guid={level==='L1-1'}
                    toolbox={blocklytoolbox} />
                </div>
                <div style={{position:"absolute",right:"12px",top:"12px"}} onClick={this.blockTips}>
                    <span ref={ref=>this.blockcount=ref} style={{fontSize:"24px",fontWeight:"bold",verticalAlign:"middle"}}>0×</span>
                    <img src={Global.getCDNURL("media/title-beta.png")} style={{height:"24px",verticalAlign:"middle"}} />
                </div>
            </div>
            <div style={{position:"absolute",display:"flex",flexDirection:"column",left:"0px",right:"50%",bottom:"0px"}}>
                {this.toolbarEle(false)}
            </div>
            <MainDrawer ref={ref=>this.drawer=ref}/>
            <Tops ref={ref=>this.Tops=ref} level={level}/>
            <Unlock ref={ref=>this.unlock=ref} />
            <Tips ref={ref=>this.tips=ref} />
            {confetti?<Confetti width={window.innerWidth} height={window.innerHeight} gravity={0.15} numberOfPieces={numberOfPieces}/>:undefined}
        </div>;
    }
    switchSize(){
        //当点击voxview 进行屏幕重新布局
        if(this._ready === READY){
            this.setState({switchSize:!this.state.switchSize},()=>{
                if(this.voxview.game)
                    this.voxview.game.setSize(this.voxview.canvas.clientWidth,this.voxview.canvas.clientHeight);
                //FIXBUG : blockview svgGroup_的父节点没有指定高度
                if(this.blockview && this.blockview.workspace && this.blockview.workspace.svgGroup_){
                    //let p = this.blockview.workspace.svgGroup_.parentNode;
                    //p.style = "height:100%";
                    //this.blockview.workspace.resize(); //不工作
                    Blockly.svgResize(this.blockview.workspace); //工作
                    //window.dispatchEvent(new Event('resize'));
                }
            });
        }
    }
    isMgr(){
        let uid = Global.getUID();
        return localStorage.isdebug==='true' && (uid===24321614||uid===144969);
    }
    Mgr(){
        let info = Global.appGetLevelInfo(this.props.level);
        if(info)
            Mgr.open(info.next-1,()=>{
                //重新加载本关卡
                this.onGameStart(this.props);
            });
    }
    //竖屏
    portrait(){
        let {uiColor,uiStyle,playPause,levelDesc,curSelectTest,
            openTops,blocklytoolbox,switchSize,confetti,numberOfPieces} = this.state;
        let {level} = this.props;
        //ios关闭滚动
        let divStyle = Global.getPlatfrom()==='ios'?{position:"fixed",left:'0px',right:'0px',top:'0px',bottom:'0px'}:undefined;

        return <div style={divStyle}>
            <div style={{position:"absolute",left:"0px",top:"0px",right:"0px",bottom:switchSize?"40%":"50%"}}
                /* onClick={(event)=>{this.switchSize(this);} 
                }*/
            >
                <VoxView file={level} ref={ref=>this.voxview=ref} layout="portrait" style={{width:"100%",height:"100%"}}/>
                {uiStyle==='simple'?undefined:this.toolbarEle(true)}
                {this.hasTips()?<div style={{position:"absolute",left:"0px",bottom:"0px"}}>   
                    <IconButton 
                        style = {playLargStyle}
                        iconStyle = {playIconLargStyle}
                        touch={true} onClick={this.Tips.bind(this)} tooltipPosition="top-center">
                        {<TipMenu />}
                    </IconButton>  
                </div>:undefined}
                {this.isMgr()?<div style={{position:"absolute",left:"64px",bottom:"0px"}}>   
                    <IconButton 
                        style = {playLargStyle}
                        iconStyle = {playIconLargStyle}
                        touch={true} onClick={this.Mgr.bind(this)} tooltipPosition="top-center">
                        {<ContentCut />}
                    </IconButton>  
                </div>:undefined}
                <div style={{position:"absolute",right:"0px",bottom:"0px"}}>              
                    <IconButton 
                        style={Global.isPad()?playLargStyle:playNormalStyle}
                        iconStyle={Global.isPad()?playIconLargStyle:playIconNormalStyle}
                        touch={true} onClick={this.PlayPause.bind(this)} tooltipPosition="top-center">
                        {playPause?<IconPlayArrow/>:<IconPause/>}
                    </IconButton>
                </div>                
            </div>
            <div style={{position:"absolute",left:"0px",top:switchSize?"60%":"50%",right:"0px",bottom:"0px"}}>
                <div style={{position:"absolute",left:"0px",right:"0px",top:"0px",bottom:"0px"}}>
                <BlockView ref={ref=>this.blockview=ref} 
                    file={`scene/${level}.toolbox?p=${Global.getRandom()}`} 
                    onBlockCount={this.onBlockCount.bind(this)}
                    layout="portrait"
                    guid={level==='L1-1'}
                    toolbox={blocklytoolbox} />
                </div>
            </div>
            <div style={{position:"absolute",right:"12px",top:"12px"}} onClick={this.blockTips} >
                    <span ref={ref=>this.blockcount=ref} style={{fontSize:"24px",fontWeight:"bold",verticalAlign:"middle",color:uiColor}}>0×</span>
                    <img src={Global.getCDNURL("media/title-beta.png")} style={{height:"24px",verticalAlign:"middle"}} />
            </div>
            <div>
                <IconButton touch={true} iconStyle={{color:uiColor}} onClick={this.Menu.bind(this)} tooltipPosition="top-center">
                    <IconMenu />
                </IconButton>
            </div>
            <MainDrawer ref={ref=>this.drawer=ref}/>
            <Tops ref={ref=>this.Tops=ref} level={level}/>
            <Unlock ref={ref=>this.unlock=ref} />
            <Tips ref={ref=>this.tips=ref} />
            {confetti?<Confetti width={window.innerWidth} height={window.innerHeight} gravity={0.15} numberOfPieces={numberOfPieces}/>:undefined}
        </div>;
    }
    render(){
        if(Global.getMaxPassLevel()===null){
            return <Redirect to='/login' />;
        }
        return window.innerWidth>window.innerHeight?this.landscape():this.portrait();
    }
};

Level.propTypes = {
    level : PropTypes.string
};

export default Level;