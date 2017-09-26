import React, {Component} from 'react';
var Game = require("./vox/game");
import {fetchJson,postJson} from './vox/fetch';
import SceneManager from './vox/scenemanager';
import log from './vox/log';
import {MessageBox} from './ui/messagebox';
import BlocklyInterface from './vox/blocklyinterface';
import {Global} from './global';
import CircularProgress from 'material-ui/CircularProgress';

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
        this.game = new Game({enableStats:false,
            enableAA:true,
            enableLight:true,
            enableShaodw:true,
            canvas:this.canvas});
        this.sceneManager = new SceneManager(this.game);
        this.game.observer = true;
        this.game.camera.rotation.order = 'ZXY';
        this.game.run();
        Global.setCurrentSceneManager(this.sceneManager);
        this.load(this.props.file);
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
        this.sceneManager.destroy();
        this.game.destroy();
        Global.setCurrentSceneManager(null);
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
            Global.initAudio();
            BlocklyInterface.blocklyEvent('SceneReset');
            fetchJson(`/load?file=scene/${file}.scene`,(json)=>{
                if(json.result==='ok'){
                    this.initCharacter(json);
                    this.sceneManager.loadFromJson(json.content,(iserr)=>{
                        if(!iserr){
                            BlocklyInterface.blocklyEvent('SceneReady');
                            this.sceneManager.enablePhysical(true);
                            this.sceneManager.pause(false);
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
    reset(){
        this.load(this.props.file);
    }
    RotationLeft(){
        this.sceneManager.rotateLeft();
    }
    RotationRight(){
        this.sceneManager.rotateRight();
    }    
    render(){
        return <div style={{width:"100%",height:"100%"}}>
                <canvas ref={canvas=>this.canvas=canvas}></canvas>
                <div style={{position:"absolute",left:"0",right:"0",top:"50%",display:this.state.loading?"flex":"none",
                    flexDirection:"column",alignItems:"center"}}>
                    <CircularProgress/>
                    <div>LOADING...</div>
                </div>
            </div>;
    }
};

export default VoxView;