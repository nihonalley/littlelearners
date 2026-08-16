(() => {

    /* ========================================
       VOICE SETTINGS
    ======================================== */

    const preferred = [
        "Microsoft Jenny",
        "Microsoft Aria",
        "Microsoft Zira",
        "Jenny",
        "Aria",
        "Zira",
        "Samantha",
        "Ava",
        "Karen",
        "Moira",
        "Susan",
        "Google UK English Female",
        "Google US English"
    ];


    let voices = [];


    let voiceEnabled =
        localStorage.getItem(
            "littleLearnersVoice"
        ) !== "off";


    /* ========================================
       VOICE LIST
    ======================================== */

    function refresh() {

        if (
            "speechSynthesis" in window
        ) {

            voices =
                window
                    .speechSynthesis
                    .getVoices();

        }

    }


    refresh();


    if (
        "speechSynthesis" in window
    ) {

        window
            .speechSynthesis
            .addEventListener(
                "voiceschanged",
                refresh
            );

    }


    /* ========================================
       CHOOSE FRIENDLY VOICE
    ======================================== */

    function voice() {

        refresh();


        const englishVoices =
            voices.filter(
                item =>
                    String(
                        item.lang || ""
                    )
                        .toLowerCase()
                        .startsWith("en")
            );


        for (
            const preferredName
            of preferred
        ) {

            const match =
                englishVoices.find(
                    item =>
                        item.name
                            .toLowerCase()
                            .includes(
                                preferredName
                                    .toLowerCase()
                            )
                );


            if (match) {
                return match;
            }

        }


        return (
            englishVoices.find(
                item =>
                    /(female|woman|girl|jenny|aria|zira|samantha|ava|karen|moira|susan)/i
                        .test(
                            item.name
                        )
            )
            ||
            englishVoices[0]
            ||
            voices[0]
            ||
            null
        );

    }


    /* ========================================
       SPEAK
    ======================================== */

    function speak(
        text,
        opt = {}
    ) {

        if (
            !voiceEnabled ||
            !(
                "speechSynthesis"
                in window
            ) ||
            !text
        ) {
            return;
        }


        window
            .speechSynthesis
            .cancel();


        const utterance =
            new SpeechSynthesisUtterance(
                text
            );


        utterance.lang =
            "en-US";


        utterance.rate =
            opt.rate ?? 0.88;


        utterance.pitch =
            opt.pitch ?? 1.16;


        utterance.volume =
            opt.volume ?? 1;


        const selectedVoice =
            voice();


        if (
            selectedVoice
        ) {

            utterance.voice =
                selectedVoice;

        }


        window
            .speechSynthesis
            .speak(
                utterance
            );

    }


    /* ========================================
       STOP VOICE
    ======================================== */

    function stop() {

        if (
            "speechSynthesis"
            in window
        ) {

            window
                .speechSynthesis
                .cancel();

        }

    }


    /* ========================================
       SOUND MIXER
    ======================================== */

    function attachSoundButton(
        button
    ) {

        if (!button) {
            return;
        }


        /*
          Prevent duplicate mixer.
        */

        const existingMixer =
            document.getElementById(
                "soundMixer"
            );


        if (
            existingMixer
        ) {

            existingMixer.remove();

        }


        /* --------------------------------
           MUSIC SETTINGS
        -------------------------------- */

        const savedVolume =
            localStorage.getItem(
                "littleLearnersMusicVolume"
            );


        let musicVolume =
            savedVolume === null
                ? 0.12
                : Number(
                    savedVolume
                );


        musicVolume =
            Math.max(
                0,
                Math.min(
                    1,
                    musicVolume
                )
            );


        let musicMuted =
            localStorage.getItem(
                "littleLearnersMusicMuted"
            ) === "true";


        /* --------------------------------
           CREATE MIXER
        -------------------------------- */

        const mixer =
            document.createElement(
                "div"
            );


        mixer.id =
            "soundMixer";


        mixer.className =
            "sound-mixer";


        mixer.innerHTML = `

            <div class="sound-mixer-title">
                Sound
            </div>


            <div class="sound-mixer-row">

                <span class="sound-mixer-label">
                    🔊 Voice
                </span>

                <button
                    class="sound-toggle"
                    id="voiceToggle"
                    type="button"
                >
                    ${
                        voiceEnabled
                            ? "On"
                            : "Off"
                    }
                </button>

            </div>


            <div class="sound-mixer-row">

                <span class="sound-mixer-label">
                    🎵 Music
                </span>

                <button
                    class="sound-toggle sound-toggle-icon"
                    id="musicToggle"
                    type="button"
                    aria-label="Mute background music"
                >
                    ${
                        musicMuted ||
                        musicVolume === 0
                            ? "🔇"
                            : "🔉"
                    }
                </button>

            </div>


            <div class="sound-volume-row">

                <input
                    id="musicVolume"
                    class="sound-volume-slider"
                    type="range"

                    min="0"
                    max="100"
                    step="1"

                    value="${
                        Math.round(
                            musicVolume * 100
                        )
                    }"

                    aria-label="Background music volume"
                >

            </div>

        `;


        document.body.appendChild(
            mixer
        );


        /* --------------------------------
           ELEMENTS
        -------------------------------- */

        const voiceToggle =
            mixer.querySelector(
                "#voiceToggle"
            );


        const musicToggle =
            mixer.querySelector(
                "#musicToggle"
            );


        const musicSlider =
            mixer.querySelector(
                "#musicVolume"
            );


        /* --------------------------------
           UPDATE MUSIC
        -------------------------------- */

        function applyMusicSettings() {

            if (
                !LittleLearners.siteAudio ||
                !LittleLearners.siteAudio.music
            ) {
                return;
            }


            LittleLearners
                .siteAudio
                .music
                .volume =
                    musicVolume;


            LittleLearners
                .siteAudio
                .music
                .muted =
                    musicMuted;

        }


        /* --------------------------------
           UPDATE MUSIC ICON
        -------------------------------- */

        function updateMusicIcon() {

            if (
                musicMuted ||
                musicVolume === 0
            ) {

                musicToggle.textContent =
                    "🔇";

            }

            else {

                musicToggle.textContent =
                    "🔉";

            }

        }


        /* --------------------------------
           UPDATE MAIN ICON
        -------------------------------- */

        function updateMainIcon() {

            const musicOff =
                musicMuted ||
                musicVolume === 0;


            if (
                !voiceEnabled &&
                musicOff
            ) {

                button.textContent =
                    "🔇";

            }

            else {

                button.textContent =
                    "🔊";

            }


            button.setAttribute(
                "aria-label",
                "Sound settings"
            );

        }


        /* --------------------------------
           OPEN MIXER
        -------------------------------- */

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                mixer
                    .classList
                    .toggle(
                        "is-open"
                    );

            }
        );


        /* --------------------------------
           DON'T CLOSE INSIDE MIXER
        -------------------------------- */

        mixer.addEventListener(
            "click",
            event => {

                event.stopPropagation();

            }
        );


        /* --------------------------------
           CLICK OUTSIDE
        -------------------------------- */

        document.addEventListener(
            "click",
            () => {

                mixer
                    .classList
                    .remove(
                        "is-open"
                    );

            }
        );


        /* --------------------------------
           ESCAPE
        -------------------------------- */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    mixer
                        .classList
                        .remove(
                            "is-open"
                        );

                }

            }
        );


        /* --------------------------------
           VOICE TOGGLE
        -------------------------------- */

        voiceToggle.addEventListener(
            "click",
            () => {

                voiceEnabled =
                    !voiceEnabled;


                localStorage.setItem(
                    "littleLearnersVoice",
                    voiceEnabled
                        ? "on"
                        : "off"
                );


                voiceToggle.textContent =
                    voiceEnabled
                        ? "On"
                        : "Off";


                if (
                    !voiceEnabled
                ) {

                    stop();

                }


                if (
                    voiceEnabled
                ) {

                    speak(
                        "Voice is on!"
                    );

                }


                updateMainIcon();

            }
        );


        /* --------------------------------
           MUSIC MUTE
        -------------------------------- */

        musicToggle.addEventListener(
            "click",
            () => {

                musicMuted =
                    !musicMuted;


                localStorage.setItem(
                    "littleLearnersMusicMuted",
                    String(
                        musicMuted
                    )
                );


                applyMusicSettings();


                /*
                  If music was turned on
                  after browser interaction,
                  make sure it starts.
                */

                if (
                    !musicMuted &&
                    LittleLearners.siteAudio
                ) {

                    LittleLearners
                        .siteAudio
                        .startMusic();

                }


                updateMusicIcon();

                updateMainIcon();

            }
        );


        /* --------------------------------
           MUSIC VOLUME
        -------------------------------- */

        musicSlider.addEventListener(
            "input",
            () => {

                musicVolume =
                    Number(
                        musicSlider.value
                    ) / 100;


                localStorage.setItem(
                    "littleLearnersMusicVolume",
                    String(
                        musicVolume
                    )
                );


                /*
                  Slider above zero =
                  automatically unmute.
                */

                if (
                    musicVolume > 0
                ) {

                    musicMuted =
                        false;


                    localStorage.setItem(
                        "littleLearnersMusicMuted",
                        "false"
                    );

                }


                /*
                  Zero = mute.
                */

                else {

                    musicMuted =
                        true;


                    localStorage.setItem(
                        "littleLearnersMusicMuted",
                        "true"
                    );

                }


                applyMusicSettings();


                if (
                    musicVolume > 0 &&
                    LittleLearners.siteAudio
                ) {

                    LittleLearners
                        .siteAudio
                        .startMusic();

                }


                updateMusicIcon();

                updateMainIcon();

            }
        );


        /* --------------------------------
           INITIALIZE
        -------------------------------- */

        applyMusicSettings();

        updateMusicIcon();

        updateMainIcon();

    }


    /* ========================================
       SHUFFLE
    ======================================== */

    function shuffle(
        array
    ) {

        const result =
            [...array];


        for (
            let i =
                result.length - 1;

            i > 0;

            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                result[i],
                result[j]
            ] = [
                result[j],
                result[i]
            ];

        }


        return result;

    }


    /* ========================================
       RANDOM ITEM
    ======================================== */

    function random(
        array
    ) {

        return array[
            Math.floor(
                Math.random() *
                array.length
            )
        ];

    }


    /* ========================================
       POSITIVE MESSAGE
    ======================================== */

    function positive() {

        return random([
            "Great job!",
            "You got it!",
            "Wonderful!",
            "That's right!",
            "Yay! Great job!",
            "Awesome!"
        ]);

    }


    /* ========================================
       CELEBRATION
    ======================================== */

    function celebrate(
        layer,
        number = 12
    ) {

        if (!layer) {
            return;
        }


        const colors = [
            "#FFD54A",
            "#F28AAA",
            "#69B9EE",
            "#72C891",
            "#9568D8"
        ];


        for (
            let i = 0;
            i < number;
            i++
        ) {

            const piece =
                document.createElement(
                    "span"
                );


            piece.className =
                "game-confetti";


            piece.style.left =
                `${
                    45 +
                    Math.random() *
                    10
                }%`;


            piece.style.top =
                `${
                    45 +
                    Math.random() *
                    10
                }%`;


            piece.style.background =
                random(
                    colors
                );


            piece.style.setProperty(
                "--x",
                `${
                    Math.random() *
                    260 -
                    130
                }px`
            );


            piece.style.setProperty(
                "--y",
                `${
                    Math.random() *
                    220 -
                    110
                }px`
            );


            layer.appendChild(
                piece
            );


            setTimeout(
                () =>
                    piece.remove(),
                900
            );

        }

    }


    /* ========================================
       GLOBAL OBJECT
    ======================================== */

    window.LittleLearners = {

        speak,

        attachSoundButton,

        shuffle,

        randomItem:
            random,

        positiveMessage:
            positive,

        celebrate,

        chooseFriendlyVoice:
            voice

    };

})();


/* ========================================
   RANDOM GAME SCENE
======================================== */

LittleLearners.randomScene =
    function (
        element
    ) {

        if (!element) {
            return;
        }


        const scenes = [

            "scene-playroom",

            "scene-playground",

            "scene-jungle"

        ];


        scenes.forEach(
            scene => {

                element
                    .classList
                    .remove(
                        scene
                    );

            }
        );


        const selected =
            scenes[
                Math.floor(
                    Math.random() *
                    scenes.length
                )
            ];


        element
            .classList
            .add(
                selected
            );

    };


/* ========================================
   GLOBAL SITE AUDIO
======================================== */

LittleLearners.siteAudio = {

    music: null,

    musicStarted: false,


    /* ====================================
       INITIALIZE
    ==================================== */

    init() {

        /* --------------------------------
           CREATE BACKGROUND MUSIC
        -------------------------------- */

        this.music =
            new Audio(
                "/assets/audio/background-music.mp3"
            );


        this.music.loop =
            true;


        /* --------------------------------
           RESTORE VOLUME
        -------------------------------- */

        const savedVolume =
            localStorage.getItem(
                "littleLearnersMusicVolume"
            );


        this.music.volume =
            savedVolume === null
                ? 0.12
                : Math.max(
                    0,
                    Math.min(
                        1,
                        Number(
                            savedVolume
                        )
                    )
                );


        /* --------------------------------
           RESTORE MUTE
        -------------------------------- */

        const savedMuted =
            localStorage.getItem(
                "littleLearnersMusicMuted"
            );


        this.music.muted =
            savedMuted === "true";


        /* --------------------------------
           RESTORE PLAYBACK POSITION
        -------------------------------- */

        const savedMusicTime =
            sessionStorage.getItem(
                "littleLearnersMusicTime"
            );


        if (
            savedMusicTime
        ) {

            this.music.currentTime =
                Number(
                    savedMusicTime
                );

        }


        /* --------------------------------
           SAVE PLAYBACK POSITION
        -------------------------------- */

        window.addEventListener(
            "beforeunload",
            () => {

                if (
                    !this.music
                ) {
                    return;
                }


                sessionStorage.setItem(
                    "littleLearnersMusicTime",
                    String(
                        this.music.currentTime
                    )
                );

            }
        );


        /* --------------------------------
           START AFTER FIRST INTERACTION
        -------------------------------- */

        const firstInteraction =
            () => {

                this.startMusic();

            };


        document.addEventListener(
            "pointerdown",
            firstInteraction,
            {
                once: true
            }
        );


        /* --------------------------------
           GLOBAL CLICK SOUND
        -------------------------------- */

        document.addEventListener(
            "click",
            event => {

                const clickable =
                    event.target.closest(
                        `
                            button,
                            a,
                            .game-card,
                            [role="button"]
                        `
                    );


                if (
                    !clickable
                ) {
                    return;
                }


                this.playClick();

            }
        );

    },


    /* ====================================
       START MUSIC
    ==================================== */

    startMusic() {

        if (
            !this.music
        ) {
            return;
        }


        this.musicStarted =
            true;


        this.music
            .play()
            .catch(
                () => {}
            );

    },


    /* ====================================
       CLICK SOUND
    ==================================== */

    playClick() {

        const click =
            new Audio(
                "/assets/audio/click.mp3"
            );


        click.volume =
            0.25;


        click
            .play()
            .catch(
                () => {}
            );

    },


    /* ====================================
       MUSIC MUTE
    ==================================== */

    setMuted(
        muted
    ) {

        if (
            this.music
        ) {

            this.music.muted =
                muted;

        }


        localStorage.setItem(
            "littleLearnersMusicMuted",
            String(
                muted
            )
        );

    },


    /* ====================================
       MUSIC VOLUME
    ==================================== */

    setVolume(
        volume
    ) {

        const safeVolume =
            Math.max(
                0,
                Math.min(
                    1,
                    Number(
                        volume
                    )
                )
            );


        if (
            this.music
        ) {

            this.music.volume =
                safeVolume;

        }


        localStorage.setItem(
            "littleLearnersMusicVolume",
            String(
                safeVolume
            )
        );

    }

};


/* ========================================
   START GLOBAL AUDIO
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        LittleLearners
            .siteAudio
            .init();

    }
);