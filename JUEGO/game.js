const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
// necesitaremos el gamecontainer para hacerlo borroso
// cuando mostramos el menú final
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'assets/flappy_dunk.png';

//constantes de juego
const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

// Variables de las aves
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

// Variables de tubería
let pipeX = 400;
let pipeY = canvas.height - 200;

// puntuación y variables de puntuación más alta
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

// agregamos una variable bool, para que podamos verificar cuando pasa flappy aumentamos
// el valor
let scored = false;

// nos deja controlar al ave con la barra espaciadora
document.body.onkeyup = function(e) {
    if (e.code == 'Space') {
        birdVelocity = FLAP_SPEED;
    }
}

// nos permite reiniciar el juego si presionamos game-over
document.getElementById('restart-button').addEventListener('click', function() {
    hideEndMenu();
    resetGame();
    loop();
})



function increaseScore() {
    // aumenta ahora nuestro contador cuando nuestro flappy pasa las tuberías
    if(birdX > pipeX + PIPE_WIDTH && 
        (birdY < pipeY + PIPE_GAP || 
          birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && 
          !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

   // restablecer la bandera, si el pájaro pasa las tuberías
    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
   // Crear cuadros delimitadores para el pájaro y las tuberías.

    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // Comprobar si hay colisión con la caja de tubería superior
    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;
    }

    // Comprobar si hay colisión con la caja de tubería inferior
    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
            return true;
    }

   // comprueba si el pájaro llega a los límites
    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }


    return false;
}

function hideEndMenu () {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu () {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    // De esta manera actualizamos siempre nuestra puntuación más alta al final de nuestro juego
    // si tenemos una puntuación más alta que la anterior
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

// reseteamos los valores al principio y empezamos
// con el pájaro al principio
function resetGame() {
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function endGame() {
    showEndMenu();
}

function loop() {
    // restablecer el ctx después de cada iteración de bucle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja un pájaro Flappy
    ctx.drawImage(flappyImg, birdX, birdY);

    // Dibujar tuberías
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    // ahora necesitaríamos agregar una verificación de colisión para mostrar nuestro menú final
    // y termina el juego
    // el colisionCheck nos devolverá verdadero si tenemos una colisión
    // de lo contrario falso
    if (collisionCheck()) {
        endGame();
        return;
    }


    // olvidé mover las tuberías
    pipeX -= 1.5;
    // si la tubería se sale del marco, debemos restablecer la tubería
    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    // aplica gravedad al ave y deja que se mueva
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    // comprueba siempre si llamas a la función...
    increaseScore()
    requestAnimationFrame(loop);
}

loop();