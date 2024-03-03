import { Timer } from "./timer.js";
export class Duck {
  constructor(speed, container, scale) {
    this.direction = [getRandomNumber(-1, 2), 1];
    this.speed = speed;
    this.alive = true;
    this.container = container;
    this.scale = scale;
    this.colors = [0, -130, -260];
    this.x = getRandomNumber(
      container.offsetWidth * 0.3,
      container.offsetWidth * 0.7
    );
    this.y = container.offsetHeight;
    this.leaveTimer = null;
    this.dieTimer = null;
    this.createDuck();
  } 
  createDuck() {
    const duck = document.createElement("div");
    duck.classList.add("duckSprite");
    duck.style.left = `${this.x}px`;
    duck.style.top = `${this.y}px`;
    duck.style.setProperty(
      "--position",
      `${this.colors[getRandomNumber(0, 3)]}px`
    );
    duck.style.transform = `scale(${this.scale})`;
    this.duck = duck;
    this.score = this.calculateScore();
    this.changeAnimationDir();
    this.container.appendChild(duck);
  }
  update() {
    if (!this.alive) return;
    if (this.hitBorder()) {
      this.changeDirection();
    }
    this.x += this.direction[0] * this.speed;
    this.y -= this.direction[1] * this.speed;
    this.duck.style.left = `${this.x}px`;
    this.duck.style.top = `${this.y}px`;
  }
  calculateScore() {
    const score = Math.floor(100 * this.speed);
    return score > 5000 ? 5000 : score;
  }
  hitBorder() {
    return (
      this.x <= (this.duck.offsetWidth * this.scale) / 2 ||
      this.y <= (this.duck.offsetHeight * this.scale) / 2 ||
      this.x >=
        this.container.offsetWidth - this.duck.offsetWidth * this.scale ||
      this.y >=
        this.container.offsetHeight - this.duck.offsetHeight * this.scale
    );
  }
  changeDirection() {
    const wall = this.getWall();
    if (wall === "left") {
      this.direction = [1, getRandomNumber(-1, 2)];
    } else if (wall === "right") {
      this.direction = [-1, getRandomNumber(-1, 2)];
    } else if (wall === "top") {
      this.direction = [getRandomNumber(-1, 2), -1];
    } else if (wall === "bottom") {
      this.direction = [getRandomNumber(-1, 2), 1];
    }
    this.changeAnimationDir();
  }
  changeAnimationDir() {
    switch (this.direction[0] + this.direction[1]) {
      case 2:
        this.duck.className = "duckSprite duckD";
        this.duck.style.transform = `scale(${this.scale})`;
        break;
      case -2:
        this.duck.className = "duckSprite duckD";
        this.duck.style.transform = `scale(${this.scale}) rotateY(180deg) rotate(90deg)`;
        break;
      case 0:
        if (this.direction[0] === -1) {
          this.duck.className = "duckSprite duckD";
          this.duck.style.transform = `scale(${this.scale}) rotateY(180deg)`;
          break;
        }
        this.duck.className = "duckSprite duckD";
        this.duck.style.transform = `scale(${this.scale}) rotate(90deg)`;
        break;
      case 1:
        this.duck.style.transform = `scale(${this.scale}) rotate(0deg)`;
        if (this.direction[0] === 1) {
          this.duck.className = "duckSprite duckH";
          break;
        }
        this.duck.className = "duckSprite duckV";
        break;
      case -1:
        if (this.direction[0] === -1) {
          this.duck.className = "duckSprite duckH";
          this.duck.style.transform = `scale(${this.scale}) rotateY(180deg)`;
          break;
        }
        this.duck.className = "duckSprite duckV";
        this.duck.style.transform = `scale(${this.scale}) rotate(180deg)`;
    }
  }
  getWall() {
    if (this.x <= (this.duck.offsetWidth * this.scale) / 2) return "left";
    if (this.y <= (this.duck.offsetHeight * this.scale) / 2) return "top";
    if (
      this.x >=
      this.container.offsetWidth - this.duck.offsetWidth * this.scale
    )
      return "right";
    if (
      this.y >=
      this.container.offsetHeight - this.duck.offsetHeight * this.scale
    )
      return "bottom";
  }
  leave() {
    this.duck.className = "duckSprite duckV";
    this.duck.animate(
      [
        { transform: `scale(${this.scale}) translateY(0)` },
        { transform: `scale(${this.scale}) translateY(-100vh)` },
      ],
      {
        duration: 3000,
        fill: "forwards",
      }
    );
    this.leaveTimer = new Timer(3000, () => {
      this.duck.remove();
    });
  }
  die() {
    if (!this.alive) return;
    this.alive = false;
    this.duck.className = "duckSprite duckDie";
    setTimeout(() => {
      this.duck.className = "duckSprite duckFall";
      this.duck.animate(
        [{ top: `${this.y}px` }, { top: `${this.container.offsetHeight}px` }],
        {
          duration: 1000,
          fill: "forwards",
        }
      );
      this.duck.animate(
        [
          { transform: `rotateY(0deg) scale(${this.scale})` },
          { transform: `rotateY(180deg) scale(${this.scale})` },
          { transform: `rotateY(0deg) scale(${this.scale})` },
        ],
        {
          duration: 500,
          iterations: Infinity,
        }
      );
    }, 500);
    this.dieTimer = new Timer(5000, () => {
      this.duck.remove();
    });
  }

  pause() {
    this.leaveTimer !== null ? this.leaveTimer.pause() : null;
    this.dieTimer !== null ? this.dieTimer.pause() : null;
  }
  resume() {
    this.leaveTimer !== null ? this.leaveTimer.resume() : null;
    this.dieTimer !== null ? this.dieTimer.resume() : null;
  }
}

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);
