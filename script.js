let gameStarted = false;
let gameOver = false;

let potatoX, potatoY;
let potatoW = 60, potatoH = 60;
let velocityY = 0;
let gravity = 1.2;
let onGround = true;
let groundY;

let obstacles = [];
let powerUps = [];

let score = 0;
let level = 1;

let shieldActive = false;
let shieldTimer = 0;

let bigPotatoTimer = 0;
let speedBoostTimer = 0;

let bgX = 0;
let bgSpeed = 4;

let rewardText = "";
let rewardTimer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  resetGame();
  frameRate(60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  groundY = height - 80;
  if (!gameOver) potatoY = groundY - potatoH;
}

function resetGame() {
  groundY = height - 80;
  potatoX = 100;
  potatoY = groundY - potatoH;
  velocityY = 0;
  onGround = true;
  obstacles = [];
  powerUps = [];
  score = 0;
  level = 1;
  shieldActive = false;
  shieldTimer = 0;
  bigPotatoTimer = 0;
  speedBoostTimer = 0;
  rewardText = "";
  rewardTimer = 0;
  gameOver = false;
}

function draw() {
  background(180, 240, 255);
  if (!gameStarted) {
    drawMenu();
  } else if (!gameOver) {
    updateLevel();
    drawGame();
  } else {
    drawGameOver();
  }
}

function drawMenu() {
  fill(0);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Dieng Potato Rush", width / 2, height / 3);

  fill(0, 150, 0);
  rect(width / 2 - 70, height / 2, 140, 50, 10);

  fill(255);
  textSize(28);
  text("START", width / 2, height / 2 + 28);
}

function updateLevel() {
  level = 1 + floor(score / 10);
}

function drawGame() {
  bgSpeed = speedBoostTimer > 0 ? 6 + level * 0.5 + 2 : 4 + level * 0.5;
  drawMovingBackground();

  velocityY += gravity;
  potatoY += velocityY;

  if (potatoY >= groundY - potatoH) {
    potatoY = groundY - potatoH;
    velocityY = 0;
    onGround = true;
  }

  drawPotato(potatoX, potatoY, velocityY, frameCount);

  if (frameCount % max(90 - level * 5, 30) === 0) {
    let type = int(random(3));
    let obSpeed = 6 + level * 1.5;
    if (type === 0)
      obstacles.push(new Obstacle(width, groundY - 50, 40, 50, obSpeed));
    else if (type === 1)
      obstacles.push(new Obstacle(width, groundY - 30, 30, 30, obSpeed));
    else
      obstacles.push(new ObstacleTriangle(width, groundY - 50, 40, 50, obSpeed));
  }

  if (frameCount % 300 === 0) {
    let types = ['kentang', 'bawang', 'wortel'];
    let type = random(types);
    powerUps.push(new PowerUp(width, groundY - 70, 30, 30, 6 + level, type));
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    let ob = obstacles[i];
    ob.update();
    ob.display();
    if (!shieldActive && ob.hits(potatoX, potatoY, potatoW, potatoH)) {
      gameOver = true;
    }
    if (!ob.active) {
      obstacles.splice(i, 1);
      score++;
    }
  }

  for (let i = powerUps.length - 1; i >= 0; i--) {
    let pu = powerUps[i];
    pu.update();
    pu.display();

    if (pu.collected(potatoX, potatoY, potatoW, potatoH)) {
      if (pu.type === 'kentang') {
        score += 5;
        rewardText = '+5 Skor!';
      } else if (pu.type === 'bawang') {
        bigPotatoTimer = 300;
        rewardText = 'Ukuran Besar!';
      } else if (pu.type === 'wortel') {
        speedBoostTimer = 300;
        rewardText = 'Cepat Sekali!';
      }
      rewardTimer = 60;
      powerUps.splice(i, 1);
    } else if (!pu.active) {
      powerUps.splice(i, 1);
    }
  }

  if (bigPotatoTimer > 0) bigPotatoTimer--;
  if (speedBoostTimer > 0) speedBoostTimer--;
  if (shieldActive) {
    shieldTimer--;
    if (shieldTimer <= 0) shieldActive = false;
  }

  if (rewardTimer > 0) {
    fill(255, 200, 0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text(rewardText, potatoX + potatoW / 2, potatoY - 30);
    rewardTimer--;
  }

  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Score: " + score, 20, 20);
  text("Level: " + level, 20, 45);
}

function drawGameOver() {
  background(255, 100, 100);
  fill(0);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Game Over!", width / 2, height / 2 - 20);
  textSize(24);
  text("Skor: " + score, width / 2, height / 2 + 20);
  text("Tekan R untuk restart", width / 2, height / 2 + 60);
}

function keyPressed() {
  if (!gameStarted) return;
  if (key === " " && onGround && !gameOver) {
    velocityY = -18;
    onGround = false;
  }
  if (gameOver && (key === "r" || key === "R")) {
    resetGame();
  }
}

function mousePressed() {
  if (!gameStarted) {
    if (
      mouseX > width / 2 - 70 &&
      mouseX < width / 2 + 70 &&
      mouseY > height / 2 &&
      mouseY < height / 2 + 50
    ) {
      gameStarted = true;
    }
  }
}

function drawMovingBackground() {
  bgX -= bgSpeed;
  if (bgX <= -width) bgX = 0;
  fill(80, 200, 120);
  rect(0, groundY, width, height - groundY);
  drawMountains(bgX);
  drawMountains(bgX + width);
}

function drawMountains(offsetX) {
  fill(100, 180, 100);
  noStroke();
  triangle(100 + offsetX, groundY, 250 + offsetX, 150, 400 + offsetX, groundY);
  triangle(300 + offsetX, groundY, 500 + offsetX, 100, 650 + offsetX, groundY);
}

function drawPotato(x, y, velocity, frameCount) {
  push();
  translate(x, y);
  let walkAnim = onGround ? sin(frameCount * 0.3) * 5 : 0;
  let scaleFactor = bigPotatoTimer > 0 ? 1.5 : 1;
  scale(scaleFactor);
  fill(245, 200, 120);
  stroke(120, 80, 40);
  strokeWeight(2);
  ellipse(potatoW / 2, potatoH / 2, potatoW, potatoH);
  fill(0);
  noStroke();
  ellipse(20, 20, 8, 8);
  ellipse(40, 20, 8, 8);
  noFill();
  stroke(0);
  strokeWeight(1);
  arc(30, 35, 20, 10, 0, PI);
  fill(200, 0, 0);
  rect(10, potatoH - 5 + walkAnim, 15, 5);
  rect(35, potatoH - 5 - walkAnim, 15, 5);
  pop();
}

class Obstacle {
  constructor(x, y, w, h, speed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.active = true;
  }
  update() {
    this.x -= this.speed;
    if (this.x + this.w < 0) this.active = false;
  }
  display() {
    fill(120);
    rect(this.x, this.y, this.w, this.h);
  }
  hits(px, py, pw, ph) {
    return !(
      px + pw < this.x || px > this.x + this.w || py + ph < this.y || py > this.y + this.h
    );
  }
}

class ObstacleTriangle extends Obstacle {
  display() {
    fill(150, 80, 80);
    triangle(this.x, this.y + this.h, this.x + this.w / 2, this.y, this.x + this.w, this.y + this.h);
  }
}

class PowerUp {
  constructor(x, y, w, h, speed, type) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.active = true;
    this.type = type;
  }
  update() {
    this.x -= this.speed;
    if (this.x + this.w < 0) this.active = false;
  }
  display() {
    if (this.type === 'kentang') fill(245, 180, 80);
    else if (this.type === 'bawang') fill(255, 255, 200);
    else if (this.type === 'wortel') fill(255, 130, 0);
    ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w, this.h);
    fill(0);
    textSize(14);
    textAlign(CENTER, CENTER);
    if (this.type === 'kentang') text('K', this.x + this.w / 2, this.y + this.h / 2);
    else if (this.type === 'bawang') text('B', this.x + this.w / 2, this.y + this.h / 2);
    else if (this.type === 'wortel') text('W', this.x + this.w / 2, this.y + this.h / 2);
  }
  collected(px, py, pw, ph) {
    return !(
      px + pw < this.x || px > this.x + this.w || py + ph < this.y || py > this.y + this.h
    );
  }
}
