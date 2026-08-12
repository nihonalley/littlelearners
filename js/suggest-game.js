document.addEventListener("DOMContentLoaded", () => {
  const button = document.createElement("button");

  button.id = "suggestGameButton";
  button.className = "suggest-game-button";
  button.type = "button";
  button.innerHTML = "💡 Suggest  & Feedback";

  document.body.appendChild(button);


  const overlay = document.createElement("div");

  overlay.id = "suggestGameOverlay";
  overlay.className = "suggest-game-overlay";

  overlay.innerHTML = `
  <div
    class="suggest-game-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="suggestGameTitle"
  >

    <button
      id="closeSuggestGame"
      class="suggest-game-close"
      type="button"
      aria-label="Close"
    >
      ×
    </button>

    <div class="suggest-game-icon">
      💡
    </div>

    <h2 id="suggestGameTitle">
      Share a Suggestion
    </h2>

    <p class="suggest-game-intro">
      Have an idea for Little Learners?
      Tell us what we can improve, or suggest
      a game your child would enjoy.
    </p>

    <form id="suggestGameForm">

      <label>
        Your Email
        <input
          id="feedbackEmail"
          type="email"
          placeholder="parent@email.com"
          required
        >
      </label>

      <label>
        Feedback or Game Suggestion
        <textarea
          id="feedbackMessage"
          rows="5"
          placeholder="Example: Please make a counting game with animals..."
          required
        ></textarea>
      </label>

      <button
        class="suggest-game-submit"
        type="submit"
      >
        Send Feedback
      </button>

    </form>

  </div>
`;

  document.body.appendChild(overlay);


  const closeButton =
    document.getElementById("closeSuggestGame");

  const form =
    document.getElementById("suggestGameForm");


  function openModal() {
    overlay.classList.add("is-open");
    document.body.classList.add("suggest-game-open");
  }


  function closeModal() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("suggest-game-open");
  }


  button.addEventListener("click", openModal);

  closeButton.addEventListener("click", closeModal);


  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal();
    }
  });


  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });


  form.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const email =
      document
        .getElementById(
          "feedbackEmail"
        )
        .value
        .trim();


    const message =
      document
        .getElementById(
          "feedbackMessage"
        )
        .value
        .trim();


    const subject =
      "Little Learners Feedback";


    const body =
`Hi Little Learners!

Email:
${email}

Feedback / Suggestion:
${message}

Thank you!`;


    const recipient =
      "mmabrigonda@gmail.com";


    window.location.href =
      `mailto:${recipient}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

  }
);
});