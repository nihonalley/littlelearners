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

const OBJECTS = ["apple", "banana", "balloon", "car", "fish", "frog", "flower", "star", "duck", "ball"],
    COLORS = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "teal", "brown", "black"],
    TOTAL = 8; const $ = id => document.getElementById(id),
        start = $('startScreen'), play = $('playScreen'),
        finish = $('finishScreen'), choices = $('objectChoices'),
        roundLabel = $('roundLabel'), feedback = $('feedback'),
        progress = $('progressBar'), layer = $('celebrationLayer');
let round = 1, target, wrong = 0, locked = false, last = ''; LittleLearners.attachSoundButton($('soundButton'));
const count = r => 2 + Math.floor((r - 1) / 2); const make = (color, object) => ({ color, object, key: `${object}-${color}` });

function choose() {
    let x; do { x = make(LittleLearners.randomItem(COLORS), LittleLearners.randomItem(OBJECTS)) } while (x.key === last); last = x.key; return x
}
function instruction() { return round <= 4 ? `Find something ${target.color}!` : `Find the ${target.color} ${target.object}!` }
function sayInstruction() { LittleLearners.speak(instruction(), { rate: .84, pitch: 1.16 }) }
function path(x) { return `../../assets/colored-objects/${x.object}/${x.object}-${x.color}.png` }
function correct(x) { return round <= 4 ? x.color === target.color : (x.color === target.color && x.object === target.object) }
function begin() {
    wrong = 0;
    locked = false;
    feedback.textContent = '';
    target = choose();
    prompt.textContent = instruction();
    roundLabel.textContent = `Round ${round} of ${TOTAL}`;
    progress.style.width = `${round / TOTAL * 100}%`;
    render(count(round));
    setTimeout(sayInstruction, 320)
}
function distract(existing) {
    let x; do { x = make(LittleLearners.randomItem(COLORS), LittleLearners.randomItem(OBJECTS)) }
    while (existing.some(y => y.key === x.key) || correct(x)); return x
}

function render(n) {
    choices.innerHTML = '';
    const items = [target];
    while (items.length < n) items.push(distract(items));
    LittleLearners.shuffle(items).forEach(x => {
        const b = document.createElement('button');
        b.className = 'game-choice';
        b.dataset.key = x.key;
        b.ariaLabel = `${x.color} ${x.object}`;
        const im = document.createElement('img');
        im.src = path(x); im.alt = '';
        b.appendChild(im);
        b.onclick = () => tap(b, x);
        choices.appendChild(b)
    })
}

function tap(b, x) {
    if (locked) return; if (correct(x)) {
        locked = true; document.querySelectorAll('.game-choice').forEach(y => { y.disabled = true; y.classList.remove('is-hint') });
        b.classList.add('is-correct');
        const m = LittleLearners.positiveMessage();
        feedback.textContent = m;
        LittleLearners.speak(m, { rate: .9, pitch: 1.18 });
        LittleLearners.celebrate(layer); setTimeout(() => round >= TOTAL ? done() : (round++, begin()), 1250)
    } else {
        wrong++;
        b.classList.remove('is-wrong');
        void b.offsetWidth;
        b.classList.add('is-wrong');
        feedback.textContent = 'Try again!';
        LittleLearners.speak(`That's a ${x.color} ${x.object}. Let's try again!`, { rate: .85, pitch: 1.14 });
        if (wrong >= 2) document.querySelector(`[data-key="${target.key}"]`)?.classList.add('is-hint')
    }
}

function startGame() {
    round = 1; last = '';
    start.classList.add('is-hidden');
    finish.classList.add('is-hidden');
    play.classList.remove('is-hidden');
    begin()
} function done() {
    play.classList.add('is-hidden');
    finish.classList.remove('is-hidden');
    LittleLearners.speak('All done! Great job!', { rate: .88, pitch: 1.18 });
    LittleLearners.celebrate(layer, 16)
} $('startButton').onclick = () => {
    LittleLearners.speak("Let's play!");
    setTimeout(startGame, 250)
}; $('playAgainButton').onclick = startGame;
$('repeatButton').onclick = sayInstruction;
