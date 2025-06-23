function touchStarted() {
  if (!gameStarted) {
    gameStarted = true;
  } else if (gameOver) {
    restartGame(); // atau fungsi kamu sendiri
  } else {
    if (onGround) {
      velocityY = -20; // atau nilai lompatmu
      onGround = false;
    }
  }
  return false; // Biar nggak scroll layar
}
