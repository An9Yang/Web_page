let shaderProgram;
let canvas;
let cameraFeed;

let vertShader = `
// vert file and comments from adam ferriss
// https://github.com/aferriss/p5jsShaderExamples
// our vertex data
attribute vec3 aPosition;
attribute vec2 aTexCoord;
// lets get texcoords just for fun!
varying vec2 vTexCoord;
void main() {
    // copy the texcoords
    vTexCoord = aTexCoord;
    // copy the position data into a vec4, using 1.0 as the w component
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    // send the vertex information on to the fragment shader
    gl_Position = positionVec4;
}
`;

let fragShader = `
  #ifdef GL_ES
  precision mediump float;
  #endif

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform sampler2D u_texture;

  float random (in vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  vec2 waterFlow(vec2 st, float t) {
      float x = st.x + 0.15 * t * sin(st.y * 30.0 + t);
      float y = st.y + 0.15 * t * sin(st.x * 30.0 + t);
      return vec2(x, y);
  }

  void main() {
      vec2 st = gl_FragCoord.xy / u_resolution;
      st.y = 1.0 - st.y;
      vec3 col = texture2D(u_texture, st).rgb;
      float gray = (col.r + col.g + col.b) / 3.0;
      vec2 uv = waterFlow(st, gray * u_time * 0.001);

      vec3 finalColor = texture2D(u_texture, uv).rgb;
      gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  noStroke();
  cameraFeed = createCapture(VIDEO);
  cameraFeed.hide();
  shaderProgram = createShader(vertShader, fragShader);

}

function draw() {
  shaderProgram.setUniform('u_time', millis() / 1000.0);
  shaderProgram.setUniform('u_resolution', [width, height]);
  shaderProgram.setUniform('u_texture', cameraFeed);
  shader(shaderProgram);
  scale(-1,-1);
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
