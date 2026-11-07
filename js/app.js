"use strict";

/* ================= State ================= */
const state = {
  category: "All",
  query: "",
  sort: "date-asc",
  registrations: [],
};

let revealIO = null;

const DAY_MS = 86400000;

const EVENTS_RAW = [
  { id: 1, title: "Neon Nights: Synthwave Live", category: "Music", dayOffset: 14, time: "8:30 PM", venue: "The Echo", city: "Los Angeles, CA", price: 45, emoji: "🎹", g1: "#7c3aed", g2: "#f4511e", host: "Pulsewave", attendees: 182, capacity: 500, featured: true, tags: ["Synthwave", "Live Electronic", "Afterparty"] },
  { id: 2, title: "DevFest AI & Cloud", category: "Tech", dayOffset: 28, time: "9:00 AM", venue: "Moscone Center", city: "San Francisco, CA", price: 99, emoji: "🤖", g1: "#4f46e5", g2: "#06b6d4", host: "DevFest", attendees: 342, capacity: 800, featured: true, tags: ["AI", "Cloud", "Engineering", "Conference"] },
  { id: 3, title: "Midnight Street Food Market", category: "Food & Drink", dayOffset: 7, time: "6:00 PM", venue: "Hustle Park", city: "Austin, TX", price: 0, emoji: "🍜", g1: "#f59e0b", g2: "#ef4444", host: "Hustle Society", attendees: 540, capacity: 1000, featured: false, tags: ["Street Food", "Night Market", "Foodie"] },
  { id: 4, title: "Canvas & Cabernet: Art Night", category: "Arts", dayOffset: 36, time: "7:00 PM", venue: "The Loft", city: "New York, NY", price: 30, emoji: "🎨", g1: "#ec4899", g2: "#8b5cf6", host: "Loft Art", attendees: 96, capacity: 120, featured: false, tags: ["Painting", "Wine", "Creative"] },
  { id: 5, title: "Sunrise Sound Bath & Yoga", category: "Wellness", dayOffset: 22, time: "7:00 AM", venue: "Mount Tabor Park", city: "Denver, CO", price: 0, emoji: "🧘", g1: "#06b6d4", g2: "#3b82f6", host: "Stillpoint", attendees: 74, capacity: 150, featured: false, tags: ["Yoga", "Sound Bath", "Meditation"] },
  { id: 6, title: "City Derby Finals", category: "Sports", dayOffset: 42, time: "7:30 PM", venue: "Lumen Field", city: "Seattle, WA", price: 25, emoji: "⚽", g1: "#ef4444", g2: "#f97316", host: "Metro FC", attendees: 2100, capacity: 4500, featured: false, tags: ["Football", "Championship", "Live"] },
  { id: 7, title: "Founders Mixer: Climate Tech", category: "Business", dayOffset: 69, time: "6:00 PM", venue: "The Battery", city: "Boston, MA", price: 40, emoji: "🌱", g1: "#10b981", g2: "#14b8a6", host: "Climate Founders", attendees: 58, capacity: 100, featured: false, tags: ["Networking", "Climate", "Startups"] },
  { id: 8, title: "Alpine Lights: Winter Trek", category: "Travel", dayOffset: 90, time: "8:00 AM", venue: "Summit Base Camp", city: "Aspen, CO", price: 120, emoji: "🏔️", g1: "#0ea5e9", g2: "#6366f1", host: "Summit Collective", attendees: 32, capacity: 60, featured: false, tags: ["Hiking", "Winter", "Adventure"] },
];

const events = EVENTS_RAW.map((e) => ({ ...e, isoDate: isoFromNow(e.dayOffset) }));

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
  const [hRaw, mRaw] = t.split(" ");
  let h = parseInt(hRaw, 10);
  const m = parseInt(mRaw, 10);
  const ampm = /pm/i.test(mRaw) ? "PM" : "AM";
  const hr24 = ampm === "PM" && h < 12 ? h + 12 : h;
  const hr12 = hr24 % 12 === 0 ? 12 : hr24 % 12;
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

function pluralize(n, word, plural) { return n === 1 ? word : plural; }

/* ================= DOM refs ================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const el = {
  header: $("#siteHeader"),
  navToggle: $("#navToggle"),
  nav: $("#primaryNav"),
  themeToggle: $("#themeToggle"),
  themeRoot: document.documentElement,
  heroSearch: $("#heroSearch"),
  heroSearchInput: $("#heroSearchInput"),
  eventsGrid: $("#eventsGrid"),
  eventsEmpty: $("#eventsEmpty"),
  eventsCount: $("#eventsCount"),
  sortSelect: $("#sortSelect"),
  categoryGrid: $("#categoryGrid"),
  eventCategoryChips: $("#eventCategoryChips"),
  eventModal: $("#eventModal"),
  modalClose: $("#modalClose"),
  modalMedia: $("#modalMedia"),
  modalEmoji: $("#modalEmoji"),
  modalCat: $("#modalCat"),
  modalDateBadge: $("#modalDateBadge"),
  modalTitle: $("#modalTitle"),
  modalMeta: $("#modalMeta"),
  modalDate: $("#modalDate"),
  modalTime: $("#modalTime"),
  modalVenue: $("#modalVenue"),
  modalCity: $("#modalCity"),
  modalPrice: $("#modalPrice"),
  modalHost: $("#modalHost"),
  modalAttendees: $("#modalAttendees"),
  modalDesc: $("#modalDesc"),
  modalTags: $("#modalTags"),
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
  toast: $("#toast"),
  newsletterForm: $("#newsletterForm"),
  newsletterEmail: $("#newsletterEmail"),
  footerYear: $("#footerYear"),
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
  applyTheme(saved === "light" ? "light" : "dark");
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
  el.categoryGrid.innerHTML = cats.map((c) => `
    <button class="category-card reveal" type="button" data-category="${c.name}">
      <span class="category-icon" aria-hidden="true">${c.name === "All" ? "✨" : (categoryEmoji(c.name))}</span>
      <span><h3>${c.name}</h3><p>${c.count} event${c.count === 1 ? "" : "s"}</p></span>
    </button>`).join("");
  el.categoryGrid.querySelectorAll(".category-card").forEach((btn) => {
    btn.addEventListener("click", () => { state.category = btn.dataset.category; setCategoryAndRender(btn.dataset.category); });
  });
}

function categoryEmoji(cat) {
  const map = { Music: "🎵", Tech: "🤖", "Food & Drink": "🍜", Arts: "🎨", Wellness: "🧘", Sports: "⚽", Business: "🌱", Travel: "🏔️" };
  return map[cat] || "🗓️";
}

function renderChips() {
  const cats = categories();
  el.eventCategoryChips.innerHTML = cats.map((c) => `
    <button class="chip${c.name === state.category ? " chip-active" : ""}" type="button" data-category="${c.name}">${c.name}</button>`).join("");
  el.eventCategoryChips.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => { state.category = chip.dataset.category; renderAll(); scrollToEvents(); });
  });
}

/* ================= Events render ================= */
function getFiltered() {
  let list = events.filter((e) => state.category === "All" || e.category === state.category);
  if (state.query) {
    const q = state.query.trim().toLowerCase();
    list = list.filter((e) => [e.title, e.venue, e.city, e.category, e.host, e.desc, e.tags.join(" ")].join(" ").toLowerCase().includes(q));
  }
  const sorted = [...list];
  if (state.sort === "date-asc") sorted.sort((a, b) => a.isoDate.localeCompare(b.isoDate));
  else if (state.sort === "date-desc") sorted.sort((a, b) => b.isoDate.localeCompare(a.isoDate));
  else sorted.sort((a, b) => b.attendees - a.attendees);
  return sorted;
}

function eventCard(e) {
  const d = new Date(e.isoDate + "T00:00:00");
  const dateLabel = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const badge = d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
  const priceLabel = e.price > 0 ? `$${e.price}` : "Free";
  const desc = e.desc || "A hand-curated experience not to be missed.";
  return `
    <article class="event-card reveal" data-id="${e.id}">
      <div class="event-media" style="--g1:${e.g1}; --g2:${e.g2}">
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
          <button class="btn btn-ghost btn-sm" type="button" data-open="${e.id}">Details</button>
        </div>
      </div>
    </article>`;
}

function renderEvents() {
  const list = getFiltered();
  if (list.length === 0) {
    el.eventsGrid.innerHTML = "";
    el.eventsEmpty.hidden = false;
    el.eventsCount.textContent = "0 events";
    return;
  }
  el.eventsEmpty.hidden = true;
  el.eventsGrid.innerHTML = list.map(eventCard).join("");
  el.eventsCount.textContent = `Showing ${list.length} of ${events.length} events`;
}

function renderEventsSkeleton() {
  const cards = Array.from({ length: 6 }, (_, i) => `
    <div class="skeleton-card reveal" aria-hidden="true">
      <div class="skeleton-media"></div>
      <div class="skeleton-body">
        <div class="skeleton-line" style="width:45%;height:12px"></div>
        <div class="skeleton-line" style="width:85%;height:16px"></div>
        <div class="skeleton-line" style="width:65%;height:12px"></div>
        <div class="skeleton-line" style="width:40%;height:12px"></div>
      </div>
    </div>`).join("");
  el.eventsGrid.innerHTML = cards;
  el.eventsEmpty.hidden = true;
  el.eventsCount.textContent = "Loading…";
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
  renderAll();
  scrollToEvents();
}

/* ================= Init render ================= */
function initEvents() {
  renderCategories();
  renderChips();
  renderEventsSkeleton();
  setTimeout(() => { renderEvents(); }, 650); // simulate curated fetch / skeleton loading
}

/* ================= Modal ================= */
let currentEvent = null;
let countdownTimer = null;

function openModal(id) {
  const e = events.find((x) => x.id === id);
  if (!e) return;
  currentEvent = e;
  el.modalMedia.style.setProperty("--g1", e.g1);
  el.modalMedia.style.setProperty("--g2", e.g2);
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
  const onScroll = () => el.header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  el.themeToggle.addEventListener("click", () => applyTheme(state.theme === "light" ? "dark" : "light"));
}

/* ================= Reveal on scroll ================= */
function initReveal() {
  if (revealIO) revealIO.disconnect();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  revealIO = io;
  document.querySelectorAll(".reveal").forEach((n) => io.observe(n));
}

/* ================= Events wiring ================= */
function initEventsWiring() {
  el.heroSearch.addEventListener("submit", (ev) => {
    ev.preventDefault();
    state.category = "All";
    state.query = el.heroSearchInput.value.trim();
    renderAll();
    scrollToEvents();
  });
  el.eventCategoryChips.addEventListener("click", (ev) => {
    const chip = ev.target.closest(".chip");
    if (!chip) return;
    state.category = chip.dataset.category;
    renderAll();
    scrollToEvents();
  });
  el.sortSelect.addEventListener("change", (ev) => { state.sort = ev.target.value; renderAll(); });
  el.eventsGrid.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-open]");
    if (btn) openModal(Number(btn.dataset.open));
  });
  el.categoryGrid.addEventListener("click", (ev) => {
    const card = ev.target.closest(".category-card");
    if (!card) return;
    state.category = card.dataset.category;
    renderAll();
    scrollToEvents();
  });
}

/* ================= Modal wiring ================= */
function initModal() {
  el.modalClose.addEventListener("click", closeModal);
  el.eventModal.addEventListener("click", (ev) => { if (ev.target === el.eventModal) closeModal(); });
  document.addEventListener("keydown", (ev) => { if (ev.key === "Escape") closeModal(); });
  el.regEvent.addEventListener("change", () => { const nid = Number(el.regEvent.value); const nev = events.find((x) => x.id === nid); if (nev) startCountdown(nev); });
  el.regForm.addEventListener("submit", submitRegistration);
  el.regDoneBtn.addEventListener("click", closeModal);
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
  initEventsWiring();
  initModal();
  initNewsletter();

  // footer year
  try { el.footerYear.textContent = String(new Date().getFullYear()); } catch (e) {}

  // hero search focus on load (small nicety)
  // initial render
  renderCategories();
  renderChips();
  renderEventsSkeleton();
  setTimeout(() => { renderEvents(); initReveal(); }, 650);
}

document.addEventListener("DOMContentLoaded", init);
