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
        if(b===false){
            this.zfogLow = this.uniforms.zfogLow.value;
            this.zfogHigh = this.uniforms.zfogHigh.value;
            this.uniforms.zfogLow.value = this.uniforms.zfogHigh.value = -9000;
        }else{
            if(this.zfogLow===+this.zfogLow && this.zfogHigh===+this.zfogHigh){
                this.uniforms.zfogLow.value = this.zfogLow;
                this.uniforms.zfogHigh.value = this.zfogHigh;
            }
        }
        this.zfogEnabled = b;
    }
    isZFog(){
        return this.zfogEnabled;
    }
    onBeforeCompile(shader){
        shader.uniforms.zfogColor = this.uniforms.zfogColor;
        shader.uniforms.zfogHigh = this.uniforms.zfogHigh;
        shader.uniforms.zfogLow = this.uniforms.zfogLow;
        shader.vertexShader = THREE.DepthZFogShader.vertexShader;
        shader.fragmentShader = THREE.DepthZFogShader.fragmentShader;
    }
 };

 export {ZDepthPhongMaterial};