const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameRunning = false;
let score = 0;

// Getaa properties
let getaaX = 100;
let getaaY = canvas.height - 100;
let getaaYVelocity = 0;
const getaaSize = 40;
const gravity = 0.6;
const jumpStrength = -15;
let isJumping = false;

// Shell properties
const shellSize = 30;
let shells = [];
const shellSpeed = 5;
let lastShellTime = 0;
const minShellInterval = 1500; // Minimum time between shells in milliseconds

function drawBeach() {
    ctx.fillStyle = '#F0E68C';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(canvas.width, canvas.height - 100);
    ctx.quadraticCurveTo(canvas.width / 2, canvas.height - 150, 0, canvas.height - 100);
    ctx.fill();
}

function drawGetaa(x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Body
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.ellipse(0, 0, getaaSize/2, getaaSize/3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(-8, -10, 3, 0, Math.PI * 2);
    ctx.arc(8, -10, 3, 0, Math.PI * 2);
    ctx.fill();

    // Claws
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.quadraticCurveTo(-30, -10, -25, -20);
    ctx.moveTo(20, 0);
    ctx.quadraticCurveTo(30, -10, 25, -20);
    ctx.stroke();

    // Legs
    ctx.lineWidth = 2;
    for (let i = -15; i <= 15; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 5);
        ctx.quadraticCurveTo(i - 10, 20, i - 15, 15);
        ctx.stroke();
    }

    // Name
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Getaa', 0, -getaaSize/2 - 5);

    ctx.restore();
}

function drawShell(x, y) {
    ctx.fillStyle = '#ffe4b5';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + shellSize/2, y - shellSize, x + shellSize, y);
    ctx.quadraticCurveTo(x + shellSize*1.2, y + shellSize/2, x + shellSize, y + shellSize);
    ctx.quadraticCurveTo(x + shellSize/2, y + shellSize*1.2, x, y + shellSize);
    ctx.quadraticCurveTo(x - shellSize/5, y + shellSize/2, x, y);
    ctx.fill();
}

function updateGetaa() {
    getaaYVelocity += gravity;
    getaaY += getaaYVelocity;

    if (getaaY > canvas.height - 100) {
        getaaY = canvas.height - 100;
        getaaYVelocity = 0;
        isJumping = false;
    }
}

function updateShells(currentTime) {
    if (currentTime - lastShellTime > minShellInterval) {
        shells.push({x: canvas.width, y: canvas.height - 100 - shellSize/2});
        lastShellTime = currentTime;
    }

    for (let i = shells.length - 1; i >= 0; i--) {
        shells[i].x -= shellSpeed;

        if (shells[i].x < -shellSize) {
            shells.splice(i, 1);
            score++;
            scoreElement.textContent = score;
        }
    }
}

function checkCollision() {
    for (let shell of shells) {
        if (
            getaaX < shell.x + shellSize &&
            getaaX + getaaSize > shell.x &&
            getaaY < shell.y + shellSize &&
            getaaY + getaaSize > shell.y
        ) {
            gameRunning = false;
            startScreen.style.display = 'block';
            startButton.textContent = 'Play Again';
        }
    }
}

function jump() {
    if (!isJumping) {
        getaaYVelocity = jumpStrength;
        isJumping = true;
    }
}

function gameLoop(currentTime) {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBeach();
    drawGetaa(getaaX, getaaY);
    
    for (let shell of shells) {
        drawShell(shell.x, shell.y);
    }

    updateGetaa();
    updateShells(currentTime);
    checkCollision();

    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', jump);

document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowUp' || event.code === 'Space') {
        jump();
    }
});

startButton.addEventListener('click', () => {
    gameRunning = true;
    score = 0;
    scoreElement.textContent = score;
    shells = [];
    getaaY = canvas.height - 100;
    getaaYVelocity = 0;
    lastShellTime = 0;
    startScreen.style.display = 'none';
    requestAnimationFrame(gameLoop);
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
