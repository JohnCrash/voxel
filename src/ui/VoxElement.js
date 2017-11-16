import React, {Component} from 'react';
import {fetchJson,postJson} from '../vox/fetch';
import SceneManager from '../vox/scenemanager';
import log from '../vox/log';
import {Global} from '../global';
var Game = require("../vox/game");

const env = {
	"bgcolor": 5504221,
	"material": {
		"item": {
			"metadata": {
				"version": 4.5,
				"type": "Material",
				"generator": "Material.toJSON"
			},
			"uuid": "BDA306DC-CF77-47BC-A907-101656488C07",
			"type": "MeshPhongMaterial",
			"color": 16777215,
			"emissive": 2236962,
			"specular": 0,
			"shininess": 32.43150094778563,
			"shading": 1,
			"vertexColors": 2,
			"depthFunc": 3,
			"depthTest": true,
			"depthWrite": true,
			"skinning": false,
			"morphTargets": false,
			"dithering": false
		},
		"ground": {
			"metadata": {
				"version": 4.5,
				"type": "Material",
				"generator": "Material.toJSON"
			},
			"uuid": "8CBEA633-C2BA-47F9-AF07-2AC7BB62F5EB",
			"type": "MeshPhongMaterial",
			"color": 16777215,
			"emissive": 2236962,
			"specular": 0,
			"shininess": 32,
			"shading": 1,
			"vertexColors": 2,
			"opacity": 0.7000000000000001,
			"depthFunc": 3,
			"depthTest": true,
			"depthWrite": true,
			"skinning": false,
			"morphTargets": false,
			"dithering": false
		},
		"water": {
			"metadata": {
				"version": 4.5,
				"type": "Material",
				"generator": "Material.toJSON"
			},
			"uuid": "F869F2F2-E3CC-4CEC-BAEA-83824E7A6E3A",
			"type": "MeshPhongMaterial",
			"color": 16777215,
			"emissive": 0,
			"specular": 1118481,
			"shininess": 0,
			"shading": 1,
			"vertexColors": 2,
			"opacity": 0.5,
			"transparent": true,
			"depthFunc": 3,
			"depthTest": true,
			"depthWrite": true,
			"skinning": false,
			"morphTargets": false,
			"dithering": false
		}
	},
	"camera": {
		"position": {
			"x": 0.14563740787561644,
			"y": -39.86133188595576,
			"z": 8.264145454447648
		},
		"rotation": {
			"x": 1.5056373680537718,
			"y": 0,
			"z": 0.010471975511974055
		}
	},
	"light": [
		{
			"type": "ambient",
			"name": "环境灯3",
			"color": {
				"r": 0.47843137254901963,
				"g": 0.47843137254901963,
				"b": 0.47843137254901963
			}
		},
		{
			"type": "direct",
			"name": "方向灯4",
			"color": {
				"r": 0.47843137254901963,
				"g": 0.47843137254901963,
				"b": 0.47843137254901963
			},
			"position": {
				"x": 133.89626055488543,
				"y": -439.60020678959154,
				"z": 1000
			},
			"rotation": {
				"x": 0,
				"y": 0,
				"z": 0
			},
			"castShadow": true,
			"bias": 0,
			"shadowRound": 163.6892177589852,
			"shadowMapWidth": 1024,
			"shadowMapHeight": 1024
		}
	]
};

class VoxElement extends Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
		try{
			this.game = new Game({enableStats:false,
				enableAA:true,
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
        this.bgcolor = this.props.bgcolor;
        this.load(this.props.file);
    }
    componentWillReceiveProps(nextProps){
        if(this.props.file!=nextProps.file){
            this.load(nextProps.file);
        }
        if(this.bgcolor !== nextProps.bgcolor){
            this.bgcolor = nextProps.bgcolor;
            this.sceneManager.setBackgroundColor(this.bgcolor);
            if(nextProps.bgcolor!==0xFFFFFF)
                this.item.doAction('jump');
        }
    }
    componentWillUnmount(){
        this.sceneManager.destroy();
        this.game.destroy();
    }
    load(voxfile){
        if(!voxfile)return;
        this.sceneManager._doloadstate = true;
        this.sceneManager.loadEnv(env);
        this.sceneManager.setBackgroundColor(this.bgcolor);
        let item = this.sceneManager.addItem({
            template : `scene/item/${voxfile}.item`,
            visible : true
        });
        this.item = item;
        let id = setInterval(()=>{
            if(item.state==='loading')
                return;
            clearInterval(id);
            if(item.live)item.live('init');
            this.sceneManager._doloadstate = false;
            this.sceneManager.pause(false);
        },20);
    }
    render(){
        return <canvas ref={canvas=>this.canvas=canvas}>
            </canvas>;
    }
};

export default VoxElement;