import React, {Component} from 'react';
import {fetchJson,postJson} from './vox/fetch';
import SceneManager from './vox/scenemanager';
import log from './vox/log';
import {MessageBox} from './ui/MessageBox';
import BlocklyInterface from './vox/blocklyinterface';
import {Global} from './global';
import CircularProgress from 'material-ui/CircularProgress';
var Game = require("./vox/game");

/**
 * VoxView的属性
 * level关卡
 */
class VoxView extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:false,
        };
    }
    componentDidMount(){
        try{
            this.game = new Game({enableStats:false,
                enableAA:Global.getPlatfrom()==='windows'?true:false,
                enableLight:true,
                enableShaodw:true,
                canvas:this.canvas});
        }catch(e){
            Global.notSupportWebGL();
            return;
        }     
    
        this.sceneManager = new SceneManager(this.game);
        this.game.observer = true;
        this.game.camera.rotation.order = 'ZXY';
        this.game.run();
        BlocklyInterface.setCurrentVoxView(this);
        Global.setCurrentSceneManager(this.sceneManager);
        this.load(this.props.file);

        /**
         * 加入
         */
        this.canvas.addEventListener('touchstart',this.touchstart,false);
        this.canvas.addEventListener('touchend',this.touchend,false);
        this.canvas.addEventListener('touchmove',this.touchmove,false);
        this.canvas.addEventListener('mousedown',this.touchstart,false);     
        this.canvas.addEventListener('mouseup',this.touchend,false);              
        this.canvas.addEventListener('mousemove',this.touchmove,false);
    }
    componentWillReceiveProps(nextProps){
        if(this.props.file!=nextProps.file||this.props.layout!=nextProps.layout){
            if(this.props.layout!=nextProps.layout){
                let parent = this.canvas.parentNode;           
                this.game.setSize(parent.clientWidth,parent.clientHeight);
            }
            this.load(nextProps.file);
        }
    }
    componentWillUnmount(){
        this.canvas.removeEventListener('touchstart',this.touchstart,false);
        this.canvas.removeEventListener('touchend',this.touchend,false);
        this.canvas.removeEventListener('touchmove',this.touchmove,false);
        this.canvas.removeEventListener('mousedown',this.touchstart,false);     
        this.canvas.removeEventListener('mouseup',this.touchend,false);              
        this.canvas.removeEventListener('mousemove',this.touchmove,false);         
        this.sceneManager.destroy();
        this.game.destroy();
        Global.setCurrentSceneManager(null);
    }
    touchstart = (event)=>{
        this._down = true;
        this._lastx = false;
        event.stopPropagation();
        return false;
    }
    touchend = (event)=>{
        this._down = false;
        this._lastx = false;
        event.stopPropagation();
        return false;
    }
    touchmove = (event)=>{
        if(this._down){
            if(event.type==='mousemove'){
                this.sceneManager.rotateCamera(event.movementX*Math.PI/180); 
            }else if(event.type==='touchmove'){
                if(this._lastx){
                    this.sceneManager.rotateCamera((this._lastx-event.touches[0].screenX)*Math.PI/180);
                }
                this._lastx = event.touches[0].screenX;    
            }
        }
        event.stopPropagation();
        return false;
    }
    initCharacter(json){
        //替换角色
        if(Global.getCharacter()!=='boy'&&json&&json.content){
            for(let item of json.content.item){
                if(item.name==='男孩'){
                    item.name = '女孩';
                    item.template = "scene/item/女孩.item";
                }else if(item.name==='女孩'){
                    item.name = '男孩';
                    item.template = "scene/item/男孩.item";
                }
            }
        }
    }
    load(file){
        this.setState({loading:true});
        this.readyPromise = new Promise((resolve,reject)=>{
            console.log('load '+file);
            BlocklyInterface.blocklyEvent('SceneReset');
            fetchJson(`/load?file=scene/${file}.scene`,(json)=>{
                if(json.result==='ok'){
                    //这里主动设置下背景颜色,因为在BlocklyInterface.pause后界面停止更新
                    this.sceneManager.setBackgroundColor(json.bgcolor);
                    this.sceneManager.game.render();

                    BlocklyInterface.pause();
                    this.initCharacter(json);
                    this.sceneManager.loadFromJson(json.content,(iserr)=>{
                        if(!iserr){
                            Global.initAudio();
                            BlocklyInterface.blocklyEvent('SceneReady');
                            this.sceneManager.zoom(Global.getPlatfrom()!=='windows'?0.85:1);
                            this.sceneManager.enablePhysical(true);
                            this.sceneManager.pause(false);
                            BlocklyInterface.resume();
                            this.setState({loading:false});
                            resolve("ready");
                        }else{
                            let err = `'${file}' load error.`;
                            log(err);
                            this.setState({loading:false});
                            reject(err);
                        }
                    });
                }else if(json.result){
                    log(json.result);
                    this.setState({loading:false});
                    reject(json.result);
                }else{
                    this.setState({loading:false});
                    reject(`fetchJson /load?file=scene/${file}.scene error`);
                }
            });
        });
    }
    isLoading(){
        return this.state.loading;
    }
    reset(){
        BlocklyInterface.reset();
        /**
         * resetItem需要等待item都装载就绪
         */
        this.readyPromise = new Promise((resolve,reject)=>{
            this.sceneManager.resetItem((iserr)=>{
                if(!iserr)
                    resolve("ready");
                else
                    reject("voxview reset error");
            });
        });
    }
    RotationLeft(){
        this.sceneManager.rotateLeft();
    }
    RotationRight(){
        this.sceneManager.rotateRight();
    }
    render(){
        return <div style={{width:"100%",height:"100%"}} ref={r=>this.root=r}>
                <canvas ref={canvas=>this.canvas=canvas} style={{width:"100%",height:"100%"}}></canvas>
                <div style={{position:"absolute",left:"0",right:"0",top:"0",bottom:'0',justifyContent:'center',
                    display:this.state.loading?"flex":"none",
                    flexDirection:"column",alignItems:"center"}}>
                    <CircularProgress/>
                    <div style={{color:"#FFFFFF"}}>LOADING...</div>
                </div>
            </div>;
    }
};

export default VoxView;