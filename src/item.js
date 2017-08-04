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
                        this.mesh[i] = this.vox.createModelMesh(i);
                        this.mesh[i].castShadow = this._castShadow;
                        this.mesh[i].receiveShadow = this._receiveShadow;
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
        json.castShadow = this._castShadow;
        json.receiveShadow = this._receiveShadow;
        if(this.template){
            json.template = this.template;
        }else{
            json.file = this.file;
            json.actions = this.actions;
        }
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
};

export {Item};