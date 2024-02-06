const gameArea = document.getElementById('gameArea');
const paddleA = document.getElementById('paddleA');
const paddleB = document.getElementById('paddleB');
const ball = document.getElementById('ball');
const playerScoreDisplay = document.getElementById('playerScore');
const opponentScoreDisplay = document.getElementById('opponentScore');

let paddleSpeed = 5;
let ballSpeedX = 2;
let ballSpeedY = 2;
let paddleAPos = gameArea.offsetHeight / 2 - paddleA.offsetHeight / 2;
let paddleBPos = gameArea.offsetHeight / 2 - paddleB.offsetHeight / 2;
let ballX = gameArea.offsetWidth / 2 - ball.offsetWidth / 2;
let ballY = gameArea.offsetHeight / 2 - ball.offsetHeight / 2;
let playerScore = 0;
let opponentScore = 0;
let gameActive = true;

gameArea.addEventListener('mousemove', (e) => {
    let relativeY = e.clientY - gameArea.getBoundingClientRect().top;
    paddleAPos = Math.max(Math.min(relativeY - paddleA.offsetHeight / 2, gameArea.offsetHeight - paddleA.offsetHeight), 0);
    paddleA.style.top = paddleAPos + 'px';
});

// Touch movement event listener for mobile devices
gameArea.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling when touching the game area

    let touchY = e.touches[0].clientY;
    let relativeY = touchY - gameArea.getBoundingClientRect().top;
    paddleAPos = Math.max(Math.min(relativeY - paddleA.offsetHeight / 2, gameArea.offsetHeight - paddleA.offsetHeight), 0);
    paddleA.style.top = paddleAPos + 'px';
});

function moveBall() {
    if (!gameActive) return;

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >= gameArea.offsetHeight - ball.offsetHeight) {
        ballSpeedY *= -1;
    }

    if ((ballX <= paddleA.offsetWidth && ballY > paddleAPos && ballY < paddleAPos + paddleA.offsetHeight) ||
        (ballX >= gameArea.offsetWidth - paddleB.offsetWidth - ball.offsetWidth && ballY > paddleBPos && ballY < paddleBPos + paddleB.offsetHeight)) {
        ballSpeedX *= -1;
        increaseBallSpeed();
    }

    if (ballX <= 0) {
        opponentScore++;
        updateScoreDisplay();
        resetBallPosition();
    } else if (ballX >= gameArea.offsetWidth - ball.offsetWidth) {
        playerScore++;
        updateScoreDisplay();
        resetBallPosition();
    }

    ball.style.left = ballX + 'px';
    ball.style.top = ballY + 'px';
    paddleB.style.top = paddleBPos + 'px';
}

function updateOpponentPaddle() {
    if (!gameActive) return;

    const paddleBCenter = paddleBPos + paddleB.offsetHeight / 2;
    const distanceToBall = ballY - paddleBCenter;
    let moveSpeed = Math.min(Math.abs(distanceToBall) / 20, paddleSpeed);

    if (distanceToBall < 0) {
        paddleBPos = Math.max(paddleBPos - moveSpeed, 0);
    } else if (distanceToBall > 0) {
        paddleBPos = Math.min(paddleBPos + moveSpeed, gameArea.offsetHeight - paddleB.offsetHeight);
    }
}

function increaseBallSpeed() {
    const speedIncreaseFactor = 1.25;
    ballSpeedX *= speedIncreaseFactor;
    ballSpeedY *= speedIncreaseFactor;
}

function resetBallPosition() {
    ballX = gameArea.offsetWidth / 2 - ball.offsetWidth / 2;
    ballY = gameArea.offsetHeight / 2 - ball.offsetHeight / 2;
    resetBallSpeed();
}

function resetBallSpeed() {
    let angle = Math.random() * (90) + 45; // Adjust the range based on the desired variation
    angle = angle * (Math.PI / 180); // Convert to radians

    let direction = Math.random() < 0.5 ? -1 : 1;

    const baseSpeed = 4; // Increased from 2 to 4 for a faster base speed
    ballSpeedX = Math.cos(angle) * baseSpeed * direction;
    ballSpeedY = Math.sin(angle) * baseSpeed;

    ballSpeedY *= Math.random() < 0.5 ? -1 : 1;
}


function updateScoreDisplay() {
    playerScoreDisplay.textContent = playerScore;
    opponentScoreDisplay.textContent = opponentScore;
    checkForWinner();
}

function checkForWinner() {
    if (playerScore >= 3) {
        alert("You win!");
        resetGame();
    } else if (opponentScore >= 3) {
        alert("AI wins!");
        resetGame();
    }
}

function resetGame() {
    playerScore = 0;
    opponentScore = 0;
    updateScoreDisplay();
    resetBallPosition();
    gameActive = true; // Reactivate the game
}

function gameLoop() {
    if (!gameActive) return;

    moveBall();
    updateOpponentPaddle();
    requestAnimationFrame(gameLoop);
}

gameLoop();
