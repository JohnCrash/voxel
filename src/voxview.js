import React, {Component} from 'react';
var Game = require("./vox/game");
import {fetchJson,postJson} from './vox/fetch';
import SceneManager from './vox/scenemanager';
import log from './vox/log';

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
            enableAA:false,
            enableLight:true,
            enableShaodw:true,
            canvas:this.canvas});
        this.sceneManager = new SceneManager(this.game);
        this.game.observer = true;
        this.game.camera.rotation.order = 'ZXY';
        this.game.run();
        this.load(this.props.level);
    }
    componentWillReceiveProps(nextProps){
        if(this.props.level!=nextProps.level)
            this.load(nextProps.level);
    }
    load(file){
        fetchJson(`/load?file=scene/${file}.scene`,(json)=>{
            if(json.result==='ok'){
                this.sceneManager.loadFromJson(json.content,(iserr)=>{
                    if(!iserr){
                        this.sceneManager.physical = true;
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
    render(){
        return <canvas ref={canvas=>this.canvas=canvas}>
            </canvas>;
    }
};

export default VoxView;