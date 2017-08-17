var Game = require("./game");
var kb = require("kb-controls");
var meshers = require("voxel").meshers;
var VolumeFog = require('./volumefog');
var voxparser = require("./vox").Parser;

var game = new Game({enableStats:true,
    enableAA:false,
    enableLight:true,
    enableShaodw:true});

var scene = game.scene;
var light1;
var light2;
var ambient;

game.on('init',function(){
    //打开灯光
    ambient = game.addAmbientLight();
    light1 = game.addSpotLight({
        color:0x909090,
        enableShadow:true,
    }); 
    light1.position.z = 100;
    this.camera.position.z = 200;
    //创建地面
    var geometry = new THREE.PlaneBufferGeometry( 300, 300, 32 );
    var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffdd99 } );
    var plane = new THREE.Mesh( geometry, planeMaterial );
    plane.receiveShadow = true;
    this.scene.add( plane );    
    //加一个盒子
    var box = new THREE.Mesh( new THREE.BoxGeometry( 10, 10, 120 ), new THREE.MeshPhongMaterial( { color: 0x2f2f99 } ) );
    box.receiveShadow = true;
    this.scene.add( box );
    //加入一个体积雾
    var fogbox = new THREE.Mesh( new THREE.BoxGeometry( 30, 30, 60 ), null );
    game.addPass(new VolumeFog(game,fogbox,0x9f9f9f));
});

game.run();
