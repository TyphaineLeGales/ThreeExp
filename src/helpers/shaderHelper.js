const THREE = require('three');

exports.glslifyStrip = glslifyStrip;
exports.addChunk = addChunk;
exports.insertBefore = insertBefore;
exports.insertAfter = insertAfter;
exports.replace = replace;

function glslifyStrip (snippet) {
    return snippet.replace(/#define\sGLSLIFY\s./, '');
}
function addChunk (key, snippet) {
    THREE.ShaderChunk[key] = glslifyStrip(snippet);
}
function _wrapInclude (str) {
    return '#include <' + str + '>';
}
function insertBefore (shader, ref, snippet, isInclude) {
    if (isInclude) ref = _wrapInclude(ref);
    return shader.replace(ref, glslifyStrip(snippet) + '\n' + ref);
}
function insertAfter (shader, ref, snippet, isInclude) {
    if (isInclude) ref = _wrapInclude(ref);
    return shader.replace(ref, ref + '\n' + glslifyStrip(snippet) + '\n');
}
function replace (shader, ref, snippet, isInclude) {
    if (isInclude) ref = _wrapInclude(ref);
    return shader.replace(ref, '\n' + glslifyStrip(snippet) + '\n');
}