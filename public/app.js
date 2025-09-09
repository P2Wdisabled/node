document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  let name = null;

  const $nickForm = document.getElementById("nick-form");
  const $nickInput = document.getElementById("nick");
  const $nickSection = document.getElementById("nick-section");

  const $messages = document.getElementById("messages");
  const $form = document.getElementById("form");
  const $input = document.getElementById("input");
  const $sendBtn = $form.querySelector("button");

  // Lock initial
  setChatLock(true);

  // Logs utiles
  socket.on("connect", () => console.log("🔗 socket:", socket.id));
  socket.on("connect_error", (e) => console.error("⚠️ connect_error", e));
  socket.on("disconnect", (r) => console.warn("🔌 disconnect", r));

  // Historique au chargement
  loadHistory(200).catch(() => {});

  function setChatLock(locked) {
    $input.disabled = locked;
    $sendBtn.disabled = locked;
    $input.placeholder = locked
      ? "Choisis d’abord un pseudo au-dessus"
      : "Tape ton message…";
  }

  function scrollToBottom() {
    $messages.scrollTop = $messages.scrollHeight;
  }

  function addSystem(text) {
    const li = document.createElement("li");
    li.className = "msg system";
    li.textContent = text;
    $messages.appendChild(li);
    scrollToBottom();
  }

  function addMessage(who, text, ts) {
    const li = document.createElement("li");
    li.className = "msg";

    const meta = document.createElement("div");
    meta.className = "meta";

    const spanWho = document.createElement("span");
    spanWho.className = "who";
    spanWho.textContent = who;

    const time = document.createElement("time");
    const date = new Date(ts || Date.now());
    time.dateTime = date.toISOString();
    time.textContent = date.toLocaleTimeString();

    meta.appendChild(spanWho);
    meta.appendChild(time);

    const p = document.createElement("p");
    p.className = "text";
    p.textContent = text;

    li.appendChild(meta);
    li.appendChild(p);
    $messages.appendChild(li);
    scrollToBottom();
  }

  async function loadHistory(limit = 100) {
    const res = await fetch(`/api/messages?limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    for (const m of rows) addMessage(m.name, m.text, m.ts);
  }

  // Pseudo → join (avec ACK, pas de reload)
  $nickForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const pseudo = ($nickInput.value || "").trim().slice(0, 32);
    if (!pseudo) return;

    const doJoin = () => {
      socket.emit("join", pseudo, (resp) => {
        if (!resp || !resp.ok) {
          addSystem("Connexion refusée. Réessaie.");
          return;
        }
        name = resp.name || pseudo;
        addSystem(`Connecté en tant que ${name}`);
        $nickSection.style.display = "none";
        setChatLock(false);
        $input.focus();
      });
    };

    if (socket.connected) doJoin();
    else socket.once("connect", doJoin);
  });

  // Envoi message
  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!name) {
      addSystem("Choisis un pseudo avant d’envoyer des messages.");
      return;
    }

    const text = $input.value.trim();
    if (!text) return;

    socket.emit("chat", text);
    $input.value = "";
    $input.focus();
  });

  // Réception live
  socket.on("system", (text) => addSystem(text));
  socket.on("chat", (msg) => addMessage(msg.name, msg.text, msg.ts));
});
