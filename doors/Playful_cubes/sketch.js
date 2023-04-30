let vertShader;
let fragShader;
let shaderProgram;
let boxGraphics;
let button;
let play = true;
let explodingCubes = [];
let particles = [];
let numParticlesSlider;
let colorfulParticlesCheckbox;


function preload() {
  vertShader = loadStrings('shader.vert');
  fragShader = loadStrings('shader.frag');
   loadScript("Particle.js");
}

function loadScript(url) {
  const script = document.createElement("script");
  script.src = url;
  script.async = false;
  document.head.appendChild(script);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  shaderProgram = createShader(vertShader.join('\n'), fragShader.join('\n'));
  boxGraphics = createGraphics(200, 200, WEBGL);

  button = createButton('Play/Pause');
  button.position(20, 20);
  button.mousePressed(togglePlay);

  mouseClicked = () => {
    let xIndex = floor(map(mouseX, 0, width, -1, 2));
    let yIndex = floor(map(mouseY, 0, height, -1, 2));
    explodingCubes.push({ x: xIndex, y: yIndex, age: 0 });
  };
    // UI elements
  numParticlesSlider = createSlider(1, 50, 20, 1);
  numParticlesSlider.position(20, 50);

  colorfulParticlesCheckbox = createCheckbox('Colorful particles', false);
  colorfulParticlesCheckbox.position(20, 80);
}

function togglePlay() {
  play = !play;
}

function draw() {
  if (!play) {
    return;
  }

  background(50);
  // Add a light source
  pointLight(255, 255, 255, 200, 0, 300);
  ambientLight(100);
updateParticles();
  let rotationX = map(mouseX, 0, width, -0.005, 0.005);
  let rotationY = map(mouseY, 0, height, -0.005, 0.005);

  // Draw multiple rotating cubes with the shader applied
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let exploded = false;

      for (let k = explodingCubes.length - 1; k >= 0; k--) {
        let explodingCube = explodingCubes[k];

        if (explodingCube.x === i && explodingCube.y === j) {
          exploded = true;
          drawExplosion(i, j, explodingCube.age);
          explodingCube.age++;

          if (explodingCube.age > 100) {
            explodingCubes.splice(k, 1);
          }
        }
      }

      if (!exploded) {
        drawCube(i, j, rotationX, rotationY);
      }
    }
  }
}
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let particle = particles[i];
    particle.update();
    particle.display();

    if (particle.isDead()) {
      particles.splice(i, 1);
    }
  }
}

function drawCube(i, j, rotationX, rotationY) {
  boxGraphics.shader(shaderProgram);
  boxGraphics.background(100, 50, 150);
  boxGraphics.noStroke();
  boxGraphics.rotateX(frameCount * (rotationX + i * 0.01));
  boxGraphics.rotateY(frameCount * (rotationY + j * 0.01));
  boxGraphics.box(100);

  push();
  texture(boxGraphics);
  noStroke();
  let x = lerp(i * 200, i * 200 + random(-1, 1), 0.1);
  let y = lerp(j * 200, j * 200 + random(-1, 1), 0.1);
  translate(x, y, 0);
  rotateX(frameCount * (rotationX + i * 0.01) + random(-0.01, 0.01));
  rotateY(frameCount * (rotationY + j * 0.01) + random(-0.01, 0.01));
  box(100);
  pop();
}

function drawExplosion(i, j, age) {
  if (age === 0) {
    let numParticles = numParticlesSlider.value();
    let position = createVector(i * 200, j * 200, 0);

    for (let k = 0; k < numParticles; k++) {
      let particle = new Particle(position);
      if (!colorfulParticlesCheckbox.checked()) {
        particle.color = color(255, 255, 255);
      }
      particles.push(particle);
    }
  }
}


class Particle {
  constructor(position) {
    this.position = position.copy();
    this.velocity = createVector(random(-1, 1), random(-1, 1), random(-1, 1));
    this.acceleration = createVector(0, 0, 0);
    this.lifespan = 255;
    this.size = random(10, 20);
    this.shape = Math.floor(random(3));
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.lifespan -= 2;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  isDead() {
    return this.lifespan <= 0;
  }

 display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    fill(this.color, this.lifespan);
    noStroke();
    
    if (this.shape === 0) {
      box(this.size);
    } else if (this.shape === 1) {
      sphere(this.size / 2);
    } else if (this.shape === 2) {
      cylinder(this.size / 2, this.size);
    }
    
    pop();
  }
}


