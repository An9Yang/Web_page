let cam;
let frames = [];
let frameDelay = 60;
let numFrames = frameDelay * 3;

let rgbDelayShader;

function preload() {
  rgbDelayShader = loadShader('rgbDelay.vert', 'rgbDelay.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);

  cam = createCapture(VIDEO);
  cam.size(width, height);
  cam.hide();

  for (let i = 0; i < numFrames; i++) {
    const frameGraphics = createGraphics(width, height);
    frameGraphics.pixelDensity(1);
    frames.push(frameGraphics);
  }
}

function draw() {
  let currentFrame = frames.shift();
  currentFrame.image(cam, 0, 0, width, height);
  frames.push(currentFrame);

  shader(rgbDelayShader);
  rgbDelayShader.setUniform('texR', frames[frameDelay * 2]);
  rgbDelayShader.setUniform('texG', frames[frameDelay * 1]);
  rgbDelayShader.setUniform('texB', frames[0]);

  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

