//http://paperjs.org/examples/candy-crash/
let capture;
class Ball {
  constructor(r, p, v) {
    this.radius = r;
    this.point = p;
    this.vector = v;
    this.maxVec = 15;
    this.numSegment = Math.floor(r / 3 + 2);
    this.boundOffset = [];
    this.boundOffsetBuff = [];
    this.sidePoints = [];
    this.path = [];

    for (let i = 0; i < this.numSegment; i++) {
      this.boundOffset.push(this.radius);
      this.boundOffsetBuff.push(this.radius);
      this.path.push(createVector());
      this.sidePoints.push(p5.Vector.fromAngle(radians(360 / this.numSegment * i), 1));
    }
  }

  iterate() {
    this.checkBorders();
    if (this.vector.mag() > this.maxVec) this.vector.setMag(this.maxVec);
    this.point.add(this.vector);
    this.updateShape();
  }

  checkBorders() {
    if (this.point.x < -this.radius) this.point.x = width + this.radius;
    if (this.point.x > width + this.radius) this.point.x = -this.radius;
    if (this.point.y < -this.radius) this.point.y = height + this.radius;
    if (this.point.y > height + this.radius) this.point.y = -this.radius;
  }

  updateShape() {
    for (let i = 0; i < this.numSegment; i++) {
      this.path[i] = this.getSidePoint(i);
    }

    beginShape();
    for (let v of this.path) {
      vertex(v.x, v.y);
    }
    endShape(CLOSE);

    for (let i = 0; i < this.numSegment; i++) {
      if (this.boundOffset[i] < this.radius / 4) this.boundOffset[i] = this.radius / 4;
      let next = (i + 1) % this.numSegment;
      let prev = i > 0 ? i - 1 : this.numSegment - 1;
      let offset = this.boundOffset[i];
      offset += (this.radius - offset) / 15;
      offset += ((this.boundOffset[next] + this.boundOffset[prev]) / 2 - offset) / 3;
      this.boundOffsetBuff[i] = this.boundOffset[i] = offset;
    }
  }

  react(b) {
    let dist = this.point.dist(b.point);
    if (dist < this.radius + b.radius && dist !== 0) {
      let overlap = this.radius + b.radius - dist;
      let direc = p5.Vector.sub(this.point, b.point).normalize().mult(overlap * 0.015);
      this.vector.add(direc);
      b.vector.sub(direc);

      this.calcBounds(b);
      b.calcBounds(this);
      this.updateBounds();
      b.updateBounds();
    }
  }

  getBoundOffset(b) {
    let diff = p5.Vector.sub(this.point, b);
    let angle = (diff.heading() + PI) % TWO_PI;
    return this.boundOffset[Math.floor(angle / TWO_PI * this.boundOffset.length)];
  }

  calcBounds(b) {
    for (let i = 0; i < this.numSegment; i++) {
      let tp = this.getSidePoint(i);
      let bLen = b.getBoundOffset(tp);
      let td = tp.dist(b.point);
      if (td < bLen) {
        this.boundOffsetBuff[i] -= (bLen -  td) / 2;
  }
}
}

getSidePoint(index) {
return p5.Vector.add(this.point, p5.Vector.mult(this.sidePoints[index], this.boundOffset[index]));
}

updateBounds() {
for (let i = 0; i < this.numSegment; i++) {
this.boundOffset[i] = this.boundOffsetBuff[i];
}
}
  display() {
    let ballMask = createGraphics(width, height);
    ballMask.fill(255);
    ballMask.beginShape();
    for (let v of this.path) {
      ballMask.vertex(v.x, v.y);
    }
    ballMask.endShape(CLOSE);

    let maskedCapture = capture.get();
    maskedCapture.mask(ballMask);
    image(maskedCapture, 0, 0);
  }
}

// --------------------- main ---------------------

let balls = [];
let numBalls = 9;

function setup() {
  createCanvas(640, 480);
  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();

  for (let i = 0; i < numBalls; i++) {
    let position = createVector(random(width), random(height));
    let vector = p5.Vector.random2D().mult(random(10));
    let radius = random(60) + 60;
    balls.push(new Ball(radius, position, vector));
  }
}

function draw() {
  background(0);

  for (let i = 0; i < balls.length - 1; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].react(balls[j]);
    }
  }

  for (let ball of balls) {
    ball.iterate();
    ball.display();
  }
}
