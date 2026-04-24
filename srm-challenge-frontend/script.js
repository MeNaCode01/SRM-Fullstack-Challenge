const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://YOUR-RENDER-APP.onrender.com";

document.getElementById("submitBtn").addEventListener("click", async () => {
  const inputEl = document.getElementById("jsonInput");
  const outputEl = document.getElementById("resultOutput");
  const errorBox = document.getElementById("errorBox");
  const btn = document.getElementById("submitBtn");

  errorBox.style.display = "none";
  outputEl.textContent = "Processing...";
  btn.disabled = true;

  let dataArray;

  try {
    const rawValue = inputEl.value.trim() || inputEl.placeholder;
    dataArray = JSON.parse(rawValue);

    if (!Array.isArray(dataArray)) {
      throw new Error("Input must be a JSON array of strings.");
    }
  } catch (e) {
    errorBox.textContent = "Invalid JSON: " + e.message;
    errorBox.style.display = "block";
    outputEl.textContent = "Error parsing input.";
    btn.disabled = false;
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/bfhl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: dataArray }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }

    outputEl.textContent = JSON.stringify(result, null, 2);
  } catch (error) {
    errorBox.textContent = "API Error: " + error.message;
    errorBox.style.display = "block";
    outputEl.textContent = "Request failed.";
  } finally {
    btn.disabled = false;
  }
});
