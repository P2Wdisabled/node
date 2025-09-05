/* public/app.js */
(() => {
  const socket = io();

  // Pseudo (prompt obligatoire au premier accès)
  let name = localStorage.getItem("nick");
  while (!name || !name.trim()) {
    name = prompt("Choisis un pseudo :") || "";
    if (name === null) name = "";
  }
  name = name.trim().slice(0, 32);
  localStorage.setItem("nick", name);
  socket.emit("join", name);

  // DOM
  const $messages = document.getElementById("messages");
  const $form = document.getElementById("form");
  const $input = document.getElementById("input");

  function scrollToBottom() {
    $messages.parentElement.scrollTop = $messages.parentElement.scrollHeight;
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

  // Envoi
  $form.addEventListener("submit", (e) => {
    e.preventDefault();
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
