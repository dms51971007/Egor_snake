var snake;
var width = 15;
var mX = 40;
var mY = 20;

var prizeX, prizeY;
var nextMove = [0, 1];
var ctx;
var canvas;
var textStatusGame;
var gameOver = true;

init();

function init() {
    canvas = document.getElementById('canvas');
    textStatusGame = document.getElementById('statusGame');
    canvas.width = width * (mX + 1) + 1;
    canvas.height = width * (mY + 1) + 1;

    ctx = canvas.getContext('2d');

    let timerId = setInterval(() => makeMove(), 200);
    document.addEventListener('keydown', logKey);
    newGame();
}

function newGame() {

    snake = new Array;
    var pos = [5, 9];
    snake.push(pos);
    draw_field();
    set_priz();
    drawStatus();


}


function logKey(e) {
    let code = e.keyCode;
    if (!gameOver) {
        switch (code) {
            case 37:
                nextMove = [-1, 0];
                break; //Left key
            case 38:
                nextMove = [0, -1];
                break; //Up key
            case 39:
                nextMove = [1, 0];
                break; //Right key
            case 40:
                nextMove = [0, 1];
                break; //Down key
        }
    } else {
        if (code == 32) {
            gameOver = false;
            newGame();
        }
    }
}


function makeMove() {
    if (!gameOver) {
        let x = snake[snake.length - 1][0] + nextMove[0];
        let y = snake[snake.length - 1][1] + nextMove[1];
        if (x < 0) x = mX;
        if (x > mX) x = 0;
        if (y < 0) y = mY;
        if (y > mY) y = 0;

        snake.push([x, y]);
        draw_snake();
        drawPrise();
        if (prizeX == x && prizeY == y) {
            set_priz();
            drawStatus();
        } else
            snake.shift();
        if (isPosOnSnake(x, y)) {
            gameOver = true;
            drawStatus();
        }
        //        for (let i = 0; i < snake.length - 1; i++) {
        //            if (snake[i][0] == x && snake[i][1] == y) {
        //                gameOver = true;
        //                drawStatus();
        //            }
        //        };   
    }

}

function drawStatus() {
    if (gameOver) {
        textStatusGame.textContent = "Нажмите пробел для начала, счет: " + snake.length;
    } else {
        textStatusGame.textContent = "Cчет: " + snake.length;
    }
}


function draw_segment(ctx, x, y, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x * width + 9, y * width + 9, 6, 0, Math.PI * 2, true); // Внешняя окружность
    ctx.fill();
}

function draw_rect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * width + 1, y * width + 1, width - 2, width - 2);
}

function isPosOnSnake(x, y) {
    for (let i = 0; i < snake.length - 1; i++) {
        if (snake[i][0] == x && snake[i][1] == y) {
            return true;
        }
    };
    return false;
}


function draw_snake() {
    for (let pr in snake) {
        let x = snake[pr][0];
        let y = snake[pr][1];
        if (pr == 0) draw_rect(x, y, "#ffffff")
        else draw_rect(x, y, "#ff0000");
    }
    ctx.stroke();
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function set_priz() {
    prizeX = getRandomInt(mX);
    prizeY = getRandomInt(mY);
    
    prizeX = snake[0][0];
    prizeY = snake[0][1];

}

function drawPrise() {
    draw_rect(prizeX, prizeY, "#f0db4f");
}


function draw_field() {
    ctx.clearRect(0, 0, width * (mX + 5), width * (mY + 5));
    for (var i = 0; i <= mY + 1; i++) {
        ctx.moveTo(0, i * width);
        ctx.lineTo(width * (mX + 1), i * width);

    }

    for (i = 0; i <= mX + 1; i++) {
        ctx.moveTo(i * width, 0);
        ctx.lineTo(width * i, (1 + mY) * width);

    }
    ctx.stroke();
}
