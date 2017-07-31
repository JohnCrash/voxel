/**
 * 游戏关卡对象场景
 */
import {Item} from './item';
var EventEmitter = require("events");

class SceneManager extends EventEmitter{
    constructor(game){
        super();
        this.game = game;
        this.lights = [];   //场景中的灯列表
        this.meshs = [];    //场景出现Mesh
        this.items = [];    //场景中物体
        this.players = [];  //场景中玩家包括npc
    }

    /**
     * 删除场景全部的对象
     */
    destroy(){
        clearLight();
        clearItem();
    }

    /**
     * 从场景文件创建场景
     */
    loadFromString(str){
        return loadFromJson(JSON.parse(str));
    }

    /**
     * 文件主要包括一下几块
     * camera
     * light
     * item
     * description
     * script
     * 当加载完全结束是调用cb(true),如果失败调用cb(false)
     */
    loadFromJson(json){
        this.description = json.description;
        this.script = json.script;
        this.loadCamera(jsom.camera);
        this.loadLight(jsom.light);
        this.loadItem(json.item);
    }

    loadCamera(camera){
        this.game.camera.position.set(camera.position.x,camera.position.y,camera.position.z);
        this.game.camera.rotation.set(camera.rotation.x,camera.rotation.y,camera.rotation.z);
        return true;
    }

    /**
     * { type ('spot|direct|hemi'),
     *  color , skyColor , groundColor ,intensity }
     */
    loadLight(lights){
        this.clearLight();
        for(let i=0;i<lights;i++){
            var light = lights[i];
            var lgt;
            switch(light.type){
                case 'spot':
                    lgt = this.game.addSpotLight(light);
                case 'direct':
                    lgt = this.game.addDirectionaLight(light);
                case 'hemi':
                    lgt = this.game.addHemiSphereLight(light.skyColor,light.groundColor,light.intensity);
                    break;
            }
            if(lgt)this.lights.push(lgt);
        }
        return true;
    }

    loadItem(items){
        this.clearItem();
        for(let i=0;i<items.length;i++){
            this.items.push(new Item(this,items[i]));
        }
        return true;
    }

    clearLight(){
        for(let i=0;i<this.lights.length;i++){
            this.game.scene.remove(this.lights[i]);
        }
        this.lights = [];
    }

    clearItem(){
        for(let i=0;i<this.items.length;i++){
            this.items[i].destroy();
        }
        this.items = [];
    }

    /**
     * 见场景当前状态保存下来
     */
    toJson(){
        let json = {
            description:this.description,
            script:this.script,
            camera:{
                position:{x:this.game.camera.positon.x,
                    y:this.game.camera.positon.y,
                    z:this.game.camera.positon.z},
                rotation:{x:this.game.camera.rotation.x,
                    y:this.game.camera.rotation.y,
                    z:this.game.camera.rotation.z}                   
            },
            light:[],
            item:[]
        };
        for(let light of this.lights){
            let lgt;
            if(light.isSpotLight){
                lgt = {type : 'spot',
                    color : color(light.color),
                    position : position(light.position),
                    rotation : position(light.roration),
                    intensity : light.intensity,
                    distance : light.distance,
                    angle : light.angle,
                    penumbera : light.penumbera,
                    decay : light.decay,
                    enableShadow : light.enableShadow,
                    castShadow : light.castShadow,
                    bias : light.shadow.bias,
                    shadowMapWidth : light.shadow.mapSize.width,
                    shadowMapHeight : light.shadow.mapSize.height
                };
            }else if(light.isDirectionalLight){
                lgt = {type : 'direct',
                    color : color(light.color),
                    position : position(light.position),
                    rotation : position(light.roration),
                    castShadow : light.castShadow,
                    bias : light.shadow.bias,
                    shadowRound : light.shadow.camera.right,
                    shadowMapWidth : light.shadow.mapSize.width,
                    shadowMapHeight : light.shadow.mapSize.height                    
                };
            }else if(light.isHemisphereLight){
                lgt = {type : 'hemi',
                    skyColor : color(light.color),
                    groundColor : color(light.groundColor),
                    position : position(light.position),
                    rotation : position(light.roration),                    
                    intensity : light.intensity
                };
            }else continue;
            json.light.push(lgt);
        }
        for(let item of this.items){
            jsom.item.push(item.toJson());
        }
        function color(c){
            return {
                r : c.r,
                g : c.g,
                b : c.b
            }
        }
        function position(p){
            return {
                x : p.x,
                y : p.y,
                z : p.z
            }
        }
    }
    toString(){
    }
};

//singleton
export default SceneManager;