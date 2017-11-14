/**
 * 初始化一个THREE环境，包括创建场景，摄像机，灯光等等...
 */
require('./postprocessing/EffectComposer');
require('./postprocessing/RenderPass');
require('./postprocessing/ShaderPass');
require('./shaders/CopyShader');
require('./shaders/SMAAShader');
require('./postprocessing/SMAAPass');
require('./shaders/sphereskybox');
require('./shaders/depthphong');
var EventEmitter = require("events");
var inherits = require("inherits");
var Observer = require("./observer");

module.exports = Game;

function Color(c){
    if(c===+c)
        return new THREE.Color(c);
    else
        return new THREE.Color(c.r,c.g,c.b);
}
/**
 * 构造函数
 * @param {*} opts 
 * canvas : 使用给定的节点,不给出宽高将以canvas父节点的大小来初始化
 * width,height : 固定的宽高，如果不提供
 * maxFrameSize : 最大的帧尺寸，帧尺寸指的是渲染真的尺寸，过大的尺寸导致低帧率
 * enableStats  : 打开帧率检测小窗口
 */
function Game(opts){
    this.opts = opts || {};
    this.scene = new THREE.Scene();    
    if(this.opts.canvas){
        this.canvas = opts.canvas;
        this.renderer = new THREE.WebGLRenderer({canvas:opts.canvas,antialias:this.opts.enableAA});
    }else{
        this.renderer = new THREE.WebGLRenderer({antialias:this.opts.enableAA});
        document.body.appendChild( this.renderer.domElement );
    }
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //如果指定了尺寸就是用，否则和屏幕尺寸保持一致
    var width;
    var height;    
    if(this.opts.width && this.opts.height){
        width = opts.width;
        height = opts.height;
    }else{
        if(this.canvas){
            let parent = this.canvas.parentNode;
            width = parent.clientWidth;
            height = parent.clientHeight;
        }else{
            width = window.innerWidth;
            height = window.innerHeight;
        }
        window.onresize = function(){
            if(this.canvas){
                let parent = this.canvas.parentNode;
                width = parent.clientWidth;
                height = parent.clientHeight;
            }else{
                width = window.innerWidth;
                height = window.innerHeight;
            }
            this.setSize(width,height);
        }.bind(this);
    }
    this.camera = new THREE.PerspectiveCamera( 30, width / height, 0.1, 1000 );
    this.setSize(width,height);
    //这里加入帧率检测
    if(this.opts.enableStats){
        this.stats = new Stats();
        document.body.appendChild( this.stats.dom );
    }
    this.renderer.shadowMap.enabled = true;
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
}

inherits(Game,EventEmitter);

/**
 * 改变尺寸
 */
Game.prototype.setSize = function(w,h){
    //this.renderer.domElement.style.width = w+'px';
    //this.renderer.domElement.style.height = h+'px';
    this.camera.aspect = w/h;
    this.camera.updateProjectionMatrix();
    if(this.opts.maxFrameSize && w > this.opts.maxFrameSize){
        w = this.opts.maxFrameSize;
        h = this.opts.maxFrameSize*h/w;
    }
    this.renderer.setSize( w,h,false );
    if(this.composer)this.composer.setSize(w,h);
    this.emit('resize',w,h);
};

Game.prototype.destroy=function(){
    if(this.renderer){
        this.stop();
        this.renderer.dispose();
    }
}
/**
 * 渲染循环
 */
Game.prototype.run=function(){
    this.emit('init');
    //如果用户没提供控制镜头的对象，这里创建默认的
    if(!this.observer){
        this.observer = new Observer(this);        
    }
    var t = Date.now()-1;
    var animate = function(){
        if(this.stoped){
            this.emit('exit');
            console.log('Game stoped!');
            return;
        }
        requestAnimationFrame( animate );
        if(this.stats)this.stats.update();
        var nt = Date.now();
        if(!this.paused){
            let dt = nt - t > 50?50:nt-t; //保证时间的连续
            this.emit('update',dt);
            if(this.composer)
                this.composer.render();
            else
                this.renderer.render( this.scene, this.camera );
        }
        t = nt;
    }.bind(this);
    animate();    
};

Game.prototype.render=function(){
    this.renderer.render( this.scene, this.camera );
}

Game.prototype.stop=function(){
    this.stoped = true;
}

/**
 * 暂停主循环
 */
Game.prototype.pause=function(){
    this.paused = true;
}

/**
 * 恢复主循环
 */
Game.prototype.resume=function(){
    this.paused = false;
}

/**
 * 重新配置
 */
Game.prototype.updateOptions=function(opts){

}

/**
 * 加入一个聚光灯(类似手电筒)
 * color        灯的颜色
 * intensity    灯的强度
 * distance     最大照射距离
 * angle        聚光灯发生角度
 * penumbera    边缘衰减(0-1)
 * decay        衰减
 * enableShadow 打开灯阴影
 * castShadow   投射阴影
 * shadow.bias        阴影贴图偏差,默认是0,取一个小的值如0.0001有助于得到较好的阴影
 * shadowMapWidth     阴影图的宽度
 * shadowMapHeight    阴影图的高度
 */
Game.prototype.addSpotLight=function(t){
    t = t || {};
    var light = new THREE.SpotLight( Color(t.color||0x909090), 
        t.intensity||1, t.distance||200, 
        t.angle||Math.PI/4, t.penumbra||0.01, t.decay||1 );
    light.distance = t.distance || 200;

    light.name = t.name || '';
    
    light.castShadow = t.castShadow;
    light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 35, 1, 120, 10000 ) );
    light.shadow.bias = t.bias||0;
    light.shadow.mapSize.width = t.shadowMapWidth || 1024;
    light.shadow.mapSize.height = t.shadowMapHeight || 1024;
    light.shadow.camera.near = 10;
    light.shadow.camera.far = 200;

    if(t.position)light.position.set(t.position.x,t.position.y,t.position.z);
    if(t.rotation)light.rotation.set(t.rotation.x,t.rotation.y,t.rotation.z);
    this.scene.add(light);
    return light;
}

/**
 * 加入环境灯(不能投射阴影)
 */
Game.prototype.addAmbientLight=function(t){
    t = t || {};
    var light = new THREE.AmbientLight(Color(t.color||0x606060));
    
    light.name = t.name || '';

    this.scene.add(light);
    return light;
}

/**
 * 加入半球灯(不能投射阴影)
 * skyColor     天空颜色
 * groundColor  地面颜色
 * intensity    灯强度
 */
Game.prototype.addHemiSphereLight=function(t){
    t = t || {};
    var light = new THREE.HemisphereLight( Color(t.skyColor||0xffffff), Color(t.groundColor||0xffffff), t.intensity||0.6 );

    light.name = t.name || '';

    if(t.position)light.position.set(t.position.x,t.position.y,t.position.z);
    if(t.rotation)light.rotation.set(t.rotation.x,t.rotation.y,t.rotation.z);     
    this.scene.add(light);   
    return light;
}

/**
 * 加入方向灯
 */
Game.prototype.addDirectionaLight=function(t){
    t = t || {};
    var light = new THREE.DirectionalLight( Color(t.color||0xffffff),t.intensity||1 );
    light.position.set( -1, 1.75, 1 );
    light.position.multiplyScalar( 50 );

    light.name = t.name || '';

    light.castShadow = false;
    light.shadow.mapSize.width = t.shadowMapWidth || 1024;
    light.shadow.mapSize.height = t.shadowMapHeight || 1024;              
    var d = t.shadowRound||100;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 3500;
    light.shadow.bias = t.bias||0;

    if(t.position)light.position.set(t.position.x,t.position.y,t.position.z);
    if(t.rotation)light.rotation.set(t.rotation.x,t.rotation.y,t.rotation.z);
    this.scene.add(light);
    setTimeout(()=>{
        light.castShadow = true;
    },100);
    return light;
}

/**
 * 删除灯
 */
Game.prototype.removeLight=function(light){
    this.scene.remove(light);
}

Game.prototype.removeSkybox=function(){
    if(this.skybox){
        this.scene.fog = null;
        this.scene.remove(this.skybox.sky);
        this.scene.remove(this.skybox.ground);
        this.skybox.sky = null;
        this.skybox.ground = null;
    }
}
Game.prototype.skyboxToJson=function(){
    if(this.skybox && this.skybox.sky && this.skybox.opts){
        return {
            type : 'sphere',
            skyColor : color(this.skybox.opts.skyColor),
            groundColor : color(this.skybox.opts.groundColor),
            offset : this.skybox.opts.offset,
            raduis : this.skybox.opts.raduis,
            exponent : this.skybox.opts.exponent,
            fogNear : this.skybox.opts.fogNear,
            fogFar : this.skybox.opts.fogFar
        };
    }else return undefined;
    function color(c){
        return {
            r : c.r,
            g : c.g,
            b : c.b
        }
    }    
}
/**
 * 创建一个球形天空盒
 * raduis       天空球半径
 * skyColor     天空颜色
 * groundColor  地面颜色
 */
Game.prototype.addSkybox=function(t){
    this.removeSkybox();
    
    let opts = {
        groundColor : Color((t&&t.groundColor)||0xca8e38),
        specular    : 0x050505,
        skyColor    : Color((t&&t.skyColor)||0x0077ff),
        offset      : (t&&t.offset)||0,
        raduis      : (t&&t.raduis)||400,
        exponent    : (t&&t.exponent)||0.6,
        fogNear     : (t&&t.fogNear)||1,
        fogFar      : (t&&t.fogFar)||2
    };
    this.skybox = {opts:opts};

    this.scene.fog = new THREE.Fog( opts.groundColor, opts.fogNear*opts.raduis, opts.fogFar*opts.raduis );
    var groundGeo = new THREE.PlaneBufferGeometry( 5000, 5000 );
    var groundMat = new THREE.MeshPhongMaterial( { color: opts.groundColor, specular: opts.specular } );

    var ground = new THREE.Mesh( groundGeo, groundMat );
    this.scene.add( ground );
    ground.position.z = -0.1;
    ground.receiveShadow = true;

    var uniforms = {
        topColor:    { value: opts.skyColor },
        bottomColor: { value: opts.groundColor },
        offset:      { value: opts.offset },
        exponent:    { value: opts.exponent }
    };

    var skyGeo = new THREE.SphereGeometry( opts.raduis, 32, 15 );
    var skyMat = new THREE.ShaderMaterial( { 
        vertexShader: THREE.SphereSkyboxShader.vertexShader, 
        fragmentShader: THREE.SphereSkyboxShader.fragmentShader, 
        uniforms: uniforms, 
        side: THREE.BackSide } );
    var sky = new THREE.Mesh( skyGeo, skyMat );
    this.scene.add( sky );

    this.skybox.sky = sky;
    this.skybox.skyMaterial = skyMat;
    this.skybox.ground = ground;
    this.skybox.groundMaterial = groundMat;
    this.skybox.uniforms = uniforms;
    this.skybox.fog = this.scene.fog;
}

/**
 * 加入多pass渲染
 */
Game.prototype.addPass=function(pass){
    if(this.composer===undefined){
        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(new THREE.RenderPass(this.scene,this.camera));
    }
    for(let i=0;i<this.composer.passes.length;i++){
        this.composer.passes[i].renderToScreen = false;
    }
    pass.renderToScreen = true;
    this.composer.addPass(pass);
}

Game.prototype.removePass=function(pass){
    if(this.composer){
        for(let i=0;i<this.composer.passes.length;i++){
            if(this.composer.passes[i]===pass){
                this.composer.passes.splice(i,1);
                break;
            }
        }
        let len = this.composer.passes.length;
        if(len<=1){
            this.composer = undefined;
        }else{
            this.composer.passes[len-1].renderToScreen = true;
        }
    }
}