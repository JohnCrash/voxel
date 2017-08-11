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
    loadFromJson(json,cb){
        this.description = json.description;
        this.script = json.script;
        this.loadSkybox(json.skybox);
        this.loadCamera(json.camera);
        this.loadLight(json.light);
        this.loadItem(json.item,cb);
    }

    loadSkybox(t){
        if(t){
            if(t.type==='sphere')
                this.game.addSphereSkybox(t);
            else if(t.type==='zfog'){
                
            }
        }
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

    loadItem(items,cb){
        this.clearItem();
        for(let i=0;i<items.length;i++){
            this.items.push(new Item(this,items[i]));
        }
        if(cb){
            let id = setInterval(()=>{
                for(let item of this.items){
                    if(item.state==='loading')
                        return;
                    else if(item.state==='error'){
                        clearInterval(id);
                        cb(true);
                        return;
                    }
                }
                clearInterval(id);
                cb(false);
            },20);
        }
        return true;
    }

    loadEnv(env){
        this.loadSkybox(env.skybox);
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
                this.lights.splice(i,1);
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
            skybox:this.game.skyboxToJson(),
            light:[],
            item:[]
        };
        for(let light of this.lights){
            let lgt;
            if(light.isSpotLight){
                lgt = {type : 'spot',
                    name : light.name,
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
                    name : light.name,
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
                    name : light.name,
                    skyColor : color(light.color),
                    groundColor : color(light.groundColor),
                    position : position(light.position),
                    rotation : position(light.rotation),                    
                    intensity : light.intensity
                };
            }else if(light.isAmbientLight){
                lgt = {type : 'ambient',
                    name : light.name,
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
            if(this.items[i] === item){
                this.items.splice(i,1);
                item.destroy();
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
    /**
     * 默认材质
     */
    setMaterial(mat,waterMat){
        this.soildMaterial = mat;
        this.waterMaterial = waterMat;
    }
};

//singleton
export default SceneManager;