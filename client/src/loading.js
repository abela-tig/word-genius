export function showLoading() {
  const loadingContainer = document.createElement("div");
  loadingContainer.className = "loading-container";

  const spinner = document.createElement("div");
  spinner.className = "spinner";

  loadingContainer.appendChild(spinner);
  document.body.appendChild(loadingContainer);

  return loadingContainer; // Return the container so it can be removed later
}

export function hideLoading(loadingContainer) {
  if (loadingContainer) {
    loadingContainer.remove();
  }
}

// Example Usage:
