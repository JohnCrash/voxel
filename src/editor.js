/**
 * 使用dat.GUI实现一个简单场景编辑器
 */
var Game = require("./game");
import {fetchJson,postJson} from './fetch';
import SceneManager from './scenemanager';
import log from './log';
import {yesno} from './dialog';

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

//确定name是否在list中，并弹出对话来确定执行cb
function resolve(name,list,cb){
    if(list.filter(item=>item===`${name}.scene`).length){
        cb();
//        yesno('提示',`已经存在一个‘${name}’文件，是否要覆盖它?`,(b)=>{
//            if(b==='ok')cb();
//        });
    }else{
        cb();
    }
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
            ui.add(this,'投射范围',50,500);
            ui.add(this,'bias',-0.01,0.01).step(0.00001);
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
    get 'bias'(){
        return this.light.shadow.bias;
    }
    set 'bias'(v){
        this.light.shadow.bias = v;
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
        return !!this.light.castShadow;
    }
    set '投射阴影'(value){
        this.light.castShadow = !!value;
    }    
    get '灯光强度'(){
        return this.light.intensity;
    }
    set '灯光强度'(value){
        this.light.intensity = value;
    }
    get '投射范围'(){
        return this.light.shadow.camera.right;
    }
    set '投射范围'(d){
        this.light.shadow.camera.left = -d;
        this.light.shadow.camera.right = d;
        this.light.shadow.camera.top = d;
        this.light.shadow.camera.bottom = -d;
        this.light.shadow.camera.updateProjectionMatrix();
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
        ui.add(this,'接受阴影');
        ui.add(this,'可见');
        ui.add(this,'水的索引');
        ui.add(this,'水的透明度',0,1).step(0.1);
        ui.add(this,'动作',item.actions.map(item=>item.name));
        ui.add(this,'删除此物品');
    }
    '删除此物品'(){
        if(this.item){
            sceneManager.removeItem(this.item);
            removeFolder(this.ui,this.item.name);
            this.item = null;
        }
    }
    get '水的透明度'(){
        return this.item.waterOpacity?this.item.waterOpacity:0.5;
    }
    set '水的透明度'(v){
        if(v>=0&&v<=1){
            this.item.setWaterOpacity(v);
        }
    }    
    get '水的索引'(){
        return this.item.water?this.item.water.toString():'';
    }
    set '水的索引'(s){
        let v = Number(s);
        if(v>=0&&v<256)
            this.item.setWaterIndex(v);
        else
            log('invalied water index '+v);
    }
    get '接受阴影'(){
        return this.item.receiveShadow;
    }
    set '接受阴影'(value){
        if(this.item.receiveShadow!==value){
            this.item.receiveShadow = !!value;
            //fixbug:在调整物体是否接受阴影时无效果
            //反转一下灯的castShadow可以解决
            function switchCastShadow(){
                for(let light of game.scene.children){
                    if(light.isDirectionalLight||light.isSpotLight){
                        light.castShadow = !light.castShadow;
                    }
                }
            }
            switchCastShadow();
            setTimeout(()=>{switchCastShadow();},20);
        }
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
        this.item.visible = !!value;
    }
    get '投射阴影'(){
        return !!this.item.castShadow;
    }
    set '投射阴影'(value){
        this.item.castShadow = !!value;
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
        this.smaa = false;
        this.selVoxFile = '3x3x3.vox';
        this.selItemFile = '';
        this.selSceneFile = '';
        this.selEnvFile = '';
        this['场景名称:'] = '';
        this['环境名:'] = '';
        this.lightUI = [];
        this.itemUI = [];
        this.zfog = true;
        this.axisHelper = new THREE.AxisHelper( 200 );
        game.scene.add(this.axisHelper);
        
        let lightTool = gui.addFolder('灯光工具');
        lightTool.add(this,'性能监测');
        lightTool.add(this,'坐标轴');
        lightTool.add(this,'SMAA');
        lightTool.add(this,'加入方向灯');
        lightTool.add(this,'加入聚光灯');
        lightTool.add(this,'加入环境灯');
        lightTool.add(this,'加入半球灯');
        
        //调节天空盒参数
        lightTool.add(this,'打开天空球');
        lightTool.addColor(this,'天空颜色');
        lightTool.addColor(this,'地面颜色');
        lightTool.add(this,'天空球半径',100,1000);
        lightTool.add(this,'雾的近点',0.1,5).step(0.01);
        lightTool.add(this,'雾的远点',0.1,5).step(0.01);
        lightTool.add(this,'偏移',-100,100);
        lightTool.add(this,'指数',0.1,1).step(0.1);
        
        lightTool.add(this,'打开ZFog');
        lightTool.addColor(this,'ZFog的颜色');
        lightTool.add(this,'ZFog高面',-1000,1000);
        lightTool.add(this,'ZFog低面',-1000,1000);

        lightTool.add(this,'创建环境');
        lightTool.add(this,'环境名:');

        let sceneTool = gui.addFolder('场景工具');
        this.sceneTool = sceneTool;
        sceneTool.add(this,'清空场景');
        sceneTool.add(this,'保存场景');
        this.sceneNameUI = sceneTool.add(this,'场景名称:');
        sceneTool.add(this,'刷新列表');
        fetchJson('/list?dir=scene/vox',(json)=>{
            let files = json.files.filter(item=>item.match(/.*\.vox$/));
            this.voxButton = sceneTool.add(this,'加入模型');
            this.voxListUI = sceneTool.add(this,'模型文件:',files);
            this.voxList = files;
        });
        fetchJson('/list?dir=scene/item',(json)=>{
            let files = json.files.filter(item=>item.match(/.*\.item$/));
            this.itemButton = sceneTool.add(this,'加入物品');
            this.itemListUI = sceneTool.add(this,'物品:',files);
            this.itemList = files;
        });
        fetchJson('/list?dir=scene',(json)=>{
            let files = json.files.filter(item=>item.match(/.*\.scene$/));
            this.sceneButton = sceneTool.add(this,'加载场景');
            this.sceneListUI = sceneTool.add(this,'场景:',files);
            this.sceneList = files;
        });
        fetchJson('/list?dir=scene/env',(json)=>{
            let files = json.files.filter(item=>item.match(/.*\.env$/));
            this.envButton = sceneTool.add(this,'加载环境');
            this.envListUI = sceneTool.add(this,'环境:',files);
            this.envList = files;
        });        
    }  
    get SMAA(){
        return this.smaa;
    }
    set SMAA(b){
        if(this.smaaPass){
            game.removePass(this.smaaPass);
            this.smaaPass = undefined;
        }else{
            var size = game.renderer.getSize();
            this.smaaPass = new THREE.SMAAPass( size.width, size.height );
            game.addPass(this.smaaPass);
        }
        this.smaa = b;
    }
    '清空场景'(){
        sceneManager.clearLight();
        sceneManager.clearItem();
        this.rebuildGUI('scene');
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
                skybox : json.skybox,
                camera : json.camera,
                light : json.light
            };
            resolve(name,this.envList,()=>
                postJson(`/save?file=scene/env/${name}.env`,exp,(json)=>{
                    if(json.result==='ok'){//成功
                        this['刷新列表']('env');
                        window.alert(`成功将该环境保存到文件'${name}.env'中.`);
                    }else{//失败
                        window.alert(json.result);
                    }
            }));
        }else{
            window.alert(`请填写环境名.`);
        }
    }
    '保存场景'(){
        let name = this['场景名称:'];
        let json = sceneManager.toJson();
        if(name){
            resolve(name,this.sceneList,()=>
                postJson(`/save?file=scene/${name}.scene`,json,(json)=>{
                    if(json.result==='ok'){
                        this['刷新列表']('scene');
                        window.alert(`成功将该场景保存到文件'${name}.scene'中.`);
                    }else{//失败
                        window.alert(json.result);
                    }
            }));
        }
    }
    '加载场景'(){
        let name = this.selSceneFile;
        if(name){
            fetchJson(`/load?file=scene/${name}`,(json)=>{
                if(json.result==='ok'){
                    sceneManager.loadFromJson(json.content,(iserr)=>{
                        if(!iserr){
                            this.rebuildGUI('scene');
                            this['场景名称:'] = name.replace(/(.*)\.scene$/,($1,$2)=>$2);
                            this.sceneNameUI.updateDisplay();
                        }else{
                            window.alert(`'scene/${name}'加载错误.`);
                        }
                    });
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
                    this.rebuildGUI('env');
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
                this.EnvList = files;
            }); 
        }
        if(!t || t==='scene'){
            this.sceneButton.remove();
            this.sceneListUI.remove();   
            fetchJson('/list?dir=scene',(json)=>{
                let files = json.files.filter(item=>item.match(/.*\.scene$/));
                this.sceneButton = this.sceneTool.add(this,'加载场景');
                this.sceneListUI = this.sceneTool.add(this,'场景:',files);
                this.SceneList = files;
            });              
        }
        if(!t || t==='item'){
            this.itemButton.remove();
            this.itemListUI.remove();  
            fetchJson('/list?dir=scene/item',(json)=>{
                let files = json.files.filter(item=>item.match(/.*\.item$/));
                this.itemButton = this.sceneTool.add(this,'加入物品');
                this.itemListUI = this.sceneTool.add(this,'物品:',files);
                this.ItemList = files;
            });                                         
        }
        if(!t || t==='vox'){
            this.voxButton.remove();
            this.voxListUI.remove();            
            fetchJson('/list?dir=scene/vox',(json)=>{
                let files = json.files.filter(item=>item.match(/.*\.vox$/));
                this.voxButton = this.sceneTool.add(this,'加入模型');
                this.voxListUI = this.sceneTool.add(this,'模型文件:',files);
                this.VoxList = files;
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
            let item = sceneManager.addItem({
                            template : `scene/item/${name}`,
                            visible : true,
                            castShadow : true,
                            receiveShadow : false
                        });
            let id = setInterval(()=>{
                if(item.state!=='loading'){
                    this.itemUI.push(new ItemUI(item));
                    clearInterval(id);
                }
            },100);
        }
    }
    addLightUI(light){
        this.lightUI.push(new LightUI(light));
    }
    rebuildGUI(t){ //从场景重建gui
        //删除现有的gui folder
        if(t==='scene'||t==='env'){
            for(let light of this.lightUI)
                light['删除此灯']();
            this.lightUI = [];
            for(let light of sceneManager.lights){
                this.addLightUI(light);
            }
        }
        if(t==='scene'){
            for(let item of this.itemUI)
                item['删除此物品']();
            this.itemUI = [];
            for(let item of sceneManager.items){
                this.itemUI.push(new ItemUI(item));
            }            
        }        
    }
    get '性能监测'(){
        if(game.stats && game.stats.dom){
            return !(game.stats.dom.style.display==='none');
        }else return false;
    }
    set '性能监测'(value){
        if(!(game.stats && game.stats.dom)){
            game.stats = new Stats();
            document.body.appendChild( game.stats.dom );
        }
        game.stats.dom.style.display = value?'inline':'none';
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
    get '打开天空球'(){
        return !!game.skybox.sky;
    }
    set '打开天空球'(e){
        if(e)
            game.addSphereSkybox(game.skybox);
        else
            game.removeSkybox();
    }    
    get '天空颜色'(){
        return '#'+game.skybox.opts.skyColor.getHexString();
    }
    set '天空颜色'(c){
        game.skybox.opts.skyColor.setStyle(c);
    }    
    get '地面颜色'(){
        return '#'+game.skybox.opts.groundColor.getHexString();
    }
    set '地面颜色'(c){
        game.skybox.ground.material.color.setStyle(c);
        game.skybox.opts.groundColor.setStyle(c);
        game.skybox.fog.color.setStyle(c);
    }
    get '天空球半径'(){
        return game.skybox.opts.raduis;
    }
    set '天空球半径'(v){
        game.skybox.opts.raduis = v;
        
        let sky = new THREE.Mesh( new THREE.SphereGeometry( v, 32, 15 ),
        game.skybox.skyMaterial );
        game.scene.remove(game.skybox.sky);
        game.skybox.sky = sky;
        game.scene.add(game.skybox.sky);
    }
    get '雾的近点'(){
        return game.skybox.opts.fogNear;
    }
    set '雾的近点'(v){
        game.skybox.opts.fogNear = v;
        game.skybox.fog.near = v*game.skybox.opts.raduis;
    }    
    get '雾的远点'(){
        return game.skybox.opts.fogFar;
    }
    set '雾的远点'(v){
        game.skybox.opts.fogFar = v;
        game.skybox.fog.far = v*game.skybox.opts.raduis;
    }
    get '偏移'(){
        return game.skybox.opts.offset;
    }
    set '偏移'(v){
        game.skybox.opts.offset = v;
        game.skybox.uniforms.offset.value = v;
    }    
    get '指数'(){
        return game.skybox.opts.exponent;
    }
    set '指数'(v){
        game.skybox.opts.exponent = v;
        game.skybox.uniforms.exponent.value = v;
    }  
    get '打开ZFog'(){
        if(sceneManager.soildMaterial){
            return sceneManager.soildMaterial.isZFog();
        }else return false;
    }
    set '打开ZFog'(v){
        if(sceneManager.soildMaterial){
            sceneManager.zfog = v;
            sceneManager.soildMaterial.enableZFog(v);
        }        
    }     
    get 'ZFog的颜色'(){
        if(sceneManager.soildMaterial){
            let fogUniforms = sceneManager.soildMaterial.uniforms;
            return '#'+fogUniforms.zfogColor.value.getHexString();
        }else return '#000000';
    }
    set 'ZFog的颜色'(v){
        if(sceneManager.soildMaterial){
            let fogUniforms = sceneManager.soildMaterial.uniforms;
            fogUniforms.zfogColor.value.setStyle(v);
            fogUniforms = sceneManager.waterMaterial.uniforms;
            fogUniforms.zfogColor.value.setStyle(v);
            game.renderer.setClearColor(fogUniforms.zfogColor.value.getHex());
        }    
    } 
    get 'ZFog高面'(){
        if(sceneManager.soildMaterial &&　sceneManager.zfog){
            let fogUniforms = sceneManager.soildMaterial.uniforms;
            return fogUniforms.zfogHigh.value;
        }else return 0;
    }
    set 'ZFog高面'(v){
        if(sceneManager.soildMaterial &&　sceneManager.zfog){
            let fogUniforms = sceneManager.soildMaterial.uniforms;
            fogUniforms.zfogHigh.value = v;
            fogUniforms = sceneManager.waterMaterial.uniforms;
            fogUniforms.zfogHigh.value = v;
        }
    } 
    get 'ZFog低面'(){
        if(sceneManager.soildMaterial &&　sceneManager.zfog){
            let fogUniforms = sceneManager.soildMaterial.uniforms;
            return fogUniforms.zfogLow.value;
        }else return 0;
    }
    set 'ZFog低面'(v){
        if(sceneManager.soildMaterial &&　sceneManager.zfog){
            let fogUniforms = sceneManager.soildMaterial.uniforms;
            fogUniforms.zfogLow.value = v;
            fogUniforms = sceneManager.waterMaterial.uniforms;
            fogUniforms.zfogLow.value = v;            
        }
    }
};

game.on('init',function(){
    //加入一个天空盒
    this.addSphereSkybox({
        skyColor    : 0x0077ff,
        groundColor : 0xca8e38,
        raduis      : 300,
    });

    //初始化视角
    this.camera.position.y = -100;
    this.camera.position.z = 200;
    this.camera.rotation.x = Math.PI/6;

    let edit = new Edit();
});

game.on('update',function(dt){
    updateHelper();
});

game.run();