(() => {
  const socket = io();

  let name = null; // pas stocké → reset à chaque reload

  const $nickForm = document.getElementById("nick-form");
  const $nickInput = document.getElementById("nick");
  const $nickSection = document.getElementById("nick-section");

  const $messages = document.getElementById("messages");
  const $form = document.getElementById("form");
  const $input = document.getElementById("input");
  const $sendBtn = $form.querySelector("button");

  // verrous initiaux
  $input.disabled = true;
  $sendBtn.disabled = true;

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

  // Choix pseudo
  $nickForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pseudo = ($nickInput.value || "").trim().slice(0, 32);
    if (!pseudo) return;
    name = pseudo;
    socket.emit("join", name);
    addSystem(`Connecté en tant que ${name}`);
    $nickSection.style.display = "none";
    // déverrouille le chat
    $input.disabled = false;
    $sendBtn.disabled = false;
    $input.focus();
  });

  // Envoi message
  $form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!name) return;
    const text = $input.value.trim();
    if (!text) return;
    socket.emit("chat", text);
    $input.value = "";
    $input.focus();
  });

  // Réception
  socket.on("system", (text) => addSystem(text));
  socket.on("chat", (msg) => addMessage(msg.name, msg.text, msg.ts));
})();
