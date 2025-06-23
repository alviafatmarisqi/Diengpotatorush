let potatoX, potatoY;
let potatoW = 60, potatoH = 60;
let velocityY = 0;
let gravity = 1.2;
let onGround = true;
let groundY;

let score = 0;
let gameStarted = false;
let gameOver = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  groundY = height - 100;
  potatoX = width / 4;
  potatoY = groundY - potatoH;
}

function draw() {
  background('#d4a373');

  // Ground
  fill('#fefae0');
  rect(0, groundY, width, height - groundY);

  if (!gameStarted) {
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text("Tap untuk mulai!", width / 2, height / 2);
    return;
  }

  if (gameOver) {
    fill(0);
    textSize(28);
    textAlign(CENTER);
    text("Game Over\nSkor: " + score + "\nTap atau tekan tombol untuk ulang", width / 2, height / 2);
    return;
  }

  // Potato (character)
  fill('#fcbf49');
  rect(potatoX, potatoY, potatoW, potatoH, 10);

  // Gravity
  if (!onGround) {
    velocityY += gravity;
    potatoY += velocityY;
    if (potatoY >= groundY - potatoH) {
      potatoY = groundY - potatoH;
      onGround = true;
      velocityY = 0;
    }
  }

  // Skor naik terus
  score++;
  fill(0);
  textSize(20);
  text("Skor: " + score, 80, 40);
}

function touchStarted() {
  if (gameOver) {
    restartGame();
    return false;
  }

  if (!gameStarted) {
    gameStarted = true;
    return false;
  }

  if (onGround) {
    velocityY = -20;
    onGround = false;
  }

  return false;
}

function restartGame() {
  score = 0;
  potatoY = groundY - potatoH;
  gameOver = false;
  gameStarted = false;
  onGround = true;
  hideRestartButton();
}

function keyPressed() {
  if (key === 'r') {
    restartGame();
  }
}

function endGame() {
  gameOver = true;
  showRestartButton();
}

function showRestartButton() {
  document.getElementById("restartBtn").style.display = "block";
}

function hideRestartButton() {
  document.getElementById("restartBtn").style.display = "none";
}

document.getElementById("restartBtn").addEventListener("click", () => {
  restartGame();
});
