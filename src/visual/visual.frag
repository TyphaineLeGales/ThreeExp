uniform sampler2D u_matCap;
varying vec2 vN;

void main() {

  vec3 base = texture2D( u_matCap, vN ).rgb;
  gl_FragColor = vec4( base, 1. );

}
