const TOTAL_ROUNDS =
    8;


const CHARACTERS = [
    {
        name: "ducks",
        singular: "duck",
        emoji: "🦆"
    },

    {
        name: "rabbits",
        singular: "rabbit",
        emoji: "🐰"
    },

    {
        name: "chicks",
        singular: "chick",
        emoji: "🐥"
    },

    {
        name: "frogs",
        singular: "frog",
        emoji: "🐸"
    },

    {
        name: "penguins",
        singular: "penguin",
        emoji: "🐧"
    }
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

const countDisplay =
    document.getElementById(
        "countDisplay"
    );

const countCaption =
    document.getElementById(
        "countCaption"
    );

const characterArea =
    document.getElementById(
        "characterArea"
    );

const finishArea =
    document.getElementById(
        "finishArea"
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

let difficulty =
    "easy";

let currentRound =
    1;

let targetCount =
    1;

let currentCount =
    0;

let currentCharacter =
    null;

let roundLocked =
    false;


/* ========================================
   SHARED SOUND
======================================== */

LittleLearners.attachSoundButton(
    soundButton
);


/* ========================================
   SETTINGS
======================================== */

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


easyButton.addEventListener(
    "click",
    () => setDifficulty("easy")
);


normalButton.addEventListener(
    "click",
    () => setDifficulty("normal")
);


challengeButton.addEventListener(
    "click",
    () => setDifficulty("challenge")
);


/* ========================================
   HELPERS
======================================== */

function randomInt(
    min,
    max
) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


function getMaxTarget() {

    if (
        difficulty === "easy"
    ) {
        return 3;
    }


    if (
        difficulty === "normal"
    ) {
        return 5;
    }


    return 10;
}


function getPromptText() {

    return (
        `Send ${targetCount} ${currentCharacter.name} across the bridge!`
    );

}


/* ========================================
   START
======================================== */

function startGame() {

    currentRound =
        1;


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

    currentCount =
        0;

    roundLocked =
        false;


    feedback.textContent =
        "";


    countDisplay.textContent =
        "0";


    currentCharacter =
        LittleLearners.randomItem(
            CHARACTERS
        );


    targetCount =
        randomInt(
            1,
            getMaxTarget()
        );


    const extraCharacters =
        randomInt(
            1,
            3
        );


    const totalCharacters =
        Math.min(
            targetCount +
            extraCharacters,
            10
        );


    roundLabel.textContent =
        `Round ${currentRound} of ${TOTAL_ROUNDS}`;


    prompt.textContent =
        getPromptText();


    countCaption.textContent =
        `${currentCharacter.name} crossed`;


    progressBar.style.width =
        `${(
            currentRound /
            TOTAL_ROUNDS
        ) * 100
        }%`;


    renderCharacters(
        totalCharacters
    );


    setTimeout(
        () => {

            LittleLearners.speak(
                getPromptText(),
                {
                    rate: 0.84,
                    pitch: 1.14
                }
            );

        },
        300
    );

}


/* ========================================
   CHARACTERS
======================================== */

function renderCharacters(
    total
) {

    characterArea.innerHTML =
        "";


    finishArea.innerHTML =
        "";


    for (
        let i = 0;
        i < total;
        i++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "count-character";


        button.innerHTML =
            `<span>${currentCharacter.emoji}</span>`;


        button.setAttribute(
            "aria-label",
            `Send ${currentCharacter.singular} across`
        );


        button.addEventListener(
            "click",
            () => {

                sendCharacterAcross(
                    button
                );

            }
        );


        characterArea.appendChild(
            button
        );

    }

}


/* ========================================
   CROSS
======================================== */

function sendCharacterAcross(
    character
) {

    if (
        roundLocked ||
        character.disabled
    ) {
        return;
    }


    character.disabled =
        true;


    currentCount++;


    countDisplay.textContent =
        String(
            currentCount
        );


    LittleLearners.speak(
        String(
            currentCount
        ),
        {
            rate: 0.78,
            pitch: 1.12
        }
    );


    /*
      Hide the original tapped character
      so it cannot be clicked again.
    */

    character.style.visibility =
        "hidden";


    /*
      Create a temporary crossing copy.
    */

    const traveler =
        document.createElement(
            "span"
        );


    traveler.className =
        "crossing-character";


    traveler.textContent =
        currentCharacter.emoji;

    const crossScene =
        document.getElementById(
            "crossScene"
        );

    crossScene.appendChild(
        traveler
    );


    /*
      After crossing, remove animation copy
      and place permanent character on far side.
    */

    setTimeout(
        () => {

            traveler.remove();


            const crossed =
                document.createElement(
                    "span"
                );


            crossed.className =
                "crossed-character";


            crossed.textContent =
                currentCharacter.emoji;


            finishArea.appendChild(
                crossed
            );

        },
        1400
    );


    if (
        currentCount ===
        targetCount
    ) {

        roundLocked =
            true;


        disableRemainingCharacters();


        setTimeout(
            completeRound,
            1550
        );

    }

}


/* ========================================
   DISABLE REMAINING
======================================== */

function disableRemainingCharacters() {

    const characters =
        characterArea.querySelectorAll(
            ".count-character"
        );


    characters.forEach(
        character => {

            character.disabled =
                true;

        }
    );

}


/* ========================================
   COMPLETE
======================================== */

function completeRound() {

    feedback.textContent =
        `Great job! ${targetCount} ${currentCharacter.name} crossed!`;


    LittleLearners.speak(
        `Great job! ${targetCount} ${currentCharacter.name} crossed the bridge!`,
        {
            rate: 0.86,
            pitch: 1.16
        }
    );


    LittleLearners.celebrate(
        celebrationLayer,
        15
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
        1600
    );

}


/* ========================================
   REPEAT
======================================== */

function repeatInstruction() {

    LittleLearners.speak(
        getPromptText(),
        {
            rate: 0.84,
            pitch: 1.14
        }
    );

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
        "All done! Great job counting!",
        {
            rate: 0.86,
            pitch: 1.16
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

startButton.addEventListener(
    "click",
    startGame
);


repeatButton.addEventListener(
    "click",
    repeatInstruction
);


playAgainButton.addEventListener(
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


setDifficulty(
    "easy"
);