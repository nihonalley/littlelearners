function loadKofiWidget() {
  const script = document.createElement("script");

  script.src =
    "https://storage.ko-fi.com/cdn/scripts/overlay-widget.js";

  script.onload = () => {
    kofiWidgetOverlay.draw("twinkletip", {
      type: "floating-chat",

      "floating-chat.donateButton.text":
        "Support Us",

      "floating-chat.donateButton.background-color":
        "#00b9fe",

      "floating-chat.donateButton.text-color":
        "#fff"
    });
  };

  document.body.appendChild(script);
}

loadKofiWidget();