/**
 * 创建一个和z深度相关的雾(或者叫渐变)
 */

 class ZDepthPhongMaterial extends THREE.MeshPhongMaterial{
    constructor(parameters){
        super(parameters);
        this.zfogEnabled = true;
        this.uniforms = {
            zfogColor : {value: new THREE.Color(0x9f9f9f)},
            zfogHigh : {value:100},
            zfogLow : {value:0}
        };
    }
    enableZFog(b){
        if(b===false)
            this.uniforms.zfogLow.value = this.uniforms.zfogHigh.value = 0;        
        this.zfogEnabled = b;
        this.needsUpdate = true;
    }
    isZFog(){
        return this.zfogEnabled;
    }
    onBeforeCompile(shader){
        if(this.zfogEnabled){
            shader.uniforms.zfogColor = this.uniforms.zfogColor;
            shader.uniforms.zfogHigh = this.uniforms.zfogHigh;
            shader.uniforms.zfogLow = this.uniforms.zfogLow;
            shader.vertexShader = THREE.DepthZFogShader.vertexShader;
            shader.fragmentShader = THREE.DepthZFogShader.fragmentShader;
        }
    }
 };

 export {ZDepthPhongMaterial};