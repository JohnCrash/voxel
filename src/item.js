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

import log from './log';
var aabb = require('aabb-3d');

class Position{
    constructor(p,item){
        this.p = p;
        this.item = item;
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
        this.fromJson(json);
    }
    fromJson(j){
        let json = j || {};
        this.position = new Position(json.position?new THREE.Vector3(json.position.x,json.position.y,json.position.z):new THREE.Vector3(),this);
        this.rotation = new Rotation(json.rotation?new THREE.Euler(json.rotation.x,json.rotation.y,json.rotation.z):new THREE.Euler(),this);
        this.name = json.name || '';
        this._visible = json.visible;
        this.ground = !!json.ground;
        this._castShadow = json.castShadow;
        this._receiveShadow = json.receiveShadow;
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
                                this.sceneManager.groundMaterial,
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
                    this.doAction(this.loadedDoAction);
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
                    this._visible = template.visible || false;
                    this._castShadow = template.castShadow || false;
                    this._receiveShadow = template.receiveShadow || false;
                    this.file = template.file;
                    this.actions = template.actions;
                    this.script = template.script;
                    if(template.live && typeof template.live==='function'){
                        this.live = template.live.bind(this);
                        if(this.live)this.live('init');
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
        return json;
    }
    doAction(name){
        if(this.actions){
            for(let i = 0;i<this.actions.length;i++){
                if(this.actions[i].name === name){
                    let action = this.actions[i];
                    if(this.vox){ //已经加载
                        this.acc = 0;
                        this.curAction = action;
                        this.curIndex = 0;
                    }else{ //未完成vox的加载
                        this.loadedDoAction = name||'idle';
                    }
                }
            }
        }
    }
    //物品包含水,设置水的索引
    setWaterIndex(waterIndex){
        this.water = waterIndex;
        for(let i=0;i<this.mesh.length;i++){
            this.mesh[i] = this.vox.createModelGroupWater(i,waterIndex,
                                this.sceneManager.groundMaterial,
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
    /**
     * 加载到场景的每一个Item会被定时调用update
     * curAction    当前对象
     * curIndex     当前显示的mesh
     */
    update(dt){
        if(this._visible && this.curAction){
            let a = this.curAction
            if(this.acc > a.delay){
                this.acc = 0;
                if(this.curIndex+1<a.sequece.length){
                    this.curIndex++;
                }else if(a.loop){
                    this.curIndex = 0;
                }
                let i = a.sequece[this.curIndex];
                if(i < this.mesh.length && i >= 0){
                    if(this.curMesh !== this.mesh[i]){
                        if(this.curMesh)this.scene.remove(this.curMesh); //remove old
                        this.curMesh = this.mesh[i];
                        this.curDim = this.vox.getModelSize(i);
                        if(this.water){
                            this.curVox = this.vox.getModelVolumeWater(i,this.water).volume;
                        }else{
                            this.curVox = this.vox.getModelVolume(i);
                        }
                        this.scene.add(this.curMesh);
                        this.curMesh.position.set(this.position.x,this.position.y,this.position.z);
                        this.curMesh.rotation.set(this.rotation.x,this.rotation.y,this.rotation.z);
                    }
                }else{
                    log(`Item '${this.name}' action '${a.name}', action sequece out of range`);
                }
            }else{
                this.acc += dt;
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
        }
    }
    aabb(){
        if(this.curDim)
            return aabb([x1:this.position.x-this.curDim[0]/2,y1:this.position.y-this.curDim[1]/2,z1:this.position.z],
                [this.position.x+this.curDim[0]/2,this.position.y+this.curDim[1]/2,this.position.z+this.curDim[2]]);
        else return aabb([0,0,0],[0,0,0]);
    }
    /**
     * 该对象和另一个对象进行碰撞测试(算法忽略旋转)
     */
    collision(item){
        //this.curVox 当前对象的体素
        //this.curDim 当前对象的体素尺寸
        //中心点在体素的地面中心位置
        let ab1 = this.aabb();
        let ab2 = item.aabb();
        let u = ab1.union(ab2)
        if((u!==null)&&((u.width()==0)||(u.height()==0)||(u.depth()==0))){//AABB相交
            if(!(this.ground || item.ground)){ 
                return u;//都不是地面的碰撞，简单的返回两个物体aabb盒的交集
            }
            let ground = this.ground?this:item;
            let obj = this.ground?item:this;
            //两个体素之间的偏移,相对于本体素的下角
            let p = {x:ground.position.x-obj.position.x,
            y:ground.position.y-obj.position.y,
            z:ground.position.z-obj.position.z};

        }else{
            return false;//不相交
        }
    }
};

export {Item};