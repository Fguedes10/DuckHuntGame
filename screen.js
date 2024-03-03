import { Dog } from "./dog.js";

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);

const sky = document.querySelector(".skyArea");
const dog = new Dog();
dog.walkRight();
const highScore = localStorage.getItem("highScore") || 0;
document.getElementsByClassName(
  "score"
)[0].textContent = `High Score: ${highScore}`;

const createDuck = () => {
  const duckColors = [0, -130, -260];
  const duck = document.createElement("div");
  duck.classList.add("duckSprite");
  duck.classList.add("moveDuckAnimation");

  duck.style.left = `${getRandomNumber(5, 60)}vw`;
  duck.style.top = "80vh";
  duck.style.setProperty(
    "--position",
    `${duckColors[getRandomNumber(0, 3)]}px`
  );

  sky.appendChild(duck);

  setTimeout(() => {
    duck.remove();
  }, 5000);
};

setInterval(() => createDuck(), 2000);
