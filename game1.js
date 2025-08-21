// Optimized Snake Game
// - rAF game loop with fixed-step accumulator
// - Offscreen pre-rendered grid background
// - Correct wrap-around and input reversal guard
// - Prize never spawns on the snake
// - Space to restart cleanly

// Grid configuration
const cellSize = 15;
const gridWidth = 30;
const gridHeight = 30;

// Canvas
var canvas;
var ctx;
var backgroundCanvas;
var backgroundCtx;

// Game state
var snake; // Array of [x, y]
var direction; // [dx, dy]
var pendingDirection; // queued direction from input
var prizeX, prizeY;
var gameOver = true;

// Timing
var stepMs = 200; // logical update step (ms)
var accumulatorMs = 0;
var lastTimestampMs = 0;

init();

function init() {
    snake = [];
    canvas = document.getElementById('canvas');
    canvas.width = cellSize * gridWidth;
    canvas.height = cellSize * gridHeight;
    ctx = canvas.getContext('2d');

    // Offscreen background for the grid
    backgroundCanvas = document.createElement('canvas');
    backgroundCanvas.width = canvas.width;
    backgroundCanvas.height = canvas.height;
    backgroundCtx = backgroundCanvas.getContext('2d');
    buildBackground();

    resetGame();

    document.addEventListener('keydown', onKeyDown, { passive: false });

    // Start rAF loop
    lastTimestampMs = performance.now();
    requestAnimationFrame(frame);
}

function resetGame() {
    snake.length = 0;
    snake.push([5, 9]);
    direction = [0, 1];
    pendingDirection = [0, 1];
    placePrizeNotOnSnake();
    gameOver = false;
    accumulatorMs = 0;
}

function frame(nowMs) {
    // Fixed-step accumulator update
    var deltaMs = nowMs - lastTimestampMs;
    if (deltaMs > 1000) deltaMs = 0; // handle tab-sleep
    lastTimestampMs = nowMs;
    accumulatorMs += deltaMs;

    while (accumulatorMs >= stepMs) {
        update();
        accumulatorMs -= stepMs;
    }

    render();
    requestAnimationFrame(frame);
}

function update() {
    if (gameOver) return;

    // Apply pending direction if not reversing
    var newDx = pendingDirection[0];
    var newDy = pendingDirection[1];
    var curDx = direction[0];
    var curDy = direction[1];
    var isReverse = (newDx === -curDx && newDy === -curDy);
    if (!isReverse) {
        direction = [newDx, newDy];
    }

    var head = snake[snake.length - 1];
    var nextX = (head[0] + direction[0] + gridWidth) % gridWidth;
    var nextY = (head[1] + direction[1] + gridHeight) % gridHeight;

    // Self collision check
    for (var i = 0; i < snake.length; i++) {
        if (snake[i][0] === nextX && snake[i][1] === nextY) {
            gameOver = true;
            return;
        }
    }

    // Move
    snake.push([nextX, nextY]);
    var atePrize = (prizeX === nextX && prizeY === nextY);
    if (atePrize) {
        placePrizeNotOnSnake();
    } else {
        snake.shift();
    }
}

function render() {
    // Draw background grid in one blit
    ctx.drawImage(backgroundCanvas, 0, 0);

    // Draw prize
    drawCell(prizeX, prizeY, "#f0db4f");

    // Draw snake
    for (var s = 0; s < snake.length; s++) {
        var x = snake[s][0];
        var y = snake[s][1];
        var color = (s === 0) ? "#ffffff" : "#ff0000";
        drawCell(x, y, color);
    }

    if (gameOver) {
        // Optional simple overlay
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Game Over - Press Space to Restart", canvas.width / 2, canvas.height / 2);
    }
}

function buildBackground() {
    // Fill background
    backgroundCtx.fillStyle = "#000000";
    backgroundCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    // Grid lines
    backgroundCtx.strokeStyle = "#222222";
    backgroundCtx.lineWidth = 1;
    backgroundCtx.beginPath();
    for (var gy = 0; gy <= gridHeight; gy++) {
        var y = gy * cellSize;
        backgroundCtx.moveTo(0, y);
        backgroundCtx.lineTo(gridWidth * cellSize, y);
    }
    for (var gx = 0; gx <= gridWidth; gx++) {
        var x = gx * cellSize;
        backgroundCtx.moveTo(x, 0);
        backgroundCtx.lineTo(x, gridHeight * cellSize);
    }
    backgroundCtx.stroke();
}

function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
}

function onKeyDown(e) {
    var code = e.keyCode || e.which;
    // Prevent page scroll on arrows and space
    if (code >= 37 && code <= 40) e.preventDefault();
    if (code === 32) e.preventDefault();

    if (code === 32) {
        // Space: restart if over
        if (gameOver) {
            resetGame();
        }
        return;
    }

    if (gameOver) return;

    // Map arrow keys to direction
    switch (code) {
        case 37: // left
            setPendingDirection(-1, 0);
            break;
        case 38: // up
            setPendingDirection(0, -1);
            break;
        case 39: // right
            setPendingDirection(1, 0);
            break;
        case 40: // down
            setPendingDirection(0, 1);
            break;
    }
}

function setPendingDirection(dx, dy) {
    // Prevent direct reversal if snake length > 1
    if (snake.length > 1) {
        var curDx = direction[0];
        var curDy = direction[1];
        if (dx === -curDx && dy === -curDy) {
            return;
        }
    }
    pendingDirection = [dx, dy];
}

function placePrizeNotOnSnake() {
    var occupied = new Set();
    for (var i = 0; i < snake.length; i++) {
        occupied.add(snake[i][0] + "," + snake[i][1]);
    }

    var tries = 0;
    do {
        prizeX = Math.floor(Math.random() * gridWidth);
        prizeY = Math.floor(Math.random() * gridHeight);
        tries++;
        if (tries > 10000) break; // safety
    } while (occupied.has(prizeX + "," + prizeY));
}
