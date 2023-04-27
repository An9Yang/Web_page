#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform sampler2D texR;
uniform sampler2D texG;
uniform sampler2D texB;

void main() {
  vec2 uv = 1.0 - vTexCoord;
  vec4 colR = texture2D(texR, uv);
  vec4 colG = texture2D(texG, uv);
  vec4 colB = texture2D(texB, uv);

  gl_FragColor = vec4(colR.r, colG.g, colB.b, 1.0);
}
