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

function initTest(){
    var vox = {
        speed : 200,
        file : "3x3x3",
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
                for(let i=0;i<vox.getModelNum();i++){
                    var mesh = vox.getModelMesh(i);
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
                return '#'+game.light.color.getHexString();
            },
            set : function(value){
                game.light.color.setStyle(value);
            }
        },
        "lightColor2" : {
            get : function(){
                return '#'+game.light2.color.getHexString();
            },
            set : function(value){
                game.light2.color.setStyle(value);
            }
        },        
    });
    game.light2 = new THREE.SpotLight( 0x505050, 1, 0, Math.PI / 2 );
    game.light2.position.set( 0,0, 300 );
    game.light2.target.position.set( 0, 0, 0 );    
    scene.add(game.light2);
    /**
     * 参数控制
     */
    var gui = new dat.GUI();
    var gui_light = gui.addFolder('默认灯光');
    gui_light.add(game.light.position,'x',-1000,1000);
    gui_light.add(game.light.position,'y',-1000,1000);
    gui_light.add(game.light.position,'z',10,1000);
    gui_light.addColor(vox,'lightColor');
    gui_light.add(game.light,'castShadow');
    var ambient = gui.addFolder('辅助灯光');
    ambient.add(game.light2.position,"x",-1000,1000);
    ambient.add(game.light2.position,"y",-1000,1000);
    ambient.add(game.light2.position,"z",0,1000);
    ambient.addColor(vox,'lightColor2');
    ambient.add(game.light2,'castShadow');
    var gui_vox = gui.addFolder('Vox');
    gui_vox.add(vox,'speed',100,3000);
    gui_vox.add(vox,'model',['3x3x3','8x8x8','castle',
    'chr_knight','chr_rain','chr_sword','doom','chr_old',
    'menger','monu1','monu9','monu10','nature','shelf','teapot',
    'anim/deer','anim/horse','anim/T-Rex','chr/chr_fox',
    'chr/chr_gumi','chr/chr_man','chr/chr_poem']);
    vox.model = '3x3x3';
}

game.on('init',function(){
    initTest();
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
});

game.run();