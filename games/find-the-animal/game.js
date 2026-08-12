const ANIMALS = [
  { name: "dog", sound: "woof woof" },
  { name: "cat", sound: "meow meow" },
  { name: "duck", sound: "quack quack" },
  { name: "frog", sound: "ribbit ribbit" },
  { name: "fish", sound: "bloop bloop" },
  { name: "elephant", sound: "elephant trumpet" },
  { name: "lion", sound: "lion roar" },
  { name: "monkey", sound: "oh oh ah ah" },
  { name: "rabbit", sound: "hop hop" },
  { name: "turtle", sound: "slow slow" },
  { name: "shark", sound: "chomp chomp" },
  { name: "penguin", sound: "waddle waddle" },
  { name: "bear", sound: "bear roar" },
  { name: "pig", sound: "oink oink" },
  { name: "horse", sound: "neigh neigh" },
  { name: "cow", sound: "moo moo" },
  { name: "mouse", sound: "squeak squeak" },
  {
    name: "trex",
    spokenName: "T-Rex",
    sound: "dinosaur roar"
  },
  { name: "sheep", sound: "ba ba" },
  { name: "crocodile", sound: "snap snap" }
];


const TOTAL_ROUNDS = 8;


/* ========================================
   ELEMENTS
======================================== */

const startScreen =
  document.getElementById("startScreen");

const playScreen =
  document.getElementById("playScreen");

const finishScreen =
  document.getElementById("finishScreen");

const startButton =
  document.getElementById("startButton");

const playAgainButton =
  document.getElementById("playAgainButton");

const repeatButton =
  document.getElementById("repeatButton");

const soundButton =
  document.getElementById("soundButton");

const findAnimalButton =
  document.getElementById("findAnimalButton");

const guessSoundButton =
  document.getElementById("guessSoundButton");

const animalChoices =
  document.getElementById("animalChoices");

const roundLabel =
  document.getElementById("roundLabel");

const prompt =
  document.getElementById("prompt");

const feedback =
  document.getElementById("feedback");

const progressBar =
  document.getElementById("progressBar");

const celebrationLayer =
  document.getElementById("celebrationLayer");


/* ========================================
   STATE
======================================== */

let currentRound = 1;

let currentTarget = null;

let previousAnimal = null;

let wrongAttempts = 0;

let roundLocked = false;

/*
  MODE 1:
  find-animal

  MODE 2:
  guess-sound
*/

let gameMode =
  "find-animal";


/* ========================================
   SHARED SOUND
======================================== */

LittleLearners.attachSoundButton(
  soundButton
);


/* ========================================
   HELPERS
======================================== */

function displayName(animal) {

  return (
    animal.spokenName ||
    animal.name
  );
}


function getChoiceCount(round) {

  /*
    Rounds 1–2 = 2 choices
    Rounds 3–4 = 3 choices
    Rounds 5–6 = 4 choices
    Rounds 7–8 = 5 choices
  */

  return (
    2 +
    Math.floor(
      (round - 1) / 2
    )
  );
}


function chooseTarget() {

  const available =
    ANIMALS.filter(
      animal =>
        animal.name !==
        previousAnimal
    );


  const animal =
    LittleLearners.randomItem(
      available
    );


  previousAnimal =
    animal.name;


  return animal;
}


function assetPath(animal) {

  return (
    "/assets/animals/" +
    animal.name +
    ".png"
  );
}


/* ========================================
   GAME MODE
======================================== */

function updateModeButtons() {

  findAnimalButton
    .classList
    .toggle(
      "is-active",
      gameMode === "find-animal"
    );


  guessSoundButton
    .classList
    .toggle(
      "is-active",
      gameMode === "guess-sound"
    );
}


function setGameMode(mode) {

  if (
    gameMode === mode
  ) {
    return;
  }


  gameMode =
    mode;


  updateModeButtons();


  /*
    If the child is already playing,
    begin a fresh round using the new mode.
  */

  if (
    !playScreen.classList.contains(
      "is-hidden"
    )
  ) {

    wrongAttempts = 0;

    roundLocked = false;

    feedback.textContent = "";

    renderCurrentRound();

  }
}


/* ========================================
   PROMPT
======================================== */

function getPromptText() {

  if (
    gameMode === "guess-sound"
  ) {

    return (
      `What animal says ${currentTarget.sound}?`
    );
  }


  return (
    `Find the ${displayName(currentTarget)}!`
  );
}


function getSpeechText() {

  if (
    gameMode === "guess-sound"
  ) {

    return (
      `What animal says ${currentTarget.sound}?`
    );
  }


  return (
    `Can you find the ${displayName(currentTarget)}?`
  );
}


function speakInstruction() {

  if (
    !currentTarget
  ) {
    return;
  }


  LittleLearners.speak(
    getSpeechText(),
    {
      rate: 0.84,
      pitch: 1.16
    }
  );
}


/* ========================================
   START GAME
======================================== */

function startGame() {

  currentRound = 1;

  previousAnimal = null;

  wrongAttempts = 0;

  roundLocked = false;


  startScreen
    .classList
    .add("is-hidden");


  finishScreen
    .classList
    .add("is-hidden");


  playScreen
    .classList
    .remove("is-hidden");


  beginRound();
}


/* ========================================
   ROUND
======================================== */

function beginRound() {

  wrongAttempts = 0;

  roundLocked = false;

  feedback.textContent = "";


  currentTarget =
    chooseTarget();


  renderCurrentRound();
}


function renderCurrentRound() {

  roundLabel.textContent =
    `Round ${currentRound} of ${TOTAL_ROUNDS}`;


  prompt.textContent =
    getPromptText();


  progressBar.style.width =
    `${
      (
        currentRound /
        TOTAL_ROUNDS
      ) * 100
    }%`;


  renderChoices(
    getChoiceCount(
      currentRound
    )
  );


  setTimeout(
    speakInstruction,
    320
  );
}


/* ========================================
   ANIMAL CHOICES
======================================== */

function renderChoices(count) {

  animalChoices.innerHTML =
    "";


  const distractors =
    LittleLearners
      .shuffle(
        ANIMALS.filter(
          animal =>
            animal.name !==
            currentTarget.name
        )
      )
      .slice(
        0,
        count - 1
      );


  const roundAnimals =
    LittleLearners.shuffle(
      [
        currentTarget,
        ...distractors
      ]
    );


  roundAnimals.forEach(
    animal => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "game-choice animal-choice";


      button.dataset.animal =
        animal.name;


      button.setAttribute(
        "aria-label",
        displayName(animal)
      );


      const image =
        document.createElement(
          "img"
        );


      image.src =
        assetPath(animal);


      image.alt =
        displayName(animal);


      button.appendChild(
        image
      );


      button.addEventListener(
        "click",
        () => {

          handleChoice(
            button,
            animal
          );

        }
      );


      animalChoices.appendChild(
        button
      );

    }
  );
}


/* ========================================
   ANSWER
======================================== */

function handleChoice(
  button,
  animal
) {

  if (
    roundLocked
  ) {
    return;
  }


  if (
    animal.name ===
    currentTarget.name
  ) {

    handleCorrect(
      button
    );

    return;
  }


  handleWrong(
    button,
    animal
  );
}


/* ========================================
   CORRECT
======================================== */

function handleCorrect(button) {

  roundLocked =
    true;


  document
    .querySelectorAll(
      ".game-choice"
    )
    .forEach(
      choice => {

        choice.disabled =
          true;

        choice.classList.remove(
          "is-hint"
        );

      }
    );


  button.classList.add(
    "is-correct"
  );


  const message =
    LittleLearners
      .positiveMessage();


  feedback.textContent =
    message;


  let speech =
    message;


  /*
    Reinforce the association in
    Guess the Sound mode.
  */

  if (
    gameMode === "guess-sound"
  ) {

    speech +=
      ` The ${displayName(currentTarget)} says ${currentTarget.sound}.`;

  }


  LittleLearners.speak(
    speech,
    {
      rate: 0.88,
      pitch: 1.18
    }
  );


  LittleLearners.celebrate(
    celebrationLayer
  );


  setTimeout(
    () => {

      if (
        currentRound >=
        TOTAL_ROUNDS
      ) {

        finishGame();

        return;
      }


      currentRound++;

      beginRound();

    },
    1350
  );
}


/* ========================================
   WRONG
======================================== */

function handleWrong(
  button,
  animal
) {

  wrongAttempts++;


  button.classList.remove(
    "is-wrong"
  );


  void button.offsetWidth;


  button.classList.add(
    "is-wrong"
  );


  feedback.textContent =
    "Try again!";


  let speech;


  if (
    gameMode === "guess-sound"
  ) {

    speech =
      `That's the ${displayName(animal)}. Try again!`;

  } else {

    speech =
      `That's the ${displayName(animal)}. Let's try again!`;

  }


  LittleLearners.speak(
    speech,
    {
      rate: 0.84,
      pitch: 1.15
    }
  );


  if (
    wrongAttempts >= 2
  ) {

    showHint();

  }
}


/* ========================================
   HINT
======================================== */

function showHint() {

  const correctButton =
    document.querySelector(
      `[data-animal="${currentTarget.name}"]`
    );


  if (
    correctButton
  ) {

    correctButton
      .classList
      .add("is-hint");

  }
}


/* ========================================
   FINISH
======================================== */

function finishGame() {

  playScreen
    .classList
    .add("is-hidden");


  finishScreen
    .classList
    .remove("is-hidden");


  LittleLearners.speak(
    "All done! Great job learning your animals!",
    {
      rate: 0.88,
      pitch: 1.18
    }
  );


  LittleLearners.celebrate(
    celebrationLayer,
    16
  );
}


/* ========================================
   EVENTS
======================================== */

startButton
  .addEventListener(
    "click",
    startGame
  );


playAgainButton
  .addEventListener(
    "click",
    startGame
  );


repeatButton
  .addEventListener(
    "click",
    speakInstruction
  );


findAnimalButton
  .addEventListener(
    "click",
    () => {

      setGameMode(
        "find-animal"
      );

    }
  );


guessSoundButton
  .addEventListener(
    "click",
    () => {

      setGameMode(
        "guess-sound"
      );

    }
  );


updateModeButtons();