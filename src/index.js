import dict from "./dict.js";

const parseResults = () => {
  const gameApp = document.querySelector("game-app");
  const gameRows = gameApp.shadowRoot.querySelectorAll("game-row");

  let contains = [];
  let doesntContain = [];
  let position = [];

  gameRows.forEach((gameRow) => {
    const gameTiles = gameRow.shadowRoot.querySelectorAll("game-tile");
    gameTiles.forEach((gameTile, i) => {
      const letter = gameTile.getAttribute("letter");
      switch (gameTile.getAttribute("evaluation")) {
        case "absent":
          doesntContain.push(letter);
          break;
        case "correct":
          position.push(`${i}:${letter}`);
          break;
        case "present":
          contains.push(`${i}:${letter}`);
          break;
      }
    });
  });

  doesntContain = doesntContain
    .filter((l) => contains.map((l2) => l2.split(":")[1]).indexOf(l) == -1)
    .filter((l) => position.map((l2) => l2.split(":")[1]).indexOf(l) == -1);

  return [contains, doesntContain, position];
};

const isCorrect = () => {
  const gameApp = document.querySelector("game-app");
  const gameRows = Array.from(
    gameApp.shadowRoot.querySelectorAll("game-row")
  ).filter((dr) => dr.getAttribute("letters"));
  const lastGameRow = gameRows[gameRows.length - 1];

  const gameTiles = lastGameRow.shadowRoot.querySelectorAll("game-tile");
  return !Array.from(gameTiles).find((gameTile, i) => {
    const letter = gameTile.getAttribute("letter");
    return gameTile.getAttribute("evaluation") != "correct";
  });
};

const wordNotAccepted = () => {
  const gameApp = document.querySelector("game-app");
  const gameRows = Array.from(
    gameApp.shadowRoot.querySelectorAll("game-row")
  ).filter((dr) => dr.getAttribute("letters"));
  const lastGameRow = gameRows[gameRows.length - 1];

  const gameTiles = lastGameRow.shadowRoot.querySelectorAll("game-tile");
  return !Array.from(gameTiles).find((gameTile, i) => {
    const letter = gameTile.getAttribute("letter");
    return !!gameTile.getAttribute("evaluation");
  });
};

const clearTyped = () => {
  const gameApp = document.querySelector("game-app");
  const gameKeyboard = gameApp.shadowRoot.querySelector("game-keyboard");
  const backspace = gameKeyboard.shadowRoot.querySelector(
    'button[data-key="←"]'
  );

  backspace.click();
  backspace.click();
  backspace.click();
  backspace.click();
  backspace.click();
};

const type = (str) => {
  const gameApp = document.querySelector("game-app");
  const gameKeyboard = gameApp.shadowRoot.querySelector("game-keyboard");
  Array.from(str).forEach((l) =>
    gameKeyboard.shadowRoot.querySelector(`button[data-key="${l}"]`).click()
  );

  gameKeyboard.shadowRoot.querySelector(`button[data-key="↵"]`).click();
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const search = (str, search) =>
  Array.from(str)
    .map((l, i) => ({ l, i }))
    .filter(({ l }) => l === search)
    .map(({ i }) => i);

const getNextGuess = (contains, doesntContain, positions) => {
  let filter = [...dict];
  console.log("Total 5 letter words: " + filter.length);

  console.log("Using contains filter: ", contains);
  contains = contains && contains.map((p) => p.split(":"));
  if (contains) {
    filter = filter.filter(
      (w) =>
        contains.filter(([p, c]) => {
          const found = search(w, c);
          return found.length && found.filter((v) => v == p).length == 0;
        }).length == contains.length
    );
  }
  console.log("After contains filter: " + filter.length);

  console.log("Using doesntContain filter: ", doesntContain);
  if (doesntContain) {
    filter = filter.filter(
      (w) =>
        doesntContain.filter((c) => w.indexOf(c) == -1).length ==
        doesntContain.length
    );
  }
  console.log("After doesntContain filter: " + filter.length);

  console.log("Using positions filter: ", positions);
  positions = positions && positions.map((p) => p.split(":"));
  if (positions) {
    filter = filter.filter(
      (w) =>
        positions.filter(([p, c]) => search(w, c).indexOf(+p) > -1).length ===
        positions.length
    );
  }
  console.log("After positions filter: " + filter.length);

  if (filter.length < 5000) {
    filter = shuffle(filter);
  }

  return filter.length && filter[0];
};

const scheduleNextGuess = () => {
  setTimeout(() => {
    if (!isCorrect()) {
      console.log("Incorrect!");
      const nextGuess = getNextGuess(...parseResults());
      console.log(`Guessing ${nextGuess}`);
      if (nextGuess) {
        type(nextGuess);
        scheduleNextGuess();
      }
    }

    if (wordNotAccepted()) {
      clearTyped();
    }
  }, 2000);
};

type("woman");
scheduleNextGuess();
