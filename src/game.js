/**
 * 初始化一个THREE环境，包括创建场景，摄像机，灯光等等...
 */
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
 * canvas : 使用给定的节点
 * width,height : 固定的宽高，如果不提供
 * maxFrameSize : 最大的帧尺寸，帧尺寸指的是渲染真的尺寸，过大的尺寸导致低帧率
 * enableStats  : 打开帧率检测小窗口
 */
function Game(opts){
    this.opts = opts || {};
    this.scene = new THREE.Scene();    
    if(this.opts.canvas){
        this.renderer = new THREE.WebGLRenderer({canvas:opts.canvas,antialias:this.opts.enableAA});
    }else{
        this.renderer = new THREE.WebGLRenderer({antialias:this.opts.enableAA});
        document.body.appendChild( this.renderer.domElement );
    }
    //如果指定了尺寸就是用，否则和屏幕尺寸保持一致
    var width;
    var height;    
    if(this.opts.width && this.opts.height){
        width = opts.width;
        height = opts.height;
    }else{
        width = window.innerWidth;
        height = window.innerHeight;
        window.onresize = function(){
            this.setSize(window.innerWidth,window.innerHeight);
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
    this.renderer.domElement.style.width = w+'px';
    this.renderer.domElement.style.height = h+'px';
    this.camera.aspect = w/h;
    this.camera.updateProjectionMatrix();
    if(this.opts.maxFrameSize && w > this.opts.maxFrameSize){
        this.renderer.setSize( this.opts.maxFrameSize,this.opts.maxFrameSize*h/w,false );
    }else{
        this.renderer.setSize( w,h,false );
    }
    this.emit('resize',w,h);
};

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
        requestAnimationFrame( animate );
        if(this.stats)this.stats.update();
        var nt = Date.now();
        if(!this.paused){
            this.emit('update',nt - t);
            this.renderer.render( this.scene, this.camera );
        }
        t = nt;
    }.bind(this);
    animate();    
};

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

    light.castShadow = true;
    light.shadow.mapSize.width = t.shadowMapWidth || 1024;
    light.shadow.mapSize.height = t.shadowMapHeight || 1024;              
    var d = t.shadowRound||50;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.far = 3500;
    light.shadow.bias = t.bias||0;

    if(t.position)light.position.set(t.position.x,t.position.y,t.position.z);
    if(t.rotation)light.rotation.set(t.rotation.x,t.rotation.y,t.rotation.z);
    this.scene.add(light);
    return light;
}

/**
 * 删除灯
 */
Game.prototype.removeLight=function(light){
    this.scene.remove(light);
}