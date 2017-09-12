/**
 * Item
 * Item 必须具备下列属性
 * type     描述物体的类型
 * name     物体的名称
 * visible  是否可见
 * position 物体的位置
 * rotation 物体的角度
 * castShadow       是否投射阴影
 * receiveShadow    是否接受阴影
 * file     vox file
 * loop     如果有一个循环动作,[0,1,2]
 * delay    每一个动作的间隔
 * actions  用来描述物品的动作表
 *  [
 *      {
 *          name        动作名
 *          sequence    动作序列
 *          delay       延时数列
 *          loop        是否循环
 *      },...
 *  ]
 */
import {VoxManager} from './voxmanager';
import {ItemTemplate} from './itemtemplate'
import {ScriptManager} from './scriptmanager';
import BlocklyInterface from './blocklyinterface';
import {AudioManager} from './audiomanager';

import log from './log';
var aabb = require('aabb-3d');

class Position{
    constructor(p,item){
        this.p = p;
        this.op = {x:p.x,y:p.y,z:p.z}; //老的位置
        this.item = item;
    }
    reset(){
        this.op = {x:this.p.x,y:this.p.y,z:this.p.z};
    }
    get x(){
        return this.p.x;
    }
    set x(v){
        this.p.x = v;
        if(this.item.curMesh)this.item.curMesh.position.x = v;
    }
    get y(){
        return this.p.y;
    }
    set y(v){
        this.p.y = v;
        if(this.item.curMesh)this.item.curMesh.position.y = v;
    }
    get z(){
        return this.p.z;
    }
    set z(v){
        this.p.z = v;
        if(this.item.curMesh)this.item.curMesh.position.z = v;
    }
    set(x,y,z){
        this.p.x = x;
        this.p.y = y;
        this.p.z = z;
        if(this.item.curMesh)this.item.curMesh.position.set(x,y,z);
    }
    add(x,y,z){
        this.p.x += x;
        this.p.y += y;
        this.p.z += z;
        if(this.item.curMesh)this.item.curMesh.position.set(this.p.x,this.p.y,this.p.z);
    }
    get(){
        return this.p;
    }
};

class Rotation{
    constructor(p,item){
        this.p = p;
        this.item = item;
    }
    get x(){
        return this.p.x;
    }
    set x(v){
        this.p.x = v;
        if(this.item.curMesh)this.item.curMesh.rotation.x = v;
    }
    get y(){
        return this.p.y;
    }
    set y(v){
        this.p.y = v;
        if(this.item.curMesh)this.item.curMesh.rotation.y = v;
    }
    get z(){
        return this.p.z;
    }
    set z(v){
        this.p.z = v;
        if(this.item.curMesh)this.item.curMesh.rotation.z = v;
    }   
    set(x,y,z){
        this.p.x = x;
        this.p.y = y;
        this.p.z = z;
        if(this.item.curMesh)this.item.curMesh.rotation.set(x,y,z);
    } 
    get(){
        return this.p;
    }            
};

class ItemTemplateManager{
};

class Item{
    constructor(sceneManager,json){
        this.sceneManager = sceneManager;
        this.scene = sceneManager.game.scene;
        //默认每个Item有一个声音
        this.audio = new THREE.Audio(this.sceneManager.audioListener);
        this.collisionWithGround = true; //默认都可以与地面发生碰撞
        this.fromJson(json);
    }
    removeSelf(){
        this.sceneManager.removeItem(this);
    }
    fromJson(j){
        let json = j || {};
        this.position = new Position(json.position?new THREE.Vector3(json.position.x,json.position.y,json.position.z):new THREE.Vector3(),this);
        this.rotation = new Rotation(json.rotation?new THREE.Euler(json.rotation.x,json.rotation.y,json.rotation.z):new THREE.Euler(),this);
        this.name = json.name || '';
        this._visible = json.visible;
        this._collisionWidth = json.collisionWidth; //可以手动指定一个碰撞宽度
        this.ground = !!json.ground;
        this.collision = !!json.collision;//是否碰撞
        this.fixed = !!json.fixed;//是否是一个固定对象
        this.gravity = !!json.gravity;//是否受重力影响
        this.velocity = new THREE.Vector3(); //确保起始速度为0
        this._castShadow = json.castShadow;
        this._receiveShadow = json.receiveShadow;
        this._floatingF = 0; //浮力
        this.specificGravity = json.specificGravity || 0.2; //比重
        this.loadedDoAction = 'idle';
        this.state = 'loading';

        let load = ()=>{
            VoxManager.loadVox([this.file],(iserr)=>{
                if(!iserr){
                    this.vox = VoxManager.getVox(this.file);
                    this.mesh = new Array(this.vox.getModelNum());
                    for(let i=0;i<this.mesh.length;i++){
                        if(json.water===+json.water){
                            this.water = json.water;
                            this.waterOpacity = json.waterOpacity;
                            this.mesh[i] = this.vox.createModelGroupWater(i,json.water,
                                this.ground?this.sceneManager.groundMaterial:this.sceneManager.itemMaterial,
                                this.sceneManager.waterMaterial);
                            let ground = this.mesh[i].children[0];
                            let water = this.mesh[i].children[1];
                            if(ground){
                                ground.castShadow = this._castShadow;
                                ground.receiveShadow = this._receiveShadow;
                            }
                            if(water){
                                water.castShadow = false;
                                water.receiveShadow = this._receiveShadow;
                                if(json.waterOpacity!==undefined)
                                    water.material.opacity = json.waterOpacity;
                            }                            
                        }else{
                            this.mesh[i] = this.vox.createModelMesh(i,this.sceneManager.itemMaterial);
                            this.mesh[i].castShadow = this._castShadow;
                            this.mesh[i].receiveShadow = this._receiveShadow;
                        }
                    }
                    this.curDim = this.vox.getModelSize(0); //给以默认尺寸
                    this.doAction(this.loadedDoAction);
                    if(this.loadEx) //加载扩展属性
                        this.loadEx(json);                    
                    this.state = 'ready';
                }else{
                    this.state = 'error';
                }
            });
        };
        if(json.template){//物品是通过模板创建出来的
            this.template = json.template;
            ItemTemplate.load(json.template,(iserr,template)=>{
                if(!iserr){
                    if(this.name===''){
                        this.name = template.name || '';
                    }
                    //模板覆盖对象的属性
                    this._visible = template.visible || false;

                    if(template.collisionWidth)
                        this._collisionWidth = template.collisionWidth;                    
                    if(template.collision!==undefined)
                        this.collision = !!template.collision;//是否碰撞
                    if(template.fixed!==undefined)
                        this.fixed = !!template.fixed;//是否是一个固定对象
                    if(template.gravity!==undefined)
                        this.gravity = !!template.gravity;//是否受重力影响
                    if(template.specificGravity)
                        this.specificGravity = template.specificGravity;

                    this._castShadow = template.castShadow || false;
                    this._receiveShadow = template.receiveShadow || false;
                    this.file = template.file;
                    this.actions = [];
                    for(let a of template.actions){
                        this.actions.push({...a});
                    }
                    this.typeName = template.name;
                    this.script = template.script;
                    if(template.live && typeof template.live==='function'){
                        this.live = template.live.bind(this);
                    }
                    load();
                }else{
                    this.state = 'error';
                }
            });
        }else{
            this.file = json.file;
            this.script = json.script;
            if(json.actions){
                this.actions = json.actions;
            }else{
                this.actions = [{
                    name : 'idle',
                    sequece : json.loop || [0],
                    delay : json.delay || 0,
                    loop : true,
                }];
            }
            load();
        }
    }
    toJson(){
        let json = {};
        json.position = {x:this.position.x,y:this.position.y,z:this.position.z};
        json.rotation = {x:this.rotation.x,y:this.rotation.y,z:this.rotation.z};
        json.name = this.name;
        json.visible = this._visible;
        json.ground = this.ground;
        
        json.collision = !!this.collision;
        json.fixed = !!this.fixed;
        json.gravity = !!this.gravity;

        json.specificGravity = this.specificGravity;
        json.castShadow = this._castShadow;
        json.receiveShadow = this._receiveShadow;
        if(this.template){
            json.template = this.template;
        }else{
            json.file = this.file;
            json.actions = this.actions;
        }
        json.water = this.water;
        json.waterOpacity = this.waterOpacity;
        if(this.toJsonEx) //存储扩展信息
            this.toJsonEx(json);
        return json;
    }
    doAction(name){
        if(this.actions){
            for(let i = 0;i<this.actions.length;i++){
                if(this.actions[i].name === name){
                    let action = this.actions[i];
                    if(this.vox){ //已经加载
                        this.curAction = action;
                        this.playSound(action.sound,action.loop,action.volume);
                        if(typeof action.curIndex === 'undefined'){
                            action.acc = 0;
                            action.curIndex = 0;
                        }
                        if(!action.loop){
                            action.acc = 0;
                            action.curIndex = 0;   
                        }
                        let i = action.sequece[action.curIndex];
                        this.meshFrame(i);
                    }else{ //未完成vox的加载
                        this.loadedDoAction = name||'idle';
                    }
                }
            }
        }
    }
    currentActionName(){
        if(this.curAction){
            return this.curAction.name;
        }
        return '';
    }
    //物品包含水,设置水的索引
    setWaterIndex(waterIndex){
        this.water = waterIndex>=0?waterIndex:this.water;
        for(let i=0;i<this.mesh.length;i++){
            this.mesh[i] = this.vox.createModelGroupWater(i,waterIndex,
                                this.ground?this.sceneManager.groundMaterial:this.sceneManager.itemMaterial,
                                this.sceneManager.waterMaterial);
            this.mesh[i].castShadow = this._castShadow;
            this.mesh[i].receiveShadow = this._receiveShadow;
            let ground = this.mesh[i].children[0];
            let water = this.mesh[i].children[1];
            if(ground){
                ground.castShadow = this._castShadow;
                ground.receiveShadow = this._receiveShadow;                                
            }
            if(water){
                water.castShadow = false;
                water.receiveShadow = this._receiveShadow;                                
            }              
        }        
    }
    setWaterOpacity(o){
        this.waterOpacity = o;
        for(let i=0;i<this.mesh.length;i++){
            let water = this.mesh[i].children[1];
            if(water && water.material){
                water.material.opacity = o;
            }              
        }
    }
    meshFrame(i){
        if(i < this.mesh.length && i >= 0){
            if(this.curMesh !== this.mesh[i]){
                if(this.curMesh)this.scene.remove(this.curMesh); //remove old
                this.curMesh = this.mesh[i];
                this.curDim = this.vox.getModelSize(i);
                if(this.water){
                    let m = this.vox.getModelVolumeWater(i,this.water);
                    this.curVox = m.volume;
                    this.curWaterVox = m.water;
                }else{
                    this.curVox = this.vox.getModelVolume(i);
                }
                this.scene.add(this.curMesh);
                this.curMesh.position.set(this.position.x,this.position.y,this.position.z);
                this.curMesh.rotation.set(this.rotation.x,this.rotation.y,this.rotation.z);
            }
        }else{
            log(`Item '${this.name}' action '${i}', action sequece out of range`);
        }
    }
    /**
     * 加载到场景的每一个Item会被定时调用update
     * curAction    当前对象
     * curIndex     当前显示的mesh
     */
    update(dt){
        if(this._visible && this.curAction){
            let a = this.curAction
            if(a.acc > a.delay){
                a.acc = 0;
                if(a.curIndex+1<a.sequece.length){
                    a.curIndex++;
                }else if(a.loop){
                    a.curIndex = 0;
                }
                let i = a.sequece[a.curIndex];
                this.meshFrame(i);
            }else{
                a.acc += dt;
            }
        }
        if(this.live)this.live('update',dt);
    }
    get visible(){
        return this._visible;
    }
    set visible(b){
        if(!b){
            if(this.curMesh){
                this.scene.remove(this.curMesh);
                this.curMesh = null;
            }
        }
        this._visible = b;
    }
    get castShadow(){
        return this._castShadow;
    }
    set castShadow(value){
        if(this._castShadow!=value){
            this._castShadow = value;
            if(this.mesh){
                for(let i=0;i<this.mesh.length;i++){
                    this.mesh[i].castShadow = value;
                    let child = this.mesh[i].children;
                    let soild = child[0];
                    let water = child[1];
                    if(soild)soild.castShadow = value;
                    if(water)soild.castShadow = value;
                }
            }
        }
    }
    get receiveShadow(){
        return this._receiveShadow;
    }
    set receiveShadow(value){
        if(this._receiveShadow!=value){
            this._receiveShadow = value;
            if(this.mesh){
                for(let i=0;i<this.mesh.length;i++){
                    this.mesh[i].receiveShadow = value;
                    let child = this.mesh[i].children;
                    let soild = child[0];
                    let water = child[1];
                    if(soild)soild.receiveShadow = value;
                    if(water)soild.receiveShadow = value;                    
                }
            }
        }
    }
    destroy(){
        if(this.curMesh){
            if(this.live)this.live('release');
            this.scene.remove(this.curMesh);
            this.curMesh = null;
            this.curAction = null;
            this.actions = null;
            this.vox = null;
            this.live = null;
            this.mesh = null;
        }
    }
    /**
     * 当物体开始下落或者着地会被调用
     * b true悬空,false着陆
     * 如果是着陆z代表下落高度
     * 另外任何时候都可以通过fallState来检查是否在下坠
     */
    onFall(b,z){
        if(this.live && !this.sceneManager._editor)this.live('fall',b,z);
    }
    /**
     * 当物体发生碰撞时被调用(注意不是和地面)
     * item为另一个物体，ab是两个物体碰撞交集aabb盒
     */
    onCollision(item,ab,dt){
        if(this.live && !this.sceneManager._editor)this.live('collision',item,ab,dt);
    }
    /**
     * 如果物体被地面阻拦该函数将被调用
     */
    onCollisionWall(){
        if(this.live && !this.sceneManager._editor)this.live('wall');
    }
    /**
     * 当物体掉入水中
     * b=true在入水，b=false出水,z物体在水中的深度
     * * 另外任何时候都可以通过swimState来检查是否在游泳
     */
    onSwiming(b,z){
        if(this.live && !this.sceneManager._editor)this.live('swiming',b,z);
    }
    aabb(){
        if(this.curDim){
            return aabb([this.position.x-this.curDim[0]/2,this.position.y-this.curDim[1]/2,this.position.z],
                [this.curDim[0],this.curDim[1],this.curDim[2]]);
        }
        else return aabb([0,0,0],[0,0,0]);
    }
    collisionAABB(){ //取短边为碰撞盒的边
        if(this.ground)return this.aabb();
        let w = this.collisionWidth();
        return aabb([this.position.x-w/2,this.position.y-w/2,this.position.z],
            [w,w,this.curDim[2]]);
    }
    /**
     * 确保collisionWidth是一个静态值，因为如果根据动画来变动将导致碰撞检测的不一致，而发生抖动。
     */
    collisionWidth(){
        if(this._collisionWidth)return this._collisionWidth;
        this._collisionWidth = Math.floor((this.curDim[0]+this.curDim[1])/2);
        //Math.min(this.curDim[0],this.curDim[1]);
        return this._collisionWidth;
    }
    collisionEdge(){
        if(this._edge)return this._edge;
        let edge = [];
        let w12 = this.collisionWidth()/2;
        for(let x = -w12;x<w12;x++){
            edge.push({x:x,y:-w12});
            edge.push({x:x,y:w12-1});
        }
        for(let y = -w12+1;y<w12-1;y++){
            edge.push({x:-w12,y:y});
            edge.push({x:w12-1,y:y});
        }
        this._edge = edge;
        return edge;
    }    
    /**
     * 该对象和另一个对象进行碰撞测试(算法忽略旋转)
     * water = true仅仅和水进行碰撞
     */
    collisionFunc(item,water){
        //this.curVox 当前对象的体素
        //this.curDim 当前对象的体素尺寸
        //中心点在体素的地面中心位置
        if(!this.curDim || !item.curDim)return null;
        let ab1 = this.collisionAABB();
        let ab2 = item.collisionAABB();
        let u = ab1.union(ab2);
        if((u!==null)&&((u.width()>0)||(u.height()>0)||(u.depth()>0))){//AABB相交
            if(!(this.ground || item.ground)){ 
                return u;//都不是地面的碰撞，简单的返回两个物体aabb盒的交集
            }
            let ground,obj,objAABB;
            if(this.ground){
                ground = this;
                obj = item;
                objAABB = ab2;
            }else{
                ground = item;
                obj = this;
                objAABB = ab1;
            }
            //两个体素之间的偏移,相对于本体素的下角
            let p = new THREE.Vector3(obj.position.x-ground.position.x+ground.curDim[0]/2,
                                    obj.position.y-ground.position.y+ground.curDim[1]/2,
                                    obj.position.z-ground.position.z);
            let groundVox = water?ground.curWaterVox:ground.curVox;
            if(!groundVox)return null;
            let dx = ground.curDim[0];
            let dy = ground.curDim[1];
            let dz = ground.curDim[2];
            let groundPlane = dx*dy;
            let groundVoxMaxIndex = groundPlane*dz;
            //为了速度考虑，这里仅仅测试obj的侧面外壳
            let edge = obj.collisionEdge();

            let vmin = {x:dx,y:dy,z:dz};
            let vmax = {x:0,y:0,z:0};
            for(let z = 0;z<obj.curDim[2];z++){
                for(let pt of edge){
                    let vx = Math.floor(p.x+pt.x);
                    if(vx<0 || vx>=dx)continue;
                    let vy = Math.floor(p.y+pt.y);
                    if(vy<0 || vy>=dy)continue;
                    let vz = Math.floor(p.z+z);
                    if(vz<0 || vz>=dz)continue;
                    let inx = vx+vy*dx+vz*groundPlane;
                    if(inx < groundVoxMaxIndex && inx>=0 && groundVox[inx]!=0){
                        vmin.x = Math.min(vmin.x,vx);
                        vmin.y = Math.min(vmin.y,vy);
                        vmin.z = Math.min(vmin.z,vz);
                        vmax.x = Math.max(vmax.x,vx);
                        vmax.y = Math.max(vmax.y,vy);
                        vmax.z = Math.max(vmax.z,vz);
                    }
                }
            }
            if(vmax.x!=0 && vmin.x!=dx){
                //构造碰撞体并返回交集
                let voxaabb = aabb([ground.position.x-dx/2+vmin.x,
                        ground.position.y-dy/2+vmin.y,
                        ground.position.z+vmin.z],
                        [vmax.x-vmin.x+1,vmax.y-vmin.y+1,vmax.z-vmin.z+1]);
                return voxaabb.union(objAABB);
            }
        }

        return null;//不相交
    }
    /**
     * 判断一个点是不是在物体的内部
     */
    ptInItem(pt,water){
        if(!this.curDim)return false;
        let ab = this.collisionAABB();
        if( pt.x>=ab.x0()&&pt.x<=ab.x1()&&
            pt.y>=ab.y0()&&pt.y<=ab.y1()&&
            pt.z>=ab.z0()&&pt.z<=ab.z1() ){
            let dx = this.curDim[0];
            let dy = this.curDim[1];
            let dz = this.curDim[2];
            let plane = dx*dy;                
            //和体素的相对坐标
            let p = {x:Math.floor(pt.x-this.position.x+dx/2),
                y:Math.floor(pt.y-this.position.y+dy/2),
                z:Math.floor(pt.z-this.position.z)};
            let vox = water?this.curWaterVox:this.curVox;
            if(!vox)return false;
            if(p.x<0||p.x>=dx)return false;
            if(p.y<0||p.y>=dy)return false;
            if(p.z<0||p.z>=dz)return false;
            let i = plane*p.z + p.y*dx + p.x;
            return vox[i]!=0;
        }
        return false;
    }
    /**
     * 向Blockly注入函数
     */
    injectBlocklyFunction(name,func){
        BlocklyInterface.injectBlocklyFunction(name,func);
    }
    /**
     * 暂停Blockly的执行
     */
    blocklyStop(msg){
        BlocklyInterface.blocklyStop(msg);
    }
    /**
     * 继续Blockly的执行
     */
    blocklyContinue(msg){
        BlocklyInterface.blocklyContinue(msg);
    }
    /**
     * 向blockly发送事件
     */
    blocklyEvent(event){
        BlocklyInterface.blocklyEvent(event);
    }
    /**
     * 播放声音
     */
    playSound(file,loop,volume){
        if(file){
            if(this.sceneManager.isMute())return;
            AudioManager.load(file,(b,buffer)=>{
                if(!b){
                    this.audio.setBuffer(buffer);
                    this.audio.setLoop(!!loop);
                    this.audio.setVolume(volume||1.0);
                    this.audio.play();
                }else{
                    try{this.audio.stop();}catch(e){}
                }
            });
        }else{
            try{this.audio.stop();}catch(e){}
        }
    }
};

export {Item};