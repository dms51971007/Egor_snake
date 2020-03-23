var snake;
var width = 15;
var mX = 30;
var mY = 30;
var nextMove = [0, 1];
var ctx;
var canvas;

init();

function init() {
    snake = new Array;
    var pos = [5, 9];
    snake.push(pos);
    var pos = [5, 10];
    snake.push(pos);
    var pos = [5, 11];
    snake.push(pos);
    var pos = [5, 12];
    snake.push(pos);
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    draw_field();
    var timerId = setInterval(() => makeMove(), 1000);

    document.addEventListener('keydown', logKey);

}

function logKey(e) {
    var code = e.keyCode;
    switch (code) {
        case 37:
            nextMove = [-1,0];
            break; //Left key
        case 38:
            nextMove = [0,-1];
            break; //Up key
        case 39:
            nextMove = [1,0];
            break; //Right key
        case 40:
            nextMove = [0,1];
            break; //Down key
    }
}


function makeMove() {
    var x = snake[snake.length - 1][0] + nextMove[0];
    var y = snake[snake.length - 1][1] + nextMove[1];
    snake.push([x, y]);
    draw_snake();
    snake.shift();
}

function draw_segment(ctx, x, y, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x * width + 9, y * width + 9, 6, 0, Math.PI * 2, true); // Внешняя окружность
    ctx.fill();
}

function draw_snake() {
    for (var pr in snake) {
        var x = snake[pr][0];
        var y = snake[pr][1];
        if (pr == 0) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(x * width + 1, y * width + 1, width - 2, width - 2);
        } else {
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(x * width + 1, y * width + 1, width - 2, width - 2);
        }
    }

    ctx.stroke();

}

function draw_field() {
    for (var i = 0; i <= mX; i++) {
        ctx.moveTo(0, i * width);
        ctx.lineTo(width * mY, i * width);

    }

    for (i = 0; i <= mY; i++) {
        ctx.moveTo(i * width, 0);
        ctx.lineTo(width * i, mX * width);

    }

    ctx.stroke();
}