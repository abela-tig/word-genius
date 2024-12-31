const length = [3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6];
const vowels = ["a", "e", "i", "o", "u"];
const consonants = [
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "q",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const fs = require("fs");
const commonWordsList = fs
  .readFileSync("common_words.txt", "utf-8")
  .split("\n");
const possibleWordsList = fs
  .readFileSync("possible_words.txt", "utf-8")
  .split("\n");
const levels = 100;

function chooseRandomChars(length) {
  let chars = [];
  let hasVowel = false;

  for (let i = 0; i < length; i++) {
    let char;
    if (Math.random() < 0.4) {
      char = vowels[Math.floor(Math.random() * vowels.length)];
      hasVowel = true;
    } else {
      char = consonants[Math.floor(Math.random() * consonants.length)];
    }
    chars.push(char);
  }

  if (!hasVowel) {
    chars[Math.floor(Math.random() * length)] =
      vowels[Math.floor(Math.random() * vowels.length)];
  }

  return chars;
}

function checkCanBeConstructer(chars, word) {
  let fullWord = word;
  chars.map((char) => {
    word = word.replace(char, "");
  });
  //   console.log(word, fullWord, chars);
  return word.length == 0;
}

function generateGame(length, level) {
  let chars = chooseRandomChars(length);
  const commonWords = commonWordsList.filter(
    (word) =>
      word.length === length &&
      chars.every((char) => word.includes(char)) &&
      checkCanBeConstructer(chars, word)
  );
  const possibleWords = possibleWordsList.filter(
    (word) =>
      word.length === length &&
      chars.every((char) => word.includes(char)) &&
      checkCanBeConstructer(chars, word)
  );

  //   console.log(
  //     chars.join(""),
  //     "Common word founded:",
  //     commonWords.length,
  //     commonWords.slice(0, 5),
  //     "Possible word founded:",
  //     possibleWords.length
  //   );

  if (
    commonWords.length > 2 &&
    commonWords.length < 6
    // &&  possibleWords.length > 0 &&
    // possibleWords.length < 10
  ) {
    // if (
    //   possibleWords.length + 2 > commonWords.length &&
    //   commonWords.length <= 4
    // ) {
    //   possibleWords.forEach((word) => {
    //     if (commonWords.includes(word) || commonWords.length >= 4) {
    //       return;
    //     }
    //     commonWords.push(word);
    //   });
    // }

    return {
      charLength: length,
      chars: chars,
      commonWords,
      possibleWords: possibleWords.filter(
        (word) => !commonWords.includes(word)
      ),
    };
  }
}

let levelData = [];
console.log("Start generating...");
while (levelData.length < levels) {
  const charLength =
    length[Math.floor((levelData.length / levels) * length.length)];
  let game = generateGame(charLength);
  if (
    game &&
    levelData.every((data) =>
      data.commonWords.every((word) => !game.commonWords.includes(word))
    )
  ) {
    levelData.push({ ...game, level: levelData.length + 1 });
    console.log("Level data generated:", levelData.length);
  }
  if (levelData.length == levels) {
    fs.writeFileSync("level_data.json", JSON.stringify(levelData, null, 2));
  }
}
