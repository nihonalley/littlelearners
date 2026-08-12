const SHAPES = {

  circle: {
    name: "Circle",
    tier: "easy",

    svg:
      `<svg viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="38"
        />
      </svg>`,

    object:
      `<span class="everyday-object">🍩</span>`
  },


  square: {
    name: "Square",
    tier: "easy",

    svg:
      `<svg viewBox="0 0 100 100">
        <rect
          x="14"
          y="14"
          width="72"
          height="72"
          rx="3"
        />
      </svg>`,

    object:
      `<div class="css-object css-window"></div>`
  },


  triangle: {
    name: "Triangle",
    tier: "easy",

    svg:
      `<svg viewBox="0 0 100 100">
        <polygon
          points="50,9 91,87 9,87"
        />
      </svg>`,

    object:
      `<div class="css-object css-triangle-sign"></div>`
  },


  star: {
    name: "Star",
    tier: "easy",

    svg:
      `<svg viewBox="0 0 100 100">
        <polygon
          points="
            50,7
            61,36
            92,37
            67,56
            76,87
            50,69
            24,87
            33,56
            8,37
            39,36
          "
        />
      </svg>`,

    object:
      `<span class="everyday-object">⭐</span>`
  },


  rectangle: {
    name: "Rectangle",
    tier: "normal",

    svg:
      `<svg viewBox="0 0 100 100">
        <rect
          x="9"
          y="26"
          width="82"
          height="48"
          rx="3"
        />
      </svg>`,

    object:
      `<div class="css-object css-door"></div>`
  },


  oval: {
    name: "Oval",
    tier: "normal",

    svg:
      `<svg viewBox="0 0 100 100">
        <ellipse
          cx="50"
          cy="50"
          rx="42"
          ry="28"
        />
      </svg>`,

    object:
      `<span class="everyday-object">🥚</span>`
  },


  heart: {
    name: "Heart",
    tier: "normal",

    svg:
      `<svg viewBox="0 0 100 100">
        <path
          d="
          M50 88
          L15 53
          C-3 34 10 9 31 14
          C41 17 47 25 50 32
          C53 25 59 17 69 14
          C90 9 103 34 85 53
          Z"
        />
      </svg>`,

    object:
      `<span class="everyday-object">❤️</span>`
  },


  diamond: {
    name: "Diamond",
    tier: "normal",

    svg:
      `<svg viewBox="0 0 100 100">
        <polygon
          points="
            50,7
            93,50
            50,93
            7,50
          "
        />
      </svg>`,

    object:
      `<div class="css-object css-kite"></div>`
  },


  pentagon: {
    name: "Pentagon",
    tier: "challenge",

    svg:
      `<svg viewBox="0 0 100 100">
        <polygon
          points="
            50,7
            93,38
            77,89
            23,89
            7,38
          "
        />
      </svg>`
  },


  hexagon: {
    name: "Hexagon",
    tier: "challenge",

    svg:
      `<svg viewBox="0 0 100 100">
        <polygon
          points="
            25,8
            75,8
            95,50
            75,92
            25,92
            5,50
          "
        />
      </svg>`
  },


  heptagon: {
    name: "Heptagon",
    tier: "challenge",

    svg:
      polygonSVG(7)
  },


  octagon: {
    name: "Octagon",
    tier: "challenge",

    svg:
      polygonSVG(8)
  },


  nonagon: {
    name: "Nonagon",
    tier: "challenge",

    svg:
      polygonSVG(9)
  },


  decagon: {
    name: "Decagon",
    tier: "challenge",

    svg:
      polygonSVG(10)
  },


  parallelogram: {
    name: "Parallelogram",
    tier: "challenge",

    svg:
      `<svg viewBox="0 0 100 100">
        <polygon
          points="
            28,20
            92,20
            72,80
            8,80
          "
        />
      </svg>`
  },


  semicircle: {
    name: "Semicircle",
    tier: "challenge",

    svg:
      `<svg viewBox="0 0 100 100">
        <path
          d="
            M10 65
            A40 40
            0 0 1
            90 65
            L10 65
            Z
          "
        />
      </svg>`
  }

};


const TOTAL_ROUNDS =
  8;


const SHAPE_COLORS = [
  "#69B9EE",
  "#F39DB7",
  "#FFD65A",
  "#72C891",
  "#A98BE8",
  "#F3A45C",
  "#73D5CF"
];


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

const shapeModeButton =
  document.getElementById(
    "shapeModeButton"
  );

const objectModeButton =
  document.getElementById(
    "objectModeButton"
  );

const easyButton =
  document.getElementById(
    "easyButton"
  );

const normalButton =
  document.getElementById(
    "normalButton"
  );

const challengeButton =
  document.getElementById(
    "challengeButton"
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

const giftBox =
  document.getElementById(
    "giftBox"
  );

const openBoxButton =
  document.getElementById(
    "openBoxButton"
  );

const revealedObject =
  document.getElementById(
    "revealedObject"
  );

const shapeChoices =
  document.getElementById(
    "shapeChoices"
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
  "shapes";

let difficulty =
  "easy";

let currentRound =
  1;

let currentShapeKey =
  null;

let previousShapeKey =
  null;

let wrongAttempts =
  0;

let roundLocked =
  false;

let boxOpened =
  false;


/* ========================================
   SOUND
======================================== */

LittleLearners.attachSoundButton(
  soundButton
);


/* ========================================
   POLYGON GENERATOR
======================================== */

function polygonSVG(
  sides
) {

  const points = [];

  const centerX =
    50;

  const centerY =
    50;

  const radius =
    42;


  for (
    let i = 0;
    i < sides;
    i++
  ) {

    const angle =
      (
        Math.PI * 2 * i
        /
        sides
      )
      -
      Math.PI / 2;


    const x =
      centerX
      +
      radius
      *
      Math.cos(angle);


    const y =
      centerY
      +
      radius
      *
      Math.sin(angle);


    points.push(
      `${x.toFixed(2)},${y.toFixed(2)}`
    );

  }


  return (
    `<svg viewBox="0 0 100 100">
      <polygon
        points="${points.join(" ")}"
      />
    </svg>`
  );

}


/* ========================================
   SETTINGS
======================================== */

function setGameMode(
  mode
) {

  gameMode =
    mode;


  shapeModeButton
    .classList
    .toggle(
      "is-active",
      mode === "shapes"
    );


  objectModeButton
    .classList
    .toggle(
      "is-active",
      mode === "objects"
    );


  /*
    Everyday Objects only uses
    Easy / Normal shapes.
  */

  if (
    mode === "objects"
    &&
    difficulty === "challenge"
  ) {

    setDifficulty(
      "normal"
    );

  }


  challengeButton.disabled =
    mode === "objects";

}


function setDifficulty(
  level
) {

  difficulty =
    level;


  easyButton
    .classList
    .toggle(
      "is-active",
      level === "easy"
    );


  normalButton
    .classList
    .toggle(
      "is-active",
      level === "normal"
    );


  challengeButton
    .classList
    .toggle(
      "is-active",
      level === "challenge"
    );

}


/* ========================================
   SHAPE POOL
======================================== */

function getShapePool() {

  return (
    Object
      .entries(
        SHAPES
      )
      .filter(
        ([
          key,
          shape
        ]) => {

          if (
            gameMode === "objects"
            &&
            !shape.object
          ) {

            return false;

          }


          if (
            difficulty === "easy"
          ) {

            return (
              shape.tier === "easy"
            );

          }


          if (
            difficulty === "normal"
          ) {

            return (
              shape.tier === "easy"
              ||
              shape.tier === "normal"
            );

          }


          return true;

        }
      )
      .map(
        ([key]) => key
      )
  );

}


/* ========================================
   START
======================================== */

function startGame() {

  currentRound =
    1;

  previousShapeKey =
    null;


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

  boxOpened =
    false;


  feedback.textContent =
    "";


  shapeChoices
    .classList
    .add(
      "is-hidden"
    );


  revealedObject
    .classList
    .add(
      "is-hidden"
    );


  revealedObject.innerHTML =
    "";


  giftBox
    .classList
    .remove(
      "is-opening"
    );


  giftBox
    .classList
    .add(
      "is-wiggling"
    );


  giftBox.style.display =
    "block";


  openBoxButton.style.display =
    "block";


  prompt.textContent =
    "What shape is in the box?";


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


  chooseRoundShape();


  setTimeout(
    () => {

      LittleLearners.speak(
        "What shape is in the box? Open it!",
        {
          rate: 0.86,
          pitch: 1.15
        }
      );

    },
    300
  );

}


/* ========================================
   TARGET
======================================== */

function chooseRoundShape() {

  const pool =
    getShapePool();


  const available =
    pool.filter(
      key =>
        key !==
        previousShapeKey
    );


  currentShapeKey =
    LittleLearners.randomItem(
      available.length
        ? available
        : pool
    );


  previousShapeKey =
    currentShapeKey;

}


/* ========================================
   OPEN BOX
======================================== */

function openGiftBox() {

  if (
    boxOpened
    ||
    roundLocked
  ) {
    return;
  }


  boxOpened =
    true;


  giftBox
    .classList
    .remove(
      "is-wiggling"
    );


  giftBox
    .classList
    .add(
      "is-opening"
    );


  openBoxButton.style.display =
    "none";


  LittleLearners.celebrate(
    celebrationLayer,
    18
  );


  setTimeout(
    revealShape,
    430
  );

}


/* ========================================
   REVEAL
======================================== */

function revealShape() {

  const shape =
    SHAPES[
      currentShapeKey
    ];


  const color =
    LittleLearners.randomItem(
      SHAPE_COLORS
    );


  revealedObject
    .style
    .setProperty(
      "--shape-color",
      color
    );


  revealedObject.innerHTML =
    gameMode === "objects"
      ? shape.object
      : shape.svg;


  revealedObject
    .classList
    .remove(
      "is-hidden"
    );


  prompt.textContent =
    "What shape is it?";


  renderAnswerChoices();


  shapeChoices
    .classList
    .remove(
      "is-hidden"
    );


  setTimeout(
    () => {

      LittleLearners.speak(
        "What shape is it?",
        {
          rate: 0.86,
          pitch: 1.15
        }
      );

    },
    200
  );

}


/* ========================================
   ANSWER OPTIONS
======================================== */

function renderAnswerChoices() {

  shapeChoices.innerHTML =
    "";


  const pool =
    getShapePool();


  const distractors =
    LittleLearners
      .shuffle(
        pool.filter(
          key =>
            key !==
            currentShapeKey
        )
      )
      .slice(
        0,
        2
      );


  const answers =
    LittleLearners.shuffle(
      [
        currentShapeKey,
        ...distractors
      ]
    );


  answers.forEach(
    key => {

      const shape =
        SHAPES[key];


      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";


      button.className =
        "shape-answer-button";


      button.dataset.shape =
        key;


      const icon =
        document.createElement(
          "span"
        );


      icon.className =
        "shape-answer-icon";


      icon.style.setProperty(
        "--answer-color",
        LittleLearners.randomItem(
          SHAPE_COLORS
        )
      );


      icon.innerHTML =
        shape.svg;


      const label =
        document.createElement(
          "span"
        );


      label.className =
        "shape-answer-label";


      label.textContent =
        shape.name;


      button.appendChild(
        icon
      );


      button.appendChild(
        label
      );


      button.addEventListener(
        "click",
        () => {

          handleAnswer(
            button,
            key
          );

        }
      );


      shapeChoices
        .appendChild(
          button
        );

    }
  );

}


/* ========================================
   ANSWER
======================================== */

function handleAnswer(
  button,
  key
) {

  if (
    roundLocked
  ) {
    return;
  }


  if (
    key ===
    currentShapeKey
  ) {

    handleCorrect(
      button
    );

  } else {

    handleWrong(
      button,
      key
    );

  }

}


/* ========================================
   CORRECT
======================================== */

function handleCorrect(
  button
) {

  roundLocked =
    true;


  const shape =
    SHAPES[
      currentShapeKey
    ];


  feedback.textContent =
    `${shape.name}! Great job!`;


  LittleLearners.speak(
    `${shape.name}! Great job!`,
    {
      rate: 0.88,
      pitch: 1.18
    }
  );


  LittleLearners.celebrate(
    celebrationLayer,
    16
  );


  button
    .classList
    .add(
      "is-hint"
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


/* ========================================
   WRONG
======================================== */

function handleWrong(
  button,
  key
) {

  wrongAttempts++;


  const wrongShape =
    SHAPES[key];


  button
    .classList
    .remove(
      "is-wrong"
    );


  void button.offsetWidth;


  button
    .classList
    .add(
      "is-wrong"
    );


  feedback.textContent =
    "Try again!";


  LittleLearners.speak(
    `That's ${wrongShape.name}. Try again!`,
    {
      rate: 0.84,
      pitch: 1.14
    }
  );


  if (
    wrongAttempts >=
    2
  ) {

    showHint();

  }

}


/* ========================================
   HINT
======================================== */

function showHint() {

  const correct =
    shapeChoices.querySelector(
      `[data-shape="${currentShapeKey}"]`
    );


  if (
    correct
  ) {

    correct
      .classList
      .add(
        "is-hint"
      );

  }

}


/* ========================================
   REPEAT
======================================== */

function repeatInstruction() {

  if (
    !boxOpened
  ) {

    LittleLearners.speak(
      "What shape is in the box? Open it!"
    );

  } else {

    LittleLearners.speak(
      "What shape is it?"
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
    "All done! Great job learning your shapes!",
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

giftBox
  .addEventListener(
    "click",
    openGiftBox
  );


openBoxButton
  .addEventListener(
    "click",
    openGiftBox
  );


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
    repeatInstruction
  );


shapeModeButton
  .addEventListener(
    "click",
    () => {

      setGameMode(
        "shapes"
      );

    }
  );


objectModeButton
  .addEventListener(
    "click",
    () => {

      setGameMode(
        "objects"
      );

    }
  );


easyButton
  .addEventListener(
    "click",
    () => {

      setDifficulty(
        "easy"
      );

    }
  );


normalButton
  .addEventListener(
    "click",
    () => {

      setDifficulty(
        "normal"
      );

    }
  );


challengeButton
  .addEventListener(
    "click",
    () => {

      setDifficulty(
        "challenge"
      );

    }
  );


setGameMode(
  "shapes"
);


setDifficulty(
  "easy"
);