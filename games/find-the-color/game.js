const COLORS = [
  {
    name: "red",
    value: "#F04F4F"
  },

  {
    name: "blue",
    value: "#4D9DE0"
  },

  {
    name: "yellow",
    value: "#FFD54A"
  },

  {
    name: "green",
    value: "#55B96F"
  },

  {
    name: "orange",
    value: "#F59A3D"
  },

  {
    name: "purple",
    value: "#9568D8"
  },

  {
    name: "pink",
    value: "#F28AAA"
  },

  {
    name: "brown",
    value: "#956B52"
  },

  {
    name: "black",
    value: "#292929"
  },

  {
    name: "white",
    value: "#FFFFFF"
  }
];


const TOTAL_ROUNDS = 8;


/* --------------------------------
   ELEMENTS
-------------------------------- */

const startScreen =
  document.getElementById("startScreen");

const gameScreen =
  document.getElementById("gameScreen");

const finishScreen =
  document.getElementById("finishScreen");

const startButton =
  document.getElementById("startButton");

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

const colorChoices =
  document.getElementById(
    "colorChoices"
  );

const roundLabel =
  document.getElementById(
    "roundLabel"
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
   GAME STATE
-------------------------------- */

let currentRound = 1;

let currentTarget = null;

let wrongAttempts = 0;

let roundLocked = false;

let soundEnabled = true;

let previousTarget = null;

let voices = [];


/* --------------------------------
   SPEECH
-------------------------------- */

function loadVoices() {

  if (
    !(
      "speechSynthesis"
      in window
    )
  ) {
    return;
  }

  voices =
    window
      .speechSynthesis
      .getVoices();

}


loadVoices();


if (
  "speechSynthesis"
  in window
) {

  window
    .speechSynthesis
    .addEventListener(
      "voiceschanged",
      loadVoices
    );

}


function chooseFriendlyVoice() {

  if (
    voices.length === 0
  ) {
    return null;
  }


  const englishVoices =
    voices.filter(
      voice =>
        voice.lang
          .toLowerCase()
          .startsWith("en")
    );


  const preferredNames = [
    "samantha",
    "ava",
    "zira",
    "jenny",
    "aria",
    "susan",
    "karen",
    "moira"
  ];


  for (
    const preferred
    of preferredNames
  ) {

    const match =
      englishVoices.find(
        voice =>
          voice.name
            .toLowerCase()
            .includes(
              preferred
            )
      );


    if (match) {
      return match;
    }

  }


  return (
    englishVoices[0]
    ||
    voices[0]
  );

}


function speak(
  text,
  options = {}
) {

  if (
    !soundEnabled
    ||
    !(
      "speechSynthesis"
      in window
    )
  ) {
    return;
  }


  window
    .speechSynthesis
    .cancel();


  const message =
    new SpeechSynthesisUtterance(
      text
    );


  message.lang =
    "en-US";


  message.rate =
    options.rate ?? 0.86;


  message.pitch =
    options.pitch ?? 1.15;


  message.volume = 1;


  const friendlyVoice =
    chooseFriendlyVoice();


  if (
    friendlyVoice
  ) {

    message.voice =
      friendlyVoice;

  }


  window
    .speechSynthesis
    .speak(
      message
    );

}


/* --------------------------------
   SOUND BUTTON
-------------------------------- */

function updateSoundButton() {

  soundButton.textContent =
    soundEnabled
      ? "🔊"
      : "🔇";


  soundButton.setAttribute(
    "aria-label",
    soundEnabled
      ? "Turn sound off"
      : "Turn sound on"
  );

}


soundButton.addEventListener(
  "click",
  () => {

    soundEnabled =
      !soundEnabled;


    if (
      !soundEnabled
      &&
      "speechSynthesis"
      in window
    ) {

      window
        .speechSynthesis
        .cancel();

    }


    updateSoundButton();


    if (
      soundEnabled
    ) {

      speak(
        "Sound is on!"
      );

    }

  }
);


/* --------------------------------
   HELPERS
-------------------------------- */

function shuffle(array) {

  const copy =
    [...array];


  for (
    let i =
      copy.length - 1;

    i > 0;

    i--
  ) {

    const j =
      Math.floor(
        Math.random()
        *
        (i + 1)
      );


    [
      copy[i],
      copy[j]
    ] =
    [
      copy[j],
      copy[i]
    ];

  }


  return copy;

}


function getChoiceCount(
  round
) {

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
      (round - 1)
      /
      2
    )
  );

}


function chooseTarget() {

  let choices =
    COLORS.filter(
      color =>
        color.name
        !==
        previousTarget
    );


  const chosen =
    choices[
      Math.floor(
        Math.random()
        *
        choices.length
      )
    ];


  previousTarget =
    chosen.name;


  return chosen;

}


/* --------------------------------
   START GAME
-------------------------------- */

function startGame() {

  currentRound = 1;

  previousTarget = null;

  startScreen
    .classList
    .add("hidden");

  finishScreen
    .classList
    .add("hidden");

  gameScreen
    .classList
    .remove("hidden");


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


  const choiceCount =
    getChoiceCount(
      currentRound
    );


  roundLabel.textContent =
    `Round ${currentRound} of ${TOTAL_ROUNDS}`;


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


  createColorChoices(
    choiceCount
  );


  setTimeout(
    () => {

      speakInstruction();

    },
    350
  );

}


/* --------------------------------
   CREATE COLORS
-------------------------------- */

function createColorChoices(
  count
) {

  colorChoices.innerHTML =
    "";


  const otherColors =
    shuffle(
      COLORS.filter(
        color =>
          color.name
          !==
          currentTarget.name
      )
    )
    .slice(
      0,
      count - 1
    );


  const roundColors =
    shuffle(
      [
        currentTarget,
        ...otherColors
      ]
    );


  roundColors.forEach(
    color => {

      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "color-button";


      button.style.backgroundColor =
        color.value;


      button.dataset.color =
        color.name;


      button.setAttribute(
        "aria-label",
        color.name
      );


      if (
        color.name ===
        "white"
      ) {

        button.classList.add(
          "white-color"
        );

      }


      button.addEventListener(
        "click",
        () => {

          handleColorTap(
            button,
            color
          );

        }
      );


      colorChoices.appendChild(
        button
      );

    }
  );

}


/* --------------------------------
   INSTRUCTION
-------------------------------- */

function speakInstruction() {

  if (
    !currentTarget
  ) {
    return;
  }


  speak(
    `Can you find ${currentTarget.name}?`,
    {
      rate: 0.82,
      pitch: 1.15
    }
  );

}


repeatButton.addEventListener(
  "click",
  speakInstruction
);


/* --------------------------------
   ANSWER
-------------------------------- */

function handleColorTap(
  button,
  color
) {

  if (
    roundLocked
  ) {
    return;
  }


  if (
    color.name
    ===
    currentTarget.name
  ) {

    handleCorrect(
      button
    );

  } else {

    handleWrong(
      button,
      color
    );

  }

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
      ".color-button"
    )
    .forEach(
      item => {

        item.disabled =
          true;

        item.classList.remove(
          "hint"
        );

      }
    );


  button.classList.add(
    "correct"
  );


  const positiveMessages = [
    "Great job!",
    "You got it!",
    "Wonderful!",
    "That's right!",
    "Yay! Great job!",
    "Awesome!"
  ];


  const message =
    positiveMessages[
      Math.floor(
        Math.random()
        *
        positiveMessages.length
      )
    ];


  feedback.textContent =
    message;


  speak(
    message,
    {
      rate: 0.9,
      pitch: 1.2
    }
  );


  createCelebration();


  setTimeout(
    () => {

      if (
        currentRound
        >=
        TOTAL_ROUNDS
      ) {

        finishGame();

      } else {

        currentRound++;

        beginRound();

      }

    },
    1350
  );

}


/* --------------------------------
   WRONG
-------------------------------- */

function handleWrong(
  button,
  color
) {

  wrongAttempts++;


  button.classList.remove(
    "wrong"
  );


  void button.offsetWidth;


  button.classList.add(
    "wrong"
  );


  /*
    First mistake:
    identify the color.

    Second mistake:
    also pulse the correct answer.
  */

  const message =
    `That's ${color.name}. Let's try again!`;


  feedback.textContent =
    "Try again!";


  speak(
    message,
    {
      rate: 0.84,
      pitch: 1.1
    }
  );


  if (
    wrongAttempts >= 2
  ) {

    showCorrectHint();

  }

}


/* --------------------------------
   HINT
-------------------------------- */

function showCorrectHint() {

  const correctButton =
    document.querySelector(
      `[data-color="${currentTarget.name}"]`
    );


  if (
    correctButton
  ) {

    correctButton
      .classList
      .add(
        "hint"
      );

  }

}


/* --------------------------------
   CELEBRATION
-------------------------------- */

function createCelebration() {

  const colors = [
    "#FFD54A",
    "#F28AAA",
    "#69B9EE",
    "#72C891",
    "#9568D8"
  ];


  for (
    let i = 0;
    i < 12;
    i++
  ) {

    const piece =
      document.createElement(
        "span"
      );


    piece.className =
      "confetti";


    piece.style.left =
      `${45 + Math.random() * 10}%`;


    piece.style.top =
      `${45 + Math.random() * 10}%`;


    piece.style.background =
      colors[
        Math.floor(
          Math.random()
          *
          colors.length
        )
      ];


    piece.style.setProperty(
      "--x",
      `${
        Math.random()
        *
        260
        -
        130
      }px`
    );


    piece.style.setProperty(
      "--y",
      `${
        Math.random()
        *
        220
        -
        110
      }px`
    );


    celebrationLayer.appendChild(
      piece
    );


    setTimeout(
      () => {

        piece.remove();

      },
      950
    );

  }

}


/* --------------------------------
   FINISH
-------------------------------- */

function finishGame() {

  gameScreen
    .classList
    .add("hidden");


  finishScreen
    .classList
    .remove("hidden");


  speak(
    "All done! Great job!",
    {
      rate: 0.88,
      pitch: 1.18
    }
  );


  createCelebration();


  setTimeout(
    createCelebration,
    350
  );

}


/* --------------------------------
   EVENTS
-------------------------------- */

startButton.addEventListener(
  "click",
  () => {

    speak(
      "Let's play!"
    );


    setTimeout(
      startGame,
      300
    );

  }
);


playAgainButton.addEventListener(
  "click",
  startGame
);