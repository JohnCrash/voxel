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
        game.on('update',dt=>this.update(dt));
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
        for(let light of lights){
            switch(light.type){
                case 'spot':
                    this.addSpotLight(light);
                    break;
                case 'direct':
                    this.addDirectionaLight(light);
                    break;
                case 'hemi':
                    this.addHemiSphereLight(light);
                    break;
                case 'ambient':
                    this.addAmbientLight(light);
                    break;
            }
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

    loadEnv(env){
        this.loadCamera(env.camera);
        this.loadLight(env.light);
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

    addSpotLight(t){
        let light = this.game.addSpotLight(t);
        this.lights.push(light);
        return light;
    }

    addAmbientLight(t){
        let light = this.game.addAmbientLight(t);
        this.lights.push(light);
        return light;        
    }

    addHemiSphereLight(t){
        let light = this.game.addHemiSphereLight(t);
        this.lights.push(light);
        return light;
    }

    addDirectionaLight(t){
        let light = this.game.addDirectionaLight(t);
        this.lights.push(light);
        return light;
    }

    removeLight(light){
        for(let i=0;i<this.lights.length;i++){
            if(this.lights[i] == light){
                this.lights.splice(i);
                this.game.removeLight(light);
                break;
            }
        }
    }
    /**
     * 见场景当前状态保存下来
     */
    toJson(){
        let json = {
            description:this.description,
            script:this.script,
            camera:{
                position:{x:this.game.camera.position.x,
                    y:this.game.camera.position.y,
                    z:this.game.camera.position.z},
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
                    rotation : position(light.rotation),
                    intensity : light.intensity,
                    distance : light.distance,
                    angle : light.angle,
                    penumbra : light.penumbra,
                    decay : light.decay,
                    castShadow : light.castShadow,
                    bias : light.shadow.bias,
                    shadowMapWidth : light.shadow.mapSize.width,
                    shadowMapHeight : light.shadow.mapSize.height
                };
            }else if(light.isDirectionalLight){
                lgt = {type : 'direct',
                    color : color(light.color),
                    position : position(light.position),
                    rotation : position(light.rotation),
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
                    rotation : position(light.rotation),                    
                    intensity : light.intensity
                };
            }else if(light.isAmbientLight){
                lgt = {type : 'ambient',
                    color : color(light.color)
                }
            }else continue;
            json.light.push(lgt);
        }
        for(let item of this.items){
            json.item.push(item.toJson());
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
        return json;
    }
    toString(){
    }
    /**
     * 加入一个物品
     */
    addItem(t){
        let item = new Item(this,t);
        this.items.push(item);
        return item;
    }
    removeItem(item){
        for(let i=0;i<this.items.length;i++){
            if(this.items[i] == item){
                this.items.splice(i);
                this.game.scene.remove(item);
                break;
            }
        } 
    }
    /**
     * 更新场景
     */
    update(dt){
        for(let item of this.items){
            item.update(dt);
        }
    }
};

//singleton
export default SceneManager;