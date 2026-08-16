const COLORS = [
  {
    name: "red",
    value: "#F06A6A"
  },

  {
    name: "blue",
    value: "#69B9EE"
  },

  {
    name: "yellow",
    value: "#FFD65A"
  },

  {
    name: "green",
    value: "#72C891"
  },

  {
    name: "orange",
    value: "#F3A45C"
  },

  {
    name: "purple",
    value: "#A98BE8"
  },

  {
    name: "pink",
    value: "#F39DB7"
  },

  {
    name: "teal",
    value: "#73D5CF"
  },

  {
    name: "brown",
    value: "#A98368"
  },

  {
    name: "black",
    value: "#363636"
  }
];


const LETTERS = [
  "A", "B", "C", "D", "E", "F", "G",
  "H", "I", "J", "K", "L", "M", "N",
  "O", "P", "Q", "R", "S", "T", "U",
  "V", "W", "X", "Y", "Z"
];


const NUMBERS = [
  "1", "2", "3", "4", "5",
  "6", "7", "8", "9", "10"
];


const PASTELS = [
  "#FFDDE6",
  "#DDEEFF",
  "#FFF0B8",
  "#DDF3E4",
  "#E9DFFF",
  "#DDF5F2",
  "#FFE5CA"
];


const TOTAL_ROUNDS = 8;


/* ========================================
   ELEMENTS
======================================== */

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

const colorModeButton =
  document.getElementById(
    "colorModeButton"
  );

const letterModeButton =
  document.getElementById(
    "letterModeButton"
  );

const numberModeButton =
  document.getElementById(
    "numberModeButton"
  );

const bubbleField =
  document.getElementById(
    "bubbleField"
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


/* ========================================
   STATE
======================================== */

let gameMode =
  "colors";

let currentRound =
  1;

let currentTarget =
  null;

let wrongAttempts =
  0;

let roundLocked =
  false;

let previousTarget =
  null;


/* ========================================
   SHARED SOUND
======================================== */

LittleLearners.attachSoundButton(
  soundButton
);


/* ========================================
   MODE
======================================== */

function setMode(mode) {

  gameMode =
    mode;


  colorModeButton
    .classList
    .toggle(
      "is-active",
      mode === "colors"
    );


  letterModeButton
    .classList
    .toggle(
      "is-active",
      mode === "letters"
    );


  numberModeButton
    .classList
    .toggle(
      "is-active",
      mode === "numbers"
    );
}


colorModeButton
  .addEventListener(
    "click",
    () => setMode("colors")
  );


letterModeButton
  .addEventListener(
    "click",
    () => setMode("letters")
  );


numberModeButton
  .addEventListener(
    "click",
    () => setMode("numbers")
  );


/* ========================================
   HELPERS
======================================== */

function bubbleCount(round) {

  if (round <= 2) {
    return 3;
  }

  if (round <= 4) {
    return 4;
  }

  if (round <= 6) {
    return 5;
  }

  return 6;
}


function chooseTarget() {

  let pool;


  if (
    gameMode === "colors"
  ) {

    pool =
      COLORS;

  } else if (
    gameMode === "letters"
  ) {

    pool =
      LETTERS;

  } else {

    pool =
      NUMBERS;

  }


  let target;


  do {

    target =
      LittleLearners.randomItem(
        pool
      );

  } while (
    getTargetKey(target)
    ===
    previousTarget
  );


  previousTarget =
    getTargetKey(target);


  return target;
}


function getTargetKey(target) {

  if (
    gameMode === "colors"
  ) {

    return target.name;

  }


  return target;
}


function getPromptText() {

  if (
    gameMode === "colors"
  ) {

    return (
      `Pop the ${currentTarget.name} bubble!`
    );

  }


  if (
    gameMode === "letters"
  ) {

    return (
      `Pop the letter ${currentTarget}!`
    );

  }


  return (
    `Pop number ${currentTarget}!`
  );
}


function getSpeechText() {

  return getPromptText();
}


function speakInstruction() {

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

  currentRound =
    1;

  previousTarget =
    null;

  wrongAttempts =
    0;

  roundLocked =
    false;


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


/* ========================================
   ROUND
======================================== */

function beginRound() {

  wrongAttempts =
    0;

  roundLocked =
    false;

  feedback.textContent =
    "";


  currentTarget =
    chooseTarget();


  roundLabel.textContent =
    `Round ${currentRound} of ${TOTAL_ROUNDS}`;


  prompt.textContent =
    getPromptText();


  progressBar.style.width =
    `${(
      currentRound /
      TOTAL_ROUNDS
    ) * 100
    }%`;


  renderBubbles(
    bubbleCount(
      currentRound
    )
  );


  setTimeout(
    speakInstruction,
    320
  );
}


/* ========================================
   BUILD BUBBLE CHOICES
======================================== */

function getRoundChoices(count) {

  if (
    gameMode === "colors"
  ) {

    const others =
      LittleLearners
        .shuffle(
          COLORS.filter(
            item =>
              item.name !==
              currentTarget.name
          )
        )
        .slice(
          0,
          count - 1
        );


    return (
      LittleLearners.shuffle(
        [
          currentTarget,
          ...others
        ]
      )
    );

  }


  const source =
    gameMode === "letters"
      ? LETTERS
      : NUMBERS;


  const others =
    LittleLearners
      .shuffle(
        source.filter(
          item =>
            item !==
            currentTarget
        )
      )
      .slice(
        0,
        count - 1
      );


  return (
    LittleLearners.shuffle(
      [
        currentTarget,
        ...others
      ]
    )
  );
}


function renderBubbles(count) {

  bubbleField.innerHTML =
    "";


  const choices =
    getRoundChoices(
      count
    );


  choices.forEach(
    choice => {

      createBubble(
        choice
      );

    }
  );
}

/* ========================================
   RANDOM NUMBER HELPER
======================================== */

function randomNumber(
  min,
  max
) {
  return (
    Math.random() *
    (max - min)
    +
    min
  );
}

/* ========================================
   CREATE BUBBLE
======================================== */

function createBubble(choice) {

  const bubble =
    document.createElement(
      "button"
    );


  bubble.type =
    "button";


  bubble.className =
    "learning-bubble";


  const size =
    randomNumber(
      82,
      105
    );


  bubble.style.width =
    `${size}px`;

  bubble.style.height =
    `${size}px`;


  bubble.style.setProperty(
    "--bubble-speed",
    `${randomNumber(
      2.5,
      4.2
    )}s`
  );


  /* COLOR MODE */

  if (
    gameMode === "colors"
  ) {

    bubble.style.setProperty(
      "--bubble-color",
      choice.value
    );


    bubble.dataset.value =
      choice.name;


    bubble.setAttribute(
      "aria-label",
      `${choice.name} bubble`
    );

  }


  /* LETTER / NUMBER MODE */

  else {

    bubble.style.setProperty(
      "--bubble-color",
      LittleLearners.randomItem(
        PASTELS
      )
    );


    bubble.dataset.value =
      choice;


    bubble.textContent =
      choice;


    bubble.setAttribute(
      "aria-label",
      choice
    );

  }


  /*
    Add the bubble to the field first.
    Then we can calculate its position.
  */

  bubbleField.appendChild(
    bubble
  );


  positionBubble(
    bubble,
    size
  );


  bubble.addEventListener(
    "click",
    () => {

      handleBubbleClick(
        bubble,
        choice
      );

    }
  );

}


/* ========================================
   POSITION BUBBLE
======================================== */

function positionBubble(
  bubble,
  size
) {

  const fieldWidth =
    bubbleField.clientWidth;

  const fieldHeight =
    bubbleField.clientHeight;


  const padding =
    14;


  const bubbleGap =
    12;


  const maxX =
    Math.max(
      padding,
      fieldWidth -
      size -
      padding
    );


  const maxY =
    Math.max(
      padding,
      fieldHeight -
      size -
      padding
    );


  /*
    Get bubbles already placed,
    excluding the new bubble.
  */

  const existingBubbles =
    Array.from(
      bubbleField.querySelectorAll(
        ".learning-bubble"
      )
    ).filter(
      existing =>
        existing !== bubble
    );


  let bestPosition =
    null;


  /*
    Try to find an empty spot.
  */

  for (
    let attempt = 0;
    attempt < 100;
    attempt++
  ) {

    const x =
      randomNumber(
        padding,
        maxX
      );


    const y =
      randomNumber(
        padding,
        maxY
      );


    let overlaps =
      false;


    for (
      const existing
      of existingBubbles
    ) {

      const existingX =
        parseFloat(
          existing.style.left
        ) || 0;


      const existingY =
        parseFloat(
          existing.style.top
        ) || 0;


      const existingSize =
        parseFloat(
          existing.style.width
        ) || 90;


      const centerX1 =
        x +
        size / 2;


      const centerY1 =
        y +
        size / 2;


      const centerX2 =
        existingX +
        existingSize / 2;


      const centerY2 =
        existingY +
        existingSize / 2;


      const dx =
        centerX1 -
        centerX2;


      const dy =
        centerY1 -
        centerY2;


      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy
        );


      const minimumDistance =
        size / 2 +
        existingSize / 2 +
        bubbleGap;


      if (
        distance <
        minimumDistance
      ) {

        overlaps =
          true;

        break;

      }

    }


    if (
      !overlaps
    ) {

      bestPosition = {
        x,
        y
      };

      break;

    }

  }


  /*
    Fallback if the screen is crowded.
  */

  if (
    !bestPosition
  ) {

    bestPosition = {

      x:
        randomNumber(
          padding,
          maxX
        ),

      y:
        randomNumber(
          padding,
          maxY
        )

    };

  }


  bubble.style.left =
    `${bestPosition.x}px`;


  bubble.style.top =
    `${bestPosition.y}px`;

}

/* ========================================
   ANSWER CHECK
======================================== */

function isCorrect(choice) {

  if (
    gameMode === "colors"
  ) {

    return (
      choice.name ===
      currentTarget.name
    );

  }


  return (
    choice ===
    currentTarget
  );
}


/* ========================================
   CLICK
======================================== */

function handleBubbleClick(
  bubble,
  choice
) {

  if (
    roundLocked
  ) {
    return;
  }


  bubble.classList.add(
    "is-popping"
  );


  if (
    isCorrect(choice)
  ) {

    handleCorrect(
      bubble
    );

  } else {

    handleWrong(
      bubble,
      choice
    );

  }
}


/* ========================================
   CORRECT
======================================== */

function handleCorrect(
  bubble
) {

  roundLocked =
    true;


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
    900
  );
}


/* ========================================
   WRONG
======================================== */

function handleWrong(
  bubble,
  choice
) {

  wrongAttempts++;


  let spokenValue;


  if (
    gameMode === "colors"
  ) {

    spokenValue =
      choice.name;

  } else {

    spokenValue =
      choice;

  }


  let targetValue;


  if (
    gameMode === "colors"
  ) {

    targetValue =
      currentTarget.name;

  } else {

    targetValue =
      currentTarget;

  }


  if (
    gameMode === "letters"
  ) {

    LittleLearners.speak(
      `That's ${spokenValue}. Find ${targetValue}!`
    );

  } else if (
    gameMode === "numbers"
  ) {

    LittleLearners.speak(
      `That's number ${spokenValue}. Find number ${targetValue}!`
    );

  } else {

    LittleLearners.speak(
      `That's ${spokenValue}. Find ${targetValue}!`
    );

  }


  feedback.textContent =
    "Try again!";


  setTimeout(
    () => {

      bubble.remove();


      replaceWrongBubble();

    },
    240
  );


  if (
    wrongAttempts >= 2
  ) {

    setTimeout(
      showHint,
      300
    );

  }
}


/* ========================================
   REPLACE WRONG BUBBLE
======================================== */

function replaceWrongBubble() {

  if (
    roundLocked
  ) {
    return;
  }


  let pool;


  if (
    gameMode === "colors"
  ) {

    pool =
      COLORS.filter(
        item =>
          item.name !==
          currentTarget.name
      );


  } else {

    const source =
      gameMode === "letters"
        ? LETTERS
        : NUMBERS;


    pool =
      source.filter(
        item =>
          item !==
          currentTarget
      );

  }


  const replacement =
    LittleLearners.randomItem(
      pool
    );


  createBubble(
    replacement
  );
}


/* ========================================
   HINT
======================================== */

function showHint() {

  let selector;


  if (
    gameMode === "colors"
  ) {

    selector =
      `[data-value="${currentTarget.name}"]`;

  } else {

    selector =
      `[data-value="${currentTarget}"]`;

  }


  const targetBubble =
    bubbleField
      .querySelector(
        selector
      );


  if (
    targetBubble
  ) {

    targetBubble
      .classList
      .add(
        "is-hint"
      );

  }
}


/* ========================================
   FINISH
======================================== */

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
    "All done! Great job popping and learning!",
    {
      rate: 0.88,
      pitch: 1.18
    }
  );


  LittleLearners.celebrate(
    celebrationLayer,
    18
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
    () => {

      finishScreen
        .classList
        .add(
          "is-hidden"
        );


      startScreen
        .classList
        .remove(
          "is-hidden"
        );

    }
  );


repeatButton
  .addEventListener(
    "click",
    speakInstruction
  );


setMode(
  "colors"
);