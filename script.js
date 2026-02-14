/* ======================
   LANDING PAGE LOGIC
   ====================== */

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const reaction = document.getElementById("reaction");

if (yesBtn && noBtn) {
  let scale = 1;
  let noClicks = 0;

  const messages = [
    "hmm. interesting.",
    "are you sure about that?",
    "be serious.",
    "this is getting awkward.",
    "you don’t actually mean that.",
    "okay i’m panicking now."
  ];

  noBtn.addEventListener("click", () => {
    noClicks++;
    scale += 0.6;
    yesBtn.style.transform = `scale(${scale})`;

    const x = Math.random() * 120 - 60;
    const y = Math.random() * 60 - 30;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;

    reaction.textContent =
      messages[Math.min(noClicks - 1, messages.length - 1)];

    if (scale > 3.2) {
      noBtn.style.display = "none";
      reaction.textContent = "okay you have no choice now.";
    }
  });

  yesBtn.addEventListener("click", () => {
    const params = new URLSearchParams(window.location.search);
    const dev = params.get("dev");

    window.location.href = dev
      ? "days.html?dev=true"
      : "days.html";
  });
}

/* ======================
   DAYS PAGE LOGIC
   ====================== */

const dayCards = document.querySelectorAll(".day-card");

if (dayCards.length > 0) {

  function getCanadaNow() {
    return new Date(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Toronto",
        hour12: false,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      }).format(new Date())
    );
  }

  function getNextCanadaMidnight(targetDay) {
    const now = getCanadaNow();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      targetDay,
      0, 0, 0
    );
  }

  const nowCanada = getCanadaNow();
  const today = nowCanada.getDate();

  const params = new URLSearchParams(window.location.search);
  const isDev =
    window.location.hostname === "localhost" ||
    params.get("dev") === "true";

  dayCards.forEach(card => {
    const unlockDay = parseInt(card.dataset.day, 10);

    if (isDev || today >= unlockDay) {
      card.classList.remove("locked");
      card.style.pointerEvents = "auto";

      card.addEventListener("click", () => {
        window.location.href = `day.html?day=${unlockDay}`;
      });
      return;
    }

    const timer = document.createElement("div");
    timer.className = "day-timer";
    card.appendChild(timer);

    function updateTimer() {
      const now = getCanadaNow();
      const target = getNextCanadaMidnight(unlockDay);
      const diff = target - now;

      if (diff <= 0) {
        location.reload();
        return;
      }

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      timer.textContent =
        `Opens in ${hrs.toString().padStart(2, "0")}:` +
        `${mins.toString().padStart(2, "0")}:` +
        `${secs.toString().padStart(2, "0")}`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  });
}
