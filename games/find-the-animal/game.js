const ANIMALS = [

  {
    name: "dog",
    sound: "Woof woof!"
  },

  {
    name: "cat",
    sound: "Meow meow!"
  },

  {
    name: "duck",
    sound: "Quack quack!"
  },

  {
    name: "frog",
    sound: "Ribbit ribbit!"
  },

  {
    name: "fish",
    sound: "Bloop bloop!"
  },

  {
    name: "elephant",
    sound: "Pawoo pawoo!"
  },

  {
    name: "lion",
    sound: "Roar!"
  },

  {
    name: "monkey",
    sound: "Ooh ooh, ah ah!"
  },

  {
    name: "rabbit",
    sound: "Hop hop!"
  },

  {
    name: "turtle",
    sound: "Slow, slow!"
  },

  {
    name: "shark",
    sound: "Chomp chomp!"
  },

  {
    name: "penguin",
    sound: "Waddle waddle!"
  },

  {
    name: "bear",
    sound: "Grrr, roar!"
  },

  {
    name: "pig",
    sound: "Oink oink!"
  },

  {
    name: "horse",
    sound: "Neigh neigh!"
  },

  {
    name: "cow",
    sound: "Moo moo!"
  },

  {
    name: "mouse",
    sound: "Squeak squeak!"
  },

  {
    name: "trex",
    spokenName: "T-Rex",
    sound: "Roar!"
  },

  {
    name: "sheep",
    sound: "Baa baa!"
  },

  {
    name: "crocodile",
    sound: "Snap snap!"
  }

];


const TOTAL_ROUNDS = 8;



/* --------------------------------
   ELEMENTS
-------------------------------- */

const startScreen =
  document.getElementById(
    "startScreen"
  );


const playScreen =
  document.getElementById(
    "playScreen"
  );


const finishScreen =
  document.getElementById(
    "finishScreen"
  );


const startButton =
  document.getElementById(
    "startButton"
  );


const playAgainButton =
  document.getElementById(
    "playAgainButton"
  );


const repeatButton =
  document.getElementById(
    "repeatButton"
  );


const soundButton =
  document.getElementById(
    "soundButton"
  );


const animalsOnlyButton =
  document.getElementById(
    "animalsOnlyButton"
  );


const animalSoundsButton =
  document.getElementById(
    "animalSoundsButton"
  );


const animalChoices =
  document.getElementById(
    "animalChoices"
  );


const roundLabel =
  document.getElementById(
    "roundLabel"
  );


const prompt =
  document.getElementById(
    "prompt"
  );


const feedback =
  document.getElementById(
    "feedback"
  );


const progressBar =
  document.getElementById(
    "progressBar"
  );


const celebrationLayer =
  document.getElementById(
    "celebrationLayer"
  );



/* --------------------------------
   STATE
-------------------------------- */

let currentRound = 1;

let currentTarget = null;

let previousAnimal = null;

let wrongAttempts = 0;

let roundLocked = false;


/*
  false:
  "Find the dog."

  true:
  "Find the dog. Woof woof!"
*/

let funSoundsEnabled = false;



/* --------------------------------
   SHARED SOUND
-------------------------------- */

LittleLearners.attachSoundButton(
  soundButton
);



/* --------------------------------
   MODE SELECTOR
-------------------------------- */

function updateModeButtons() {

  animalsOnlyButton
    .classList
    .toggle(
      "is-active",
      !funSoundsEnabled
    );


  animalSoundsButton
    .classList
    .toggle(
      "is-active",
      funSoundsEnabled
    );

}



animalsOnlyButton
  .addEventListener(
    "click",
    () => {

      funSoundsEnabled =
        false;


      updateModeButtons();


      speakInstruction();

    }
  );



animalSoundsButton
  .addEventListener(
    "click",
    () => {

      funSoundsEnabled =
        true;


      updateModeButtons();


      speakInstruction();

    }
  );



/* --------------------------------
   HELPERS
-------------------------------- */

function displayName(
  animal
) {

  return (
    animal.spokenName
    ||
    animal.name
  );

}



function getChoiceCount(
  round
) {

  /*
    Rounds 1–2 = 2
    Rounds 3–4 = 3
    Rounds 5–6 = 4
    Rounds 7–8 = 5
  */

  return (
    2
    +
    Math.floor(
      (round - 1)
      /
      2
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



function assetPath(
  animal
) {

  return (
    "../../assets/animals/"
    +
    animal.name
    +
    ".png"
  );

}



/* --------------------------------
   INSTRUCTION
-------------------------------- */

function getPromptText() {

  return (
    `Find the ${displayName(currentTarget)}!`
  );

}



function getSpeechText() {

  const base =
    `Can you find the ${displayName(currentTarget)}?`;


  if (
    !funSoundsEnabled
  ) {

    return base;

  }


  return (
    `${base} ${currentTarget.sound}`
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



/* --------------------------------
   START GAME
-------------------------------- */

function startGame() {

  currentRound = 1;

  previousAnimal = null;


  startScreen
    .classList
    .add(
      "is-hidden"
    );


  finishScreen
    .classList
    .add(
      "is-hidden"
    );


  playScreen
    .classList
    .remove(
      "is-hidden"
    );


  beginRound();

}



/* --------------------------------
   ROUND
-------------------------------- */

function beginRound() {

  wrongAttempts = 0;

  roundLocked = false;


  feedback.textContent =
    "";


  currentTarget =
    chooseTarget();


  roundLabel.textContent =
    `Round ${currentRound} of ${TOTAL_ROUNDS}`;


  prompt.textContent =
    getPromptText();


  progressBar.style.width =
    `${
      (
        currentRound
        /
        TOTAL_ROUNDS
      )
      *
      100
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



/* --------------------------------
   CHOICES
-------------------------------- */

function renderChoices(
  count
) {

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
        assetPath(
          animal
        );


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


      animalChoices
        .appendChild(
          button
        );

    }
  );

}



/* --------------------------------
   ANSWER
-------------------------------- */

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



/* --------------------------------
   CORRECT
-------------------------------- */

function handleCorrect(
  button
) {

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


  if (
    funSoundsEnabled
  ) {

    speech +=
      ` ${currentTarget.sound}`;

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
    1300
  );

}



/* --------------------------------
   WRONG
-------------------------------- */

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


  let speech =
    `That's the ${displayName(animal)}.`;


  if (
    funSoundsEnabled
  ) {

    speech +=
      ` ${animal.sound}`;

  }


  speech +=
    " Let's try again!";


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



/* --------------------------------
   HINT
-------------------------------- */

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
      .add(
        "is-hint"
      );

  }

}



/* --------------------------------
   FINISH
-------------------------------- */

function finishGame() {

  playScreen
    .classList
    .add(
      "is-hidden"
    );


  finishScreen
    .classList
    .remove(
      "is-hidden"
    );


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



/* --------------------------------
   EVENTS
-------------------------------- */

startButton
  .addEventListener(
    "click",
    () => {

      LittleLearners.speak(
        "Let's find some animals!"
      );


      setTimeout(
        startGame,
        250
      );

    }
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



updateModeButtons();