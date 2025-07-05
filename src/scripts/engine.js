const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    enemy: document.querySelector(".enemy"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    livesLeft: document.querySelector("#lives"),
    cursor: document.querySelector(".cursor"),
    modal: document.querySelector(".modal-container"),
    info: document.querySelector(".info-container"),
    playBtn: document.querySelectorAll(".play-btn"),
    infoTitle: document.querySelector(".info-title"),
    infoText: document.querySelector(".info-text"),
    enemyImg: document.querySelector(".enemy"),
  },
  values: {
    timeId: null,
    hitPosition: 0,
    result: 0,
    currentTime: 60,
    lives: 3,
  },
  action: {
    enemyMoveTime: setInterval(randomSquare, 850),
  },
};

// reseta valores do jogo
function resetGameValues() {
  // Reinicia os valores
  state.values.result = 0;
  state.values.currentTime = 60;
  state.values.lives = 3;

  // Atualiza o DOM
  state.view.score.textContent = state.values.result;
  state.view.timeLeft.textContent = state.values.currentTime;
  state.view.livesLeft.textContent = `x${state.values.lives}`;

  // Fecha os modais
  state.view.modal.style.display = "none";
  state.view.info.style.display = "none";

  // Limpa intervalos antigos (se existirem)
  clearInterval(state.values.timeId);
  clearInterval(state.action.countDownTimerId);

  // Inicia novamente os timers
  state.values.timeId = setInterval(randomSquare, 850);
  state.action.countDownTimerId = setInterval(countDown, 1000);
}

// fecha modal
function closeModalAndPlay() {
  state.view.playBtn.forEach((btn) => {
    btn.addEventListener("click", resetGameValues);
  });
}

// função que finaliza o jogo
function gameOver() {
  clearInterval(state.values.timeId);
  clearInterval(state.action.countDownTimerId);
}

// finaliza game com a perda de pontos
function endPoints() {
  state.view.infoTitle.textContent = "Você errou 3x e perdeu! ";
  state.view.infoText.textContent = `Sua pontuação foi: ${state.values.result}`;
  state.view.info.style.display = "block";
  gameOver();
}

// finaliza game com o esgotamento do tempo
function endGameTime() {
  state.view.infoTitle.textContent = "O tempo acabou!";
  state.view.infoText.textContent = `Sua pontuação foi: ${state.values.result}`;
  state.view.info.style.display = "block";
  gameOver();
}

// abre modal de acordo com a situação (perda de pontos ou tenpo esgotado)
function openModalAndPlay(typeModal) {
  if (typeModal === "endpoints") {
    endPoints();
  } else if (typeModal === "endtime") {
    endGameTime();
  } else {
    state.view.infoTitle.textContent = "Fim de jogo!";
    state.view.infoText.textContent = `Sua pontuação foi: ${state.values.result}`;
    state.view.info.style.display = "block";
    gameOver();
  }
}

// som do hit
function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}.m4a`);
  audio.volume = 0.1;
  audio.play();
}

// função para adicionar aleatoriamente o enemy no quadrados (janelas)
function randomSquare() {
  // emove o enemy de qualquer posição em que ele possa estar
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function addHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit");
      }
      if (
        square.id !== state.values.hitPosition &&
        state.values.hitPosition !== null
      ) {
        state.values.lives -= 1;
        state.view.livesLeft.textContent = `x${state.values.lives}`;
        state.view.hitPosition = null;
        if (state.values.lives === 0) {
          gameOver();
          openModalAndPlay("endpoints");
        }
      }
    });
  });
}

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if (state.values.currentTime <= 0) {
    clearInterval(state.action.timeId);
    clearInterval(state.action.countDownTimerId);
    openModalAndPlay("endtime");
  }
}

function init() {
  closeModalAndPlay();
  addHitBox();
}

init();
