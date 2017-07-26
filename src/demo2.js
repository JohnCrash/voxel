/**
 * 本例子主要测试不同的光照
 */
var Game = require("./game");
var kb = require("kb-controls");
var meshers = require("voxel").meshers;

require("whatwg-fetch");

var voxparser = require("./vox").Parser;

var game = new Game({enableStats:true,
    enableAA:false,
    enableLight:true,
    enableShaodw:true});

var scene = game.scene;
var light1;
var light2;
var hemiLight;

function initTest(){
    var vox = {
        speed : 200,
        file : "3x3x3",
        hemiIntensity : 0.6,
        enableDirectLight : true,
        enableSpotLight : false,
        "场景文件" : function(){
            console.log('scene json!');
            $('#json').modal('show');
        },
        open : function(){
            fetch(`vox/${this.file}.vox`).then(function(response){
                return response.arrayBuffer();
            }).then((function(req){
                if(this.id)
                    clearInterval(this.id);
                this.id = 0;
                if(this.cur)
                    scene.remove(this.cur);
                this.cur = null;
                this.frames = [];
                var vox = voxparser(req);
                var material = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0	} );
                for(let i=0;i<vox.getModelNum();i++){
                    var mesh = vox.getModelMesh(i,material);
                    var size = vox.getModelSize(i);
                    mesh.position.x -= size[0]/2;
                    mesh.position.y -= size[1]/2;
                    this.frames.push(mesh);
                }
                if(this.frames.length<=1){
                    scene.add(this.frames[0]);
                    this.cur = this.frames[0];
                }else{
                    this.index = 0;
                    this.id = setInterval((function(){
                        if(this.cur)scene.remove(this.cur);
                        scene.add(this.frames[this.index]);
                        this.cur = this.frames[this.index];
                        this.index++;
                        if(this.index>=this.frames.length)
                            this.index = 0;
                    }).bind(this),this.speed);
                } 
            }).bind(this)).catch((function(err){
                console.log(this.file+' '+err);
            }).bind(this)); 
        }
    };
    Object.defineProperties(vox,{
        "model":{
            get : function(){
                return this.file;
            },
            set : function(value){
                this.file = value;
                this.open();
            }
        },
        "lightColor" : {
            get : function(){
                return '#'+light1.color.getHexString();
            },
            set : function(value){
                light1.color.setStyle(value);
            }
        },
        "lightColor2" : {
            get : function(){
                return '#'+light2.color.getHexString();
            },
            set : function(value){
                light2.color.setStyle(value);
            }
        },  
        "skyColor" : {
            get : function(){
                return '#'+hemiLight.color.getHexString();
            },
            set : function(value){
                hemiLight.color.setStyle(value);
            }
        },
        "groundColor" : {
            get : function(){
                return '#'+hemiLight.groundColor.getHexString();
            },
            set : function(value){
                hemiLight.groundColor.setStyle(value);
            }
        },
        "enableDirect" : {
            get : function(){
                return this.enableDirectLight;
            },
            set : function(value){
                if(this.enableDirectLight!=value){
                    this.enableDirectLight = value;
                    if(value)
                        scene.add(light1);
                    else
                        scene.remove(light1);
                }
            }
        },
        "enableSpot" : {
            get : function(){
                return this.enableSpotLight;
            },
            set : function(value){
                if(this.enableSpotLight!=value){
                    this.enableSpotLight = value;
                    if(value)
                        scene.add(light2);
                    else
                        scene.remove(light2);
                }
            }
        }, 
        "hemiSphereIntensity" : {
            get : function(){
                return this.hemiIntensity;
            },
            set : function(value){
                if(this.hemiIntensity!=value){
                    this.hemiIntensity = value;
                    var light = game.addHemiSphereLight(hemiLight.color,hemiLight.groundColor,value);
                    scene.remove(hemiLight);
                    hemiLight = light;
                }
            }            
        }
    });
    game.light2 = new THREE.SpotLight( 0x505050, 1, 0, Math.PI / 2 );
    game.light2.position.set( 0,0, 300 );
    game.light2.target.position.set( 0, 0, 0 );    
    scene.add(game.light2);
    /**
     * 参数控制
     */
    var gui = new dat.GUI();
    var gui_light1 = gui.addFolder('方向灯');
    gui_light1.add(vox,'enableDirect');
    gui_light1.add(light1.position,'x',-1000,1000);
    gui_light1.add(light1.position,'y',-1000,1000);
    gui_light1.add(light1.position,'z',10,1000);
    gui_light1.addColor(vox,'lightColor');
    gui_light1.add(light1,'castShadow');

    var gui_light2 = gui.addFolder('聚光灯');
    gui_light2.add(vox,'enableSpot');
    gui_light2.add(light2.position,"x",-1000,1000);
    gui_light2.add(light2.position,"y",-1000,1000);
    gui_light2.add(light2.position,"z",0,1000);
    gui_light2.addColor(vox,'lightColor2');
    gui_light2.add(light2,'castShadow');

    var hemispare_gui = gui.addFolder('半球灯');
    hemispare_gui.addColor(vox,'skyColor');
    hemispare_gui.addColor(vox,'groundColor');
    hemispare_gui.add(hemiLight.position,"x",-1000,1000);
    hemispare_gui.add(hemiLight.position,"y",-1000,1000);
    hemispare_gui.add(hemiLight.position,"z",0,1000);    
    hemispare_gui.add(vox,"hemiSphereIntensity",0,2).step(0.1);
    var gui_vox = gui.addFolder('Vox');
    gui_vox.add(vox,'speed',100,3000);
    gui_vox.add(vox,'model',['3x3x3','8x8x8','castle',
    'chr_knight','chr_rain','chr_sword','doom','chr_old',
    'menger','monu1','monu9','monu10','nature','shelf','teapot',
    'anim/deer','anim/horse','anim/T-Rex','chr/chr_fox',
    'chr/chr_gumi','chr/chr_man','chr/chr_poem']);
    gui_vox.add(vox,'场景文件');

    vox.model = '3x3x3';
}

game.on('init',function(){
    //打开灯光
    hemiLight = game.addHemiSphereLight();
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 500, 0 );
                    
    light1 = game.addDirectionaLight({
        color:0x404040,
        enableShadow:true
    });
    light1.position.set( 0,0, 300 );
    light1.target.position.set( 0, 0, 0 );     
    light2 = game.addSpotLight({
        color:0x505050,
        enableShadow:true,
    });
    light2.position.set( 0,0, 300 );
    light2.target.position.set( 0, 0, 0 );    
    scene.remove(light2);

    //创建地面
    var geometry = new THREE.PlaneBufferGeometry( 300, 300, 32 );
    var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffdd99 } );
    var plane = new THREE.Mesh( geometry, planeMaterial );
    plane.receiveShadow = true;
    this.scene.add( plane );    
    //初始化视角
    this.camera.position.y = -100;
    this.camera.position.z = 200;
    this.camera.rotation.x = Math.PI/6;

    initTest();
});

game.run();
