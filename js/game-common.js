(() => {
    const preferred =
        ["Microsoft Jenny", "Microsoft Aria", "Microsoft Zira", "Jenny", "Aria", "Zira", "Samantha", "Ava", "Karen", "Moira", "Susan", "Google UK English Female",
            "Google US English"];
    let sound = true, voices = [];
    function refresh() {
        if ("speechSynthesis" in window) voices = window.speechSynthesis.getVoices()
    }
    refresh();
    if ("speechSynthesis" in window) window.speechSynthesis.addEventListener("voiceschanged", refresh);
    function voice() {
        refresh();
        const en = voices.filter(v => String(v.lang || "").toLowerCase().startsWith("en"));
        for (const p of preferred) {
            const m = en.find(v => v.name.toLowerCase().includes(p.toLowerCase()));
            if (m) return m
        }
        return en.find(v => /(female|woman|girl|jenny|aria|zira|samantha|ava|karen|moira|susan)/i.test(v.name)) || en[0] || voices[0] || null
    }
    function speak(text, opt = {}) {
        if (!sound || !("speechSynthesis" in window) || !text) return; window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US";
        u.rate = opt.rate ?? .88;
        u.pitch = opt.pitch ?? 1.16; u.volume = opt.volume ?? 1;
        const v = voice();
        if (v) u.voice = v;
        window.speechSynthesis.speak(u)
    } function stop() {
        if ("speechSynthesis" in window) window.speechSynthesis.cancel()
    }
    function attach(btn) {
        if (!btn) return;
        const update = () => {
            btn.textContent = sound ? "🔊" : "🔇";
            btn.setAttribute("aria-label", sound ? "Turn sound off" : "Turn sound on")
        };
        update(); btn.addEventListener("click", () => {
            sound = !sound; if (!sound) stop();
            update(); if (sound) speak("Sound is on!")
        })
    } function shuffle(a) {
        a = [...a];
        for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
        return a
    } function random(a) { return a[Math.floor(Math.random() * a.length)] } function positive() {
        return random(["Great job!", "You got it!", "Wonderful!", "That's right!", "Yay! Great job!", "Awesome!"])
    }
    function celebrate(layer, n = 12) {
        if (!layer) return; const c = ["#FFD54A", "#F28AAA", "#69B9EE", "#72C891", "#9568D8"];
        for (let i = 0; i < n; i++) {
            const p = document.createElement("span");
            p.className = "game-confetti"; p.style.left = `${45 + Math.random() * 10}%`;
            p.style.top = `${45 + Math.random() * 10}%`; p.style.background = random(c);
            p.style.setProperty("--x", `${Math.random() * 260 - 130}px`);
            p.style.setProperty("--y", `${Math.random() * 220 - 110}px`);
            layer.appendChild(p); setTimeout(() => p.remove(), 900)
        }
    }
    window.LittleLearners = {
        speak, attachSoundButton: attach, shuffle, randomItem: random, positiveMessage: positive, celebrate, chooseFriendlyVoice: voice
    }
})();
