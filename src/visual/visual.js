const THREE = require('three');
const glslify = require('glslify');

exports.preInit = preInit;
exports.init = init;
exports.resize = resize;
exports.update = update;

exports.container = null;

let _material;
let _geometry;
let _tex;
let mesh;

function preInit() {
    exports.container = new THREE.Object3D();
}

function init () {
    // exports.container.add(new THREE.Mesh(new THREE.IcosahedronBufferGeometry(0.5, 2), new THREE.MeshNormalMaterial()));
    _tex = new THREE.TextureLoader().load('matcap2.jpeg');
    _tex.wrapS = THREE.RepeatWrapping;
    _tex.wrapT = THREE.RepeatWrapping;
  _material = new THREE.ShaderMaterial( {
    uniforms: {
      u_matCap: {
        type: 't',
        value: _tex
      },
    },
    vertexShader: glslify('./visual.vert'),
    fragmentShader: glslify('./visual.frag'),
    flatShading: true
  } );
  // _material.uniforms.tMatCap.value.wrapS =
  // _material.uniforms.tMatCap.value.wrapT =
  // THREE.ClampToEdgeWrapping;


  _geometry = new THREE.TorusKnotGeometry( 11, 3, 270, 18, 3, 4);

  mesh = new THREE.Mesh(_geometry, _material);

  exports.container.add(mesh);

}

function resize (width, height) {

}

function update (dt) {

}

