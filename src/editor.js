/**
 * 使用dat.GUI实现一个简单场景编辑器
 */
var Game = require("./game");
import {fetchJson} from './fetch';
import SceneManager from './scenemanager';
import log from './log';

let game = new Game({enableStats:false,
    enableAA:false,
    enableLight:true,
    enableShaodw:true});

let sceneManager = new SceneManager(game);
let gui = new dat.GUI();
let lightID = 1;
let helpers = [];

function addHelper(h){
    helpers.push(h);
    game.scene.add(h);
}
function removeHelper(h){
    for(let i=0;i<helpers.length;i++){
        if(h==helpers[i]){
            game.scene.remove(h);
            helpers.splice(i);
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

function removeFolder(gui,ui){
    if(ui.domElement){
        let folder = ui.domElement.parentElement||ui.domElement.parentNode;
        if(folder){
            let parent = folder.parentElement||folder.parentNode;
            parent.removeChild(folder);  
        }
    }
}

class LightUI{
    constructor(light){
        this.light = light;
        
        let ui = this.ui = gui.addFolder(`${getLightType(light)}${lightID++}`);
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
        removeFolder(gui,this.ui);
    }
    get '打开辅助线'(){
        return this.helper.visible;
    }
    set '打开辅助线'(value){
        this.helper.visible = value;
    }
    get '投射阴影'(){
        return this.light.castShadow;
    }
    set '投射阴影'(value){
        this.light.castShadow = value;
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
    }
};

class ItemEditUI{

};

class Edit{
    constructor(){
        this.curVoxFile = '3x3x3';
        this.lightUI = [];
        this.axisHelper = new THREE.AxisHelper( 200 );
        game.scene.add(this.axisHelper);
        let lightTool = gui.addFolder('灯光工具');
        lightTool.add(this,'加入方向灯');
        lightTool.add(this,'加入聚光灯');
        lightTool.add(this,'加入环境灯');
        lightTool.add(this,'加入半球灯');
        lightTool.add(this,'坐标轴');

        let sceneTool = gui.addFolder('场景工具');
        sceneTool.add(this,'保存场景');
        sceneTool.add(this,'加入模型');
        fetchJson('/resources',(json)=>{
            sceneTool.add(this,'模型文件',json.files);
        });

        let itemTool = gui.addFolder('角色与物品工具');
        fetchJson('/items',(json)=>{
            sceneTool.add(this,'模型文件',json.files);
        });        
        itemTool.add(this,'保存物品');
        itemTool.add(this,'动作');
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
    '保存场景'(){
    }
    '加入模型'(){
    }
    addLightUI(light){
        this.lightUI.push(new LightUI(light));
    }
    get '模型文件'(){
        return this.curVoxFile;
    }
    set '模型文件'(value){
        this.curVoxFile = value;
        log(value);
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