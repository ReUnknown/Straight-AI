const input = document.getElementById("question");
const responseEl = document.getElementById("response");

input.addEventListener("keydown", async function (e) {
  if (e.key === "Enter") {
    const question = input.value.trim();
    if (question === "") {
      responseEl.textContent = ""; // clear any previous response
      return;
    }

    responseEl.textContent = "Thinking...";

    try {
      const res = await fetch("http://localhost:3000/straight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      responseEl.textContent = data.answer || "";
      responseEl.style.color = "black";
    } catch (error) {
      responseEl.textContent = "Error: Server unreachable.";
      responseEl.style.color = "red";
    }
  }
});
