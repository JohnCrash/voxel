/**
 * 游戏关卡对象场景
 */
import {Item} from './item';
import {ZDepthPhongMaterial} from './depthphong';

var EventEmitter = require("events");
var aabb = require('aabb-3d');

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
class SceneManager extends EventEmitter{
    constructor(game){
        super();
        this.game = game;
        this.lights = [];   //场景中的灯列表
        this.meshs = [];    //场景出现Mesh
        this.items = [];    //场景中物体
        this.players = [];  //场景中玩家包括npc
        this.zfog = true;
        this.gravity = -98;//重力加速度

        this.setBackgroundColor(0);
        this.itemMaterial = new ZDepthPhongMaterial({ color: 0xffffff,
             shading: THREE.FlatShading, 
             vertexColors: THREE.VertexColors,
             shininess: 0} );
        this.groundMaterial = new ZDepthPhongMaterial({ color: 0xffffff,
             shading: THREE.FlatShading, 
             vertexColors: THREE.VertexColors,
             shininess: 0} );
        this.waterMaterial = new ZDepthPhongMaterial({ color: 0xffffff,
             shading: THREE.FlatShading, 
             vertexColors: THREE.VertexColors,
             shininess: 0,
             opacity: 0.5,
             transparent : true} );
        this.enableZFog(true);
        game.on('update',dt=>this.update(dt));
    }
    setBackgroundColor(c){
        this.bgcolor = new THREE.Color(c);
        this.game.renderer.autoClear = true;
        this.game.renderer.setClearColor(c);
    }
    getBackgroundColor(){
        return this.bgcolor;
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
        if(json.bgcolor)this.setBackgroundColor(json.bgcolor);
        this.loadSkybox(json.skybox);
        this.loadMaterial(json.material);
        this.loadZFog(json.zfog);
        this.loadCamera(json.camera);
        this.loadLight(json.light);
        this.loadItem(json.item,cb);
    }

    loadSkybox(t){
        if(t){
            this.game.addSkybox(t);
        }else{
            this.game.removeSkybox();
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
    loadMaterial(material){
        if(material){
            this.itemMaterial.setValues(material.item);
            this.groundMaterial.setValues(material.ground);
            this.waterMaterial.setValues(material.water);
        }
    }
    loadEnv(env){ 
        if(env.bgcolor)this.setBackgroundColor(env.bgcolor);
        this.loadSkybox(env.skybox);
        this.loadMaterial(env.material);
        this.loadZFog(env.zfog);
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
    loadZFog(json){
        if(json && this.groundMaterial){
            this.enableZFog(true);
            let fogUniforms = this.groundMaterial.uniforms;
            if(json.color)fogUniforms.zfogColor.value.setRGB(json.color.r,json.color.g,json.color.b);
            fogUniforms.zfogHigh.value = json.high || 100.0;
            fogUniforms.zfogLow.value = json.low || 0.0;
            fogUniforms = this.waterMaterial.uniforms;
            if(json.color)fogUniforms.zfogColor.value.setRGB(json.color.r,json.color.g,json.color.b);
            fogUniforms.zfogHigh.value = json.high || 100.0;
            fogUniforms.zfogLow.value = json.low || 0.0;    
            fogUniforms = this.itemMaterial.uniforms;
            if(json.color)fogUniforms.zfogColor.value.setRGB(json.color.r,json.color.g,json.color.b);
            fogUniforms.zfogHigh.value = json.high || 100.0;
            fogUniforms.zfogLow.value = json.low || 0.0;                       
        }else{
            this.enableZFog(false);
        }
    }
    zfogToJson(){
        if(this.groundMaterial){
            let fogUniforms = this.groundMaterial.uniforms
            return {
                color : color(fogUniforms.zfogColor.value),
                high : fogUniforms.zfogHigh.value,
                low : fogUniforms.zfogLow.value
            };
        }
    }
    enableZFog(b){
        if(this.groundMaterial){
            this.groundMaterial.enableZFog(b);
            this.itemMaterial.enableZFog(b);
            this.waterMaterial.enableZFog(b);
        }
    }
    /**
     * 见场景当前状态保存下来
     */
    toJson(){
        let json = {
            description:this.description,
            script:this.script,
            bgcolor : this.getBackgroundColor().toJSON(),
            camera:{
                position:{x:this.game.camera.position.x,
                    y:this.game.camera.position.y,
                    z:this.game.camera.position.z},
                rotation:{x:this.game.camera.rotation.x,
                    y:this.game.camera.rotation.y,
                    z:this.game.camera.rotation.z}                   
            },
            skybox:this.game.skyboxToJson(),
            material:{
                item:this.itemMaterial.toJSON(),
                ground:this.groundMaterial.toJSON(),
                water:this.waterMaterial.toJSON()
            },
            light:[],
            item:[]
        };
        if(this.zfog)json.zfog = this.zfogToJson();

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
        let dts = dt/1000.0;
        //更新物体
        for(let item of this.items){
            if(this.physical){
                //重力处理
                if(item.gravity){
                    item.velocity.z += (this.gravity*dts);
                }
                //处理位移
                if(!item.fixed && !item.ground){
                    item.position.add(item.velocity.x*dts,item.velocity.y*dts,item.velocity.z*dts);
                }
            }
            item.update(dt);
        }
        //碰撞处理
        for(let i=0;i<this.items.length;i++){
            let item1 = this.items[i];
            if(item1.collision||item1.ground){
                for(let j=i+1;j<this.items.length;j++){
                    let item2 = this.items[j];
                    if(item2.collision||item2.ground){
                        let ab = item1.collisionFunc(item2);
                        if(ab){
                            this.collision(item1,item2,ab);
                            item1.onCollision(item2,ab);
                            item2.onCollision(item1,ab);
                        }
                    }
                }
            }
        }
    }
    /**
     * 两个物体发生碰转
     */
    collision(item1,item2,ab){
        item1.collisionPhysic(item2,ab);
        item2.collisionPhysic(item2,ab);
        this.emit('collision',item1,item2,ab);
    }
};

//singleton
export default SceneManager;