var Game = require("./game");
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
    /**
     * 参数控制
     */

    var vox = {};
    var gui = new dat.GUI();
    var gui_light1 = gui.addFolder('方向灯');
    gui_light1.add(light1.position,'x',-1000,1000);
    gui_light1.add(light1.position,'y',-1000,1000);
    gui_light1.add(light1.position,'z',10,1000);
    gui_light1.add(light1,'castShadow');

    console.log('!!');

    fetch(`vox/8x8x8.vox`).then(function(response){
        return response.arrayBuffer();
    }).then(function(req){
        var vox = voxparser(req);
        var material = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0	} );
        var mesh = vox.getModelMesh(0,material);
        var size = vox.getModelSize(0);
        mesh.position.x -= size[0]/2;
        mesh.position.y -= size[1]/2;
        scene.add(mesh);
    }).catch(function(err){
        console.log(err);
    });
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
