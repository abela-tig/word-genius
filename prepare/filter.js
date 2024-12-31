const fs = require("fs/promises");

async function main(name) {
  const data = await fs.readFile(name, "utf-8");
  const words = new Set(
    data
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => {
        return (
          word.length >= 3 &&
          word.length <= 6 &&
          word.match(/^[a-zA-Z]+$/) &&
          !word.includes(" ")
        );
      })
  );
  fs.writeFile(name, [...words].sort((a, b) => a.length - b.length).join("\n"));
}

main("common_words.txt");
