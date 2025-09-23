const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PLAYER_X = 30;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 7;
const AI_SPEED = 4;
const BALL_SPEED = 6;

// Game objects
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    vx: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
    vy: BALL_SPEED * (Math.random() * 2 - 1)
};

function drawRect(x, y, w, h, color='#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall() {
    ctx.fillStyle = '#0ff';
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
}

function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.vx = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
    ball.vy = BALL_SPEED * (Math.random() * 2 - 1);
}

function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Ball collision with top/bottom
    if (ball.y < 0) {
        ball.y = 0;
        ball.vy = -ball.vy;
    } else if (ball.y + BALL_SIZE > canvas.height) {
        ball.y = canvas.height - BALL_SIZE;
        ball.vy = -ball.vy;
    }

    // Ball collision with player paddle
    if (
        ball.x < PLAYER_X + PADDLE_WIDTH &&
        ball.x > PLAYER_X &&
        ball.y + BALL_SIZE > playerY &&
        ball.y < playerY + PADDLE_HEIGHT
    ) {
        ball.x = PLAYER_X + PADDLE_WIDTH;
        ball.vx = -ball.vx;
        // Add "spin" based on where the ball hits the paddle
        let impact = (ball.y + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ball.vy = impact * 0.25;
    }

    // Ball collision with AI paddle
    if (
        ball.x + BALL_SIZE > AI_X &&
        ball.x + BALL_SIZE < AI_X + PADDLE_WIDTH &&
        ball.y + BALL_SIZE > aiY &&
        ball.y < aiY + PADDLE_HEIGHT
    ) {
        ball.x = AI_X - BALL_SIZE;
        ball.vx = -ball.vx;
        let impact = (ball.y + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ball.vy = impact * 0.25;
    }

    // Ball out of bounds (reset)
    if (ball.x < 0 || ball.x > canvas.width) {
        resetBall();
    }

    // AI paddle movement
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (ball.y + BALL_SIZE / 2 < aiCenter - 10) {
        aiY -= AI_SPEED;
    } else if (ball.y + BALL_SIZE / 2 > aiCenter + 10) {
        aiY += AI_SPEED;
    }
    // Clamp AI paddle
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function render() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Middle line
    ctx.fillStyle = '#444';
    for (let i = 0; i < canvas.height; i += 30) {
        ctx.fillRect(canvas.width / 2 - 2, i, 4, 20);
    }

    // Draw paddles and ball
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');
    drawBall();
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Player paddle follows mouse
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Start game
resetBall();
gameLoop();
