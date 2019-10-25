attribute vec4 a_position;
attribute vec4 a_bonesIndex;
attribute vec4 a_boneWeights;

void main() {

  gl_Position = projection * view * position;

}