const prompt =
    document.getElementById(
        "prompt"
    );


/* ========================================
   BACKGROUND SCENE
======================================== */

const learningScene =
    document.getElementById(
        "learningScene"
    );


LittleLearners.randomScene(
    learningScene
);


/* ========================================
   GAME DATA
======================================== */

const OBJECTS = [
    "apple",
    "banana",
    "balloon",
    "car",
    "fish",
    "frog",
    "flower",
    "star",
    "duck",
    "ball"
];


const COLORS = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
    "white",
    "brown",
    "black"
];


const TOTAL =
    8;


/* ========================================
   ELEMENTS
======================================== */

const $ =
    id =>
        document.getElementById(
            id
        );


const start =
    $("startScreen");


const play =
    $("playScreen");


const finish =
    $("finishScreen");


const choices =
    $("objectChoices");


const roundLabel =
    $("roundLabel");


const feedback =
    $("feedback");


const progress =
    $("progressBar");


const layer =
    $("celebrationLayer");


/* ========================================
   STATE
======================================== */

let round =
    1;


let target =
    null;


let wrong =
    0;


let locked =
    false;


let last =
    "";


/* ========================================
   SOUND
======================================== */

LittleLearners.attachSoundButton(
    $("soundButton")
);


/* ========================================
   HELPERS
======================================== */

const count =
    roundNumber =>
        2 +
        Math.floor(
            (roundNumber - 1) / 2
        );


const make =
    (
        color,
        object
    ) => ({
        color,
        object,
        key:
            `${object}-${color}`
    });


/* ========================================
   CHOOSE TARGET
======================================== */

function choose() {

    let item;


    do {

        item =
            make(
                LittleLearners.randomItem(
                    COLORS
                ),

                LittleLearners.randomItem(
                    OBJECTS
                )
            );

    } while (
        item.key === last
    );


    last =
        item.key;


    return item;

}


/* ========================================
   INSTRUCTION
======================================== */

function instruction() {

    if (
        round <= 4
    ) {

        return (
            `Find something ${target.color}!`
        );

    }


    return (
        `Find the ${target.color} ${target.object}!`
    );

}


function sayInstruction() {

    LittleLearners.speak(
        instruction(),
        {
            rate: 0.84,
            pitch: 1.16
        }
    );

}


/* ========================================
   IMAGE PATH
======================================== */

function path(
    item
) {

    return (
        `../../assets/colored-objects/${item.object}/${item.object}-${item.color}.png`
    );

}


/* ========================================
   CHECK ANSWER
======================================== */

function correct(
    item
) {

    if (
        round <= 4
    ) {

        return (
            item.color ===
            target.color
        );

    }


    return (
        item.color ===
        target.color
        &&
        item.object ===
        target.object
    );

}


/* ========================================
   BEGIN ROUND
======================================== */

function begin() {

    wrong =
        0;


    locked =
        false;


    feedback.textContent =
        "";


    target =
        choose();


    prompt.textContent =
        instruction();


    roundLabel.textContent =
        `Round ${round} of ${TOTAL}`;


    progress.style.width =
        `${
            (
                round /
                TOTAL
            ) *
            100
        }%`;


    render(
        count(
            round
        )
    );


    setTimeout(
        sayInstruction,
        320
    );

}


/* ========================================
   DISTRACTOR
======================================== */

function distract(
    existing
) {

    let item;


    do {

        item =
            make(
                LittleLearners.randomItem(
                    COLORS
                ),

                LittleLearners.randomItem(
                    OBJECTS
                )
            );

    } while (
        existing.some(
            existingItem =>
                existingItem.key ===
                item.key
        )
        ||
        correct(
            item
        )
    );


    return item;

}


/* ========================================
   RENDER CHOICES
======================================== */

function render(
    numberOfChoices
) {

    choices.innerHTML =
        "";


    const items = [
        target
    ];


    while (
        items.length <
        numberOfChoices
    ) {

        items.push(
            distract(
                items
            )
        );

    }


    LittleLearners
        .shuffle(
            items
        )
        .forEach(
            item => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.className =
                    "game-choice";


                /*
                  Extra class for white objects
                  so we can give them a subtle
                  outline/background if needed.
                */

                if (
                    item.color ===
                    "white"
                ) {

                    button.classList.add(
                        "game-choice--white-object"
                    );

                }


                button.dataset.key =
                    item.key;


                button.ariaLabel =
                    `${item.color} ${item.object}`;


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    path(
                        item
                    );


                image.alt =
                    "";


                button.appendChild(
                    image
                );


                button.onclick =
                    () => {

                        tap(
                            button,
                            item
                        );

                    };


                choices.appendChild(
                    button
                );

            }
        );

}


/* ========================================
   ANSWER TAP
======================================== */

function tap(
    button,
    item
) {

    if (
        locked
    ) {
        return;
    }


    if (
        correct(
            item
        )
    ) {

        locked =
            true;


        document
            .querySelectorAll(
                ".game-choice"
            )
            .forEach(
                choice => {

                    choice.disabled =
                        true;


                    choice
                        .classList
                        .remove(
                            "is-hint"
                        );

                }
            );


        button
            .classList
            .add(
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
            layer
        );


        setTimeout(
            () => {

                if (
                    round >= TOTAL
                ) {

                    done();

                }

                else {

                    round++;

                    begin();

                }

            },
            1250
        );

    }

    else {

        wrong++;


        button
            .classList
            .remove(
                "is-wrong"
            );


        /*
          Restart wiggle animation.
        */

        void button.offsetWidth;


        button
            .classList
            .add(
                "is-wrong"
            );


        feedback.textContent =
            "Try again!";


        LittleLearners.speak(
            `That's a ${item.color} ${item.object}. Let's try again!`,
            {
                rate: 0.85,
                pitch: 1.14
            }
        );


        if (
            wrong >= 2
        ) {

            document
                .querySelector(
                    `[data-key="${target.key}"]`
                )
                ?.classList
                .add(
                    "is-hint"
                );

        }

    }

}


/* ========================================
   START GAME
======================================== */

function startGame() {

    round =
        1;


    last =
        "";


    start
        .classList
        .add(
            "is-hidden"
        );


    finish
        .classList
        .add(
            "is-hidden"
        );


    play
        .classList
        .remove(
            "is-hidden"
        );


    begin();

}


/* ========================================
   FINISH
======================================== */

function done() {

    play
        .classList
        .add(
            "is-hidden"
        );


    finish
        .classList
        .remove(
            "is-hidden"
        );


    LittleLearners.speak(
        "All done! Great job!",
        {
            rate: 0.88,
            pitch: 1.18
        }
    );


    LittleLearners.celebrate(
        layer,
        16
    );

}


/* ========================================
   EVENTS
======================================== */

$("startButton").onclick =
    () => {

        LittleLearners.speak(
            "Let's play!"
        );


        setTimeout(
            startGame,
            250
        );

    };


$("playAgainButton").onclick =
    startGame;


$("repeatButton").onclick =
    sayInstruction;