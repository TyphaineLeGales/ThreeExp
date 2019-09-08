const THREE = require('three');
const glslify = require('glslify');

exports.preInit = preInit;
exports.init = init;
exports.resize = resize;
exports.update = update;

exports.container = null;

function preInit() {
    exports.container = new THREE.Object3D();
}

function init () {

  exports.container.add(new THREE.Mesh(new THREE.IcosahedronBufferGeometry(0.5, 2), new THREE.MeshNormalMaterial()));

}

function resize (width, height) {

}

function update (dt) {

}

