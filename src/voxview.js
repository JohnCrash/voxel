import React, {Component} from 'react';
var Game = require("./vox/game");
import {fetchJson,postJson} from './vox/fetch';
import SceneManager from './vox/scenemanager';
import log from './vox/log';
import {MessageBox} from './ui/messagebox';
import BlocklyInterface from './vox/blocklyinterface';

/**
 * VoxView的属性
 * level关卡
 */
class VoxView extends Component{
    constructor(props){
        super(props);
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
        this.load(this.props.file);
    }
    componentWillReceiveProps(nextProps){
        if(this.props.file!=nextProps.file){
            this.load(nextProps.file);
        }else if(this.props.mute!=nextProps.mute){
            this.sceneManager.muteMusic(nextProps.mute);
            this.sceneManager.muteSound(nextProps.mute);
        }
    }
    load(file){
        BlocklyInterface.blocklyEvent('SceneReset');
        fetchJson(`/load?file=scene/${file}.scene`,(json)=>{
            if(json.result==='ok'){
                this.sceneManager.loadFromJson(json.content,(iserr)=>{
                    if(!iserr){
                        BlocklyInterface.blocklyEvent('SceneReady');
                        this.sceneManager.enablePhysical(true);
                        this.sceneManager.muteMusic(this.props.mute);
                        this.sceneManager.muteSound(this.props.mute);
                        this.sceneManager.pause(false);
                    }else{
                        log(`'${file}' load error.`);
                    }
                });
            }else if(json.result){
                log(json.result);
            }
        });
    }
    reset(){
        this.load(this.props.file);
    }
    RotationLeft(){
    }
    RotationRight(){            
    }    
    render(){
        return <canvas ref={canvas=>this.canvas=canvas}>
            </canvas>;
    }
};

export default VoxView;