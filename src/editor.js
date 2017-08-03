/**
 * 使用dat.GUI实现一个简单场景编辑器
 */
var Game = require("./game");
import {fetchJson,postJson} from './fetch';
import SceneManager from './scenemanager';
import log from './log';

let game = new Game({enableStats:false,
    enableAA:false,
    enableLight:true,
    enableShaodw:true});

let sceneManager = new SceneManager(game);
let gui = new dat.GUI();
let lightID = 1;
let itemID = 1;
let ID = 1;
let helpers = [];

function addHelper(h){
    helpers.push(h);
    game.scene.add(h);
}
function removeHelper(h){
    for(let i=0;i<helpers.length;i++){
        if(h==helpers[i]){
            game.scene.remove(h);
            helpers.splice(i,1);
            break;
        }
    }
}
function updateHelper(){
    for(let helper of helpers){
        helper.update();
    }
}

function getLightType(light){
    if(light.isHemisphereLight){
        return '半球灯';
    }else if(light.isDirectionalLight){
        return '方向灯';
    }else if(light.isAmbientLight){
        return '环境灯';
    }else if(light.isSpotLight){
        return '聚光灯';
    }else{
        return '未知类型的灯';
    }
}

function addPosition(ui,p){
    ui.add(p,'x',-1000,1000);
    ui.add(p,'y',-1000,1000);
    ui.add(p,'z',-1000,1000);
}

class ColorUI{
    constructor(c){
        this.c = c;
    }
    get color(){
        return '#'+this.c.getHexString();
    }
    set color(value){
        this.c.setStyle(value);
    }
    get sky(){
        return '#'+this.c.getHexString();
    }
    set sky(value){
        this.c.setStyle(value);
    }    
    get ground(){
        return '#'+this.c.getHexString();
    }
    set ground(value){
        this.c.setStyle(value);
    }       
}

function addColor(ui,c,name){
    ui.addColor(new ColorUI(c),name);
}

function removeFolder(ui,name){
    if(ui.domElement){
        let folder = ui.domElement.parentElement||ui.domElement.parentNode;
        if(folder){
            let parent = folder.parentElement||folder.parentNode;
            if(parent){
                parent.removeChild(folder);
                delete gui.__folders[name];
            }
        }
    }
}

function renameFolder(ui,old,name){
    if(ui.domElement){
        let ul = ui.domElement.childNodes[0];
        if(ul){
            let li = ul.childNodes[0];
            if(li){
                li.innerHTML = name;
                let v = gui.__folders[old]; //删除旧名
                delete gui.__folders[old];
                gui.__folders[name] = v;
            }
        }
    }
}

//确保名称不重复
function checkFolderName(name){
    for(let key in gui.__folders){
        if(name===key){
            return `${name}${ID++}`;
        }
    }
    return name;
}

class LightUI{
    constructor(light){
        this.light = light;
        
        this.light.name = checkFolderName(light.name || `${getLightType(light)}${lightID++}`);
        let ui = this.ui = gui.addFolder(this.light.name);
        ui.add(this,'名称:');
        if(light.isHemisphereLight){
            addColor(ui,light.color,'sky');
            addColor(ui,light.groundColor,'ground');
            addPosition(ui,light.position);
            ui.add(this,'灯光强度',0,2).step(0.1);
            this.helper = new THREE.HemisphereLightHelper(light,5);
            addHelper(this.helper);
        }else if(light.isDirectionalLight){
            addColor(ui,light.color,'color');
            addPosition(ui,light.position);
            ui.add(this,'投射阴影');
            ui.add(this,'灯光强度',0,2).step(0.1);
            this.helper = new THREE.DirectionalLightHelper(light,5);
            addHelper(this.helper);
        }else if(light.isAmbientLight){
            addColor(ui,light.color,'color');
        }else if(light.isSpotLight){
            addColor(ui,light.color,'color');
            addPosition(ui,light.position);
            ui.add(this,'投射阴影');
            ui.add(this,'灯光强度',0,2).step(0.1);
            ui.add(this.light,'angle',0,Math.PI/3);
            ui.add(this.light,'penumbra',0,1);
            ui.add(this.light,'decay',1,2);
            ui.add(this.light,'distance',50,2000);
            this.helper = new THREE.SpotLightHelper(light);
            addHelper(this.helper);            
        }
        if(this.helper)ui.add(this,'打开辅助线');
        ui.add(this,'删除此灯');
    }
    '删除此灯'(){
        sceneManager.removeLight(this.light);
        removeHelper(this.helper);
        removeFolder(this.ui,this.light.name);
    }
    get '名称:'(){
        return this.light.name;
    }
    set '名称:'(value){
        renameFolder(this.ui,this.light.name,value);
        this.light.name = value;
    }    
    get '打开辅助线'(){
        return this.helper.visible;
    }
    set '打开辅助线'(value){
        this.helper.visible = value;
    }
    get '投射阴影'(){
        return this.light.castShadow?true:false;
    }
    set '投射阴影'(value){
        this.light.castShadow = value?true:false;
    }    
    get '灯光强度'(){
        return this.light.intensity;
    }
    set '灯光强度'(value){
        this.light.intensity = value;
    }
};

class ItemUI{
    constructor(item){
        this.item = item;
        let name = checkFolderName(item.name || `物品${itemID++}`);
        let ui = this.ui = gui.addFolder(name);
        item.name = name;
        ui.add(this,'名称:');
        addPosition(ui,item.position);
        ui.add(this,'面向',0,2*Math.PI).step(0.1);
        ui.add(this,'投射阴影');
        ui.add(this,'可见');
        ui.add(this,'动作',item.actions.map(item=>item.name));
        ui.add(this,'删除此物品');
    }
    '删除此物品'(){
        sceneManager.removeItem(this.item);
        removeFolder(this.ui,this.item.name);
        this.item = null;
    }
    get '名称:'(){
        return this.item.name;
    }
    set '名称:'(value){
        renameFolder(this.ui,this.item.name,value);
        this.item.name = value;
    }
    get '可见'(){
        return this.item.visible;
    }
    set '可见'(value){
        this.item.visible = value?true:false;
    }
    get '投射阴影'(){
        return this.item.castShadow?true:false;
    }
    set '投射阴影'(value){
        this.item.castShadow = value?true:false;
    }
    get '面向'(){
        return this.item.rotation.z;
    }
    set '面向'(value){
        this.item.rotation.z = value;
    }
    get '动作'(){
        if(this.item.curAction && this.item.curAction.name)
            return this.item.curAction.name;
        else
            return 'undefined';
    }
    set '动作'(value){
        this.item.doAction(value);
    }    
};

class ItemEditUI{

};

class Edit{
    constructor(){
        this.selVoxFile = '3x3x3.vox';
        this.selItemFile = '';
        this.selSceneFile = '';
        this.selEnvFile = '';
        this['场景名称:'] = '';
        this['环境名:'] = '';
        this.lightUI = [];
        this.itemUI = [];
        this.axisHelper = new THREE.AxisHelper( 200 );
        game.scene.add(this.axisHelper);
        
        let lightTool = gui.addFolder('灯光工具');
        lightTool.add(this,'坐标轴');
        lightTool.add(this,'加入方向灯');
        lightTool.add(this,'加入聚光灯');
        lightTool.add(this,'加入环境灯');
        lightTool.add(this,'加入半球灯');
        lightTool.add(this,'创建环境');
        lightTool.add(this,'环境名:');

        let sceneTool = gui.addFolder('场景工具');
        this.sceneTool = sceneTool;
        sceneTool.add(this,'保存场景');
        sceneTool.add(this,'场景名称:');
        sceneTool.add(this,'刷新列表');
        fetchJson('/list?dir=scene/vox',(json)=>{
            let files = json.files.filter(item=>item.match(/.*\.vox$/));
            this.voxButton = sceneTool.add(this,'加入模型');
            this.voxListUI = sceneTool.add(this,'模型文件:',files);
        });
        fetchJson('/list?dir=scene/item',(json)=>{
            let files = json.files.filter(item=>item.match(/.*\.item$/));
            this.itemButton = sceneTool.add(this,'加入物品');
            this.itemListUI = sceneTool.add(this,'物品:',files);
        });
        fetchJson('/list?dir=scene',(json)=>{
            let files = json.files.filter(item=>item.match(/.*\.scene$/));
            this.sceneButton = sceneTool.add(this,'加载场景');
            this.sceneListUI = sceneTool.add(this,'场景:',files);
        });
        fetchJson('/list?dir=scene/env',(json)=>{
            let files = json.files.filter(item=>item.match(/.*\.env$/));
            this.envButton = sceneTool.add(this,'加载环境');
            this.envListUI = sceneTool.add(this,'环境:',files);
        });        
    } 
    '加入方向灯'(){
        let light = sceneManager.addDirectionaLight();
        light.position.set(0,0,50);
        this.addLightUI(light);
    }
    '加入聚光灯'(){
        let light = sceneManager.addSpotLight();
        light.position.set(0,0,50);
        this.addLightUI(light);        
    }
    '加入环境灯'(){
        this.addLightUI(sceneManager.addAmbientLight());
    }
    '加入半球灯'(){
        this.addLightUI(sceneManager.addHemiSphereLight());
    }
    '创建环境'(){ //将当前场景中的灯光和视角保存为一个文件
        let name = this['环境名:'];
        if(name){
            let json = sceneManager.toJson();
            let exp = {
                camera : json.camera,
                light : json.light
            };
            postJson(`/save?file=scene/env/${name}.env`,exp,(json)=>{
                if(json.result==='ok'){//成功
                    this['刷新列表']('env');
                    window.alert(`成功将该环境保存到文件'${name}.env'中.`);
                }else{//失败
                    window.alert(json.result);
                }
            });
        }else{
            window.alert(`请填写环境名.`);
        }
    }
    '保存场景'(){
        let name = this['场景名称:'];
        let json = sceneManager.toJson();
        if(name){
            postJson(`/save?file=scene/${name}.scene`,json,(json)=>{
                if(json.result==='ok'){
                    this['刷新列表']('scene');
                    window.alert(`成功将该场景保存到文件'${name}.scene'中.`);
                }else{//失败
                    window.alert(json.result);
                }
            });
        }
    }
    '加载场景'(){
        let name = this.selSceneFile;
        if(name){
            fetchJson(`/load?file=scene/${name}`,(json)=>{
                if(json.result==='ok'){
                    sceneManager.loadFromJson(json.content);
                    this.rebuildGUI();
                    this['场景名称:'] = name.replace(/(.*)\.scene$/,$1=>$1);
                }else if(json.result){
                    window.alert(json.result);
                }
            });
        }        
    }
    '加载环境'(){
        let name = this.selEnvFile;
        if(name){
            fetchJson(`/load?file=scene/env/${name}`,(json)=>{
                if(json.result==='ok'){
                    sceneManager.loadEnv(json.content);
                    this.rebuildGUI();
                    this['环境名:'] = name.replace(/(.*)\.env$/,$1=>$1);
                }else if(json.result){
                    window.alert(json.result);
                }
            });
        }
    }
    '刷新列表'(t){
        if(!t || t==='env'){
            this.envButton.remove();
            this.envListUI.remove();
            fetchJson('/list?dir=scene/env',(json)=>{
                let files = json.files.filter(item=>item.match(/.*\.env$/));
                this.envButton = this.sceneTool.add(this,'加载环境');
                this.envListUI = this.sceneTool.add(this,'环境:',files);
            }); 
        }
        if(!t || t==='scene'){
            this.sceneButton.remove();
            this.sceneListUI.remove();   
            fetchJson('/list?dir=scene',(json)=>{
                let files = json.files.filter(item=>item.match(/.*\.scene$/));
                this.sceneButton = this.sceneTool.add(this,'加载场景');
                this.sceneListUI = this.sceneTool.add(this,'场景:',files);
            });              
        }
        if(!t || t==='item'){
            this.itemButton.remove();
            this.itemListUI.remove();  
            fetchJson('/list?dir=scene/item',(json)=>{
                let files = json.files.filter(item=>item.match(/.*\.item$/));
                this.itemButton = this.sceneTool.add(this,'加入物品');
                this.itemListUI = this.sceneTool.add(this,'物品:',files);
            });                                         
        }
        if(!t || t==='vox'){
            this.voxButton.remove();
            this.voxListUI.remove();            
            fetchJson('/list?dir=scene/vox',(json)=>{
                let files = json.files.filter(item=>item.match(/.*\.vox$/));
                this.voxButton = this.sceneTool.add(this,'加入模型');
                this.voxListUI = this.sceneTool.add(this,'模型文件:',files);
            });            
        }         
    }
    '加入模型'(){
        let name = this.selVoxFile;
        if(name){
            this.itemUI.push(new ItemUI(sceneManager.addItem({
                file : `scene/vox/${name}`,
                visible : true,
                castShadow : true,
                receiveShadow : false
            })));
        }
    }
    '加入物品'(){
        let name = this.selItemFile;
        if(name){

        }
    }
    addLightUI(light){
        this.lightUI.push(new LightUI(light));
    }
    rebuildGUI(){ //从场景重建gui
        //删除现有的gui folder
        for(let light of this.lightUI)
            light['删除此灯']();
        for(let item of this.itemUI)
            item['删除此物品']();
        this.lightUI = [];
        this.itemUI = [];
        for(let light of sceneManager.lights){
            this.addLightUI(light);
        }
        for(let item of sceneManager.items){
            this.itemUI.push(new ItemUI(item));
        }
    }
    get '模型文件:'(){
        return this.selVoxFile;
    }
    set '模型文件:'(value){
        this.selVoxFile = value;
    }    
    get '物品:'(){
        return this.selItemFile;
    }
    set '物品:'(value){
        this.selItemFile = value;
    }
    get '场景:'(){
        return this.selSceneFile;
    }
    set '场景:'(value){
        this.selSceneFile = value;
    }    
    get '环境:'(){
        return this.selEnvFile;
    }
    set '环境:'(value){
        this.selEnvFile = value;
    }    
    get '坐标轴'(){
        return this.axisHelper.visible;
    }
    set '坐标轴'(value){
        this.axisHelper.visible = value;
    }            
};

let edit = new Edit();

game.on('init',function(){
    //创建地面
    var geometry = new THREE.PlaneBufferGeometry( 300, 300, 32 );
    var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffdd99 } );
    var plane = new THREE.Mesh( geometry, planeMaterial );
    plane.receiveShadow = true;
    plane.position.z = -0.1;
    this.scene.add( plane );    
    //初始化视角
    this.camera.position.y = -100;
    this.camera.position.z = 200;
    this.camera.rotation.x = Math.PI/6;
});

game.on('update',function(dt){
    updateHelper();
});

game.run();