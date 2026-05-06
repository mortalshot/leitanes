import "./app.min.js";
const initError404 = () => {
  const backButton = document.querySelector("[data-fls-404-back]");
  if (!backButton) return;
  backButton.addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = "index.html";
  });
};
window.addEventListener("load", initError404);
