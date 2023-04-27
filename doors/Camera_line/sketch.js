let particles = [];
const num = 2000;

const noiseScale = 0.01 / 2;
let video;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  for (let i = 0; i < num; i++) {
    particles.push(createVector(random(width), random(height)));
  }

  stroke(255);
  strokeWeight(0.5); // Adjust line thickness
  clear();
}

function draw() {
  background(0, 10);

  video.loadPixels();

  for (let i = 0; i < num; i++) {
    let p = particles[i];
    point(p.x, p.y);

    let index = 4 * (int(p.y) * video.width + int(p.x));
    let brightness = (video.pixels[index] + video.pixels[index + 1] + video.pixels[index + 2]) / 3;

    let n = noise(p.x * noiseScale, p.y * noiseScale, frameCount * noiseScale * noiseScale);
    let a = TAU * n * (brightness / 255.0);
    
    let d = dist(p.x, p.y, mouseX, mouseY);
    let speedScale = map(d, 0, width, 5, 1);
    
    p.x += cos(a) * speedScale;
    p.y += sin(a) * speedScale;

    if (!onScreen(p)) {
      p.x = random(width);
      p.y = random(height);
    }
  }
}

function mousePressed() {
  noiseSeed(millis());
}

function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}
