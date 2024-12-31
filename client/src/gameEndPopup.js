export function showLevelPopup(currentLevel) {
  const nextLevel = currentLevel + 1;

  // Create popup container
  const popupContainer = document.createElement("div");
  popupContainer.className = "loading-container"; // Reuse the style from the loading popup

  // Create popup content
  const popupContent = document.createElement("div");
  popupContent.className = "popup-content"; // Add new content styling inside the existing container

  // Level information
  const levelInfo = document.createElement("div");
  levelInfo.className = "level-info";
  levelInfo.innerHTML = `
      <p>Current Level: <strong>${currentLevel}</strong></p>
      <p>Next Level: <strong>${nextLevel}</strong></p>
    `;

  // Replay button
  const replayButton = document.createElement("button");
  replayButton.className = "popup-button replay-button";
  replayButton.textContent = "Replay";
  replayButton.onclick = () => {
    location.reload(); // Reload the page
  };

  // Next Game button
  const nextButton = document.createElement("button");
  nextButton.className = "popup-button next-button";
  nextButton.textContent = "Next Game";
  nextButton.onclick = () => {
    // Redirect with the new level query parameter
    const url = new URL(window.location.href);
    url.searchParams.set("level", nextLevel);
    window.location.replace(url.toString());
  };

  // Append children
  popupContent.appendChild(levelInfo);
  popupContent.appendChild(replayButton);
  popupContent.appendChild(nextButton);
  popupContainer.appendChild(popupContent);

  // Append popup to body
  document.body.appendChild(popupContainer);
  // Close the popup when clicking the background
  popupContainer.addEventListener("click", (e) => {
    if (e.target === popupContainer) {
      hideLevelPopup(popupContainer); // Close the popup
    }
  });
  return popupContainer; // Return the container so it can be removed later
}

export function hideLevelPopup(popupContainer) {
  if (popupContainer) {
    popupContainer.remove();
  }
}
