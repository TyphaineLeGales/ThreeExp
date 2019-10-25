const MinSignal = require('min-signal');
const THREE = require('three');
exports.loader = require('quick-loader').create();

exports.gl = null;
exports.isSupportWebGL = null;

exports.renderer = null;
exports.scene = null;
exports.camera = null;
exports.postprocessing = null;

exports.mouse = null;
exports.easedMouse = null;

exports.resolution = null;
exports.isStageReady = false;
exports.hasInitialized = false;

exports.domElement = null;

exports.width = 0;
exports.height = 0;

exports.time = 0;