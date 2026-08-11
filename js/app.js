let soundEnabled = true;

const soundButton = document.getElementById("soundButton");

function speak(text) {
  if (!soundEnabled || !("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const message = new SpeechSynthesisUtterance(text);

  message.lang = "en-US";
  message.rate = 0.9;
  message.pitch = 1.15;
  message.volume = 1;

  window.speechSynthesis.speak(message);
}

function updateSoundButton() {
  soundButton.textContent = soundEnabled ? "🔊" : "🔇";

  soundButton.setAttribute(
    "aria-label",
    soundEnabled ? "Turn sound off" : "Turn sound on"
  );
}

soundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;

  if (!soundEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  updateSoundButton();

  if (soundEnabled) {
    speak("Sound is on!");
  }
});

/*
  We intentionally do not auto-play speech when the homepage opens.

  Mobile browsers usually require a user interaction before allowing
  speech or audio playback.
*/
