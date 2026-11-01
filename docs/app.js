/* Cadıların Maskesi — karakter kağıdı uygulaması.
   Veri: data.js (GAME_DATA). Durum: Firebase RTDB (varsa) ya da localStorage.
   Kural: uygulama hiçbir zaman zar atmaz; oyuncu fiziksel zar atar, sonucu işler. */
(function () {
  const D = window.GAME_DATA;
  const app = document.getElementById("app");
  const SESSION_KEY = "ya_session";
  const chars = Object.fromEntries(D.characters.map(c => [c.id, c]));

  // ---------- durum ----------
  function defaultState() {
    const s = { chars: {}, shared: { notes: "", moon: 0, clues: {}, prep: {} } };
    for (const c of D.characters) {
      const cs = { hp: c.hpMax, notes: "", daily: {} };
      if (c.resource.kind === "omen") cs.omens = [];
      else cs.res = c.resource.start ?? c.resource.max;
      if (c.wildShape) cs.ws = c.wildShape.max;
      if (c.portent) cs.portent = ["", ""];
      if (c.resource.shortOncePerDay) cs.shortUsed = false;
      for (const d of c.daily || []) cs.daily[d.id] = false;
      s.chars[c.id] = cs;
    }
    return s;
  }
  function merge(base, over) {
    if (over === null || over === undefined) return base;
    if (Array.isArray(base)) return Array.isArray(over) ? over : base;
    if (typeof base === "object") { const out = { ...base }; for (const k of Object.keys(over || {})) out[k] = merge(base[k] ?? null, over[k]); return out; }
    return over;
  }
  function setPath(obj, path, val) {
    const ks = path.split("/"); let o = obj;
    for (let i = 0; i < ks.length - 1; i++) { if (o[ks[i]] == null || typeof o[ks[i]] !== "object") o[ks[i]] = {}; o = o[ks[i]]; }
    o[ks[ks.length - 1]] = val;
  }
  let state = defaultState(), store, online = false;

  function makeFirebaseStore() {
    firebase.initializeApp(window.FIREBASE_CONFIG);
    const db = firebase.database();
    const root = db.ref("games/" + (window.GAME_ID || "default"));
    return {
      init(onChange) {
        root.on("value", snap => { state = merge(defaultState(), snap.val() || {}); onChange(); });
        db.ref(".info/connected").on("value", s => { online = !!s.val(); renderStatus(); });
      },
      set(path, val) { setPath(state, path, val); root.child(path).set(val); }
    };
  }
  function makeLocalStore() {
    const KEY = "ya_state_" + (window.GAME_ID || "default");
    const bc = ("BroadcastChannel" in window) ? new BroadcastChannel(KEY) : null;
    const load = () => { try { return merge(defaultState(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { return defaultState(); } };
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
    return {
      init(onChange) {
        state = load(); onChange();
        if (bc) bc.onmessage = () => { state = load(); onChange(); };
        window.addEventListener("storage", e => { if (e.key === KEY) { state = load(); onChange(); } });
      },
      set(path, val) { setPath(state, path, val); save(); if (bc) bc.postMessage("u"); }
    };
  }

  // ---------- yardımcılar ----------
  const mod = n => Math.floor((n - 10) / 2);
  const fmt = n => (n >= 0 ? "+" + n : "" + n);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let toastT;
  function toast(msg, ms = 3200) { const t = document.getElementById("toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, ms); }
  // Oturum: sekmeye özel (sessionStorage) öncelikli, cihaz geneli (localStorage) yedek.
  function session() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; } }
  function setSession(s) {
    try { if (s) { const v = JSON.stringify(s); sessionStorage.setItem(SESSION_KEY, v); localStorage.setItem(SESSION_KEY, v); } else { sessionStorage.removeItem(SESSION_KEY); localStorage.removeItem(SESSION_KEY); } } catch {}
  }
  let view = { tab: null };

  const MASK_SVG = `<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round">
    <path d="M60 10c22 0 40 14 40 34 0 24-14 48-40 66C34 92 20 68 20 44c0-20 18-34 40-34z" fill="currentColor" fill-opacity=".08"/>
    <path d="M60 10v100" stroke-opacity=".35"/>
    <path class="eye l" d="M30 46c8-8 20-8 26 0-6 8-18 8-26 0z" fill="currentColor"/>
    <path class="eye r" d="M64 46c6-8 18-8 26 0-8 8-20 8-26 0z" fill="currentColor"/>
    <path d="M44 74c6 10 26 10 32 0" stroke-linecap="round"/>
    <path d="M20 44c-8-10-8-26 2-34M100 44c8-10 8-26-2-34" stroke-linecap="round" stroke-opacity=".6"/>
  </svg>`;
  const HG_SVG = `<svg viewBox="0 0 40 60" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round">
    <path d="M8 6h24M8 54h24M11 6c0 14 7 18 9 24-2 6-9 10-9 24M29 6c0 14-7 18-9 24 2 6 9 10 9 24"/>
    <path class="sand" d="M13 9c0 9 5 13 7 17 2-4 7-8 7-17z" fill="currentColor" fill-opacity=".85"/>
    <path d="M14 51h12l-6-9z" fill="currentColor" fill-opacity=".25"/>
  </svg>`;
  const EMBLEMS = {
    dice: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round">
      <path d="M50 10 88 30 50 50 12 30z"/>
      <path d="M12 30 50 50v42L12 72z" fill="currentColor" fill-opacity=".12"/>
      <path d="M88 30 50 50v42l38-20z" fill="currentColor" fill-opacity=".25"/>
      <ellipse cx="50" cy="30" rx="4" ry="2.4" fill="currentColor"/>
      <ellipse cx="31" cy="50" rx="2.6" ry="3.4" fill="currentColor"/><ellipse cx="31" cy="61" rx="2.6" ry="3.4" fill="currentColor"/><ellipse cx="31" cy="72" rx="2.6" ry="3.4" fill="currentColor"/>
      <ellipse cx="61" cy="56" rx="2.6" ry="3.4" fill="currentColor"/><ellipse cx="77" cy="66" rx="2.6" ry="3.4" fill="currentColor"/>
    </svg>`,
    cauldron: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 42h60M26 42c-2 26 12 42 24 42s26-16 24-42"/><path d="M14 42h72M30 84l-6 8M70 84l6 8"/><path d="M40 30c0-8 6-10 6-16M52 32c0-9 7-10 7-17M62 34c0-6 4-8 4-13" stroke-linecap="round"/><circle cx="36" cy="40" r="2" fill="currentColor"/><circle cx="58" cy="39" r="2" fill="currentColor"/></svg>`,
    grimoire: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 18h52a6 6 0 0 1 6 6v58H28a6 6 0 0 0-6 6z"/><path d="M22 18v70a6 6 0 0 0 6 6h52"/><path d="M50 34l4 10 10 2-8 7 2 10-8-5-8 5 2-10-8-7 10-2z" fill="currentColor" opacity=".9"/><path d="M34 62h30M34 70h22"/></svg>`,
    moth: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M50 30v48"/><path d="M50 36C40 22 18 20 12 30c-6 10 10 24 38 26"/><path d="M50 36c10-14 32-16 38-6 6 10-10 24-38 26"/><path d="M50 62c-10 6-26 6-30 0 4 14 22 14 30 4"/><path d="M50 62c10 6 26 6 30 0-4 14-22 14-30 4"/><path d="M46 28l-6-10M54 28l6-10" stroke-linecap="round"/><circle cx="34" cy="38" r="2.5" fill="currentColor"/><circle cx="66" cy="38" r="2.5" fill="currentColor"/></svg>`
  };

  // ---------- render ----------
  let pendingRender = false;
  function render() {
    const ae = document.activeElement;
    if (ae && ae.dataset && ae.dataset.sync) { pendingRender = true; return; }
    pendingRender = false;
    const openKeys = new Set([...app.querySelectorAll("details[open] > summary")].map(x => x.textContent.trim()));
    const y = window.scrollY;
    const s = session();
    if (!s) renderLogin();
    else if (s.role === "dm") renderDM();
    else { const c = chars[s.char]; if (!c) { setSession(null); renderLogin(); } else renderPlayer(c); }
    app.querySelectorAll("details > summary").forEach(sm => { if (openKeys.has(sm.textContent.trim())) sm.parentElement.open = true; });
    window.scrollTo(0, y);
    checkTime();
  }
  function applyTheme(c) {
    const r = document.documentElement.style;
    let c1 = "#c9a24a", c2 = "#7f5af0";
    if (c) {
      c1 = c.theme.c1; c2 = c.theme.c2;
      if (c.theme.soul && c.resource.kind === "souls") {
        const n = Math.max(0, Math.min(c.theme.soul.length - 1, state.chars[c.id]?.res ?? 0));
        [c1, c2] = c.theme.soul[n];
      }
    }
    r.setProperty("--c1", c1); r.setProperty("--c2", c2);
  }
  function renderStatus() {
    const el = document.getElementById("status"); if (!el) return;
    el.textContent = window.FIREBASE_CONFIG ? (online ? "● bağlı" : "○ bağlantı yok") : "● yalnızca bu cihaz";
    el.style.color = window.FIREBASE_CONFIG && !online ? "var(--danger)" : "var(--muted)";
  }

  function renderLogin() {
    applyTheme(null);
    app.innerHTML = `
      <div class="login-hero"><div class="mask">${MASK_SVG}</div><h1>Cadıların Maskesi</h1><p class="muted">Kaos Ajanları · karakter kağıtları</p></div>
      <div class="card">
        <label class="small muted">Kodunu gir</label>
        <input class="code" id="code" autocomplete="off" autocapitalize="characters" placeholder="KOD">
        <div style="height:10px"></div>
        <button class="primary" id="go" style="width:100%">Giriş</button>
        <p class="small muted" id="err" style="margin:8px 0 0"></p>
      </div>
      ${!window.FIREBASE_CONFIG ? `<div class="banner">Firebase ayarlanmadı: değişiklikler yalnızca bu cihazda saklanır.</div>` : ""}`;
    const inp = document.getElementById("code");
    const go = () => {
      const code = inp.value.trim().toUpperCase();
      if (code === String(D.dmCode).toUpperCase()) { setSession({ role: "dm" }); view.tab = D.characters[0].id; return render(); }
      const c = D.characters.find(x => String(x.code).toUpperCase() === code);
      if (c) { setSession({ role: "player", char: c.id }); view.tab = "sheet"; return render(); }
      document.getElementById("err").textContent = "Kod tanınmadı.";
    };
    document.getElementById("go").onclick = go;
    inp.onkeydown = e => { if (e.key === "Enter") go(); };
    inp.focus();
  }

  const topbar = title => `<div class="topbar"><div><span class="who">${esc(title)}</span> <span id="status" class="small"></span></div><button class="ghost sm" id="logout">Çıkış</button></div>`;
  function bindTop() { document.getElementById("logout").onclick = () => { setSession(null); render(); }; renderStatus(); }

  function renderPlayer(c) {
    applyTheme(c);
    const tab = view.tab || "sheet";
    app.innerHTML = topbar(c.player) + `
      <div class="tabs"><button data-t="sheet" class="${tab === "sheet" ? "active" : ""}">Karakter</button><button data-t="shared" class="${tab === "shared" ? "active" : ""}">Ortak Notlar</button></div>
      <div id="content"></div>`;
    bindTop();
    app.querySelectorAll(".tabs button").forEach(b => b.onclick = () => { view.tab = b.dataset.t; render(); });
    const content = document.getElementById("content");
    if (tab === "sheet") renderSheet(content, c, false); else renderShared(content, false);
  }
  function renderDM() {
    const tab = view.tab || D.characters[0].id;
    applyTheme(chars[tab] || null);
    app.innerHTML = topbar("DM") + `
      <div class="tabs">${D.characters.map(c => `<button data-t="${c.id}" class="${tab === c.id ? "active" : ""}">${esc(c.player)}</button>`).join("")}<button data-t="shared" class="${tab === "shared" ? "active" : ""}">Ortak</button><button data-t="story" class="${tab === "story" ? "active" : ""}">Hikâye</button></div>
      <div id="content"></div>`;
    bindTop();
    app.querySelectorAll(".tabs button").forEach(b => b.onclick = () => { view.tab = b.dataset.t; render(); });
    const content = document.getElementById("content");
    if (tab === "shared") renderShared(content, true);
    else if (tab === "story") renderStory(content);
    else renderSheet(content, chars[tab], true);
  }

  // ---------- zaman bildirimi ve çan ----------
  let audioCtx = null;
  function armAudio() { try { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === "suspended") audioCtx.resume(); } catch {} }
  ["pointerdown", "keydown", "touchstart"].forEach(ev => window.addEventListener(ev, armAudio, { passive: true }));
  function bell() {
    try {
      armAudio(); if (!audioCtx) return;
      const strike = (t0, base) => {
        [1, 2.01, 2.74, 3.76].forEach((m, i) => {
          const o = audioCtx.createOscillator(), g = audioCtx.createGain();
          o.type = "sine"; o.frequency.value = base * m;
          g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.35 / (i + 1), t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.6 - i * 0.4);
          o.connect(g); g.connect(audioCtx.destination); o.start(t0); o.stop(t0 + 2.8);
        });
      };
      const now = audioCtx.currentTime; strike(now, 440); strike(now + 1.1, 392);
    } catch {}
  }
  let lastMoon = null;
  function checkTime() {
    const m = state.shared?.moon ?? 0;
    if (lastMoon === null) { lastMoon = m; return; }
    if (m > lastMoon) { showNotice(m - lastMoon, m); bell(); }
    lastMoon = m;
  }
  let noticeT;
  function showNotice(delta, total) {
    const n = document.getElementById("notice");
    n.innerHTML = `<div class="inner"><div class="hgbig">${HG_SVG}</div><div class="big">Zaman ilerliyor</div><div class="sub">${delta} kum saati çevrildi · ${total} / ${D.moonMax || 12}</div><div class="tap">dokun ve kapat</div></div>`;
    n.hidden = false;
    n.onclick = () => { n.hidden = true; clearTimeout(noticeT); };
    clearTimeout(noticeT); noticeT = setTimeout(() => n.hidden = true, 3000);
  }

  // ---------- DM hikâye ----------
  let STORY = null;
  function story() {
    if (STORY) return STORY;
    try { STORY = JSON.parse(decodeURIComponent(escape(atob(window.STORY_B64 || "")))); } catch { STORY = null; }
    return STORY;
  }
  function renderStory(el) {
    const S = story();
    if (!S) { el.innerHTML = `<div class="card">Hikâye dosyası yüklenemedi (story.js).</div>`; return; }
    const det = (title, body, open) => `<details ${open ? "open" : ""}><summary><span class="name">${esc(title)}</span></summary><div class="body">${body}</div></details>`;
    const list = arr => `<ul class="beats">${arr.map(x => `<li>${nl(x)}</li>`).join("")}</ul>`;
    const checklist = (items, key) => `<div class="checklist">${items.map((it, i) => { const id = it.id || ("p" + i); const done = !!state.shared[key]?.[id]; return `<label class="${done ? "done" : ""}"><input type="checkbox" data-ck="${key}/${id}" ${done ? "checked" : ""}><span>${nl(it.text || it)}</span></label>`; }).join("")}</div>`;
    const secs = [["ozet", "Özet"], ["nusha", "Nüshalar"], ["perde", "Perdeler"], ["gercek", "Gerçek"], ["glamour", "Glamour"], ["kum", "Kum"], ["npc", "NPC'ler"], ["kars", "Karşılaşmalar"], ["yaratik", "Yaratıklar"], ["ipucu", "İpucu takibi"], ["hazirlik", "Hazırlık"]];
    const para = s => `<p class="prose">${nl(s)}</p>`;
    el.innerHTML = `
      <div class="hero"><div class="emblem">${MASK_SVG}</div><h2>${esc(S.title)}</h2><div class="sub">${esc(S.tagline)}</div></div>
      <div class="toc">${secs.map(([id, t]) => `<a href="#s-${id}">${esc(t)}</a>`).join("")}</div>

      <div class="card" id="s-ozet"><h3>Özet</h3>${para(S.synopsis)}${S.overview ? `<h3 class="sec">Oyun nasıl akar</h3>${para(S.overview)}` : ""}${S.names ? `<h3 class="sec">Kim kimdir</h3>${list(S.names)}` : ""}</div>

      <div class="card" id="s-nusha"><h3>Nüshalar</h3><p class="hint" style="margin:0 0 8px">Oyunculara verilecek yazılı belgeler ve hazır replikler. "Ortak notlara ekle" düğmesi metni Ortak Notlar'ın sonuna yazar; oyuncular anında görür. "Kopyala" panoya alır.</p>
        ${(S.handouts || []).map((h, i) => det(h.title, `<div class="read">${nl(h.text)}</div><div class="row" style="margin-top:10px"><button class="sm primary" data-handout-add="${i}">Ortak notlara ekle</button><button class="sm" data-handout-copy="${i}">Kopyala</button></div>`)).join("")}</div>

      <div class="card" id="s-perde"><h3>Perdeler</h3><p class="hint" style="margin:0 0 8px">Her perde önce düz yazıyla özetlenir (örnek akış), sonra sahne sahne açılır. İtalik kutular oyunculara okunacak metin, maddeler sana notlar.</p>
        ${S.acts.map(a => det(`${a.title} · ${a.time}`, `
          <div class="kv"><b>Amaç</b><span>${nl(a.goal)}</span><b>Kum</b><span>${esc(a.sand)}</span></div>
          ${a.narrative ? `<h3 class="sec">Örnek akış</h3>${para(a.narrative)}` : ""}
          <h3 class="sec">Sahneler</h3>
          ${a.scenes.map(sc => det(sc.title, `<div class="read">${nl(sc.read)}</div>${list(sc.beats)}`)).join("")}
          ${a.transition ? `<p class="hint" style="margin-top:10px"><b>Geçiş:</b> ${nl(a.transition)}</p>` : ""}`)).join("")}</div>

      <div class="card" id="s-gercek"><h3>Gerçek (sadece DM)</h3>${list(S.truth)}</div>
      ${S.glamour ? `<div class="card" id="s-glamour"><h3>Glamour nasıl çalışır</h3>${list(S.glamour)}</div>` : ""}
      <div class="card" id="s-kum"><h3>${esc(S.clock.name)}</h3>${list(S.clock.rules)}<h3 class="sec">Kilitler: her karakterin sahnesi</h3><table class="simple"><tr><th>Kim · yetenek</th><th>Nerede</th><th>Ne olur</th></tr>${S.locks.map(l => `<tr>${l.map(x => `<td>${esc(x)}</td>`).join("")}</tr>`).join("")}</table></div>
      <div class="card" id="s-npc"><h3>NPC'ler</h3>${S.npcs.map(n => det(`${n.name} · ${n.role}`, `<div class="kv"><b>Görünüş</b><span>${nl(n.look)}</span><b>Ses</b><span>${nl(n.voice)}</span><b>İster</b><span>${nl(n.wants)}</span><b>Sır</b><span>${nl(n.secret)}</span><b>DM notu</b><span>${nl(n.tips)}</span></div>`)).join("")}</div>
      ${S.encounters ? `<div class="card" id="s-kars"><h3>Karşılaşmalar</h3>${S.encounters.map(e => det(e.where, `${para(e.what)}<p class="hint"><b>Alternatif:</b> ${nl(e.alt)}</p>`)).join("")}</div>` : ""}
      <div class="card" id="s-yaratik"><h3>Yaratıklar</h3>${S.monsters.map(m => det(m.name, `<p class="small muted" style="margin:0 0 6px">${esc(m.base)}</p><div class="pre">${esc(m.stats)}</div><p class="hint"><b>Taktik:</b> ${nl(m.tactics)}</p>`)).join("")}</div>
      <div class="card" id="s-ipucu"><h3>İpucu takibi</h3><p class="hint" style="margin:0 0 6px">Oyuncular bulunca işaretle; cihazlar arası senkron.</p>${checklist(S.clues, "clues")}</div>
      <div class="card" id="s-hazirlik"><h3>Hazırlık</h3>${checklist(S.prep, "prep")}</div>`;
    el.querySelectorAll("[data-ck]").forEach(cb => cb.onchange = () => { store.set("shared/" + cb.dataset.ck, cb.checked); render(); });
    el.querySelectorAll("[data-handout-add]").forEach(b => b.onclick = () => {
      const h = S.handouts[Number(b.dataset.handoutAdd)];
      const cur = state.shared.notes || "";
      const block = `${cur.trim() ? cur.replace(/\s+$/, "") + "\n\n" : ""}— ${h.title} —\n${h.text}\n`;
      store.set("shared/notes", block);
      toast(`"${h.title}" ortak notlara eklendi.`);
    });
    el.querySelectorAll("[data-handout-copy]").forEach(b => b.onclick = async () => {
      const h = S.handouts[Number(b.dataset.handoutCopy)];
      try { await navigator.clipboard.writeText(h.text); toast("Panoya kopyalandı."); } catch { toast("Kopyalama izni yok; metni seçip kopyala."); }
    });
    el.querySelectorAll(".toc a").forEach(a => a.onclick = e => { e.preventDefault(); const t = document.querySelector(a.getAttribute("href")); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); });
  }

  // ---------- ortak ----------
  function renderShared(el, dm) {
    const sh = state.shared, max = D.moonMax || 12;
    el.innerHTML = `
      <div class="card"><h3>Zamanın Kumları</h3>
        <div class="sands">${Array.from({ length: max }, (_, i) => `<div class="hg ${i < sh.moon ? "on" : ""} ${i === sh.moon - 1 ? "last" : ""}">${HG_SVG}</div>`).join("")}</div>
        <div class="row between"><span class="muted small">${sh.moon} / ${max}${sh.moon >= max ? " · Ay döndü" : ""}</span>
          ${dm ? `<span class="row"><button class="sm" id="moon-">−1</button><button class="sm primary" id="moon+">Kum çevir (+1)</button></span>` : ""}</div>
        ${dm ? `<div class="row" style="margin-top:10px"><input class="num" id="moonN" inputmode="numeric" value="2" style="width:64px"><button class="sm" id="moonAdd">Bu kadar ilerlet</button><span class="grow"></span><button class="sm ghost" id="moon0">Sıfırla</button></div>
        <p class="hint">Her ilerletmede tüm ekranlara tek bir çanlı bildirim gider (kaç kum saati çevrildiği yazar).</p>` : ""}</div>
      <div class="card"><h3>Ortak Notlar</h3><p class="hint" style="margin:0 0 8px">Herkes okur ve yazar; her cihazda aynı anda güncellenir.</p>
        <textarea id="shared-notes" data-sync="1" placeholder="İpuçları, isimler, plan…">${esc(sh.notes)}</textarea></div>`;
    bindTextarea(document.getElementById("shared-notes"), "shared/notes");
    if (dm) {
      document.getElementById("moon-").onclick = () => { store.set("shared/moon", Math.max(0, sh.moon - 1)); render(); };
      const advance = n => { if (n <= 0) return; store.set("shared/moon", Math.min(max, sh.moon + n)); render(); };
      document.getElementById("moon+").onclick = () => advance(1);
      document.getElementById("moonAdd").onclick = () => advance(parseInt(document.getElementById("moonN").value, 10) || 0);
      const z = document.getElementById("moon0");
      z.onclick = () => {
        if (z.dataset.armed) { store.set("shared/moon", 0); render(); return; }
        z.dataset.armed = "1"; z.textContent = "Emin misin? Sıfırla"; z.classList.remove("ghost"); z.classList.add("danger");
        setTimeout(() => { if (document.body.contains(z)) { delete z.dataset.armed; z.textContent = "Sıfırla"; z.classList.add("ghost"); z.classList.remove("danger"); } }, 4000);
      };
    }
  }
  function bindTextarea(ta, path) {
    let t;
    ta.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => store.set(path, ta.value), 400); });
    ta.addEventListener("blur", () => { clearTimeout(t); store.set(path, ta.value); if (pendingRender) render(); });
  }

  // ---------- karakter kağıdı ----------
  const resCount = (c, cs) => c.resource.kind === "omen" ? (cs.omens || []).length : (cs.res ?? 0);
  const canPay = (c, cs, a) => resCount(c, cs) >= (a.cost || 0);

  function renderSheet(el, c, dm) {
    const cs = state.chars[c.id];
    const hpPct = Math.max(0, Math.min(100, Math.round(100 * cs.hp / c.hpMax)));
    const soulCls = c.resource.kind === "souls" ? ` soul-${Math.min(3, cs.res)}` : "";
    el.innerHTML = `
      <div class="hero${soulCls}">
        <div class="emblem">${EMBLEMS[c.theme.emblem] || ""}</div>
        <h2>${esc(c.title)}</h2>
        <div class="sub">${esc(c.race)} · ${esc(c.cls)} · ${esc(c.bg)}</div>
        <div class="hp">
          <div class="row between"><span class="hpnum">${cs.hp}<span class="muted small" style="font-family:Inter"> / ${c.hpMax} HP</span></span></div>
          <div class="hpbar"><div class="${hpPct <= 33 ? "low" : ""}" style="width:${hpPct}%"></div></div>
          <div class="quick"><button class="sm" data-hp="-5">−5</button><button class="sm" data-hp="-1">−1</button><button class="sm" data-hp="1">+1</button><button class="sm" data-hp="5">+5</button><button class="sm" id="hpfull">Tam HP</button></div>
        </div>
      </div>

      <div class="card">
        <div class="stats">
          <div><div class="k">AC</div><div class="v">${c.ac}</div><div class="small muted">${esc(c.acNote)}</div></div>
          <div><div class="k">Hız</div><div class="v">${esc(c.speed)}</div></div>
          <div><div class="k">Büyü</div><div class="v">DC 13</div><div class="small muted">saldırı +5 · yeterlilik +${c.prof}</div></div>
        </div>
        <div class="abil">${Object.entries(c.abilities).map(([k, v]) => `<div><div class="k">${k}</div><div class="m">${fmt(mod(v))}</div><div class="s">${v}</div></div>`).join("")}</div>
        <div class="sec"><h3>Saving throw</h3><div class="saves">${c.saves.map(([k, v]) => `<div>${k}<b>${fmt(v)}</b></div>`).join("")}</div></div>
        <div class="sec"><h3>Skill</h3><div class="chips">${c.skills.map(([k, v]) => `<span class="chip ${v === 0 ? "zero" : ""}">${esc(k)} <b>${fmt(v)}</b></span>`).join("")}</div></div>
        <div class="sec"><h3>Silahlar</h3><table class="simple"><tr><th>Silah</th><th>Saldırı</th><th>Hasar</th><th></th></tr>${c.weapons.map(w => `<tr><td><b>${esc(w[0])}</b></td><td>${esc(w[1])}</td><td>${esc(w[2])}</td><td class="muted">${esc(w[3])}</td></tr>`).join("")}</table></div>
        <div class="sec"><h3>Özellikler</h3><ul class="traits">${c.traits.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>
      </div>

      <div class="card" id="res"></div>

      <div class="card">
        <h3>Sürekli yetenekler</h3>
        ${c.cantrips.map(a => abilityHtml(a, "free")).join("")}
        <h3 class="sec">${esc(c.resource.name)} harcayan</h3>
        ${c.powers.map((a, i) => abilityHtml(a, "power", i, !canPay(c, cs, a), c)).join("")}
        ${(c.daily || []).length ? `<h3 class="sec">Günde 1</h3>` + c.daily.map(a => dailyHtml(a, cs.daily?.[a.id])).join("") : ""}
        ${(c.special || []).length ? `<h3 class="sec">Özel</h3>` + c.special.map(a => abilityHtml(a, "none")).join("") : ""}
        <h3 class="sec">Background · ${esc(c.background.name)}</h3>
        ${abilityHtml({ name: c.background.feature, text: c.background.text }, "none")}
        <details class="sec"><summary><span class="name">Ekipman</span></summary><div class="body">${nl(c.equipment)}</div></details>
      </div>

      <div class="card">
        <div class="row between"><h3 style="margin:0">Dinlenme</h3><span class="row"><button class="sm" id="short">Short rest</button><button class="sm" id="long">Long rest</button></span></div>
        <p class="hint">Short: ${esc(restText(c, "short"))}<br>Long: ${esc(restText(c, "long"))}</p>
      </div>

      <div class="card">
        <h3>${dm ? esc(c.player) + " için notlar" : "Notlarım"}</h3>
        <p class="hint" style="margin:0 0 8px">Sadece bu karaktere ait; DM de görür.</p>
        <textarea id="notes" data-sync="1" placeholder="İpuçları, isimler, planlar…">${esc(cs.notes)}</textarea>
      </div>`;

    el.querySelectorAll("[data-hp]").forEach(b => b.onclick = () => { store.set(`chars/${c.id}/hp`, Math.max(0, Math.min(c.hpMax, cs.hp + Number(b.dataset.hp)))); render(); });
    document.getElementById("hpfull").onclick = () => { store.set(`chars/${c.id}/hp`, c.hpMax); render(); };
    el.querySelectorAll("[data-daily]").forEach(b => b.onclick = () => { const id = b.dataset.daily; store.set(`chars/${c.id}/daily/${id}`, !(cs.daily?.[id])); render(); });
    document.getElementById("short").onclick = () => rest(c, "short");
    document.getElementById("long").onclick = () => rest(c, "long");
    bindTextarea(document.getElementById("notes"), `chars/${c.id}/notes`);
    renderResource(document.getElementById("res"), c, cs);
    bindPowerButtons(el, c, cs);
  }

  function costBadge(a, c) {
    if (c && c.resource.kind === "omen") return `<span class="badge any">${a.cost}</span>`;
    return `<span class="badge ${a.cost > 1 ? "cost2" : "cost"}">${a.cost}</span>`;
  }
  const nl = s => esc(s).replace(/\n/g, "<br>");
  function abilityHtml(a, kind, idx, off, c) {
    const badge = kind === "free" ? `<span class="badge free">∞</span>` : kind === "power" ? costBadge(a, c) : "";
    const use = kind === "power" ? `<div class="row" style="margin-top:10px" data-usewrap="${idx}"></div>` : "";
    return `<details class="${off ? "off" : ""}"><summary>${badge}<span class="name">${esc(a.name)}</span><span class="short">${esc(a.short || "")}</span></summary><div class="body">${nl(a.text)}${use}</div></details>`;
  }
  function dailyHtml(a, used) {
    return `<details class="${used ? "off" : ""}"><summary><span class="badge">${used ? "✓" : "1"}</span><span class="name">${esc(a.name)}</span><span class="short">${esc(a.short || "")}</span></summary>
      <div class="body">${nl(a.text)}<div class="row" style="margin-top:10px"><button class="sm" data-daily="${a.id}">${used ? "Geri al" : "Kullanıldı işaretle"}</button></div></div></details>`;
  }
  function restText(c, kind) {
    const r = c.resource, parts = [];
    if (r.kind === "omen") parts.push("boş slot kadar d20 at (11+ beyaz, 10- kırmızı) ve ekle");
    else if (r.kind === "count") parts.push(kind === "short" ? `+${r.shortRest} ${r.name}${r.shortOncePerDay ? " (günde 1)" : ""}` : `${r.name} = ${r.longRest}`);
    else if (r.kind === "souls") parts.push("Ruh değişmez");
    if (c.wildShape) parts.push("Wild Shape yenilenir");
    if (kind === "long") { if ((c.daily || []).length) parts.push("günlükler yenilenir"); if (c.portent) parts.push("2 yeni d20 at ve yaz"); parts.push("HP tam"); }
    return parts.join(" · ");
  }

  function renderResource(el, c, cs) {
    const r = c.resource, path = `chars/${c.id}`;
    let html = `<div class="row between"><h3 style="margin:0">${esc(r.name)}</h3><span class="muted small">${resCount(c, cs)} / ${r.max}</span></div>`;
    if (r.kind === "omen") {
      const om = cs.omens || [];
      html += `<div class="tokens">${om.map((t, i) => `<button class="tok ${t} filled" data-spend="${i}" title="harca">${t === "w" ? "☀" : "☾"}</button>`).join("")}${Array.from({ length: Math.max(0, r.max - om.length) }, () => `<span class="tok empty"></span>`).join("")}</div>
        <div class="row"><button class="sm" id="addw">+ Beyaz</button><button class="sm" id="addr">+ Kırmızı</button></div>
        <p class="hint">Fiziksel d20 at ve ekle. Token'a dokunursan yetenek seçmeden harcarsın.</p>
        <details style="margin-top:8px"><summary><span class="name">Kehanet nasıl çalışır</span></summary><div class="body">${nl(r.text)}</div></details>`;
    } else if (r.kind === "count") {
      html += `<div class="tokens">${Array.from({ length: r.max }, (_, i) => `<span class="tok ${i < cs.res ? "on filled" : "empty"}"></span>`).join("")}</div>
        <div class="row"><button class="sm" id="res-">−1</button><button class="sm" id="res+">+1</button></div>
        ${r.shortOncePerDay ? `<p class="hint">Short rest manası bugün ${cs.shortUsed ? "kullanıldı" : "hazır"}.</p>` : ""}<p class="hint">${nl(r.text)}</p>`;
    } else if (r.kind === "souls") {
      const tier = cs.res >= 3 ? "Tam karanlık peri · Intimidation avantaj · Persuasion ve Deception dezavantaj" : cs.res === 2 ? "Damarlar kararıyor · Intimidation avantaj · Persuasion dezavantaj" : cs.res === 1 ? "Gözlerde hafif gölge · etki yok" : "Olağan görünüm";
      html += `<div class="tokens">${Array.from({ length: r.max }, (_, i) => `<span class="tok ${i < cs.res ? "soul filled" : "empty"}">${i < cs.res ? "✦" : ""}</span>`).join("")}</div>
        <div class="row"><button class="sm" id="res+">+1 ruh (ölüm)</button><button class="sm" id="res-">−1 serbest bırak</button></div>
        <p class="hint" style="color:var(--text)"><b>Ruh Yükü:</b> ${tier}</p><p class="hint">${nl(r.text)}</p>`;
    }
    if (c.wildShape) {
      html += `<div class="sec"><div class="row between"><h3 style="margin:0">Wild Shape</h3><span class="muted small">${cs.ws} / ${c.wildShape.max}</span></div>
        <div class="row" style="margin-top:8px"><div class="tokens" style="margin:0">${Array.from({ length: c.wildShape.max }, (_, i) => `<span class="tok ${i < cs.ws ? "on" : "empty"}">${i < cs.ws ? "🐾" : ""}</span>`).join("")}</div>
        <button class="sm" id="ws-" ${cs.ws <= 0 ? "disabled" : ""}>Dönüş (−1)</button><button class="sm ghost" id="ws+" ${cs.ws >= c.wildShape.max ? "disabled" : ""}>+1</button></div>
        <details style="margin-top:10px"><summary><span class="name">Nasıl çalışır · boy şablonu</span></summary><div class="body">${nl(c.wildShape.text)}
          <table class="simple" style="margin-top:8px"><tr><th>Boy</th><th>Örnek</th><th>AC</th><th>HP</th><th>Saldırı</th></tr>${c.wildShape.table.map(rw => `<tr>${rw.map(x => `<td>${esc(x)}</td>`).join("")}</tr>`).join("")}</table>
          <p class="hint">DM her hayvana bir imza yeteneği ekler.</p></div></details></div>`;
    }
    if (c.portent) {
      const p = cs.portent || ["", ""];
      html += `<div class="sec"><h3>Yüzyılların Sezgisi</h3><p class="hint" style="margin:0 0 8px">Long rest sonrası 2 d20 at, buraya yaz. Birini kullanınca sil.</p>
        <div class="row"><input class="num" id="p0" data-sync="1" inputmode="numeric" value="${esc(p[0])}" placeholder="d20"><input class="num" id="p1" data-sync="1" inputmode="numeric" value="${esc(p[1])}" placeholder="d20"></div></div>`;
    }
    el.innerHTML = html;

    if (r.kind === "omen") {
      const om = cs.omens || [];
      el.querySelectorAll("[data-spend]").forEach(b => b.onclick = () => spendOmen(c, Number(b.dataset.spend)));
      const add = t => { if (om.length >= r.max) return toast("Kehanet dolu (5)."); store.set(`${path}/omens`, [...om, t]); render(); };
      document.getElementById("addw").onclick = () => add("w");
      document.getElementById("addr").onclick = () => add("r");
    } else {
      document.getElementById("res-").onclick = () => { if (cs.res <= 0) return; store.set(`${path}/res`, cs.res - 1); render(); };
      document.getElementById("res+").onclick = () => { if (cs.res >= r.max) return toast("Dolu."); store.set(`${path}/res`, cs.res + 1); render(); };
    }
    if (c.wildShape) {
      document.getElementById("ws-").onclick = () => { store.set(`${path}/ws`, Math.max(0, cs.ws - 1)); render(); };
      document.getElementById("ws+").onclick = () => { store.set(`${path}/ws`, Math.min(c.wildShape.max, cs.ws + 1)); render(); };
    }
    if (c.portent) {
      ["p0", "p1"].forEach((id, i) => { const inp = document.getElementById(id); inp.onchange = () => { const p = [...(cs.portent || ["", ""])]; p[i] = inp.value.trim(); store.set(`${path}/portent`, p); }; inp.onblur = () => { if (pendingRender) render(); }; });
    }
  }

  function bindPowerButtons(el, c, cs) {
    el.querySelectorAll("[data-usewrap]").forEach(w => {
      const i = Number(w.dataset.usewrap), a = c.powers[i];
      if (c.resource.kind === "omen") {
        const om = cs.omens || [], hasW = om.includes("w"), hasR = om.includes("r");
        w.innerHTML = `<button class="sm" data-use="${i}" data-tok="w" ${hasW ? "" : "disabled"}>☀ Beyaz harca</button><button class="sm" data-use="${i}" data-tok="r" ${hasR ? "" : "disabled"}>☾ Kırmızı harca</button>`;
      } else {
        w.innerHTML = `<button class="sm primary" data-use="${i}" ${resCount(c, cs) < a.cost ? "disabled" : ""}>Kullan (−${a.cost})</button>`;
      }
      w.querySelectorAll("[data-use]").forEach(b => b.onclick = () => usePower(c, i, b.dataset.tok));
    });
  }
  function spendOmen(c, idx, label) {
    const cs = state.chars[c.id], om = [...(cs.omens || [])];
    const t = om.splice(idx, 1)[0];
    store.set(`chars/${c.id}/omens`, om);
    toast((label ? label + " · " : "") + (t === "w" ? "Beyaz: bir yoldaşın bir sonraki d20'sine +1d4." : "Kırmızı: bir düşmanın bir sonraki d20'sinden -1d4."), 4500);
    render();
  }
  function usePower(c, i, tok) {
    const cs = state.chars[c.id], a = c.powers[i];
    if (c.resource.kind === "omen") {
      const idx = (cs.omens || []).indexOf(tok);
      if (idx < 0) return toast("O renkte kehanet yok.");
      return spendOmen(c, idx, a.name);
    }
    if (cs.res < a.cost) return toast("Yeterli kaynak yok.");
    store.set(`chars/${c.id}/res`, cs.res - a.cost);
    toast(`${a.name} kullanıldı (−${a.cost}).`); render();
  }
  function rest(c, kind) {
    const cs = state.chars[c.id], r = c.resource, path = `chars/${c.id}`, msgs = [];
    if (r.kind === "omen") {
      const empty = r.max - (cs.omens || []).length;
      msgs.push(empty > 0 ? `${empty} d20 at: 11+ beyaz, 10- kırmızı, sonra + düğmeleriyle ekle` : "kehanet zaten dolu");
    } else if (r.kind === "count") {
      if (kind === "short") {
        if (r.shortOncePerDay && cs.shortUsed) msgs.push(`${r.name}: bugünkü short rest hakkı kullanılmış`);
        else { store.set(`${path}/res`, Math.min(r.max, cs.res + r.shortRest)); if (r.shortOncePerDay) store.set(`${path}/shortUsed`, true); msgs.push(`+${r.shortRest} ${r.name}`); }
      } else { store.set(`${path}/res`, r.longRest); if (r.shortOncePerDay) store.set(`${path}/shortUsed`, false); msgs.push(`${r.name} = ${r.longRest}`); }
    }
    if (c.wildShape) { store.set(`${path}/ws`, c.wildShape.max); msgs.push("Wild Shape yenilendi"); }
    if (kind === "long") {
      for (const d of c.daily || []) store.set(`${path}/daily/${d.id}`, false);
      if (c.portent) { store.set(`${path}/portent`, ["", ""]); msgs.push("2 yeni d20 at ve yaz"); }
      store.set(`${path}/hp`, c.hpMax); msgs.push("HP tam");
    }
    toast((kind === "short" ? "Short rest: " : "Long rest: ") + msgs.join(" · "), 5000);
    render();
  }

  store = window.FIREBASE_CONFIG && window.firebase ? makeFirebaseStore() : makeLocalStore();
  store.init(() => { render(); checkTime(); });
})();
