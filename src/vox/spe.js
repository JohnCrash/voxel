/**
 * 描述SPE
 */
/*global THREE,SPE*/
function vec3(v){
    if(v){
        switch(typeof v){
            case 'object':{
                if(v instanceof Array){
                    return new THREE.Vector3(v[0],v[1],v[2]);
                }else{
                    return new THREE.Vector3(v.x,v.y,v.z);
                }
            }
            case 'string':
            {
                let m = v.match(/([+-.\d]+),([+-.\d]+),([+-.\d]+)/);
                if(m){
                    return new THREE.Vector3(Number(m[1]),Number(m[2]),Number(m[3]));
                }
            }
        }
    }
}
function color(c){
    switch(typeof c){
        case 'string':
            return new THREE.Color(c);
        case 'object':{
            if(c instanceof Array){
                return new THREE.Color(c[0],c[1],c[2]);
            }else{
                return new THREE.Color(c.r,c.g,c.b);
            }
        }
    }
}
function generall(p){
    if(p){
        return {
            value : vec3(p.value),
            spread : vec3(p.spread),
            spreadClamp : vec3(p.spreadClamp),
            radius : p.radius,
            radiusScale : vec3(p.radiusScale),
            distribution : p.distribution,
            randomise : p.randomise
        };
    }
}
function generallValue(p){
    if(p){
        return {
            value : p.value,
            spread : p.spread,
            randomise : p.randomise
        };
    }
}
function generallAxis(p){
    if(p){
        return {
            axis : vec3(p.axis),
            axisSpread : vec3(p.axisSpread),
            angle : p.angle,
            angleSpread : p.angleSpread,
            static : p.static,
            randomise : p.randomise
        };
    }
}
class Spe{
    constructor(json){
        if(json)this.loadFromJson(json);
    }
    //
    loadFromJson(json){
        if(!SPE){
            console.warn('loadFromJson error,import SPE.min.js');
            return;
        }
        if(json && json.group && json.emitter){
            let group = json.group;
            let e = json.emitter;
            this.group = new SPE.Group({
        		texture: group.texture?{
                    value: group.texture.value?THREE.ImageUtils.loadTexture(group.texture.value):undefined
                }:undefined,
                fixedTimeStep:group.fixedTimeStep,
                hasPerspective:group.hasPerspective,
                colorize:group.colorize,
                blending:group.blending,
                transparent:group.transparent,
                alphaTest:group.alphaTest,
                depthWrite:group.depthWrite,
                depthTest:group.depthTest,
                fog:group.fog,
                scale:group.scale
            });
            this.emitter = new SPE.Emitter({
                type:e.type,
                duration:e.duration,
                isStatic:e.isStatic,
                direction:e.direction,
                maxAge:generallValue(e.maxAge),
                position:generall(e.position),
                acceleration:generall(e.acceleration),
                velocity:generall(e.velocity),
                drag:generallValue(e.drag),
                wiggle:generallValue(e.wiggle),
                rotation:generallAxis(e.rotation),
                color : e.color?{
                    value : e.color.map((c)=>{return color(c)}),
                    spread : vec3(e.color.spread),
                    randomise : e.color.randomise
                }:undefined,
                opacity:generallValue(e.opacity),
                angle:generallValue(e.angle),
                size:generallValue(e.size),
                particleCount:e.particleCount,
            });
            this.group.addEmitter( this.emitter );
        }
    }
    dispose(){
        this.group.dispose();
    }
    update(dt){
        this.group.tick(dt/1000);
    }
    node(){
        return this.group.mesh;
    }
};

export default Spe;
