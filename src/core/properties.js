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

exports.Bone0PositionX= 0;
exports.Bone0PositionY= 0;
exports.Bone0PositionZ= 0;
exports.Bone0RotationX= 0;
exports.Bone0RotationY= 0;
exports.Bone0RotationZ= 0;
exports.Bone0ScaleX= 0;
exports.Bone0ScaleY= 0;
exports.Bone0ScaleZ= 0;