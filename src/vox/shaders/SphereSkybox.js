/**
 * 创建一个球形天空盒
 */
/*global THREE*/
THREE.SphereSkyboxShader = {

	uniforms: {
		"topColor":   { value: null },
        "bottomColor":{ value: null },
        "offset":     { value: 30 },
        "exponent" :  {value : 0 }
	},
    //下面的代码从meshphong_vert.glsl复制过来
    vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
    fragmentShader: `
         uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
            float h = normalize( vWorldPosition + offset ).z;
            gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
        }`
};
