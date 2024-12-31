import "./style.css";
import axios from "axios";
import "./style.css";
import { showLoading, hideLoading } from "./loading";
import { Letter } from "./letter";
import { showLevelPopup } from "./gameEndPopup";
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get("level");
    const loadingContainer = showLoading();
    const resp = await axios.get("/api/level/" + level);
    const levelData = resp.data.level;
    hideLoading(loadingContainer);
    console.log(levelData);
    initGame(levelData);
  } catch (err) {
    console.error(err);
    // window.location.reload();
  }
});
const canvas = document.createElement("canvas");
const wordConstruct = document.querySelector(".word-construct");
const ctx = canvas.getContext("2d");
const SIZE = { width: 210, height: 180 };
canvas.width = SIZE.width;
canvas.height = SIZE.height;
const letters = [];
let activeLetters = [];
const gotWords = [];
const MOUSE_DOWN_POS = {};
let MOUSE_STRECH_POS = {};
const SELECTED_STROKE_WIDTH = 15;
function initGame(levelData) {
  const { chars, commonWords, level } = levelData;

  // Set the level number
  document.querySelector(".level-holder").textContent = level;

  // Create word boxes for the common words
  const gameBoard = document.querySelector(".game-board");
  commonWords.forEach((word) => {
    const wordBox = createWordBox(word);
    gameBoard.appendChild(wordBox);
  });

  // Create letter buttons for the available characters
  drawPolygon(chars);

  const wordDragConatiner = document.querySelector(".word-drag-container");
  const wordConstruct = document.querySelector(".word-construct");
  wordDragConatiner.appendChild(canvas);

  canvas.addEventListener("mousedown", pressEvent);
  canvas.addEventListener("touchstart", pressEvent);
  function pressEvent(event) {
    const type = event.type;
    let mouseX;
    let mouseY;
    if (type === "touchstart") {
      const rect = canvas.getBoundingClientRect(); // Get the canvas bounding box
      const touch = event.touches[0]; // Get the first touch point
      mouseX = touch.clientX - rect.left; // Calculate offsetX
      mouseY = touch.clientY - rect.top; // Calculate offsetY
    } else {
      mouseX = event.offsetX;
      mouseY = event.offsetY;
    }
    MOUSE_DOWN_POS.x = mouseX;
    MOUSE_DOWN_POS.y = mouseY;
    const letterPressed = letters.filter((letter) => {
      return checkPressInsideCircle(letter, MOUSE_DOWN_POS);
    });
    if (!letterPressed.length) return;
    const letter = letterPressed[0];
    activeLetters.push(letter);
    console.log(letter.letter, letter, activeLetters);
    letter.sw = SELECTED_STROKE_WIDTH;
    updateFrame(chars);
  }

  canvas.addEventListener("mousemove", moveEvent);
  canvas.addEventListener("touchmove", moveEvent);
  function moveEvent(event) {
    const type = event.type;
    let mouseX;
    let mouseY;
    if (type == "touchmove") {
      const rect = canvas.getBoundingClientRect(); // Get the canvas bounding box
      const touch = event.touches[0]; // Get the first touch point
      mouseX = touch.clientX - rect.left; // Calculate offsetX
      mouseY = touch.clientY - rect.top; // Calculate offsetY
    } else {
      mouseX = event.offsetX;
      mouseY = event.offsetY;
    }
    MOUSE_STRECH_POS.x = mouseX;
    MOUSE_STRECH_POS.y = mouseY;
    if (activeLetters.length) {
      const letterConnectedList = letters.filter((letter) =>
        checkPressInsideCircle(letter, MOUSE_STRECH_POS)
      );
      if (letterConnectedList.length) {
        const letterConnected = letterConnectedList[0];
        const isConnectedBefore = activeLetters.filter(
          (letter) => letter.letter === letterConnected.letter
        );
        // console.log("Is connected", isConnectedBefore);
        if (!isConnectedBefore.length) {
          activeLetters.push(letterConnected);
          letterConnected.sw = SELECTED_STROKE_WIDTH;
          if (activeLetters.length === chars.length) {
            const wordGenerated = activeLetters
              .map((letter) => letter.letter)
              .join("");
            wordConstruct.classList.add("green-pop");
            setTimeout(() => {
              wordConstruct.classList.remove("green-pop");
              activeLetters = [];
              evaluateAttempt(wordGenerated, commonWords, level);
            }, 250);
          }
        } else {
          // If you want reverse detach you should detect reverse vector man or some magic math :)
          // const doubledLetter = isConnectedBefore[0];
          // const isLat =
          //   activeLetters[activeLetters.length - 1].letter ===
          //   doubledLetter.letter;
          // activeLetters.pop();
        }
      }
    }

    updateFrame(chars);
  }
  canvas.addEventListener("mouseup", pressRelease);
  canvas.addEventListener("touchend", pressRelease);
  function pressRelease() {
    // Not politically :)
    letters.forEach((letter) => {
      letter.sw = Letter.DEFAULT_SW;
    });
    MOUSE_STRECH_POS = {};
    if (activeLetters.length === letters.length) {
      const wordGenerated = activeLetters
        .map((letter) => letter.letter)
        .join("");
      // evaluateAttempt(wordGenerated, commonWords, level);
    }
    activeLetters = [];
    updateFrame(chars);
  }
}

function createWordBox(word) {
  const wordBox = document.createElement("div");
  wordBox.classList.add("word-box");

  word.split("").forEach(() => {
    const emptyBox = document.createElement("input");
    emptyBox.type = "text";
    emptyBox.classList.add("letter-box");
    emptyBox.disabled = true; // Make input disabled until the letter is placed
    wordBox.appendChild(emptyBox);
  });

  return wordBox;
}
function polygonFormer(letter, n, i, attachDefaultPos = false) {
  const radius = 16 * (n + 1) > 60 ? 60 : 16 * (n + 1); // Radius of the polygon
  const centerX = SIZE.width / 2; // Center X of the canvas
  const centerY = SIZE.height / 2; // Center Y of the canvas
  const angleStep = (2 * Math.PI) / n; // Angle between each vertex

  const angle = angleStep * i;
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);
  if (attachDefaultPos) {
    letter.pos.x = x;
    letter.pos.y = y;
  }
  if (i === 0) {
    ctx.moveTo(x, y); // Move to the first vertex
  } else {
    ctx.lineTo(x, y); // Draw line to the next vertex
  }
  letter.draw(ctx);
}
function drawPolygon(chars) {
  const n = chars.length;

  ctx.beginPath();
  ctx.font = "25px Arial"; // Set the font for the text
  ctx.textAlign = "center"; // Center the text horizontally
  ctx.textBaseline = "middle"; // Center the text vertically
  if (!letters.length) {
    for (let i = 0; i < n; i++) {
      const letter = new Letter({}, chars[i]);
      letters.push(letter);

      polygonFormer(letter, n, i, true);
    }
  } else {
    letters.forEach((letter, i) => polygonFormer(letter, letters.length, i));
  }
  ctx.closePath(); // Close the path
}

function updateFrame(chars) {
  ctx.clearRect(0, 0, SIZE.width, SIZE.height);
  if (MOUSE_STRECH_POS.x && MOUSE_STRECH_POS.y && activeLetters.length) {
    const activeLength = activeLetters.length;
    activeLetters.forEach((letter, i) => {
      const isInBetween = i < activeLength - 1;
      ctx.strokeWidth = 8;
      ctx.moveTo(letter.pos.x, letter.pos.y);
      ctx.lineTo(
        isInBetween ? activeLetters[i + 1].pos.x : MOUSE_STRECH_POS.x,
        isInBetween ? activeLetters[i + 1].pos.y : MOUSE_STRECH_POS.y
      );
      ctx.stroke();
    });
    // console.log("Drawing");
  }
  const word = activeLetters.map((letter) => letter.letter).join("");

  wordConstruct.textContent = word;

  drawPolygon(chars);
}
function evaluateAttempt(wordGenerated, commonWords, level) {
  const guessedWord = commonWords.filter(
    (word) => word.toLowerCase() === wordGenerated
  );
  if (!guessedWord.length) {
    console.log("Guesed word");
    document.querySelectorAll(".word-box > input").forEach((input, i) => {
      if (input.value) return;
      input.classList.add("shake-sideway");
      input.classList.add("red-border-input");
      setTimeout(() => {
        input.classList.remove("shake-sideway");
        input.classList.remove("red-border-input");
        input.classList.remove("animate-got-word");
      }, 600);
    });
    return;
  }

  const word = guessedWord[0];
  // const wordBox = document.querySelectorAll(".word-box");
  const isDuplicate = gotWords.includes(word);
  const wordPos = commonWords.indexOf(word);
  if (isDuplicate) {
    console.log("duplicate");
    document
      .querySelectorAll(".word-box")
      [wordPos].childNodes.forEach((input, i) => {
        input.classList.add("shake-sideway");
        setTimeout(() => {
          input.classList.remove("shake-sideway");
          input.classList.remove("animate-got-word");
        }, 1000);
      });
    return;
  }
  document
    .querySelectorAll(".word-box")
    [wordPos].childNodes.forEach((input, i) => {
      input.classList.add("animate-got-word");
      input.value = word[i]?.toUpperCase();
    });
  gotWords.push(word);
  const gameEnd = [...new Set(gotWords)].length === commonWords.length;

  if (gameEnd) {
    setTimeout(() => {
      showLevelPopup(level);
    }, 1200);
  }
}
function checkPressInsideCircle(letter, pos) {
  return (
    ((pos.x - letter.pos.x) ** 2 + (pos.y - letter.pos.y) ** 2) ** 0.5 <=
    letter.r
  );
}
