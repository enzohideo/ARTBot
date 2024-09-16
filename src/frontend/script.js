import Ui from "./htmx.js";

document.body.addEventListener("htmx:beforeRequest", function (evt) {
  const prompt = evt.detail.elt;
  if (!prompt.matches("[name='prompt']")) return;

  const chat = document.getElementById("chat");
  if (!chat) return;

  chat.insertAdjacentHTML(
    "beforeend",
    Ui.message({
      role: "user",
      text: prompt.value,
      swap: false,
    }),
  );
});
