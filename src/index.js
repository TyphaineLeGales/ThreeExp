const browser = require('./core/browser');
const settings = require('./core/settings');
const properties = require('./core/properties');
const fboHelper = require('./helpers/fboHelper');

const OrbitControls = require('./controls/OrbitControls');
const visual = require('./visual/visual');

const THREE = require('three');
const mixIn = require('mout/object/mixIn');

// expose the variable hpgOuroGame to the global
window[settings.GLOBAL_ID] = module.exports = exports = settings;

exports.browser = browser;
exports.properties = properties;

// global functions
exports.checkIsSupported = checkIsSupported;
exports.preInit = preInit;
exports.init = init;
exports.resize = resize;
exports.render = render;

let _controls;

let _renderer;
let _scene;
let _camera;

function checkIsSupported () {
    if (window.WebGLRenderingContext) {
        try {
            return _setGLInfo(document.createElement('canvas'));
        } catch (err) {
            return false;
        }
    }
    return false;
}

function _setGLInfo (canvas) {
    if (!settings.gl) {
        let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if ((gl.getExtension('OES_texture_float') || (gl.getExtension('OES_texture_half_float'))) && gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)) {
            settings.renderTargetFloatType = browser.isIOS || !gl.getExtension('OES_texture_float') ? THREE.HalfFloatType : THREE.FloatType;
            settings.dataFloatType = THREE.FloatType;
        } else {
            settings.useFloatPacking = true;
            settings.renderTargetFloatType = settings.dataFloatType = THREE.UnsignedByteType;
        }
        return true;
    }
    return false;
}

function preInit (opts, onPreloading) {
    mixIn(settings, opts);
    _initStage();

    visual.preInit();

    properties.loader.start(onPreloading);
}

function init (opts) {
    mixIn(settings, opts);

    visual.init();
    _scene.add(visual.container);

    properties.hasInitialized = true;
}

function _initStage () {
    _renderer = properties.renderer = new THREE.WebGLRenderer({
        canvas: settings.canvas,
        antialias: true,
        alpha: false
    });

    _scene = properties.scene = new THREE.Scene();

    _camera = properties.camera = new THREE.PerspectiveCamera(100, 1, 0.05, 100);
    _camera.position.z = 5;

	_controls = new OrbitControls(_camera, settings.canvas);

    _scene.add(_camera);

    properties.resolution = new THREE.Vector2();

    properties.sharedUniforms = {
        u_resolution: {value: properties.resolution}
    }

    fboHelper.init(_renderer, settings.renderTargetFloatType);


    properties.isStageReady = true;
}

function resize (width, height) {
    if (properties.isStageReady) {
        let dpi = 1;
        let dpiWidth = width * dpi;
        let dpiHeight = height * dpi;
        properties.width = dpiWidth;
        properties.height = dpiHeight;
        properties.resolution.set(dpiWidth, dpiHeight);
        _camera.aspect = dpiWidth / dpiHeight;
        _camera.updateProjectionMatrix();
        _renderer.setSize(dpiWidth, dpiHeight);
        visual.resize(dpiWidth, dpiHeight);
    }
}

function render (dt) {
    if (properties.isStageReady) {
        properties.time += dt;

        _renderer.setClearColor(0, 0);
        if (properties.hasInitialized) {
            visual.update(dt);
        }
        _renderer.render(_scene, _camera);
    }
}
