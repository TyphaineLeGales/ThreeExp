const THREE = require('three');
const glslify = require('glslify');

exports.init = init;
exports.copy = copy;
exports.render = render;
exports.renderGeometry = renderGeometry;
exports.renderMesh = renderMesh;
exports.debugTo = debugTo;
exports.clearColor = clearColor;
exports.getColorState = getColorState;
exports.setColorState = setColorState;
exports.createRenderTarget = createRenderTarget;

let renderer = exports.renderer = null;
let triGeom = exports.triGeom = null;
exports.clearMaterial = null;
exports.floatType = null;
exports.precisionPrefix = '';
exports.vertexShader = '';

let _scene;
let _camera;

let _tri;

let _debugScene;
let _debugMesh;
let _debugMaterial;

function init (refRenderer, floatType) {
    renderer = exports.renderer = refRenderer;
    exports.floatType = floatType;
    _scene = new THREE.Scene();
    _camera = new THREE.Camera();
    _camera.position.z = 1;

    triGeom = exports.triGeom = new THREE.BufferGeometry();
    triGeom.addAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 4, -1, 0, -1, 4, 0]), 3));

    _tri = new THREE.Mesh(triGeom);
    _tri.frustumCulled = false;
    _scene.add(_tri);
    
    let precisionPrefix = exports.precisionPrefix = 'precision ' + renderer.capabilities.precision + ' float;\n';
    exports.vertexShader = precisionPrefix + glslify('../glsl/quad.vert');

    exports.copyMaterial = new THREE.RawShaderMaterial ({
        uniforms: {
            u_texture: {value: null},
        },
        vertexShader: exports.vertexShader,
        fragmentShader: precisionPrefix + glslify('../glsl/copy.frag'),
        depthTest: false,
        depthWrite: false,
        blending: THREE.NoBlending
    });

    exports.clearMaterial = new THREE.RawShaderMaterial ({
        uniforms: {
            u_color: {value: new THREE.Vector4(1, 1, 1, 1)},
        },
        vertexShader: exports.vertexShader,
        fragmentShader: precisionPrefix + glslify('../glsl/clear.frag'),
        depthTest: false,
        depthWrite: false,
        transparent: true,
        blending: THREE.NoBlending
    });

    _debugScene = new THREE.Scene();
    let debugGeometry =  new THREE.PlaneBufferGeometry(1, 1);
    debugGeometry.translate(0.5, -0.5, 0);

    _debugMaterial = new THREE.RawShaderMaterial ({
        uniforms: {
            u_texture: {value: null},
            u_transform: {value: new THREE.Vector4(0, 0, 1, 1)}
        },
        vertexShader: precisionPrefix + glslify('../glsl/debug.vert'),
        fragmentShader: precisionPrefix + glslify('../glsl/copy.frag'),
        depthTest: false,
        depthWrite: false,
        blending: THREE.NoBlending
    });
    _debugMesh = new THREE.Mesh(debugGeometry, _debugMaterial);
    _debugScene.frustumCulled = false;
    _debugScene.add(_debugMesh);
}

function copy (texture, renderTarget, forceClear) {
    let material = exports.copyMaterial;
    material.uniforms.u_texture.value = texture;
    render(material, renderTarget, forceClear);
}

function render (material, renderTarget, forceClear) {
    _tri.material = material;
    if (renderTarget) {
        renderer.setRenderTarget(renderTarget);
    }
    renderer.render(_scene, _camera, forceClear);
    if (renderTarget) {
        renderer.setRenderTarget(null);
    }
}

function renderGeometry (geometry, material, renderTarget, forceClear) {
    _tri.geometry = geometry;
    render(material, renderTarget, forceClear);
    _tri.geometry = triGeom;
}

function renderMesh (mesh, renderTarget, forceClear) {
    _tri.visible = false;
    _scene.add(mesh);
    if (renderTarget) {
        renderer.setRenderTarget(renderTarget);
    }
    renderer.render(_scene, _camera, forceClear);
    if (renderTarget) {
        renderer.setRenderTarget(null);
    }
    _scene.remove(mesh);
    _tri.visible = true;
}

function debugTo (texture, width, height, x, y) {
    width = width || 200;
    height = width || 200;
    x = x || 0;
    y = y || 0;

    let size = renderer.getSize(new THREE.Vector2());
    x = x / size.width * 2 - 1;
    y = 1 - y / size.height * 2;
    width = width / size.width * 2;
    height = height / size.height * 2;

    _debugMaterial.uniforms.u_texture.value = texture;
    _debugMaterial.uniforms.u_transform.value.set(x, y, width, height);

    let state = getColorState();
    renderer.autoClearColor = false;
    renderer.setRenderTarget(null);
    renderer.render(_debugScene, _camera);
    getColorState(state);
}

function clearColor (r, g, b, a, renderTarget, forceClear) {
    exports.clearMaterial.uniforms.u_color.value.set(r, g, b, a);
    render(exports.clearMaterial, renderTarget, forceClear);
}

function getColorState () {
    return {
        autoClear: renderer.autoClear,
        autoClearColor: renderer.autoClearColor,
        autoClearStencil: renderer.autoClearStencil,
        autoClearDepth: renderer.autoClearDepth,
        clearColor: renderer.getClearColor().getHex(),
        clearAlpha: renderer.getClearAlpha()
    };
}

function setColorState (state) {
    renderer.setClearColor(state.clearColor, state.clearAlpha);
    renderer.autoClear = state.autoClear;
    renderer.autoClearColor = state.autoClearColor;
    renderer.autoClearStencil = state.autoClearStencil;
    renderer.autoClearDepth = state.autoClearDepth;

}

function createRenderTarget (width, height, isRGBA, isNearest, isFloat) {
    return new THREE.WebGLRenderTarget(width, height, {
        wrapS: THREE.ClampToEdgeWrapping, 
        wrapT: THREE.ClampToEdgeWrapping,
        magFilter: isNearest ? THREE.NearestFilter : THREE.LinearFilter,
        minFilter: isNearest ? THREE.NearestFilter : THREE.LinearFilter,
        format: isRGBA ? THREE.RGBAFormat : THREE.RGBFormat,
        type: isFloat ? exports.floatType : THREE.UnsignedByteType,
        anisotropy: 0,
        encoding: THREE.LinearEncoding,
        depthBuffer: false,
        stencilBuffer: false
    });
}