import React, {Component} from 'react';
var Game = require("./vox/game");
import {fetchJson,postJson} from './vox/fetch';
import SceneManager from './vox/scenemanager';
import log from './vox/log';
import {MessageBox} from './ui/messagebox';
import BlocklyInterface from './vox/blocklyinterface';
import {Global} from './global';

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
        Global.setCurrentSceneManager(this.sceneManager);
        this.load(this.props.file);
    }
    componentWillReceiveProps(nextProps){
        if(this.props.file!=nextProps.file){
            this.load(nextProps.file);
        }
    }
    componentWillUnmount(){
        this.sceneManager.destroy();
        this.game.destroy();
        Global.setCurrentSceneManager(null);
    }
    load(file){
        console.log('load '+file);
        Global.initAudio();
        BlocklyInterface.blocklyEvent('SceneReset');
        fetchJson(`/load?file=scene/${file}.scene`,(json)=>{
            if(json.result==='ok'){
                this.sceneManager.loadFromJson(json.content,(iserr)=>{
                    if(!iserr){
                        BlocklyInterface.blocklyEvent('SceneReady');
                        this.sceneManager.enablePhysical(true);
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
        this.sceneManager.rotateLeft();
    }
    RotationRight(){
        this.sceneManager.rotateRight();
    }    
    render(){
        return <canvas ref={canvas=>this.canvas=canvas}>
            </canvas>;
    }
};

export default VoxView;