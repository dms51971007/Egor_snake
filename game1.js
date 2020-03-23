var 

function draw_field() {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        var width = 15;
        var mX = 30;
        var mY = 30;
        for (var i = 0; i <= mX; i++) {
            ctx.moveTo(0, i * width);
            ctx.lineTo(width * mY, i * width);

        }

        for (var i = 0; i <= mY; i++) {
            ctx.moveTo(i * width, 0);
            ctx.lineTo(width * i, mX * width);

        }

        ctx.stroke();
    }
}