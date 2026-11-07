"use strict";

const state = {
  category: "All",
  query: "",
  location: "all",
  date: "",
  sort: "date-asc",
  faved: [],
  registrations: [],
  auth: null,
  section: "events",
};

const DAY_MS = 86400000;
const CITIES = [
  "Los Angeles, CA", "San Francisco, CA", "Austin, TX", "New York, NY", "Denver, CO",
  "Seattle, WA", "Boston, MA", "Nashville, TN", "Aspen, CO",
];

const CATEGORY_EMOJI = {
  "All": "✨",
  "Music & Concerts": "🎵",
  "Tech & Startups": "🤖",
  "Food & Drink": "🍜",
  "Arts & Culture": "🎨",
  "Wellness": "🧘",
  "Sports": "⚽",
  "Business": "🌱",
  "Travel": "🏔️",
  "Drama": "🎭",
  "Comedy": "🎤",
};

const EVENTS_RAW = [
  { id: 1, title: "Neon Nights: Synthwave Live", category: "Music & Concerts", dayOffset: 14, time: "8:30 PM", venue: "The Echo", city: "Los Angeles, CA", price: 45, emoji: "🎹", g1: "#8fae91", g2: "#164c32", host: "Pulsewave", attendees: 182, capacity: 500, featured: true, tags: ["Synthwave", "Live Electronic", "Afterparty"] },
  { id: 2, title: "DevFest AI & Cloud", category: "Tech & Startups", dayOffset: 28, time: "9:00 AM", venue: "Moscone Center", city: "San Francisco, CA", price: 99, emoji: "🤖", g1: "#c4e2c5", g2: "#164c32", host: "DevFest", attendees: 342, capacity: 800, featured: true, tags: ["AI", "Cloud", "Engineering", "Conference"] },
  { id: 3, title: "Midnight Street Food Market", category: "Food & Drink", dayOffset: 7, time: "6:00 PM", venue: "Hustle Park", city: "Austin, TX", price: 0, emoji: "🍜", g1: "#b9cba9", g2: "#6e8f6e", host: "Hustle Society", attendees: 540, capacity: 1000, featured: false, tags: ["Street Food", "Night Market", "Foodie"] },
  { id: 4, title: "Canvas & Cabernet: Art Night", category: "Arts & Culture", dayOffset: 36, time: "7:00 PM", venue: "The Loft", city: "New York, NY", price: 30, emoji: "🎨", g1: "#8fae91", g2: "#3f6b4f", host: "Loft Art", attendees: 96, capacity: 120, featured: false, tags: ["Painting", "Wine", "Creative"] },
  { id: 5, title: "Sunrise Sound Bath & Yoga", category: "Wellness", dayOffset: 22, time: "7:00 AM", venue: "Mount Tabor Park", city: "Denver, CO", price: 0, emoji: "🧘", g1: "#a5c9a8", g2: "#4e6e57", host: "Stillpoint", attendees: 74, capacity: 150, featured: false, tags: ["Yoga", "Sound Bath", "Meditation"] },
  { id: 6, title: "City Derby Finals", category: "Sports", dayOffset: 42, time: "7:30 PM", venue: "Lumen Field", city: "Seattle, WA", price: 25, emoji: "⚽", g1: "#6e8f6e", g2: "#2f5d3a", host: "Metro FC", attendees: 2100, capacity: 4500, featured: false, tags: ["Football", "Championship", "Live"] },
  { id: 7, title: "Founders Mixer: Climate Tech", category: "Business", dayOffset: 69, time: "6:00 PM", venue: "The Battery", city: "Boston, MA", price: 40, emoji: "🌱", g1: "#8fae91", g2: "#164c32", host: "Climate Founders", attendees: 58, capacity: 100, featured: false, tags: ["Networking", "Climate", "Startups"] },
  { id: 8, title: "Alpine Lights: Winter Trek", category: "Travel", dayOffset: 90, time: "8:00 AM", venue: "Summit Base Camp", city: "Aspen, CO", price: 120, emoji: "🏔️", g1: "#9db89e", g2: "#2e5e43", host: "Summit Collective", attendees: 32, capacity: 60, featured: false, tags: ["Hiking", "Winter", "Adventure"] },
  { id: 9, title: "Hamlet — Shakespeare in the Park", category: "Drama", dayOffset: 24, time: "7:00 PM", venue: "Central Park Amphitheatre", city: "New York, NY", price: 35, emoji: "🎭", g1: "#8fae91", g2: "#4a6b58", host: "Park Players", attendees: 210, capacity: 400, featured: false, tags: ["Theatre", "Drama", "Classic"] },
  { id: 10, title: "Hack the Planet: AI for Good Hackathon", category: "Tech & Startups", dayOffset: 52, time: "9:00 AM", venue: "Innovation Hub", city: "San Francisco, CA", price: 50, emoji: "🤝", g1: "#c4e2c5", g2: "#164c32", host: "Hackathon Alliance", attendees: 480, capacity: 1000, featured: true, tags: ["Hackathon", "AI", "Open Source"] },
  { id: 11, title: "Stand-Up Comedy: Laugh Riot", category: "Comedy", dayOffset: 17, time: "8:00 PM", venue: "The Basement", city: "Los Angeles, CA", price: 25, emoji: "🎤", g1: "#b3c7b0", g2: "#5c7a5e", host: "Laugh Riot", attendees: 150, capacity: 300, featured: false, tags: ["Comedy", "Live", "Stand-Up"] },
  { id: 12, title: "Indie Waves: Folk & Acoustic Concert", category: "Music & Concerts", dayOffset: 38, time: "7:30 PM", venue: "The Bluebird Hall", city: "Nashville, TN", price: 40, emoji: "🎸", g1: "#a5c9a8", g2: "#3e6b4e", host: "Indie Waves", attendees: 260, capacity: 350, featured: false, tags: ["Folk", "Acoustic", "Concert"] },
];

const events = EVENTS_RAW.map((e) => ({ ...e, isoDate: isoFromNow(e.dayOffset) }));

const EVENT_IMAGES = {
  1: "assets/img/photo-1470229722913-7c0e2dbbafd3.jpg",
  2: "assets/img/photo-1545454675-3531b543be5d.jpg",
  3: "assets/img/photo-1506929562872-bb421503ef21.jpg",
  4: "assets/img/photo-1514320291840-2e0a9bf2a9ae.jpg",
  5: "assets/img/photo-1493225457124-a3eb161ffa5f.jpg",
  6: "assets/img/photo-1470229722913-7c0e2dbbafd3.jpg",
  7: "assets/img/photo-1545454675-3531b543be5d.jpg",
  8: "assets/img/photo-1514320291840-2e0a9bf2a9ae.jpg",
  9: "assets/img/photo-1493225457124-a3eb161ffa5f.jpg",
  10: "assets/img/photo-1506929562872-bb421503ef21.jpg",
  11: "assets/img/photo-1470229722913-7c0e2dbbafd3.jpg",
  12: "assets/img/photo-1493225457124-a3eb161ffa5f.jpg",
};

function isoFromNow(days) {
  const d = new Date(Date.now() + days * DAY_MS);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function fmtLong(iso) {
  return parseDate(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function fmtDateBadge(iso) {
  return parseDate(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

function fmtTime(t) {
  const [timeStr, meridiem] = t.split(" ");
  const [h, m] = timeStr.split(":").map(Number);
  let hh = h;
  if (/pm/i.test(meridiem) && hh < 12) hh += 12;
  const hr12 = hh % 12 === 0 ? 12 : hh % 12;
  const ampm = /pm/i.test(meridiem) ? "PM" : "AM";
  return `${hr12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function countdownTarget(e) {
  const [timeStr, meridiem] = e.time.split(" ");
  const [h, m] = timeStr.split(":").map(Number);
  let hh = h;
  if (/pm/i.test(meridiem) && hh < 12) hh += 12;
  const [y, mo, d] = e.isoDate.split("-").map(Number);
  return new Date(y, mo - 1, d, hh, m, 0, 0);
}

/* ================= DOM refs ================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const el = {
  header: $("#siteHeader"),
  navToggle: $("#navToggle"),
  nav: $("#primaryNav"),
  themeToggle: $("#themeToggle"),
  navLocation: $("#navLocation"),
  navSearchBtn: $("#navSearchBtn"),
  navSignInBtn: $("#navSignInBtn"),
  themeRoot: document.documentElement,
  hero: $("#home"),
  heroPhoto: $("#heroPhoto"),
  heroSearch: $("#heroSearch"),
  heroSearchName: $("#heroSearchName"),
  heroSearchCategory: $("#heroSearchCategory"),
  heroSearchLocation: $("#heroSearchLocation"),
  heroSearchDate: $("#heroSearchDate"),
  heroSearchBtn: $("#heroSearchBtn"),
  trendingTags: $("#trendingTags"),
  categoryTrack: $("#categoryTrack"),
  trending: $("#trending"),
  trendingGrid: $("#trendingGrid"),
  eventsGrid: $("#eventsGrid"),
  eventsEmpty: $("#eventsEmpty"),
  eventsCount: $("#eventsCount"),
  sortSelect: $("#sortSelect"),
  eventCategoryChips: $("#eventCategoryChips"),
  about: $("#about"),
  siteFooter: $("#siteFooter"),
  newsletterForm: $("#newsletterForm"),
  newsletterEmail: $("#newsletterEmail"),
  footerYear: $("#footerYear"),
  eventModal: $("#eventModal"),
  modalClose: $("#modalClose"),
  modalMedia: $("#modalMedia"),
  modalEmoji: $("#modalEmoji"),
  modalCat: $("#modalCat"),
  modalDateBadge: $("#modalDateBadge"),
  modalTitle: $("#modalTitle"),
  modalDate: $("#modalDate"),
  modalTime: $("#modalTime"),
  modalVenue: $("#modalVenue"),
  modalCity: $("#modalCity"),
  modalPrice: $("#modalPrice"),
  modalHost: $("#modalHost"),
  modalAttendees: $("#modalAttendees"),
  modalDesc: $("#modalDesc"),
  modalTags: $("#modalTags"),
  countdown: $("#countdown"),
  countdownValue: $("#countdownValue"),
  regForm: $("#regForm"),
  regName: $("#regName"),
  regEmail: $("#regEmail"),
  regPhone: $("#regPhone"),
  regEvent: $("#regEvent"),
  errName: $("#errName"),
  errEmail: $("#errEmail"),
  errPhone: $("#errPhone"),
  errEvent: $("#errEvent"),
  regSubmit: $("#regSubmit"),
  regSuccess: $("#regSuccess"),
  regSuccessText: $("#regSuccessText"),
  regSuccessDetails: $("#regSuccessDetails"),
  regDoneBtn: $("#regDoneBtn"),
  authModal: $("#authModal"),
  authClose: $("#authClose"),
  authForm: $("#authForm"),
  authEmail: $("#authEmail"),
  authPassword: $("#authPassword"),
  authErrEmail: $("#authErrEmail"),
  authErrPassword: $("#authErrPassword"),
  authSubmit: $("#authSubmit"),
  authSuccess: $("#authSuccess"),
  authSuccessText: $("#authSuccessText"),
  authDoneBtn: $("#authDoneBtn"),
  toast: $("#toast"),
};

/* ================= Theme ================= */
function applyTheme(theme) {
  state.theme = theme;
  el.themeRoot.setAttribute("data-theme", theme);
  try { localStorage.setItem("kexplore_theme", theme); } catch (e) {}
}

function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem("kexplore_theme"); } catch (e) {}
  applyTheme(saved === "dark" ? "dark" : "light");
}

/* ================= Toast ================= */
let toastTimer = null;
function showToast(message) {
  el.toast.textContent = message;
  el.toast.hidden = false;
  el.toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.toast.classList.remove("is-visible"); setTimeout(() => { el.toast.hidden = true; }, 350); }, 3200);
}

/* ================= Categories ================= */
function categories() {
  const names = ["All", ...Array.from(new Set(events.map((e) => e.category)))];
  const counts = {};
  events.forEach((e) => { counts[e.category] = (counts[e.category] || 0) + 1; });
  return names.map((n) => ({ name: n, count: n === "All" ? events.length : counts[n] || 0 }));
}

function renderCategories() {
  const cats = categories();
  el.categoryTrack.innerHTML = cats.map((c) => `
    <button class="category-card reveal${c.name === state.category ? " is-active" : ""}" type="button" data-category="${c.name}">
      <span class="category-icon" aria-hidden="true">${CATEGORY_EMOJI[c.name] || "🗓️"}</span>
      <span class="category-text"><h3>${c.name}</h3><p>${c.count} event${c.count === 1 ? "" : "s"}</p></span>
    </button>`).join("");
  el.categoryTrack.querySelectorAll(".category-card").forEach((btn) => {
    btn.addEventListener("click", () => { state.category = btn.dataset.category; state.section = "events"; renderAll(); scrollToEvents(); });
  });
}

function renderChips() {
  const cats = categories();
  el.eventCategoryChips.innerHTML = cats.map((c) => `
    <button class="chip${c.name === state.category ? " chip-active" : ""}" type="button" data-category="${c.name}">${c.name}</button>`).join("");
  el.eventCategoryChips.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => { state.category = chip.dataset.category; state.section = "events"; renderAll(); scrollToEvents(); });
  });
}

/* ================= Events rendering ================= */
function renderEventsSkeleton() {
  const cards = Array.from({ length: 6 }, () => `
    <div class="skeleton-card reveal" aria-hidden="true">
      <div class="skeleton-media"></div>
      <div class="skeleton-body">
        <div class="skeleton-line" style="width:45%;height:12px"></div>
        <div class="skeleton-line" style="width:85%;height:16px"></div>
        <div class="skeleton-line" style="width:65%;height:12px"></div>
        <div class="skeleton-line" style="width:40%;height:12px"></div>
      </div>
    </div>`).join("");
  const target = state.section === "trending" ? el.trendingGrid : el.eventsGrid;
  target.innerHTML = cards;
  el.eventsEmpty.hidden = true;
  el.eventsCount.textContent = "Loading…";
}

function getFiltered() {
  let list = events.filter((e) => state.category === "All" || e.category === state.category);
  if (state.location && state.location !== "all") list = list.filter((e) => e.city === state.location);
  if (state.date) list = list.filter((e) => e.isoDate.slice(0, 10) === state.date);
  if (state.query) {
    const q = state.query.trim().toLowerCase();
    list = list.filter((e) => [e.title, e.venue, e.city, e.category, e.host, e.tags.join(" ")].join(" ").toLowerCase().includes(q));
  }
  const sorted = [...list];
  if (state.sort === "date-asc") sorted.sort((a, b) => a.isoDate.localeCompare(b.isoDate));
  else if (state.sort === "date-desc") sorted.sort((a, b) => b.isoDate.localeCompare(a.isoDate));
  else sorted.sort((a, b) => b.attendees - a.attendees);
  return sorted;
}

function eventCard(e, dark) {
  const d = new Date(e.isoDate + "T00:00:00");
  const badge = d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
  const priceLabel = e.price > 0 ? `$${e.price}` : "Free";
  const desc = e.desc || "A hand-curated experience not to be missed.";
  const isFaved = state.faved.includes(String(e.id));
  const img = EVENT_IMAGES[e.id] || "";
  const bgImage = img ? `url('${img}'), linear-gradient(140deg, ${e.g1}, ${e.g2})` : `linear-gradient(140deg, ${e.g1}, ${e.g2})`;
  return `
    <article class="event-card${dark ? " trending-card" : ""}" data-id="${e.id}">
      <div class="event-media" style="--g1:${e.g1}; --g2:${e.g2}; background-image: ${bgImage}; background-size: cover; background-position: center;">
        <span class="event-emoji" aria-hidden="true">${e.emoji}</span>
        <span class="event-cat">${e.category}</span>
        <span class="event-date-badge">${badge}</span>
      </div>
      <div class="event-body">
        <h3>${e.title}</h3>
        <p class="event-meta"><span aria-hidden="true">📍</span> ${e.venue} · ${e.city}</p>
        <p class="event-desc">${desc}</p>
        <div class="event-foot">
          <span class="event-price">${priceLabel}</span>
          <span class="event-attendees">${e.attendees} attending</span>
          <button class="bookmark-btn${isFaved ? " is-faved" : ""}" type="button" data-bookmark="${e.id}" aria-label="${isFaved ? "Remove from favourites" : "Save to favourites"}">${isFaved ? "❤️" : "🤍"}</button>
          <button class="btn btn-ghost btn-sm" type="button" data-open="${e.id}">Details</button>
        </div>
      </div>
    </article>`;
}

function renderEvents() {
  const list = getFiltered();
  const isTrending = state.section === "trending";
  const target = isTrending ? el.trendingGrid : el.eventsGrid;
  const source = isTrending ? list.filter((e) => e.featured) : list;
  if (source.length === 0) {
    target.innerHTML = "";
    el.eventsEmpty.hidden = true;
    el.eventsCount.textContent = "0 events";
    return;
  }
  target.innerHTML = source.map((e) => eventCard(e, isTrending)).join("");
  el.eventsCount.textContent = `Showing ${source.length} of ${events.length} events`;
}

function renderAll() {
  renderEvents();
  updateChipsState();
}

function updateChipsState() {
  $$(".chip").forEach((chip) => chip.classList.toggle("chip-active", chip.dataset.category === state.category));
}

function scrollToEvents() { document.querySelector("#events")?.scrollIntoView({ behavior: "smooth", block: "start" }); }

function setCategoryAndRender(cat) {
  state.category = cat;
  state.section = "events";
  renderAll();
  scrollToEvents();
}

/* ================= Favourites ================= */
function initBookmarks() {
  document.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-bookmark]");
    if (!btn) return;
    const id = btn.dataset.bookmark;
    const idx = state.faved.indexOf(String(id));
    if (idx >= 0) { state.faved.splice(idx, 1); btn.classList.remove("is-faved"); btn.innerHTML = "🤍"; }
    else { state.faved.push(String(id)); btn.classList.add("is-faved"); btn.innerHTML = "❤️"; }
    try { localStorage.setItem("kexplore_favs", JSON.stringify(state.faved)); } catch (e) {}
    showToast(state.faved.includes(String(id)) ? "Saved to your favourites ❤️" : "Removed from favourites");
  });
}

/* ================= Event modal ================= */
let currentEvent = null;
let countdownTimer = null;

function openModal(id) {
  const e = events.find((x) => x.id === id);
  if (!e) return;
  state.section = "events";
  currentEvent = e;
  el.modalMedia.style.setProperty("--g1", e.g1);
  el.modalMedia.style.setProperty("--g2", e.g2);
  const modalImg = EVENT_IMAGES[e.id] || "";
  el.modalMedia.style.backgroundImage = modalImg ? `url('${modalImg}'), linear-gradient(140deg, ${e.g1}, ${e.g2})` : `linear-gradient(140deg, ${e.g1}, ${e.g2})`;
  el.modalMedia.style.backgroundSize = "cover";
  el.modalMedia.style.backgroundPosition = "center";
  el.modalEmoji.textContent = e.emoji;
  el.modalCat.textContent = e.category;
  el.modalDateBadge.textContent = fmtDateBadge(e.isoDate);
  el.modalTitle.textContent = e.title;
  el.modalDate.textContent = fmtLong(e.isoDate);
  el.modalTime.textContent = fmtTime(e.time);
  el.modalVenue.textContent = e.venue;
  el.modalCity.textContent = e.city;
  el.modalPrice.textContent = e.price > 0 ? `$${e.price}` : "Free";
  el.modalHost.textContent = e.host;
  el.modalAttendees.textContent = String(e.attendees);
  el.modalDesc.textContent = e.desc;
  el.modalTags.innerHTML = e.tags.map((t) => `<span class="tag">${t}</span>`).join("");
  el.regSuccess.hidden = true;
  el.regForm.reset();
  clearErrors();
  el.regEvent.innerHTML = events.map((x) => `<option value="${x.id}" ${x.id === e.id ? "selected" : ""}>${x.title}</option>`).join("");
  el.regEvent.value = String(e.id);
  startCountdown(e);
  document.body.style.overflow = "hidden";
  el.eventModal.hidden = false;
  requestAnimationFrame(() => el.eventModal.classList.add("is-open"));
}

function closeModal() {
  document.body.style.overflow = "";
  el.eventModal.classList.remove("is-open");
  setTimeout(() => { el.eventModal.hidden = true; }, 250);
}

function startCountdown(e) {
  const target = countdownTarget(e);
  const render = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) { el.countdownValue.textContent = "Happening now"; return; }
    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    el.countdownValue.textContent = d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${sec}s`;
  };
  render();
  clearInterval(countdownTimer);
  countdownTimer = setInterval(render, 1000);
}

function clearErrors() {
  [el.errName, el.errEmail, el.errPhone, el.errEvent].forEach((e) => (e.textContent = ""));
}

function validateReg() {
  let ok = true;
  const name = el.regName.value.trim();
  if (name.length < 2) { el.errName.textContent = "Please enter your full name."; ok = false; }
  const email = el.regEmail.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { el.errEmail.textContent = "Please enter a valid email address."; ok = false; }
  const phone = el.regPhone.value.trim();
  if (!/^\+?[0-9][0-9\s\-()]{8,19}$/.test(phone)) { el.errPhone.textContent = "Please enter a valid phone number."; ok = false; }
  const eventId = Number(el.regEvent.value);
  if (!eventId) { el.errEvent.textContent = "Please choose an event."; ok = false; }
  return ok;
}

function submitRegistration(ev) {
  ev.preventDefault();
  if (!validateReg()) return;
  const data = {
    eventId: Number(el.regEvent.value),
    eventTitle: currentEvent ? currentEvent.title : "Event",
    name: el.regName.value.trim(),
    email: el.regEmail.value.trim(),
    phone: el.regPhone.value.trim(),
    date: currentEvent ? currentEvent.isoDate : "",
    time: currentEvent ? currentEvent.time : "",
    code: "KX-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
  };
  try { localStorage.setItem("kexplore_registrations", JSON.stringify([...state.registrations, data])); } catch (e) {}
  const rows = [
    ["Event", data.eventTitle],
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Date", data.date ? fmtLong(data.date) : ""],
    ["Time", data.time ? fmtTime(data.time) : ""],
    ["Confirmation", data.code],
  ];
  el.regSuccessDetails.innerHTML = rows.map(([k, v]) => `<div class="reg-success-row"><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  el.regSuccessText.textContent = `Ticket ${data.code} reserved for ${data.name}. Check your inbox at ${data.email}.`;
  el.regSuccess.hidden = false;
  el.regForm.hidden = true;
  showToast(`🎟️ Registration ${data.code} confirmed!`);
}

/* ================= Auth (mock) ================= */
function openAuthModal() {
  state.auth = "open";
  el.authForm.reset();
  clearAuthErrors();
  el.authSuccess.hidden = true;
  document.body.style.overflow = "hidden";
  el.authModal.hidden = false;
  requestAnimationFrame(() => el.authModal.classList.add("is-open"));
}
function closeAuthModal() {
  state.auth = null;
  document.body.style.overflow = "";
  el.authModal.classList.remove("is-open");
  setTimeout(() => { el.authModal.hidden = true; }, 250);
}
function clearAuthErrors() { el.authErrEmail.textContent = ""; el.authErrPassword.textContent = ""; }
function validateAuth() {
  let ok = true;
  const email = el.authEmail.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { el.authErrEmail.textContent = "Please enter a valid email address."; ok = false; }
  const pw = el.authPassword.value;
  if (pw.length < 4) { el.authErrPassword.textContent = "Password must be at least 4 characters."; ok = false; }
  return ok;
}
function submitAuth(ev) {
  ev.preventDefault();
  if (!validateAuth()) return;
  state.auth = { email: el.authEmail.value.trim(), at: new Date().toISOString() };
  try { localStorage.setItem("kexplore_auth", JSON.stringify(state.auth)); } catch (e) {}
  el.authSuccess.hidden = false;
  el.authForm.hidden = true;
  showToast("Signed in successfully ✅");
}

/* ================= Modal wiring ================= */
function initModal() {
  el.modalClose.addEventListener("click", closeModal);
  el.eventModal.addEventListener("click", (ev) => { if (ev.target === el.eventModal) closeModal(); });
  document.addEventListener("keydown", (ev) => { if (ev.key === "Escape") { if (state.auth === "open") closeAuthModal(); else closeModal(); } });
  el.regForm.addEventListener("submit", submitRegistration);
  el.regDoneBtn.addEventListener("click", closeModal);

  el.authClose.addEventListener("click", closeAuthModal);
  el.authModal.addEventListener("click", (ev) => { if (ev.target === el.authModal) closeAuthModal(); });
  el.authForm.addEventListener("submit", submitAuth);
  el.authDoneBtn.addEventListener("click", closeAuthModal);
}

/* ================= Header / nav ================= */
function initHeader() {
  const toggle = el.navToggle;
  const nav = el.nav;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll(".nav-link").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
  el.themeToggle.addEventListener("click", () => applyTheme(state.theme === "light" ? "dark" : "light"));
  el.navLocation.addEventListener("change", (ev) => { state.location = ev.target.value; state.section = "events"; renderAll(); scrollToEvents(); });
  el.navSearchBtn.addEventListener("click", () => el.heroSearchName.focus());
  el.navSignInBtn.addEventListener("click", openAuthModal);
  const onScroll = () => el.header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ================= Reveal on scroll ================= */
let revealIO = null;
function initReveal() {
  if (revealIO) revealIO.disconnect();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  revealIO = io;
  document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
}

/* ================= Hero search ================= */
function initHero() {
  el.heroSearch.addEventListener("submit", (ev) => {
    ev.preventDefault();
    state.category = el.heroSearchCategory.value || "All";
    state.location = el.heroSearchLocation.value || "all";
    state.date = el.heroSearchDate.value || "";
    state.query = el.heroSearchName.value.trim();
    state.section = "events";
    renderAll();
    scrollToEvents();
  });
  if (el.trendingTags) {
    el.trendingTags.querySelectorAll(".trending-tag").forEach((tag) => {
      tag.addEventListener("click", () => { state.category = tag.dataset.category; state.section = "events"; renderAll(); scrollToEvents(); });
    });
  }
}

/* ================= Newsletter ================= */
function initNewsletter() {
  el.newsletterForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const email = el.newsletterEmail.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast("Please enter a valid email address."); return; }
    el.newsletterForm.reset();
    showToast("🎉 You're on the list! Event drops coming your way.");
  });
}

/* ================= Init ================= */
function init() {
  initTheme();
  initHeader();
  initReveal();
  initBookmarks();
  initHero();
  initModal();
  initNewsletter();

  try { el.footerYear.textContent = String(new Date().getFullYear()); } catch (e) {}

  el.heroPhoto.style.backgroundImage = "url('assets/img/1506929562872-bb421503ef21.jpg'), linear-gradient(150deg, #8fae91, #164c32)";
  el.heroPhoto.style.backgroundSize = "cover";
  el.heroPhoto.style.backgroundPosition = "center";

  renderCategories();
  renderChips();
  renderEventsSkeleton();
  setTimeout(() => { renderEvents(); initReveal(); }, 650);
}

document.addEventListener("DOMContentLoaded", init);
