import { Timer } from "./timer.js";
export function Dog() {
  this.createDog = () => {
    const dog = document.createElement("div");
    dog.classList.add("dogSprite");
    document.getElementsByTagName("body")[0].appendChild(dog);
    this.dog = dog;
  };
  this.walk = () => {
    this.createDog();
    this.dog.classList.add("walk");
    this.smellTimer = new Timer(5000, () => {
      this.smell();
    });
  };
  this.smell = () => {
    this.dog.classList.toggle("walk");
    this.dog.classList.toggle("smell");
    this.jumpTimer = new Timer(1000, () => {
      this.jump();
    });
  };
  this.jump = () => {
    this.dog.classList.toggle("smell");
    this.dog.classList.toggle("jump");
    this.remove(1500);
  };
  this.remove = (time) => {
    this.deleteTimer = new Timer(time, () => {
      this.dog.remove();
    });
  };
  this.laugh = () => {
    this.createDog();
    const x = getRandomNumber(40, 65);
    this.dog.style.left = `${x}vw`;
    this.dog.classList.add("laugh");
    this.remove(4000);
  };
  this.laughGameover = () => {
    this.createDog();
    const x = getRandomNumber(40, 65);
    this.dog.style.left = `${x}vw`;
    this.dog.classList.add("laughGameover");
  };
  this.duckCaught = (numOfducks) => {
    this.createDog();
    const x = getRandomNumber(40, 65);
    this.dog.style.left = `${x}vw`;
    if (numOfducks === 1) {
      this.dog.classList.add("dogDuckCaught");
    } else if (numOfducks === 2) {
      this.dog.classList.add("dogDuckCaught2");
    } else {
      this.dog.remove();
    }
    this.remove(4000);
  };
  this.pause = () => {
    this.smellTimer !== undefined ? this.smellTimer.pause() : null;
    this.jumpTimer !== undefined ? this.jumpTimer.pause() : null;
    this.deleteTimer !== undefined ? this.deleteTimer.pause() : null;
    this.dog !== undefined ? this.dog.classList.toggle("paused") : null;
  };
  this.resume = () => {
    this.smellTimer !== undefined ? this.smellTimer.resume() : null;
    this.jumpTimer !== undefined ? this.jumpTimer.resume() : null;
    this.deleteTimer !== undefined ? this.deleteTimer.resume() : null;
    this.dog !== undefined ? this.dog.classList.toggle("paused") : null;
  };
  this.smellRight = () => {
    this.dog.classList.toggle("walkRight");
    this.dog.classList.toggle("smellRight");
  };
  this.walRight2 = () => {
    this.createDog();
    this.dog.classList.add(this.walRight2);
  };
  this.walkRight = () => {
    this.createDog();
    this.dog.classList.add("walkRight");
    setTimeout(() => {
      this.smellRight();
      setTimeout(() => {
        this.dog.classList.remove("smellRight");
        this.dog.classList.add("walkRight2");
        setTimeout(() => {
          this.remove(2500);
          setTimeout(() => {
            this.walkRight();
          }, 5000);
        }, 500);
      }, 3000);
    }, 3000);
  };
}

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);
