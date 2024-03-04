import { Dog } from "./dog.js";
import { Duck } from "./duck.js";
import { Timer } from "./timer.js";

const shooting = document.getElementsByClassName("shootingArea")[0];
const body = document.getElementsByTagName("body")[0];

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);

let gameStarted = false;

window.addEventListener("click", () => {
  if (gameStarted) {
    return;
  }
  gameStarted = true;
  document.getElementsByClassName("startGame")[0].style.display = "none";
  const saveState = JSON.parse(localStorage.getItem("saveState"));
  let game = new Game(saveState);

  window.addEventListener("click", (event) => game.shoot(event));
  window.addEventListener("keydown", (event) => game.pause(event));
  document
    .getElementsByClassName("pauseButton")[0]
    .addEventListener("click", () => {
      game.isPaused ? game.pauseOff() : game.pauseOn();
    });

  document.getElementById("quitToSave").addEventListener("click", () => {
    game.changeToSavePause();
  });
  document.getElementById("quitGame").addEventListener("click", () => {
    window.location.href = "index.html";
  });
  document.getElementById("saveGame").addEventListener("click", () => {
    game.saveState();
    window.location.href = "index.html";
  });
  document.getElementById("restart").addEventListener("click", () => {
    game.restartGame();
    game.pauseOff();
    game = new Game(undefined);
  });
});

class Game {
  constructor(saveState) {
    this.remainingBullets = 3;
    this.isPaused = false;
    this.canShoot = false;
    this.firstDuck = true;
    this.dog = new Dog();
    this.round = saveState ? saveState.round : 1;
    this.roundDuck = 0;
    this.ducksHit = 0;
    this.score = saveState ? saveState.score : 0;
    this.roundStartScore = 0;
    this.minDuckKills = saveState ? saveState.minDuckKills : 5;
    this.ducks = [];
    this.pauseSound = new Audio("resources/pause.mp3");
    this.dogBark = new Audio("resources/dogBark.mp3");
    this.gotDuckSound = new Audio("resources/gotDuck.mp3");
    this.flawlessRoundSound = new Audio("resources/flawlessRound.mp3");
    this.nextRoundSound = new Audio("resources/nextRound.mp3");
    this.duckFallSound = new Audio("resources/duckFall.mp3");
    this.roundStartSound = new Audio("resources/roundStart.mp3");
    this.gunShotSound = new Audio("resources/gunShot.mp3");
    this.gameOverSound = new Audio("resources/gameOver.mp3");
    this.duckQuackSound = new Audio("resources/duckQuack.mp3");
    this.dogLaughSound = new Audio("resources/dogLaugh.mp3");
    this.roundEndSound = new Audio("resources/roundEnd.mp3");
    this.maxSpeed = saveState ? saveState.maxSpeed : 10;
    this.sizes = this.getSizes();
    this.timers = [];
    document.getElementById("roundCounter").innerText = `R = ${this.round}`;
    document.getElementById(
      "minDucks"
    ).innerText = `Ducks needed to Pass: ${this.minDuckKills}`;
    this.updateScore(0);

    this.animationFrame = window.requestAnimationFrame(() => this.update());
    this.startRound();
  }

  restartGame() {
    this.ducks.forEach((duck) => {
      duck.duck.remove();
    });
    this.reload();
    window.cancelAnimationFrame(this.animationFrame);
    this.timers.forEach((timer) => {
      timer.stop();
    });
    this.pauseSound.pause();
    this.dog.remove();
    localStorage.removeItem("saveState");
    localStorage.removeItem("score");
    this.reloadDuckContainer();
  }

  getSizes() {
    if (window.innerHeight < 600) {
      this.maxSpeed = this.maxSpeed === 10 ? 7 : this.maxSpeed;
      return [2, 1.5];
    }
    return [4, 3, 2.5];
  }

  startRound() {
    localStorage.setItem("score", this.score);
    this.roundStartSound.play();
    this.playRoundAnimation();
    this.dog.walk();
    setTimeout(() => {
      this.dogBark.play();
    }, 6000);
    this.timers[0] = new Timer(9000, () => {
      this.playRound();
    });
  }

  playRound() {
    this.firstDuck = true;
    if (this.roundDuck < 10) {
      if (this.round > 10) {
        this.spawnDucks(2);
        return;
      }
      this.duckQuackSound.play();
      this.spawnDucks(1);
      return;
    }
    this.roundEndSound.play();
    this.nextRound();
  }
  spawnDucks(numberOfDucks) {
    for (let i = 0; i < numberOfDucks; i++) {
      this.roundDuck++;
      const duck = new Duck(
        getRandomNumber(this.maxSpeed - 5, this.maxSpeed + 1),
        shooting,
        this.sizes[getRandomNumber(0, this.sizes.length)]
      );
      this.ducks.push(duck);
    }
    this.timers[1] = new Timer(10000, () => {
      if (this.ducks.length > 0) {
        if (this.numberOfDucks === 1) {
          document.getElementById(
            `duck${this.roundDuck}`
          ).style.backgroundImage = "url(images/redDuck.png)";
        } else {
          if (this.ducks.length === 1) {
            document.getElementById(
              `duck${this.roundDuck}`
            ).style.backgroundImage = "url(images/redDuck.png)";
          } else {
            document.getElementById(
              `duck${this.roundDuck}`
            ).style.backgroundImage = "url(images/redDuck.png)";
            document.getElementById(
              `duck${this.roundDuck - 1}`
            ).style.backgroundImage = "url(images/redDuck.png)";
          }
        }
        this.timers[3] = new Timer(500, () => {
          this.dog.laugh();
          this.dogLaughSound.play();
        });
        this.ducks.forEach((duck) => {
          duck.leave();
        });
        this.ducks = [];
        this.canShoot = false;
        this.reload();
        this.timers[2] = new Timer(6000, () => {
          this.playRound();
        });
      }
    });
    this.canShoot = true;
  }

  update() {
    if (this.isPaused) {
      this.animationFrame = window.requestAnimationFrame(() => this.update());
      return;
    }
    this.ducks.forEach((duck) => {
      duck.update();
    });

    this.animationFrame = window.requestAnimationFrame(() => this.update());
  }
  nextRound() {
    if (this.ducksHit < this.minDuckKills) {
      this.gameOver();
      return;
    }
    this.round += 1;
    this.roundDuck = 0;
    this.checkFlawlessRound();
    this.ducksHit = 0;
    this.roundStartScore = this.score;
    this.reloadDuckContainer();
    this.nextRoundSound.play();
    if (this.round % 5 === 0) {
      if (this.minDuckKills >= 10) return;
      this.minDuckKills += 1;
      document.getElementById(
        "minDucks"
      ).innerText = `Ducks needed to Pass: ${this.minDuckKills}`;
    }
    if (this.round % 2 === 0) {
      if (this.maxSpeed < 25) {
        this.maxSpeed += 1;
      }
    }
    document.getElementById("roundCounter").innerText = `R = ${this.round}`;
    this.startRound();
  }

  saveState() {
    const saveState = {
      round: this.round,
      score: this.roundStartScore,
      maxSpeed: this.maxSpeed,
      minDuckKills: this.minDuckKills,
    };
    localStorage.setItem("saveState", JSON.stringify(saveState));
  }

  gameOver() {
    const highScore = localStorage.getItem("highScore");
    if (highScore === null || this.score > highScore) {
      localStorage.setItem("highScore", this.score);
    }
    this.gameOverSound.play();
    window.location.href = "gameover.html";
  }

  checkFlawlessRound() {
    if (this.ducksHit === 10) {
      this.flawlessRoundSound.play();
      const flawlessAnimation = document.getElementById("flawlessRound");
      flawlessAnimation.style.display = "block";
      this.updateScore(10000);
      setTimeout(() => {
        flawlessAnimation.style.display = "none";
      }, 5000);
    }
  }

  playRoundAnimation() {
    const roundAnimation = document.getElementById("roundAnnouncer");
    roundAnimation.style.display = "flex";
    roundAnimation.children[1].textContent = `ROUND ${this.round}`;
    setTimeout(() => {
      roundAnimation.style.display = "none";
    }, 5000);
  }
  reloadDuckContainer() {
    for (let i = 1; i <= 10; i++) {
      let duck = document.getElementById(`duck${i}`);
      duck.style.backgroundImage = "url(images/emptyDuck.jpg)";
    }
  }

  shoot(event) {
    if (this.remainingBullets === 0 || !this.canShoot) {
      return;
    }
    this.canShoot = false;
    this.gunShotSound.play();
    setTimeout(() => {
      this.gunShotSound.pause();
      this.gunShotSound.currentTime = 0;
    }, 1000);

    const hitDuck = this.hitDuck(event.clientX, event.clientY);
    if (hitDuck !== null) {
      this.updateScore(hitDuck.score);
      this.ducksHit += 1;
      this.updateDuckContainer(this.roundDuck);
      hitDuck.die();
      setTimeout(() => {
        this.duckFallSound.play();
      }, 1000);
    }

    const bullets = document.getElementsByClassName("bullets")[0].children;
    bullets[this.remainingBullets - 1].style.display = "none";
    this.remainingBullets -= 1;

    setTimeout(() => {
      if (this.ducks.length !== 0) this.canShoot = true;
    }, 1000);

    if (this.ducks.length === 0) {
      this.timers[1].stop();
      this.canShoot = false;
      setTimeout(() => {
        this.gotDuckSound.play();
        this.round > 10 ? this.dog.duckCaught(2) : this.dog.duckCaught(1);
      }, 2000);
      setTimeout(() => {
        this.reload();
      }, 1000);
      this.timers[2] = new Timer(8000, () => {
        this.playRound();
      });
    }
  }

  updateDuckContainer() {
    if (this.round > 10) {
      if (this.firstDuck) {
        document.getElementById(
          `duck${this.roundDuck - 1}`
        ).style.backgroundImage = "url(images/duck.jpg)";
        this.firstDuck = false;
      } else {
        document.getElementById(`duck${this.roundDuck}`).style.backgroundImage =
          "url(images/duck.jpg)";
      }
    } else {
      document.getElementById(`duck${this.roundDuck}`).style.backgroundImage =
        "url(images/duck.jpg)";
    }
  }

  updateScore(score) {
    let addScore = document.getElementsByClassName("addScore")[0];
    let totalScore = document.getElementById("score");
    const scoreTwoZeros = "SCORE : 00";
    const scoreOneZero = "SCORE : 0";

    this.score += score;
    if (this.score >= 100000) {
      totalScore.textContent = "SCORE : " + this.score;
    } else if (this.score >= 10000) {
      totalScore.textContent = scoreOneZero + this.score;
    } else if (this.score === 0) {
      totalScore.textContent = "SCORE : 00000" + this.score;
    } else {
      totalScore.textContent = scoreTwoZeros + this.score;
    }
    if (score === 0) return;
    addScore.textContent = `+${score}`;
    addScore.classList.add("toggleScoreAnimation");
    setTimeout(() => {
      addScore.classList.remove("toggleScoreAnimation");
    }, 2000);
    localStorage.setItem("score", this.score);
  }

  hitDuck(shootX, shootY) {
    let hitDuck = null;
    this.ducks.forEach((duck) => {
      if (duck.alive) {
        const position = duck.duck.getBoundingClientRect();
        if (
          shootX >= position.left &&
          shootX <= position.right &&
          shootY >= position.top &&
          shootY <= position.bottom
        ) {
          hitDuck = duck;
        }
      }
    });
    hitDuck !== null ? this.ducks.splice(this.ducks.indexOf(hitDuck), 1) : null;
    return hitDuck;
  }

  reload() {
    const bullets = document.getElementsByClassName("bullets")[0].children;
    for (let i = 0; i < bullets.length; i++) {
      setTimeout(() => {
        bullets[i].style.display = "inline";
      }, 500 * i + 1);
    }
    this.remainingBullets = 3;
  }

  pause(event) {
    if (event.keyCode === 27) {
      if (this.isPaused) {
        this.pauseOff();
      } else {
        this.pauseOn();
      }
    }
  }

  pauseOn() {
    document.getElementsByClassName("pauseMenu")[0].style.display = "block";
    this.isPaused = true;
    this.canShoot = false;
    this.dog.pause();
    this.ducks.forEach((duck) => {
      duck.pause();
    });
    this.pauseSound.play();
    this.timers.forEach((timer) => {
      timer.pause();
    });
  }

  pauseOff() {
    document.getElementsByClassName("pauseMenu")[0].style.display = "none";
    this.changeToStandardPause();
    this.canShoot = true;
    this.isPaused = false;
    this.dog.resume();
    this.ducks.forEach((duck) => {
      duck.resume();
    });
    this.pauseSound.play();
    this.pauseSound.currentTime = 0;
    this.timers.forEach((timer) => {
      timer.resume();
    });
  }
  changeToSavePause() {
    let pauseOptionsDiv = document.getElementsByClassName("pauseOptions")[0];
    let saveOptionsDiv = document.getElementsByClassName("saveOptions")[0];
    pauseOptionsDiv.style.display = "none";
    saveOptionsDiv.style.display = "flex";
  }

  changeToStandardPause() {
    let pauseOptionsDiv = document.getElementsByClassName("pauseOptions")[0];
    let saveOptionsDiv = document.getElementsByClassName("saveOptions")[0];
    pauseOptionsDiv.style.display = "flex";
    saveOptionsDiv.style.display = "none";
  }
}
