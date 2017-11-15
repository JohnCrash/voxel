/**
 * 游戏关卡对象场景
 */
import {Item} from './item';
import {ZDepthPhongMaterial} from './depthphong';
import {AudioManager} from './audiomanager';
import Spe from './spe';

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
        this._pause = true; //默认暂停
        this._editor = false; //编辑状态
        this._exit = false; //退出状态
        this._doloadstate = false; //加载状态
        //初始化声音监听
        this.audioListener = new THREE.AudioListener();
        game.camera.add(this.audioListener);
        this.music = new THREE.Audio(this.audioListener);
        this._muteSound = undefined;
        this._muteMusic = undefined;

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
        game.on('exit',()=>{
            this._exit = true;
            if(!this._doloadstate)
                this.destroy();
        });
    }
    pause(b){
        this._pause = b;
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
        this.stopMusic();
        this.clearLight();
        this.clearItem();
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
     * 当加载完全结束时调用cb(true),如果失败调用cb(false)
     */
    loadFromJson(json,cb){
        if(this._exit || this._doloadstate)return;

        this.json = json;
        this._doloadstate = true;
        this.game.scene.visible = false;
        //this.muteMusic(true); //关闭声音
        //this.muteSound(true);
        this.pause(true); //加载的时候暂停更新
        this.description = json.description;
        this.markdownDescription = json.markdownDescription;
        this.script = json.script;
        this.musicFile = json.music||'';
        this.musicLoop = !!json.loop;
        this.setBackgroundColor(json.bgcolor);
        this.loadSPE(json.spe);
        this.loadSkybox(json.skybox);
        this.loadMaterial(json.material);
        this.loadZFog(json.zfog);
        this.loadCamera(json.camera);
        this.loadLight(json.light);
        this.loadItem(json.item,cb);
    }

    resetItem(cb){
        if(this.json && !this._doReset && !this._doloadstate){
            this._doReset = true;
            this.loadItem(this.json.item,cb);
        }
    }

    loadSPE(t){
        this._speJson = t;
        if(this._spe){
            this.game.scene.remove(this._spe.node());
            this._spe.dispose();
        }
        if(t){
            this._spe = new Spe(t);
            this.game.scene.add(this._spe.node());
        }
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

        let id = setInterval(()=>{
            for(let item of this.items){
                if(item.state==='loading')
                    return;
                else if(item.state==='error'){
                    console.warn(item);
                    clearInterval(id);
                    this._doReset = false;
                    this._doloadstate = false;
                    this.game.scene.visible = true;
                    if(this._exit){
                        this.destroy();
                    }
                    if(cb)cb(true);
                    return;
                }
            }
            clearInterval(id);
            if(this._exit){
                this.destroy();
            }else{
                for(let item of this.items){
                    if(item.live)item.live('init');
                }
            }
            this._doReset = false;
            this._doloadstate = false;
            this.game.scene.visible = true;
            if(cb)cb(false);
        },20);
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
        this._groundCollisions = null;
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
            music:this.musicFile,
            loop:this.musicLoop,
            bgcolor : this.getBackgroundColor().toJSON(),
            camera:{
                position:{x:this.game.camera.position.x,
                    y:this.game.camera.position.y,
                    z:this.game.camera.position.z},
                rotation:{x:this.game.camera.rotation.x,
                    y:this.game.camera.rotation.y,
                    z:this.game.camera.rotation.z}                   
            },
            spe:this._speJson,
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
        this._groundCollisions = null;
        return item;
    }
    removeItem(item){
        for(let i=0;i<this.items.length;i++){
            if(this.items[i] === item){
                this.items.splice(i,1);
                item.destroy();
                this._groundCollisions = null;
                break;
            }
        }
    }
    //可以有多个地面
    getGroundItem(){
        if(this._groundCollisions)
            return this._groundCollisions;

        let grounds = [];
        for(let item of this.items){
            if(item.ground)
                grounds.push(item);
        }
        if(grounds.length===0)
            return null;
        this._groundCollisions = {
            length :  grounds.length,
            collisionFunc : (item,b)=>{
                let ab;
                for(let ground of grounds){
                    ab = ground.collisionFunc(item,b);
                    if(ab)return ab;
                }
                return ab;
            }
        };
        return this._groundCollisions;
    }
    /**
     * 更新场景
     */
    update(dt){
        let dts = dt/1000.0;
        let groundItem = this.getGroundItem();
        
        if(this._doloadstate||this._doReset)return; //如果真正读取就不要更新

        if(this._spe)this._spe.update(dt); //更新粒子效果

        if(this._pause || !groundItem){//没有地面，直接简单更新
            for(let item of this.items){
                item.update(dt);
            }
            return;
        }

        //如果物体在xy方向上有位移处理就到无xy碰撞的位置，如果物体在xy方向上没有位移就不进行处理
        for(let item of this.items){
            item.update(dt);
            if(!item.ground && item.collision){
                let ab = groundItem.collisionFunc(item);
                if(ab){
                    this.collisionGroundXY(groundItem,item,ab,dt);
                }
            }
        }
        //处理z方向的碰撞
        for(let item of this.items){
            if(!item.ground){
                if(item.collision && item.collisionWithGround){
                    let ab = groundItem.collisionFunc(item);
                    if(ab && ab.depth()>=1){
                        continue; //xy过来还有约束，不做重力处理和抬升
                    }
                }
                if(this.physical && item.gravity && !item.fixed){ //受重力影响
                    item.velocity.z += ((this.gravity+item._floatingF)*dts);
                    item.position.add(item.velocity.x*dts,item.velocity.y*dts,item.velocity.z*dts);
                }
                if(item.collision && item.collisionWithGround){
                    let ab = groundItem.collisionFunc(item,true);
                    this.collisionGroundWater(groundItem,item,ab,dt);
                    ab = groundItem.collisionFunc(item);
                    this.collisionGroundZ(groundItem,item,ab,dt);
                }
            }
        }
        //处理位移
        //item1.position.reset();
        //处理物体之间的碰撞排除地面
        for(let item1 of this.items){
            if(!item1.ground && item1.collision){
                for(let item2 of this.items){
                    if(item1!==item2 && !item2.ground && item2.collision){
                        let ab = item1.collisionFunc(item2);
                        if(ab)this.collision(item1,item2,ab,dt);
                    }
                }
                item1.position.reset(); //重置老的位置
            }
        }
    }
    /**
     * 如果和水发生碰撞
     */    
    collisionGroundWater(ground,item,ab,dt){
        if(ab && ab.depth()>0){ //在水里
            let H = item.aabb().depth();
            let d = ab.depth();
            if(H>0 && item.specificGravity>0){
                let A = 3;
                item._floatingF = -this.gravity * d/(H * item.specificGravity) - A*item.velocity.z*d/(H *item.specificGravity);
                //item.velocity.z *= ab.depth()/H; //这里假设速度在水中会衰减
            }else item._floatingF = 0;
            if(!item.swimState){
                item.swimState = true;
                item.onSwiming(true,d);
            }
        }else{//出水
            item._floatingF = 0;
            if(item.swimState){
                item.swimState = false;
                item.onSwiming(false,0);
            }
        }
    }
    /**
     * 处理物体和地面的关系，如果碰撞就直接往上找到最顶的位置
     */
    collisionGroundZ(ground,item,ab,dt){
        if(ab && ab.depth()>0){//着陆
            item.velocity.set(0,0,0);
            item.position.z += ab.depth(); //一次顶到最上面
            if(item.fallState){
                item.fallState = false;
                item.onFall(false,item.position.z-item.fallZ);
                this.emit('fall',false,item,item.position.z-item.fallZ);
            }
        }else{//悬空
            if(!item.fallState){
                item.fallZ = item.position.z;
                item.fallState = true;
                item.onFall(true,0);
                this.emit('floating',true,item,0);
            }
        }
    }
    /**
     * 处理XY方向上的碰撞，如果XY方向物体有移动就将其调整物体的XY使之在XY方向上没有碰撞
     * 如果XY方向上没有移动就忽略
     */
    collisionGroundXY(ground,item,ab,dt){
        let x = item.position.x-item.position.op.x;
        let y = item.position.y-item.position.op.y;
        if(x!=0||y!=0){
            x = item.position.x;
            y = item.position.y;
            let t = 0.5;
            let b = 0.5;
            let n = 10; //做10次二分逼近碰撞点
            let lx,ly;
            let isc = false;
            let isnotify = false;
            lx = item.position.op.x;
            ly = item.position.op.y;
            while(n--){
                item.position.x = t*x + (1-t)*item.position.op.x;
                item.position.y = t*y + (1-t)*item.position.op.y;
                ab = ground.collisionFunc(item);
                if(!ab || ab.depth()<1){
                    t = t+b/2;//不碰撞,向前(远离op)
                    lx = item.position.x;
                    ly = item.position.y;
                }else{
                    t = t-b/2;//靠近op
                    isc = true;//表示发生过碰撞
                }
                b = b/2;
            }
            if(!isc){ //上述测试都没有发生碰撞,将逼近点直接指向目的地(t=1)
                item.position.x = x;
                item.position.y = y;
                ab = ground.collisionFunc(item);
                if(!ab || ab.depth()<1){//还是没不发生碰撞
                    lx = x;
                    ly = y;
                }else{//最后发生碰撞
                    isnotify = true;
                }
            }else{//发生碰撞
                isnotify = true;
            }
            item.position.x = lx;
            item.position.y = ly;
            if(isnotify)item.onCollisionWall();
        }
    }
    /**
     * 点位置有什么东西
     */
    ptItem(pt){
        let ia = [];
        for(let item of this.items){
            if(item.ptInItem(pt)){
                ia.push(item);
            }
        }
        return ia;
    }
    //物体和物体之间发生了碰撞
    collision(item1,item2,ab,dt){
        //通知他们彼此
        item1.onCollision(item2,ab,dt);
        item2.onCollision(item1,ab,dt);
        this.emit('collision',item1,item2,ab,dt);
    }
    /**
     * 播放场景背景音乐
     */
    playMusic(file,loop){
        this.currentMusicFile = file;
        console.log('PLAY MUSIC:'+file);
        this.stopMusic();
        AudioManager.load(file,(b,buffer)=>{
            if(!b){
                this.music.setBuffer(buffer);
                this.music.setLoop(!!this.musicLoop);
                this.music.play();
            }
        });             
    }
    stopMusic(){
        if(this.music){
            try{
                this.music.stop();
            }catch(e){
            }
        }
    }
    musicVolume(v){
        if(this.music){
            this.music.setVolume(v);
        }
    }
    //是否静音
    isMute(){
        return this._muteSound;
    }
    //打开关闭声音
    muteSound(b){
        console.log('muteSound:'+b);
        if(this._muteSound!==!!b){
            this._muteSound = b;
            if(b){//关闭全部正在播放的声音
            }
        }
    }
    playSound(file,loop,volume){
        if(file){
            if(this.isMute())return;
            let audio = new THREE.Audio(this.audioListener);
            AudioManager.load(file,(b,buffer)=>{
                if(!b){
                    audio.setBuffer(buffer);
                    audio.setLoop(!!loop);
                    audio.setVolume(volume||1.0);
                    audio.play();
                }else{
                    try{audio.stop();}catch(e){}
                }
            });
        }
    }    
    muteMusic(b){
        console.log('muteMusic:'+b);
        if(this._muteMusic!==!!b){
            this._muteMusic = b;
            if(b){
                this.stopMusic();
            }else{
                this.playMusic(this.musicFile,this.musicLoop);
            }
        }
        if(!b){
            if(this.currentMusicFile !== this.musicFile){
                this.playMusic(this.musicFile,this.musicLoop);
            }
        }
    }
    enablePhysical(b){
        this.physical = !!b;
    }
    rotateCamera(t){
        let x = this.game.camera.position.x;
        let y = this.game.camera.position.y;
        let d = Math.sqrt(x*x+y*y);
        let a = Math.atan2(y,x)+t;
        this.game.camera.position.x = d*Math.cos(a);
        this.game.camera.position.y = d*Math.sin(a);
        this.game.camera.rotation.z += t;
    }
    /**
     * 旋转摄像机
     */
    rotateLeft(){
        this.rotateCamera(-90/4*Math.PI/180);
    }
    rotateRight(){
        this.rotateCamera(15*Math.PI/180);
    }
    zoom(a){
        this.game.camera.position.x = a*this.game.camera.position.x;
        this.game.camera.position.y = a*this.game.camera.position.y;        
        this.game.camera.position.z = a*this.game.camera.position.z;        
    }
    //创建一个粒子引擎
    createSpe(json){
        return new Spe(json);
    }
};

export default SceneManager;