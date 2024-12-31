import axios from "axios";
import "./style.css";
import { showLoading, hideLoading } from "./loading";
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const levelsHolder = document.querySelector(".levels-list");
    const loadingContainer = showLoading();
    const levels = await axios.get("/api/levels");
    const count = levels.data.count;
    hideLoading(loadingContainer);
    for (let i = 1; i <= count; i++) {
      const level = document.createElement("div");
      level.classList.add("level");
      level.onclick = () => {
        window.location.href = `/game.html?level=${i}`;
      };
      level.textContent = `${i}`;
      levelsHolder.appendChild(level);
    }
  } catch (err) {
    console.error(err);
    window.location.reload();
  }
});
