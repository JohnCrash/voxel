/**
 * 实现一个简单的体积雾
 */
module.exports = VolumeFog;

var VolumeFogVertex = `
    varying vec2 vUv;
    varying vec4 Pos;
    void main(){
        vUv = uv;
        Pos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        gl_Position = Pos;
    }
`;
var VolumeFogFragment = `
    #include <common>
    #include <packing>
    varying vec2 vUv;
    varying vec4 Pos;
    uniform vec2 size;
    uniform vec3 fogColor;
    uniform sampler2D frameTexture;
    uniform sampler2D depthTexture;
    void main(){
        vec4 pos = Pos;//gl_FragCoord;
        vec2 p = (pos.xy/pos.w+1.0)/2.0;
        float d = unpackRGBAToDepth(texture2D(depthTexture, p));
        if( d > Pos.z/Pos.w ){
            //float a = d+Pos.z/Pos.w;
            gl_FragColor = mix(texture2D(frameTexture,p),vec4(fogColor,1.0),0.5);
            //gl_FragColor = vec4(fogColor,1.0);
        }else{
            gl_FragColor = texture2D(frameTexture,p);
        }
    }
`;

function VolumeFog( game,box,c ) {

	THREE.Pass.call( this );

    this.camera = game.camera;
    let size = game.renderer.getSize();
    this.scene = new THREE.Scene();
    this.uniforms = {
        frameTexture:{value:null},
        depthTexture:{value:null},
        size:{value:new THREE.Vector2(size.width,size.height)},
        fogColor : {value:new THREE.Color(c)}
    };
    box.material = new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: VolumeFogVertex,
            fragmentShader: VolumeFogFragment,
            side:THREE.FrontSide
        }
    );
	this.scene.add( box );
};

VolumeFog.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.ShaderPass,

	render: function( renderer, writeBuffer, readBuffer, delta, maskActive ) {
        if(this.uniforms.frameTexture){
            this.uniforms.frameTexture.value = readBuffer.texture;
            this.uniforms.depthTexture.value = readBuffer.depthTexture;
        }
		if ( this.renderToScreen ) {
			renderer.render( this.scene, this.camera );
		} else {
			renderer.render( this.scene, this.camera, writeBuffer, this.clear );
		}
	}
} );
