// https://p5js.org/reference/#/p5/createA

function setup() {
  createCanvas(windowWidth, windowHeight);
  // let door1 = createA("doors/1", "Door #1");
  // door1.position(50, 150);
  
  // let door2 = createA("doors/2", "Door #2");
  // door2.position(50, 200);
}

function draw() {
  background(220);
  textSize(36);
  text("Which one?", 50, 100)
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}