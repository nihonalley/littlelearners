const prompt =
    document.getElementById("prompt");

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

const COLORS = [
    { name: "red", value: "#F04F4F" },
    { name: "blue", value: "#4D9DE0" },
    { name: "yellow", value: "#FFD54A" },
    { name: "green", value: "#55B96F" },
    { name: "orange", value: "#F59A3D" },
    { name: "purple", value: "#9568D8" },
    { name: "pink", value: "#F28AAA" },
    { name: "brown", value: "#956B52" },
    { name: "black", value: "#292929" },
    { name: "white", value: "#FFFFFF" }
],
    TOTAL = 8;
const $ = id => document.getElementById(id),
    start = $('startScreen'),
    play = $('playScreen'),
    finish = $('finishScreen'),
    choices = $('colorChoices'),
    roundLabel = $('roundLabel'),
    feedback = $('feedback'),
    progress = $('progressBar'),
    layer = $('celebrationLayer');
let round = 1, target, wrong = 0, locked = false, previous = null;
LittleLearners.attachSoundButton($('soundButton'));
const count = r => 2 + Math.floor((r - 1) / 2);
function choose() {
    const a = COLORS.filter(c => c.name !== previous),
        x = LittleLearners.randomItem(a);
    previous = x.name; return x
}
function instruction() {
    return `Can you find ${target.name}?`
}
function sayInstruction() { LittleLearners.speak(instruction(), { rate: .84, pitch: 1.16 }) }
function begin() {
    wrong = 0; locked = false;
    feedback.textContent = '';
    target = choose();
    prompt.textContent = instruction();
    roundLabel.textContent = `Round ${round} of ${TOTAL}`;
    progress.style.width = `${round / TOTAL * 100}%`;
    render(count(round)); setTimeout(sayInstruction, 320)
}
function render(n) {
    choices.innerHTML = ''; const d = LittleLearners.shuffle(COLORS.filter(c => c.name !== target.name)).slice(0, n - 1);
    LittleLearners.shuffle([target, ...d]).forEach(c => {
        const b = document.createElement('button');
        b.className = 'game-choice game-choice--color';
        if (c.name === 'white') b.classList.add('game-choice--white');
        b.style.backgroundColor = c.value; b.dataset.color = c.name;
        b.ariaLabel = c.name;
        b.onclick = () => tap(b, c);
        choices.appendChild(b)
    })
}
function tap(b, c) {
    if (locked) return;
    if (c.name === target.name) {
        locked = true; document.querySelectorAll('.game-choice').forEach(x => { x.disabled = true; x.classList.remove('is-hint') });
        b.classList.add('is-correct');
        const m = LittleLearners.positiveMessage();
        feedback.textContent = m;
        LittleLearners.speak(m, { rate: .9, pitch: 1.18 });
        LittleLearners.celebrate(layer);
        setTimeout(() => round >= TOTAL ? done() : (round++, begin()), 1250)
    } else {
        wrong++; b.classList.remove('is-wrong');
        void b.offsetWidth; b.classList.add('is-wrong'); feedback.textContent = 'Try again!';
        LittleLearners.speak(`That's ${c.name}. Let's try again!`, { rate: .85, pitch: 1.14 });
        if (wrong >= 2)
            document.querySelector(`[data-color="${target.name}"]`)?.classList.add('is-hint')
    }
}
function startGame() {
    round = 1; previous = null;
    start.classList.add('is-hidden');
    finish.classList.add('is-hidden');
    play.classList.remove('is-hidden'); begin()
}
function done() {
    play.classList.add('is-hidden');
    finish.classList.remove('is-hidden');
    LittleLearners.speak('All done! Great job!', { rate: .88, pitch: 1.18 });
    LittleLearners.celebrate(layer, 16)
} $('startButton').onclick = () => {
    LittleLearners.speak("Let's play!");
    setTimeout(startGame, 250)
}; $('playAgainButton').onclick = startGame; $('repeatButton').onclick = sayInstruction;
