var snake;
var width = 15;
var mX = 30;
var mY = 30;

var prizeX, prizeY;
var nextMove = [0, 1];
var ctx;
var canvas;
var gameOver = true;

init();

function init() {
    snake = new Array;
    var pos = [5, 9];
    snake.push(pos);
    canvas = document.getElementById('canvas');
    canvas.width = width * mX;
    canvas.height = width * mY;

    ctx = canvas.getContext('2d');

    draw_field();
    let timerId = setInterval(() => makeMove(), 200);

    document.addEventListener('keydown', logKey);

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
        console.log(code);
        if (code == 32) gameOver = false;
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
        if (prizeX == x && prizeY == y)
            set_priz();
        else
            snake.shift();

        for (let i = 0; i < snake.length - 1; i++) {
            if (snake[i][0] == x && snake[i][1] == y)
                gameOver = true;
        };
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
    draw_rect(prizeX, prizeY, "#f0db4f");

}


function draw_field() {
   for (var i = 0; i <= mY + 1; i++) {
        ctx.moveTo(0, i * width);
        ctx.lineTo(width * (mX + 1), i * width);

    }

    for (i = 0; i <= mX + 1; i++) {
        ctx.moveTo(i * width, 0);
        ctx.lineTo(width * i, (1 + mY) * width);

    }
    set_priz();
    ctx.stroke();
}
