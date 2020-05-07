var GameSnake = (function () {

    var snake;
    var mX = 40;
    var mY = 20;

    var prize;
    var nextMove;
    var prevMove;
    var gameOver = true;


    var Pos = function (x, y) {
        this.x = x;
        this.y = y;
    };

    function init() {

        snake = new Array;

        prize = new Pos(0, 1);
        nextMove = new Pos(0, 1);
        snake.push(new Pos(5, 9));
        snake.push(new Pos(4, 9));
        set_priz();
        gameOver = false;

    }

    function makeMove() {
        if (!gameOver) {
            x = snake[snake.length - 1].x + nextMove.x;
            y = snake[snake.length - 1].y + nextMove.y;
            if (x < 0) x = mX;
            if (x > mX) x = 0;
            if (y < 0) y = mY;
            if (y > mY) y = 0;

            snake.push(new Pos(x, y));

            if (prize.x == x && prize.y == y) {
                set_priz();
            } else {
                prevMove = snake[0];
                snake.shift();
            }

            if (isPosOnSnake(x, y)) {
                gameOver = true;
            }
        }

    }

    function isPosOnSnake(x, y) {
        for (i = 0; i < snake.length - 1; i++) {
            if (snake[i].x == x && snake[i].y == y) {
                return true;
            }
        };
        return false;
    }


    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function set_priz() {
        prize.x = getRandomInt(mX);
        prize.y = getRandomInt(mY);
    }

    return {
        init: init,
        makeMove: makeMove,
        isGameOver: function () {
            return gameOver;
        },
        getSnake: function () {
            return snake;
        },

        getScore: function () {
            return snake.length;
        },

        getPrize: function () {
            return prize;
        },
        getPrevMove: function () {
            return prevMove;
        },

        setNextMove: function (x, y) {
            nextMove = new Pos(x, y);
        }

    }
})();

var UISnake = (function () {
    var ctx;
    var canvas;
    var textStatusGame;
    var mX = 40;
    var mY = 20;
    var width = 15;

    function draw_field() {
        ctx.clearRect(0, 0, width * (mX + 1), width * (mY + 1));
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

    function draw_snake(snake, prevMove) {
        draw_rect(snake[snake.length - 1].x, snake[snake.length - 1].y, "#ff0000");
        if (prevMove !== undefined)
            draw_rect(prevMove.x, prevMove.y, "#ffffff");
    }

    function draw_prize(prize) {
        draw_rect(prize.x, prize.y, "#f0db4f");
    }

    function draw_rect(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * width + 1, y * width + 1, width - 2, width - 2);
    }

    function drawStatus(gameOver, score) {
        if (gameOver) {
            textStatusGame.textContent = "Нажмите пробел для начала, счет: " + score;
        } else {
            textStatusGame.textContent = "Cчет: " + score;
        }
    }

    function init() {

        canvas = document.getElementById('canvas');
        textStatusGame = document.getElementById('statusGame');
        canvas.width = width * (mX + 1) + 1;
        canvas.height = width * (mY + 1) + 1;
        ctx = canvas.getContext('2d');
        drawStatus(true, 0);
        draw_field();

    }

    return {
        init: init,
        draw: function (gSnake) {
            draw_snake(gSnake.getSnake(), gSnake.getPrevMove());
            draw_prize(gSnake.getPrize());
            drawStatus(gSnake.isGameOver(), gSnake.getScore());


        }
    }
})();

var SnakeController = (function (gSnake, UIsnake) {


    setInterval(() => makeMove(), 200);
    document.addEventListener('keydown', logKey);

    UIsnake.init();

    function makeMove() {
        if (!gSnake.isGameOver()) {
            gSnake.makeMove();
            UIsnake.draw(gSnake);
        }
    }

    function logKey(e) {
        let code = e.keyCode;
        if (!gSnake.isGameOver()) {
            switch (code) {
                case 37:
                    gSnake.setNextMove(-1, 0);
                    break; //Left key
                case 38:
                    gSnake.setNextMove(0, -1);
                    break; //Up key
                case 39:
                    gSnake.setNextMove(1, 0);
                    break; //Right key
                case 40:
                    gSnake.setNextMove(0, 1);
                    break; //Down key
            }
        } else {
            if (code == 32) {
                gSnake.init();
                UIsnake.init();
                UIsnake.draw(gSnake);
            }
        }
    }



})(GameSnake, UISnake);
