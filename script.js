const CANVAS_NODE = document.getElementById("arkanoid");
const CTX = CANVAS_NODE.getContext("2d");

CANVAS_NODE.width = innerWidth;
CANVAS_NODE.height = innerHeight;

const BALL_RADIUS = 10;

const PADDLE_WIDTH = 75;
const PADDLE_HEIGHT = 15;

const BRICK_ROW_COUNT = 5;
const BRICK_COLUMN_COUNT = 5;
const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET = 30;

let ballX = CANVAS_NODE.width / 2;
let ballY = CANVAS_NODE.height - 50;
let dx = 5;
let dy = -5;

let paddleX = (CANVAS_NODE.width - PADDLE_WIDTH) / 2;

let score = 0;
let lives = 3;

const bricks = [];

for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
    bricks[c] = [];

    for (let r = 0; r < BRICK_ROW_COUNT; r++){
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        }
    }
}

function drawBall() {
    CTX.fillStyle = "#FF0000";
    CTX.beginPath();
    CTX.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    CTX.fill();
    CTX.closePath();
}

function drawPaddle() {
    CTX.fillStyle = "#8B4513";
    CTX.beginPath();
    CTX.rect(paddleX, CANVAS_NODE.height - PADDLE_HEIGHT * 2,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
    )

    CTX.fill();
    CTX.closePath();
}

function drawBricks() {
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
            if (bricks[c][r].status === 1) {

                const BRICK_X = r * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET;
                const BRICK_Y = c * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET + 20;

                bricks[c][r].x = BRICK_X;
                bricks[c][r].y = BRICK_Y;


                CTX.fillStyle = "#808000";
                CTX.beginPath();
                CTX.rect(BRICK_X, BRICK_Y, BRICK_WIDTH, BRICK_HEIGHT);
                CTX.fill();
                CTX.closePath();
            }
        }
    }
}

function drawScore() {
    CTX.fillStyle = "#000000";
    CTX.font = "24px Arial";
    CTX.fillText("Счёт: " + score, 8, 30);
}

function drawLives() {
    CTX.fillStyle = "#000000";
    CTX.font = "24px Arial";
    CTX.fillText("Жизни: " + lives, CANVAS_NODE.width - 110, 30);

}

function detectCollision() {
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
            let brick = bricks[c][r];

            if (brick.status === 1) {
                const isCollisionTrue = 
                ballX > brick.x && ballX < brick.x + BRICK_WIDTH &&
                ballY > brick.y && ballY < brick.y + BRICK_HEIGHT;

                if (isCollisionTrue) {
                    dy = -dy;
                    brick.status = 0;

                    score++;

                    if (score === BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
                        alert("Вы победили!");
                        document.location.reload();
                    }
                }

            }
        }
    }    
}

document.addEventListener("touchmove", handleTouchMove);

function handleTouchMove(event) {

    const RELATIVE_X = event.clientX - CANVAS_NODE.offsetLeft;

    if (RELATIVE_X > 0 && RELATIVE_X < CANVAS_NODE.width) {

        paddleX = RELATIVE_X - PADDLE_WIDTH / 2;

    }
}

function draw() {
    
    CTX.save();
    CTX.clearCanvas();
    CTX.scale(innerWidth / width, innerHeight / height);

    CTX.clearRect(0, 0, CANVAS_NODE.width,  CANVAS_NODE.height)
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    detectCollision();
    

        if (ballX + dx < BALL_RADIUS || ballX + dx > CANVAS_NODE.width - BALL_RADIUS) {
            dx = -dx;
        }

        if (ballY + dy < BALL_RADIUS) {
            dy = -dy;
        }

        if (ballY + dy > CANVAS_NODE.height - BALL_RADIUS - PADDLE_HEIGHT) {
            if (ballX > paddleX && ballX < paddleX + PADDLE_WIDTH) {
                dy = -dy;
            }
            if (ballY + dy > CANVAS_NODE.height - BALL_RADIUS) {
                lives--;

                if (lives === 0) {
                    alert("Игра окончена!");
                    document.location.reload();
                }
                else {
                    ballX = CANVAS_NODE.width / 2;
                    ballY = CANVAS_NODE.height - 50;
                    dx = 5;
                    dy = -5;
                    paddleX = (CANVAS_NODE.width - PADDLE_WIDTH) / 2;
                }
            }
        }


    ballX += dx;
    ballY += dy;

    requestAnimationFrame(draw);
    CTX.restore();
}

let click = 0;

CTX.font = "42px Arial";
CTX.fillText("ARCANOID", CANVAS_NODE.width / 4, CANVAS_NODE.height / 3);

CTX.font = "16px Arial";
CTX.fillText("Нажми на экран чтобы начать играть", CANVAS_NODE.width / 6, CANVAS_NODE.height / 2);

document.addEventListener("touchstart" || "click", e => {
    click++;
    if (click === 1 && click < 2) {
        draw();
    }
    
    
});

//draw();
