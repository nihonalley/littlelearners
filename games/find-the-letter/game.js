const LETTERS = [
  { letter: "A", sound: "ah" },
  { letter: "B", sound: "buh" },
  { letter: "C", sound: "kuh" },
  { letter: "D", sound: "duh" },
  { letter: "E", sound: "eh" },
  { letter: "F", sound: "fff" },
  { letter: "G", sound: "guh" },
  { letter: "H", sound: "huh" },
  { letter: "I", sound: "ih" },
  { letter: "J", sound: "juh" },
  { letter: "K", sound: "kuh" },
  { letter: "L", sound: "lll" },
  { letter: "M", sound: "mmm" },
  { letter: "N", sound: "nnn" },
  { letter: "O", sound: "ah" },
  { letter: "P", sound: "puh" },
  { letter: "Q", sound: "kwuh" },
  { letter: "R", sound: "rrr" },
  { letter: "S", sound: "sss" },
  { letter: "T", sound: "tuh" },
  { letter: "U", sound: "uh" },
  { letter: "V", sound: "vvv" },
  { letter: "W", sound: "wuh" },
  { letter: "X", sound: "ks" },
  { letter: "Y", sound: "yuh" },
  { letter: "Z", sound: "zzz" }
];


const PASTELS = [
  "#FFE3D8",
  "#DDEEFF",
  "#FFF1B9",
  "#DDF3E4",
  "#EAE0FF",
  "#FFDDEA",
  "#DDF5F2",
  "#F5E4CF"
];


const TOTAL_ROUNDS = 8;


/* --------------------------------
   ELEMENTS
-------------------------------- */

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

const letterChoices =
  document.getElementById("letterChoices");

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


/* --------------------------------
   STATE
-------------------------------- */

let currentRound = 1;

let currentTarget = null;

let previousTarget = null;

let wrongAttempts = 0;

let roundLocked = false;


/* --------------------------------
   SHARED SOUND
-------------------------------- */

LittleLearners.attachSoundButton(
  soundButton
);


/* --------------------------------
   HELPERS
-------------------------------- */

function getChoiceCount(round) {

  /*
    Round 1–2 = 2
    Round 3–4 = 3
    Round 5–6 = 4
    Round 7–8 = 5
  */

  return (
    2
    +
    Math.floor(
      (round - 1) / 2
    )
  );

}


function chooseTarget() {

  const available =
    LETTERS.filter(
      item =>
        item.letter !==
        previousTarget
    );


  const target =
    LittleLearners.randomItem(
      available
    );


  previousTarget =
    target.letter;


  return target;
}


function getPromptText() {

  return (
    `Find the letter ${currentTarget.letter}`
  );

}


function getSpeechText() {

  return (
    `Find the letter ${currentTarget.letter}. `
  );

}


/* --------------------------------
   START
-------------------------------- */

function startGame() {

  currentRound = 1;

  previousTarget = null;

  startScreen.classList.add(
    "is-hidden"
  );

  finishScreen.classList.add(
    "is-hidden"
  );

  playScreen.classList.remove(
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

  feedback.textContent = "";


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
   SPEECH
-------------------------------- */

function speakInstruction() {

  LittleLearners.speak(
    getSpeechText(),
    {
      rate: 0.82,
      pitch: 1.16
    }
  );

}


/* --------------------------------
   LETTER CHOICES
-------------------------------- */

function renderChoices(
  count
) {

  letterChoices.innerHTML = "";


  const distractors =
    LittleLearners
      .shuffle(
        LETTERS.filter(
          item =>
            item.letter !==
            currentTarget.letter
        )
      )
      .slice(
        0,
        count - 1
      );


  const roundLetters =
    LittleLearners.shuffle(
      [
        currentTarget,
        ...distractors
      ]
    );


  const roundPastels =
    LittleLearners.shuffle(
      PASTELS
    );


  roundLetters.forEach(
    (item, index) => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "game-choice";


      button.dataset.letter =
        item.letter;


      button.style.backgroundColor =
        roundPastels[
          index %
          roundPastels.length
        ];


      button.setAttribute(
        "aria-label",
        `Letter ${item.letter}`
      );


      const letter =
        document.createElement(
          "span"
        );


      letter.className =
        "letter-choice";


      letter.textContent =
        item.letter;


      button.appendChild(
        letter
      );


      button.addEventListener(
        "click",
        () => {

          handleChoice(
            button,
            item
          );

        }
      );


      letterChoices.appendChild(
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
  item
) {

  if (
    roundLocked
  ) {
    return;
  }


  if (
    item.letter ===
    currentTarget.letter
  ) {

    handleCorrect(
      button
    );

    return;
  }


  handleWrong(
    button,
    item
  );

}


/* --------------------------------
   CORRECT
-------------------------------- */

function handleCorrect(
  button
) {

  roundLocked = true;


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


  LittleLearners.speak(
    message,
    {
      rate: 0.9,
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
    1250
  );

}


/* --------------------------------
   WRONG
-------------------------------- */

function handleWrong(
  button,
  item
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


  LittleLearners.speak(
    `That's ${item.letter}. ` +
    `Let's try again!`,
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
      `[data-letter="${currentTarget.letter}"]`
    );


  if (
    correctButton
  ) {

    correctButton.classList.add(
      "is-hint"
    );

  }

}


/* --------------------------------
   FINISH
-------------------------------- */

function finishGame() {

  playScreen.classList.add(
    "is-hidden"
  );


  finishScreen.classList.remove(
    "is-hidden"
  );


  LittleLearners.speak(
    "All done! Great job learning your letters!",
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

startButton.addEventListener(
  "click",
  () => {

    LittleLearners.speak(
      "Let's learn our letters!"
    );


    setTimeout(
      startGame,
      250
    );

  }
);


playAgainButton.addEventListener(
  "click",
  startGame
);


repeatButton.addEventListener(
  "click",
  speakInstruction
);