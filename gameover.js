import { Dog } from "./dog.js";

const dog = new Dog();

let htmlHighScore = document.getElementById("highScore");
let htmlGameScore = document.getElementById("gameScore");
const totalScore = localStorage.getItem("score");
const highScore = localStorage.getItem("highScore");

window.onload = () => {
  window.addEventListener("click", () => {
    document.getElementById("mainMenu").addEventListener("click", () => {
      window.location.href = "index.html";
    });
    document.getElementById("playAgain").addEventListener("click", () => {
      window.location.href = "game.html";
    });
  });

  localStorage.removeItem("saveState");
  localStorage.removeItem("score");
  dog.laughGameover();
  htmlGameScore.textContent = `THIS GAME SCORE: ${totalScore}`;
  htmlHighScore.textContent = `YOUR HIGHEST SCORE: ${highScore}`;
  if (totalScore === highScore) {
    htmlHighScore.textContent = `YOUR NEW HIGHEST SCORE: ${highScore}`;
  }
};
