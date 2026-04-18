/* UI-only prototype for Hirex (no backend). */

const STORAGE_KEY = "hirex_demo_state_v1";

const now = () => new Date();
const fmtDate = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
const daysFromNow = (d) => {
  const t = new Date();
  t.setDate(t.getDate() + d);
  t.setHours(10, 0, 0, 0);
  return t.toISOString();
};
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

function moneyINR(amount) {
  if (!amount || amount <= 0) return "₹0";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function salaryLPA(item) {
  if (item.type !== "job") return null;
  const min = Number(item.salaryMinLPA);
  const max = Number(item.salaryMaxLPA);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max <= 0) return null;
  if (min === max) return `${min} LPA`;
  return `${min}–${max} LPA`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { registrations: {}, saves: {} };
    const parsed = JSON.parse(raw);
    return { registrations: parsed.registrations || {}, saves: parsed.saves || {} };
  } catch {
    return { registrations: {}, saves: {} };
  }
}

function saveState(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

const DATA = {
  hackathons: [
    {
      id: "hx-hack-neoai",
      type: "hackathon",
      title: "NeoAI Build Sprint",
      venue: "Bengaluru • Hirex Arena",
      mode: "offline",
      domain: ["AI", "Product", "LLMs"],
      startAt: daysFromNow(6),
      duration: "36 hours",
      teamSize: "2–4",
      fee: 499,
      verified: true,
      trust: 92,
      details:
        "A fast-paced, team-based hackathon focused on practical AI products. Build an end-to-end prototype with a crisp pitch and measurable impact.",
      reviews: [
        { name: "Aditi Sharma", rating: 5, text: "Great event, well organized. Mentors were super helpful." },
        { name: "Kunal Mehta", rating: 4, text: "Solid problems and smooth registration process." },
        { name: "Riya Singh", rating: 5, text: "Loved the venue and the judging quality." },
        { name: "Dev Patel", rating: 4, text: "Well-managed schedule and good networking." },
      ],
    },
    {
      id: "hx-hack-blueweb",
      type: "hackathon",
      title: "BlueWeb Hackfest",
      venue: "Online • Live Rooms",
      mode: "online",
      domain: ["Web", "DevTools", "Open Source"],
      startAt: daysFromNow(3),
      duration: "24 hours",
      teamSize: "1–3",
      fee: 0,
      verified: true,
      trust: 88,
      details:
        "A clean, web-first hackathon with starter kits and short technical workshops. Great for students who want a realistic sprint experience.",
      reviews: [
        { name: "Sana Khan", rating: 5, text: "Very useful workshop + hack combo. Great resources." },
        { name: "Arjun Rao", rating: 4, text: "Smooth and beginner-friendly. Good pacing." },
        { name: "Neha Verma", rating: 4, text: "Loved the project themes and quick feedback." },
      ],
    },
    {
      id: "hx-hack-fintech",
      type: "hackathon",
      title: "FinTech Forge Weekend",
      venue: "Mumbai • Skyline Hub",
      mode: "offline",
      domain: ["FinTech", "Data", "Security"],
      startAt: daysFromNow(12),
      duration: "48 hours",
      teamSize: "3–5",
      fee: 799,
      verified: false,
      trust: 79,
      details:
        "Build secure fintech workflows—onboarding, fraud checks, and reconciliation. Includes a product track and a security track with focused evaluations.",
      reviews: [
        { name: "Ishaan Gupta", rating: 4, text: "Challenging tracks, good judges, realistic use-cases." },
        { name: "Meera Nair", rating: 3, text: "Great content, though onboarding could be tighter." },
      ],
    },
  ],
  workshops: [
    {
      id: "hx-ws-uiux",
      type: "workshop",
      title: "Modern UI/UX for Product Teams",
      organizer: "Hirex Studio",
      mode: "online",
      domain: ["UI/UX", "Design Systems"],
      startAt: daysFromNow(2),
      duration: "2 hours",
      fee: 199,
      verified: true,
      trust: 94,
      details:
        "Learn spacing, hierarchy, and component thinking. Includes a mini design-audit framework and practical templates.",
      reviews: [
        { name: "Priya", rating: 5, text: "Very useful workshop. Clear structure and examples." },
        { name: "Kabir", rating: 4, text: "Great pacing and hands-on exercises." },
        { name: "Sanjay", rating: 5, text: "Clean explanations and super practical tips." },
      ],
    },
    {
      id: "hx-ws-mlops",
      type: "workshop",
      title: "MLOps Starter: Deploy & Monitor",
      organizer: "CloudCraft Academy",
      mode: "offline",
      domain: ["AI", "MLOps", "Cloud"],
      startAt: daysFromNow(9),
      duration: "4 hours",
      fee: 0,
      verified: true,
      trust: 87,
      details: "A practical workshop covering deployment patterns, monitoring signals, and reliability basics for ML systems.",
      reviews: [
        { name: "Tanvi", rating: 4, text: "Good hands-on labs. Helpful instructor." },
        { name: "Rohit", rating: 4, text: "Solid intro and realistic deployment scenarios." },
      ],
    },
  ],
  seminars: [
    {
      id: "hx-sem-career",
      type: "seminar",
      title: "Career Roadmaps: From Student to SDE",
      host: "Hirex Community",
      organizer: "TechTalks India",
      mode: "online",
      startAt: daysFromNow(1),
      duration: "75 mins",
      fee: 0,
      verified: true,
      trust: 90,
      details: "A structured seminar on portfolios, interview prep, and building momentum with consistent projects.",
      reviews: [
        { name: "Ananya", rating: 5, text: "Great clarity and actionable steps." },
        { name: "Vikram", rating: 4, text: "Very helpful Q&A session." },
      ],
    },
    {
      id: "hx-sem-cyber",
      type: "seminar",
      title: "Security for Builders: Practical Threat Modeling",
      host: "SecureOps Guild",
      organizer: "SecureOps Guild",
      mode: "offline",
      startAt: daysFromNow(7),
      duration: "90 mins",
      fee: 299,
      verified: false,
      trust: 82,
      details: "Learn realistic threat modeling in small steps and apply it to common product features.",
      reviews: [
        { name: "Harsh", rating: 4, text: "Good examples and simple frameworks." },
        { name: "Nidhi", rating: 4, text: "Made security feel approachable." },
      ],
    },
  ],
  opportunities: {
    jobs: [
      {
        id: "hx-job-frontend",
        type: "job",
        title: "Frontend Engineer (React)",
        company: "BluePeak Labs",
        domain: ["Web", "UI"],
        location: "Remote (India)",
        salaryMinLPA: 8,
        salaryMaxLPA: 14,
        verified: true,
        trust: 91,
        fee: 0,
        details:
          "Build crisp UI experiences with strong component discipline. You'll collaborate with designers and ship weekly improvements.",
        reviews: [
          { name: "Nitin", rating: 5, text: "Quick application flow and transparent updates." },
          { name: "Ira", rating: 4, text: "Clear role description and responsive recruiter." },
        ],
      },
      {
        id: "hx-job-data",
        type: "job",
        title: "Data Analyst",
        company: "FinSight",
        domain: ["Data", "BI"],
        location: "Pune (Hybrid)",
        salaryMinLPA: 6,
        salaryMaxLPA: 10,
        verified: false,
        trust: 78,
        fee: 0,
        details: "Work on dashboards and insights that power product decisions. Strong SQL + visualization focus.",
        reviews: [
          { name: "Madhav", rating: 4, text: "The requirements were realistic and well scoped." },
        ],
      },
    ],
    internships: [
      {
        id: "hx-int-ml",
        type: "internship",
        title: "ML Intern",
        company: "CloudCraft Academy",
        domain: ["AI", "Data"],
        location: "Online",
        schedule: "Part-time",
        paid: true,
        stipend: 15000,
        mode: "online",
        verified: true,
        trust: 89,
        fee: 0,
        details: "Build datasets, train baseline models, and help with evaluation harnesses. Weekly mentor check-ins.",
        reviews: [
          { name: "Pooja", rating: 5, text: "Great mentorship and clear tasks." },
          { name: "Yash", rating: 4, text: "Good learning curve and friendly team." },
        ],
      },
      {
        id: "hx-int-product",
        type: "internship",
        title: "Product Intern",
        company: "Hirex Studio",
        domain: ["Product", "Research"],
        location: "Delhi (On-site)",
        schedule: "Full-time",
        paid: false,
        stipend: 0,
        mode: "offline",
        verified: true,
        trust: 86,
        fee: 0,
        details: "Help run user interviews, convert insights into specs, and support experiments on onboarding flows.",
        reviews: [
          { name: "Srishti", rating: 4, text: "Great exposure to real product work." },
        ],
      },
    ],
    freelancing: [
      {
        id: "hx-free-ui-audit",
        type: "freelance",
        title: "Landing Page UI Audit + Refresh",
        company: "NovaMart",
        domain: ["UI/UX", "Web"],
        budget: 12000,
        duration: "1 week",
        verified: true,
        trust: 93,
        fee: 0,
        details:
          "Audit spacing, hierarchy, and conversion flow. Deliver a refreshed UI with 3 sections, responsive layout, and component guidelines.",
        reviews: [
          { name: "Farhan", rating: 5, text: "The client brief was clear; proposal submission was smooth." },
          { name: "Shreya", rating: 4, text: "Good listing quality and quick responses." },
        ],
      },
      {
        id: "hx-free-backend-api",
        type: "freelance",
        title: "API Integration (Payments Mock)",
        company: "FinSight",
        domain: ["Backend", "API"],
        budget: 18000,
        duration: "10 days",
        verified: false,
        trust: 77,
        fee: 0,
        details: "Integrate a mock payment provider and implement basic receipt email simulation (no real emails).",
        reviews: [
          { name: "Akash", rating: 4, text: "Budget and duration were realistic." },
        ],
      },
    ],
  },
};

const UI = {
  route: "home",
  scope: "all",
  q: "",
  filters: {
    mode: "any",
    price: "any",
    verifiedOnly: false,
    domain: "",
    chip: "recommended",
  },
  sortBy: "recommended",
  drawerItemId: null,
  drawerItemType: null,
  pay: {
    open: false,
    step: 1,
    itemId: null,
    itemType: null,
    payload: null,
  },
};

const el = (id) => document.getElementById(id);
const state = loadState();

const chipConfig = [
  { id: "recommended", label: "Recommended" },
  { id: "team", label: "Team-based" },
  { id: "verified", label: "Verified" },
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
  { id: "online", label: "Online" },
  { id: "offline", label: "Offline" },
];

function computeTrustAvg() {
  const items = allItemsFlat().filter((i) => typeof i.trust === "number");
  const avg = items.reduce((a, b) => a + b.trust, 0) / Math.max(1, items.length);
  return Math.round(avg);
}

function allItemsFlat() {
  const opp = DATA.opportunities;
  return [
    ...DATA.hackathons,
    ...DATA.workshops,
    ...DATA.seminars,
    ...opp.jobs,
    ...opp.internships,
    ...opp.freelancing,
  ];
}

function isEvent(item) {
  return item.type === "hackathon" || item.type === "workshop" || item.type === "seminar";
}

function isOpportunity(item) {
  return item.type === "job" || item.type === "internship" || item.type === "freelance";
}

function itemFee(item) {
  const fee = item.fee || 0;
  return fee;
}

function itemMode(item) {
  if (!item.mode) return "offline";
  return item.mode;
}

function itemIsPaid(item) {
  return itemFee(item) > 0;
}

function startAt(item) {
  return item.startAt ? new Date(item.startAt) : null;
}

function eventStarted(item) {
  const s = startAt(item);
  if (!s) return false;
  return now().getTime() >= s.getTime();
}

function registrationFor(item) {
  return state.registrations[item.id] || null;
}

function saveFor(item) {
  return !!state.saves[item.id];
}

function setSaved(item, isSaved) {
  const next = loadState();
  next.saves[item.id] = !!isSaved;
  saveState(next);
  state.saves = next.saves;
  toast(isSaved ? "Saved" : "Removed", isSaved ? "Added to your saved list." : "Removed from saved.", "warn");
  render();
}

function registerFree(item, payload) {
  const next = loadState();
  next.registrations[item.id] = {
    id: uid(),
    itemId: item.id,
    type: item.type,
    createdAt: new Date().toISOString(),
    status: "confirmed",
    payment: itemIsPaid(item)
      ? { status: "paid", amount: itemFee(item), receiptId: "rcpt_" + uid().slice(0, 8), email: payload.email || "" }
      : { status: "not_required", amount: 0 },
    cancellation: { status: "active" },
    form: payload,
  };
  saveState(next);
  state.registrations = next.registrations;
}

function applyOpportunity(item, payload) {
  const next = loadState();
  next.registrations[item.id] = {
    id: uid(),
    itemId: item.id,
    type: item.type,
    createdAt: new Date().toISOString(),
    status: "applied",
    payment: { status: "not_required", amount: 0 },
    cancellation: { status: "active" },
    form: payload,
  };
  saveState(next);
  state.registrations = next.registrations;
}

function cancelRegistration(item, reason) {
  const reg = registrationFor(item);
  if (!reg) return;
  const next = loadState();
  const started = eventStarted(item);
  const paid = itemIsPaid(item);
  const refundable = paid && !started;

  next.registrations[item.id] = {
    ...reg,
    cancellation: {
      status: "cancelled_by_user",
      reason: reason || "User cancelled",
      at: new Date().toISOString(),
    },
    refund: paid
      ? refundable
        ? { status: "refunded", amount: itemFee(item), at: new Date().toISOString(), reason: "Cancelled before start" }
        : { status: "not_applicable", amount: 0, reason: "Event already started" }
      : { status: "not_required", amount: 0 },
  };
  saveState(next);
  state.registrations = next.registrations;
  if (paid && refundable) toast("Cancelled", "Registration cancelled. Full refund issued (before start).", "ok");
  else toast("Cancelled", started ? "Registration cancelled. Refund not possible after start." : "Registration cancelled.", "warn");
}

function organizerCancel(item) {
  const reg = registrationFor(item);
  if (!reg) return;
  const next = loadState();
  const paid = itemIsPaid(item);
  next.registrations[item.id] = {
    ...reg,
    cancellation: {
      status: "cancelled_by_organizer",
      reason: "Cancelled by organizer",
      at: new Date().toISOString(),
    },
    refund: paid
      ? { status: "refunded", amount: itemFee(item), at: new Date().toISOString(), reason: "Organizer cancelled" }
      : { status: "not_required", amount: 0 },
  };
  saveState(next);
  state.registrations = next.registrations;
  toast("Organizer cancelled", paid ? "Listing cancelled. Full refund issued automatically." : "Listing cancelled.", "bad");
}

function toast(title, text, tone = "ok") {
  const host = el("toastHost");
  const t = document.createElement("div");
  t.className = `toast toast--${tone}`;
  const icon = tone === "ok" ? "✓" : tone === "warn" ? "!" : "×";
  t.innerHTML = `
    <div class="toast__icon" aria-hidden="true">${icon}</div>
    <div>
      <div class="toast__title">${escapeHtml(title)}</div>
      <div class="toast__text">${escapeHtml(text)}</div>
    </div>
  `;
  host.appendChild(t);
  setTimeout(() => t.remove(), 3600);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
}

function badge(label, kind) {
  return `<span class="badge ${kind ? "badge--" + kind : ""}">${escapeHtml(label)}</span>`;
}

function stars(n) {
  const s = clamp(Number(n) || 0, 0, 5);
  return "★".repeat(s) + "☆".repeat(5 - s);
}

function primaryLabel(item) {
  if (isEvent(item)) return registrationFor(item) ? "View registration" : "Register";
  return registrationFor(item) ? "View application" : "Apply";
}

function secondaryLabel(item) {
  return saveFor(item) ? "Saved" : "Save";
}

function itemKicker(item) {
  if (item.type === "hackathon") return "Hackathon • Team-based";
  if (item.type === "workshop") return "Workshop";
  if (item.type === "seminar") return "Seminar";
  if (item.type === "job") return "Job opportunity";
  if (item.type === "internship") return "Internship";
  if (item.type === "freelance") return "Freelance project";
  return "Listing";
}

function listTitleForRoute(route) {
  if (route === "hackathons") return ["Hackathons", "Team-based registrations with trust scores and reviews."];
  if (route === "workshops") return ["Workshops", "Domain-based sessions with online/offline and pricing badges."];
  if (route === "seminars") return ["Seminars", "Hosts, organizers, time/date, and consistent payment flow."];
  if (route === "opportunities") return ["Opportunities", "Jobs, internships, and freelance projects with apply flows."];
  return ["Home", "Upcoming items, your registrations, and smart suggestions."];
}

function applyFilters(items) {
  let out = [...items];

  if (UI.scope === "events") out = out.filter(isEvent);
  if (UI.scope === "opps") out = out.filter(isOpportunity);

  const q = UI.q.trim().toLowerCase();
  if (q) {
    out = out.filter((i) => {
      const hay = [
        i.title,
        i.venue,
        i.organizer,
        i.host,
        i.company,
        i.location,
        ...(i.domain || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  if (UI.filters.mode !== "any") out = out.filter((i) => itemMode(i) === UI.filters.mode);
  if (UI.filters.price !== "any") out = out.filter((i) => (UI.filters.price === "paid" ? itemIsPaid(i) : !itemIsPaid(i)));
  if (UI.filters.verifiedOnly) out = out.filter((i) => i.verified);
  const d = UI.filters.domain.trim().toLowerCase();
  if (d) out = out.filter((i) => (i.domain || []).some((x) => String(x).toLowerCase().includes(d)));

  const chip = UI.filters.chip;
  if (chip === "team") out = out.filter((i) => i.type === "hackathon");
  if (chip === "verified") out = out.filter((i) => i.verified);
  if (chip === "free") out = out.filter((i) => !itemIsPaid(i));
  if (chip === "paid") out = out.filter((i) => itemIsPaid(i));
  if (chip === "online") out = out.filter((i) => itemMode(i) === "online");
  if (chip === "offline") out = out.filter((i) => itemMode(i) === "offline");

  return sortItems(out);
}

function sortItems(items) {
  const s = UI.sortBy;
  const copy = [...items];
  if (s === "soonest") {
    copy.sort((a, b) => (startAt(a)?.getTime() || Infinity) - (startAt(b)?.getTime() || Infinity));
    return copy;
  }
  if (s === "trust") {
    copy.sort((a, b) => (b.trust || 0) - (a.trust || 0));
    return copy;
  }
  if (s === "feeLow") {
    copy.sort((a, b) => itemFee(a) - itemFee(b));
    return copy;
  }
  copy.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0) || (b.trust || 0) - (a.trust || 0));
  return copy;
}

function cardHtml(item) {
  const paid = itemIsPaid(item);
  const mode = itemMode(item);
  const reg = registrationFor(item);
  const started = isEvent(item) ? eventStarted(item) : false;
  const statusBadge = reg
    ? reg.cancellation?.status === "cancelled_by_user"
      ? badge("Cancelled (You)", "status-warn")
      : reg.cancellation?.status === "cancelled_by_organizer"
        ? badge("Cancelled (Organizer)", "status-bad")
        : badge(isEvent(item) ? "Registered" : "Applied", "status-ok")
    : started
      ? badge("Started", "status-warn")
      : "";

  const when = isEvent(item) && item.startAt ? fmtDate(item.startAt) : null;

  const topRight = `
    <div class="badge-row">
      ${item.verified ? badge("Verified", "verified") : ""}
      ${badge(paid ? "Paid" : "Free", paid ? "paid" : "free")}
      ${badge(mode === "online" ? "Online" : "Offline", mode === "online" ? "online" : "offline")}
      ${typeof item.trust === "number" ? badge(`Trust ${item.trust}`, "trust") : ""}
      ${statusBadge}
    </div>
  `;

  const meta = isEvent(item)
    ? `${escapeHtml(item.venue || "")}${when ? " • " + escapeHtml(when) : ""}`
    : `${escapeHtml(item.company || "")} • ${escapeHtml(item.location || "")}`;

  const chips = (item.domain || []).slice(0, 3).map((d) => badge(d)).join("");
  const feeLine = paid ? `Fee: <b>${escapeHtml(moneyINR(itemFee(item)))}</b>` : `Fee: <b>Free</b>`;
  const salaryLine = item.type === "job" && salaryLPA(item) ? `Salary: <b>${escapeHtml(salaryLPA(item))}</b>` : "";

  return `
    <article class="card" data-open="${escapeHtml(item.id)}" tabindex="0" role="button" aria-label="View details">
      <div class="card__top">
        <div>
          <div class="card__title">${escapeHtml(item.title)}</div>
          <div class="card__meta">${meta}</div>
          <div class="badge-row" style="margin-top:10px">${chips}</div>
        </div>
        <div>${topRight}</div>
      </div>

      <div class="card__row">
        <div class="kv">
          <div class="kv__item"><span class="dot"></span>${feeLine}</div>
          ${salaryLine ? `<div class="kv__item"><span class="dot"></span>${salaryLine}</div>` : ""}
          ${
            item.type === "hackathon"
              ? `<div class="kv__item"><span class="dot"></span>Team: <b>${escapeHtml(item.teamSize)}</b></div>`
              : ""
          }
          ${item.duration ? `<div class="kv__item"><span class="dot"></span>Duration: <b>${escapeHtml(item.duration)}</b></div>` : ""}
        </div>
        <div class="actions">
          <button class="btn btn--ghost" data-action="details" data-id="${escapeHtml(item.id)}" type="button">View Details</button>
          <button class="btn btn--primary" data-action="primary" data-id="${escapeHtml(item.id)}" type="button">${escapeHtml(
            primaryLabel(item),
          )}</button>
        </div>
      </div>
    </article>
  `;
}

function sectionHtml(title, subtitle, items) {
  const cards = items.map(cardHtml).join("");
  return `
    <div class="section">
      <div class="section__head">
        <div>
          <div class="section__title">${escapeHtml(title)}</div>
          <div class="section__sub">${escapeHtml(subtitle)}</div>
        </div>
      </div>
      <div class="section__body">
        <div class="cards">${cards || `<div class="muted">No items match the current filters.</div>`}</div>
      </div>
    </div>
  `;
}

function renderHome() {
  const regItems = Object.keys(state.registrations)
    .map((id) => allItemsFlat().find((x) => x.id === id))
    .filter(Boolean);

  const upcomingHackathons = [...DATA.hackathons]
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
    .slice(0, 4);

  const suggestions = applyFilters(allItemsFlat()).slice(0, 6);

  const home = el("sectionHome");
  home.innerHTML = [
    sectionHtml("Upcoming hackathons", "Team-based events with trust scores, reviews, and clean payment flow.", upcomingHackathons),
    sectionHtml("Registered / applied", "Your saved state persists locally in this demo.", regItems),
    sectionHtml("Recommended for you", "Based on trust, verification, and your current filters.", suggestions),
  ].join("");
}

function renderList() {
  const titleEl = el("pageTitle");
  const subEl = el("pageSubtitle");
  const [t, s] = listTitleForRoute(UI.route);
  titleEl.textContent = t;
  subEl.textContent = s;

  let items = [];
  if (UI.route === "hackathons") items = DATA.hackathons;
  if (UI.route === "workshops") items = DATA.workshops;
  if (UI.route === "seminars") items = DATA.seminars;
  if (UI.route === "opportunities") items = [...DATA.opportunities.jobs, ...DATA.opportunities.internships, ...DATA.opportunities.freelancing];

  const filtered = applyFilters(items);
  const list = el("sectionList");
  list.innerHTML = sectionHtml(t, "Click any card for a realistic details & action flow.", filtered);
}

function renderStats() {
  const all = allItemsFlat();
  const registeredCount = Object.keys(state.registrations).length;
  el("statRegistered").textContent = String(registeredCount);
  el("statTrust").textContent = String(computeTrustAvg());
  el("statWeek").textContent = String(all.filter((x) => isEvent(x) && x.startAt && new Date(x.startAt).getTime() - now().getTime() < 7 * 864e5).length);
}

function renderChips() {
  const row = el("chipRow");
  row.innerHTML = chipConfig
    .map((c) => `<button class="chip ${UI.filters.chip === c.id ? "is-active" : ""}" data-chip="${escapeHtml(c.id)}" type="button">${escapeHtml(c.label)}</button>`)
    .join("");
}

function setRoute(route) {
  UI.route = route;
  document.querySelectorAll(".navlink").forEach((b) => b.classList.toggle("is-active", b.dataset.route === route));
  el("sectionHome").classList.toggle("is-hidden", route !== "home");
  el("sectionList").classList.toggle("is-hidden", route === "home");
  const [t, s] = listTitleForRoute(route);
  el("pageTitle").textContent = t;
  el("pageSubtitle").textContent = s;
  render();
  el("app").focus();
}

function setScope(scope) {
  UI.scope = scope;
  document.querySelectorAll(".pill").forEach((b) => b.classList.toggle("is-active", b.dataset.filterScope === scope));
  render();
}

function render() {
  renderStats();
  renderChips();
  if (UI.route === "home") renderHome();
  else renderList();
  bindCardHandlers();
  refreshDrawerIfOpen();
}

function bindCardHandlers() {
  document.querySelectorAll("[data-open]").forEach((card) => {
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDetails(card.getAttribute("data-open"));
      }
    });
  });

  document.querySelectorAll("[data-action='details']").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openDetails(btn.dataset.id);
    }),
  );
  document.querySelectorAll("[data-action='primary']").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openDetails(btn.dataset.id);
      setTimeout(() => el("drawerPrimaryAction").click(), 0);
    }),
  );
  document.querySelectorAll("[data-open]").forEach((card) => card.addEventListener("click", () => openDetails(card.getAttribute("data-open"))));
}

function findItemById(id) {
  return allItemsFlat().find((x) => x.id === id) || null;
}

function openDetails(id) {
  const item = findItemById(id);
  if (!item) return;
  UI.drawerItemId = item.id;
  UI.drawerItemType = item.type;
  el("drawerOverlay").classList.remove("is-hidden");
  el("detailsDrawer").classList.remove("is-hidden");
  el("drawerOverlay").setAttribute("aria-hidden", "false");
  el("detailsDrawer").setAttribute("aria-hidden", "false");
  refreshDrawer(item);
}

function closeDrawer() {
  UI.drawerItemId = null;
  UI.drawerItemType = null;
  el("drawerOverlay").classList.add("is-hidden");
  el("detailsDrawer").classList.add("is-hidden");
  el("drawerOverlay").setAttribute("aria-hidden", "true");
  el("detailsDrawer").setAttribute("aria-hidden", "true");
}

function refreshDrawerIfOpen() {
  if (!UI.drawerItemId) return;
  const item = findItemById(UI.drawerItemId);
  if (!item) return closeDrawer();
  refreshDrawer(item);
}

function refundPolicyText(item) {
  if (!isEvent(item)) return "Not applicable (opportunities have no payment/refunds in this demo).";
  if (!itemIsPaid(item)) return "Free registration. No payment required.";
  const started = eventStarted(item);
  return started
    ? "Refund not possible after the event starts."
    : "Refund allowed only until the event starts. If organizer cancels, full refund is issued automatically.";
}

function cancellationControls(item, reg) {
  if (!reg) return "";
  if (!isEvent(item)) return "";

  const started = eventStarted(item);
  const cancelled = reg.cancellation?.status?.startsWith("cancelled");
  if (cancelled) return "";

  const canCancel = !started;
  return `
    <div class="divider"></div>
    <div class="side-title">Cancellation</div>
    <div class="side-body">
      <div class="badge-row" style="margin:8px 0 10px">
        ${badge(canCancel ? "Cancelable (before start)" : "Not cancelable", canCancel ? "status-ok" : "status-warn")}
        ${itemIsPaid(item) ? badge("Refund rules apply", "paid") : badge("No payment", "free")}
      </div>
      <button class="btn btn--ghost" data-cancel="user" ${canCancel ? "" : "disabled"} type="button">Cancel registration</button>
      <button class="btn btn--ghost" data-cancel="org" type="button" style="margin-left:8px">Simulate organizer cancel</button>
      <div class="muted" style="margin-top:10px">Organizer cancellations trigger automatic refunds. This is a demo action for realism.</div>
    </div>
  `;
}

function registrationStatusBlock(item, reg) {
  if (!reg) {
    return `
      <div class="side-title">Status</div>
      <div class="side-body">
        <div class="badge-row" style="margin-bottom:10px">
          ${badge("Not registered", "status-warn")}
          ${itemIsPaid(item) ? badge(`Fee ${moneyINR(itemFee(item))}`, "paid") : badge("Free", "free")}
        </div>
        <div class="muted">Complete the flow to see confirmation, receipt (for paid), and cancellation/refund states.</div>
      </div>
    `;
  }

  const cancelled = reg.cancellation?.status;
  const paid = itemIsPaid(item);
  const started = isEvent(item) ? eventStarted(item) : false;

  let badgeHtml = isEvent(item) ? badge("Registered", "status-ok") : badge("Applied", "status-ok");
  if (cancelled === "cancelled_by_user") badgeHtml = badge("Cancelled (You)", "status-warn");
  if (cancelled === "cancelled_by_organizer") badgeHtml = badge("Cancelled (Organizer)", "status-bad");
  if (!cancelled && started) badgeHtml = badge("Started", "status-warn");

  const payBlock = paid
    ? reg.payment?.status === "paid"
      ? `
        <div class="badge-row" style="margin:10px 0">
          ${badge("Payment Successful", "status-ok")}
          ${badge(moneyINR(reg.payment.amount), "paid")}
        </div>
        <div class="muted">Receipt: <b>${escapeHtml(reg.payment.receiptId || "—")}</b></div>
        <div class="muted" style="margin-top:6px">A payment receipt has been sent to your registered email address.</div>
      `
      : `
        <div class="badge-row" style="margin:10px 0">
          ${badge("Payment pending", "status-warn")}
          ${badge(moneyINR(itemFee(item)), "paid")}
        </div>
      `
    : `
      <div class="badge-row" style="margin:10px 0">
        ${badge("No payment required", "status-ok")}
      </div>
    `;

  const refund = reg.refund;
  const refundLine =
    refund?.status === "refunded"
      ? `<div class="badge-row" style="margin-top:10px">${badge("Refund issued", "status-ok")}${badge(moneyINR(refund.amount), "free")}</div>
         <div class="muted" style="margin-top:6px">${escapeHtml(refund.reason || "")}</div>`
      : refund?.status === "not_applicable"
        ? `<div class="badge-row" style="margin-top:10px">${badge("Refund not possible", "status-warn")}</div>
           <div class="muted" style="margin-top:6px">${escapeHtml(refund.reason || "")}</div>`
        : "";

  return `
    <div class="side-title">Status</div>
    <div class="side-body">
      <div class="badge-row">${badgeHtml}${paid ? badge("Paid listing", "paid") : badge("Free listing", "free")}</div>
      <div class="muted" style="margin-top:8px">Created: <b>${escapeHtml(fmtDate(reg.createdAt))}</b></div>
      ${payBlock}
      ${cancelled ? `<div class="badge-row" style="margin-top:10px">${badge("Cancellation status", "status-warn")}${badge(cancelled.includes("organizer") ? "Organizer" : "User", cancelled.includes("organizer") ? "status-bad" : "status-warn")}</div>
      <div class="muted" style="margin-top:6px">${escapeHtml(reg.cancellation?.reason || "")}</div>` : ""}
      ${refundLine}
    </div>
  `;
}

function detailsTable(item) {
  const rows = [];
  if (isEvent(item)) {
    rows.push(["Venue", item.venue || "—"]);
    rows.push(["Starts", item.startAt ? fmtDate(item.startAt) : "—"]);
    rows.push(["Duration", item.duration || "—"]);
    rows.push(["Mode", itemMode(item) === "online" ? "Online" : "Offline"]);
    if (item.type === "hackathon") rows.push(["Team size", item.teamSize || "—"]);
    rows.push(["Fee", itemIsPaid(item) ? moneyINR(itemFee(item)) : "Free"]);
  } else {
    rows.push(["Company", item.company || "—"]);
    rows.push(["Role", item.title || "—"]);
    rows.push(["Location", item.location || "—"]);
    if (item.type === "job") rows.push(["Salary", salaryLPA(item) || "—"]);
    if (item.type === "internship") rows.push(["Schedule", item.schedule || "—"]);
    if (item.type === "internship") rows.push(["Paid", item.paid ? `Yes • ₹${item.stipend}/mo` : "Unpaid"]);
    if (item.type === "freelance") rows.push(["Budget", moneyINR(item.budget || 0)]);
    if (item.type === "freelance") rows.push(["Duration", item.duration || "—"]);
  }
  rows.push(["Trust score", typeof item.trust === "number" ? `${item.trust}/100` : "—"]);
  rows.push(["Verified", item.verified ? "Yes" : "No"]);

  const cells = rows
    .map(
      ([k, v]) => `
      <div class="cell">
        <div class="cell__label">${escapeHtml(k)}</div>
        <div class="cell__value">${escapeHtml(String(v))}</div>
      </div>
    `,
    )
    .join("");

  return `<div class="table">${cells}</div>`;
}

function policyCard(item) {
  const paid = itemIsPaid(item);
  const started = isEvent(item) ? eventStarted(item) : false;
  const refund = refundPolicyText(item);
  const receiptLine = paid
    ? `After successful payment, the UI confirms: <b>Payment Successful</b>, <b>Registration Confirmed</b>, and
       <b>Receipt sent to registered email</b>.`
    : `Free flows confirm registration instantly.`;
  return `
    <div class="detail-card__title">Payment, receipt & refunds</div>
    <div class="detail-card__body">
      <div class="badge-row" style="margin-bottom:10px">
        ${paid ? badge("Proceed to Payment flow", "paid") : badge("No payment required", "free")}
        ${isEvent(item) ? badge(started ? "Event started" : "Before start", started ? "status-warn" : "status-ok") : badge("Opportunity", "verified")}
      </div>
      <div>${receiptLine}</div>
      <div style="margin-top:10px"><b>Refund policy:</b> ${refund}</div>
      <div style="margin-top:10px"><b>Cancellation terms:</b> Users can cancel before event start. Organizer cancellations trigger automatic refunds and display status.</div>
      ${paid ? `<div style="margin-top:10px"><b>Receipt system:</b> “A payment receipt has been sent to your registered email address”.</div>` : ""}
    </div>
  `;
}

function reviewCards(item) {
  const reviews = item.reviews || [];
  if (!reviews.length) return `<div class="muted">No reviews yet.</div>`;
  return reviews
    .map(
      (r) => `
      <div class="review">
        <div class="review__top">
          <div class="review__name">${escapeHtml(r.name)}</div>
          <div class="review__stars" aria-label="Rating ${escapeHtml(String(r.rating))} out of 5">${escapeHtml(stars(r.rating))}</div>
        </div>
        <div class="review__text">${escapeHtml(r.text)}</div>
      </div>
    `,
    )
    .join("");
}

function renderActionForm(item) {
  const reg = registrationFor(item);
  const saved = saveFor(item);
  const isPaid = itemIsPaid(item);

  const common = `
    <div class="side-title">${isEvent(item) ? "Registration" : "Application"}</div>
    <div class="side-body">
      <div class="badge-row" style="margin:8px 0 12px">
        ${item.verified ? badge("Verified", "verified") : badge("Unverified", "status-warn")}
        ${badge(isPaid ? `Paid ${moneyINR(itemFee(item))}` : "Free", isPaid ? "paid" : "free")}
      </div>
  `;

  if (reg) {
    return (
      common +
      `
        <div class="muted">You already completed this flow. See status above for receipt/cancellation/refund details.</div>
        <div style="margin-top:12px">
          <button class="btn btn--ghost" data-save="${saved ? "off" : "on"}" type="button">${escapeHtml(secondaryLabel(item))}</button>
        </div>
      </div>`
    );
  }

  if (isEvent(item)) {
    const teamBlock =
      item.type === "hackathon"
        ? `
          <div class="field">
            <label for="teamName">Team name</label>
            <input id="teamName" type="text" placeholder="e.g. Blue Rockets" />
          </div>
          <div class="field">
            <label for="teamSize">Team size</label>
            <select id="teamSize">
              <option value="2">2</option>
              <option value="3" selected>3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        `
        : "";

    const feeLine = isPaid
      ? `<div class="muted">This is a paid listing. You’ll complete checkout and receive a receipt email confirmation.</div>`
      : `<div class="muted">This is free. Registration confirms instantly.</div>`;

    return (
      common +
      `
        <div class="field">
          <label for="fullName">Full name</label>
          <input id="fullName" type="text" placeholder="Your name" autocomplete="name" />
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" type="email" placeholder="you@example.com" autocomplete="email" />
        </div>
        ${teamBlock}
        <div style="margin-top:12px">${feeLine}</div>
        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap">
          <button class="btn ${isPaid ? "btn--primary" : "btn--primary"}" data-register="go" type="button">${
            isPaid ? "Proceed to Payment" : "Confirm Registration"
          }</button>
          <button class="btn btn--ghost" data-save="on" type="button">${escapeHtml(secondaryLabel(item))}</button>
        </div>
      </div>`
    );
  }

  if (isOpportunity(item)) {
    const resume = `
      <div class="field">
        <label for="resume">Resume upload (UI only)</label>
        <input id="resume" type="file" accept=".pdf,.doc,.docx" />
      </div>
    `;

    const extra =
      item.type === "freelance"
        ? `
          <div class="field">
            <label for="proposal">Proposal</label>
            <textarea id="proposal" rows="4" placeholder="Share your plan, timeline, and relevant work…"></textarea>
          </div>
        `
        : `
          <div class="field">
            <label for="note">Short note</label>
            <textarea id="note" rows="3" placeholder="Why you’re a good fit…"></textarea>
          </div>
        `;

    return (
      common +
      `
        <div class="field">
          <label for="appName">Full name</label>
          <input id="appName" type="text" placeholder="Your name" autocomplete="name" />
        </div>
        <div class="field">
          <label for="appEmail">Email</label>
          <input id="appEmail" type="email" placeholder="you@example.com" autocomplete="email" />
        </div>
        ${resume}
        ${extra}
        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap">
          <button class="btn btn--primary" data-apply="go" type="button">Submit Application</button>
          <button class="btn btn--ghost" data-save="on" type="button">${escapeHtml(secondaryLabel(item))}</button>
        </div>
        <div class="muted" style="margin-top:10px">Applications are simulated and stored locally for demo realism.</div>
      </div>`
    );
  }

  return common + `<div class="muted">No actions available.</div></div>`;
}

function refreshDrawer(item) {
  el("drawerKicker").textContent = itemKicker(item);
  el("drawerTitle").textContent = item.title;

  const reg = registrationFor(item);
  const paid = itemIsPaid(item);

  el("drawerBadges").innerHTML = [
    item.verified ? badge("Verified", "verified") : badge("Not verified", "status-warn"),
    badge(paid ? "Paid" : "Free", paid ? "paid" : "free"),
    badge(itemMode(item) === "online" ? "Online" : "Offline", itemMode(item) === "online" ? "online" : "offline"),
    typeof item.trust === "number" ? badge(`Trust ${item.trust}/100`, "trust") : "",
  ].join("");

  el("detailSummary").innerHTML = `
    <div class="detail-card__title">Details</div>
    <div class="detail-card__body">${escapeHtml(item.details || "")}</div>
    ${detailsTable(item)}
  `;

  el("detailPolicy").innerHTML = policyCard(item);
  el("detailReviews").innerHTML = reviewCards(item);

  el("sideStatus").innerHTML = registrationStatusBlock(item, reg);
  el("sideActionForm").innerHTML = renderActionForm(item) + cancellationControls(item, reg);

  const primary = el("drawerPrimaryAction");
  primary.textContent = primaryLabel(item);
  primary.onclick = () => {
    el("sideActionForm").scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const secondary = el("drawerSecondaryAction");
  secondary.textContent = secondaryLabel(item);
  secondary.onclick = () => setSaved(item, !saveFor(item));

  el("sideActionForm").querySelectorAll("[data-save]").forEach((b) =>
    b.addEventListener("click", () => setSaved(item, b.dataset.save === "on")),
  );
  el("sideActionForm").querySelectorAll("[data-register='go']").forEach((b) =>
    b.addEventListener("click", () => onRegister(item)),
  );
  el("sideActionForm").querySelectorAll("[data-apply='go']").forEach((b) =>
    b.addEventListener("click", () => onApply(item)),
  );

  el("sideActionForm").querySelectorAll("[data-cancel]").forEach((b) =>
    b.addEventListener("click", () => {
      if (b.dataset.cancel === "user") cancelRegistration(item, "User cancelled via demo UI");
      if (b.dataset.cancel === "org") organizerCancel(item);
      refreshDrawerIfOpen();
      render();
    }),
  );
}

function onRegister(item) {
  const isPaid = itemIsPaid(item);
  const name = (el("fullName")?.value || "").trim();
  const email = (el("email")?.value || "").trim();
  const teamName = (el("teamName")?.value || "").trim();
  const teamSize = el("teamSize")?.value || "";

  if (!name || !email) {
    toast("Missing details", "Please add your name and email to continue.", "warn");
    return;
  }

  const payload = { name, email, teamName: teamName || undefined, teamSize: teamSize || undefined };

  if (!isPaid) {
    registerFree(item, payload);
    toast("Registration Confirmed", "You’re registered. No payment required.", "ok");
    refreshDrawerIfOpen();
    render();
    return;
  }

  openPayment(item, payload);
}

function onApply(item) {
  const name = (el("appName")?.value || "").trim();
  const email = (el("appEmail")?.value || "").trim();
  const note = (el("note")?.value || "").trim();
  const proposal = (el("proposal")?.value || "").trim();
  const resume = el("resume")?.files?.[0]?.name || "";

  if (!name || !email) {
    toast("Missing details", "Please add your name and email to submit.", "warn");
    return;
  }

  const payload = { name, email, resumeFile: resume || "(not uploaded)", note: note || undefined, proposal: proposal || undefined };
  applyOpportunity(item, payload);
  toast("Application submitted", "Your application was recorded (demo).", "ok");
  refreshDrawerIfOpen();
  render();
}

function openPayment(item, payload) {
  UI.pay.open = true;
  UI.pay.step = 1;
  UI.pay.itemId = item.id;
  UI.pay.itemType = item.type;
  UI.pay.payload = payload || null;

  el("payItem").textContent = item.title;
  el("payAmount").textContent = moneyINR(itemFee(item));
  el("payEmail").value = payload.email || "";
  el("payName").value = payload.name || "";

  el("payOverlay").classList.remove("is-hidden");
  el("payModal").classList.remove("is-hidden");
  el("payOverlay").setAttribute("aria-hidden", "false");

  renderPayScreen(item, payload);
}

function closePayment() {
  UI.pay.open = false;
  UI.pay.step = 1;
  UI.pay.itemId = null;
  UI.pay.itemType = null;
  UI.pay.payload = null;
  el("payOverlay").classList.add("is-hidden");
  el("payModal").classList.add("is-hidden");
  el("payOverlay").setAttribute("aria-hidden", "true");
}

function setPayStep(step) {
  UI.pay.step = step;
  document.querySelectorAll(".step").forEach((s) => s.classList.toggle("is-active", Number(s.dataset.step) === step));
}

function renderPayScreen(item, payload) {
  const screen = el("payScreen");
  const cta = el("payCta");
  const back = el("payBack");

  const email = (el("payEmail").value || "").trim();
  const name = (el("payName").value || "").trim();

  if (UI.pay.step === 1) {
    setPayStep(1);
    back.disabled = true;
    cta.textContent = "Pay now";
    cta.disabled = !email || !name;
    screen.innerHTML = `
      <div class="big-success">
        <div class="big-success__title">Review & pay</div>
        <div class="big-success__text">
          You’re paying <b>${escapeHtml(moneyINR(itemFee(item)))}</b> to confirm registration.
          This is a simulated Razorpay-style checkout (UI only).
        </div>
        <div class="badge-row">
          ${badge("Secure checkout", "verified")}
          ${badge("Receipt via email", "status-ok")}
          ${badge("Refunds until start", "status-warn")}
        </div>
      </div>
    `;
    cta.onclick = () => {
      const email2 = (el("payEmail").value || "").trim();
      const name2 = (el("payName").value || "").trim();
      if (!email2 || !name2) {
        toast("Missing details", "Enter name and email to proceed.", "warn");
        return;
      }
      setPayStep(2);
      renderPayScreen(item, payload);
    };
    return;
  }

  if (UI.pay.step === 2) {
    setPayStep(2);
    back.disabled = true;
    cta.textContent = "Processing…";
    cta.disabled = true;
    screen.innerHTML = `
      <div class="big-success">
        <div class="big-success__title">Processing payment</div>
        <div class="big-success__text">Verifying payment securely. Please wait.</div>
        <div class="pill-inline"><span class="spinner" aria-hidden="true"></span> Checking status</div>
      </div>
    `;
    setTimeout(() => {
      setPayStep(3);
      renderPayScreen(item, payload);
    }, 1100);
    return;
  }

  if (UI.pay.step === 3) {
    setPayStep(3);
    back.disabled = false;
    back.textContent = "Close";
    cta.textContent = "Done";
    cta.disabled = false;
    const receiptId = "rcpt_" + uid().slice(0, 10);
    screen.innerHTML = `
      <div class="big-success">
        <div class="big-success__title">Payment Successful</div>
        <div class="big-success__text">
          <b>Registration Confirmed</b>. Receipt: <b>${escapeHtml(receiptId)}</b>
        </div>
        <div class="big-success__text">
          A payment receipt has been sent to your registered email address.
        </div>
        <div class="badge-row">
          ${badge("Payment Successful", "status-ok")}
          ${badge("Registration Confirmed", "status-ok")}
          ${badge("Receipt sent to registered email", "verified")}
        </div>
      </div>
    `;

    const finalize = () => {
      const emailFinal = (el("payEmail").value || email || "").trim();
      const nameFinal = (el("payName").value || name || "").trim();
      const next = loadState();
      next.registrations[item.id] = {
        id: uid(),
        itemId: item.id,
        type: item.type,
        createdAt: new Date().toISOString(),
        status: "confirmed",
        payment: { status: "paid", amount: itemFee(item), receiptId, email: emailFinal, name: nameFinal },
        cancellation: { status: "active" },
        form: { ...payload, email: emailFinal, name: nameFinal },
      };
      saveState(next);
      state.registrations = next.registrations;
      toast("Payment Successful", "Registration Confirmed. Receipt sent to registered email.", "ok");
      closePayment();
      refreshDrawerIfOpen();
      render();
    };

    back.onclick = () => {
      finalize();
    };
    cta.onclick = () => {
      finalize();
    };
  }
}

function init() {
  render();

  // Top navigation links
  document.querySelectorAll(".navlink").forEach((b) => b.addEventListener("click", () => setRoute(b.dataset.route)));
  document.querySelectorAll(".pill").forEach((b) => b.addEventListener("click", () => setScope(b.dataset.filterScope)));

  el("globalSearch").addEventListener("input", (e) => {
    UI.q = e.target.value || "";
    render();
  });

  el("sortBy").addEventListener("change", (e) => {
    UI.sortBy = e.target.value;
    render();
  });

  el("clearFilters").addEventListener("click", () => {
    UI.q = "";
    UI.filters = { mode: "any", price: "any", verifiedOnly: false, domain: "", chip: "recommended" };
    UI.sortBy = "recommended";
    el("globalSearch").value = "";
    el("domain").value = "";
    el("onlyVerified").checked = false;
    document.querySelectorAll(".seg__btn").forEach((b) => b.classList.remove("is-active"));
    document.querySelectorAll(".seg__btn[data-mode='any'], .seg__btn[data-price='any']").forEach((b) => b.classList.add("is-active"));
    render();
    toast("Reset", "Filters cleared.", "ok");
  });

  // Filter segments
  document.querySelectorAll(".seg__btn").forEach((b) => {
    b.addEventListener("click", () => {
      const mode = b.dataset.mode;
      const price = b.dataset.price;
      if (mode) UI.filters.mode = mode;
      if (price) UI.filters.price = price;

      if (mode) document.querySelectorAll(".seg__btn[data-mode]").forEach((x) => x.classList.toggle("is-active", x === b));
      if (price) document.querySelectorAll(".seg__btn[data-price]").forEach((x) => x.classList.toggle("is-active", x === b));
      render();
    });
  });

  // Default active for segments
  document.querySelectorAll(".seg__btn[data-mode='any'], .seg__btn[data-price='any']").forEach((b) => b.classList.add("is-active"));

  el("onlyVerified").addEventListener("change", (e) => {
    UI.filters.verifiedOnly = !!e.target.checked;
    render();
  });
  el("domain").addEventListener("input", (e) => {
    UI.filters.domain = e.target.value || "";
    render();
  });

  // Chips
  el("chipRow").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-chip]");
    if (!btn) return;
    UI.filters.chip = btn.dataset.chip;
    render();
  });

  // Drawer close
  el("drawerOverlay").addEventListener("click", closeDrawer);
  el("closeDrawer").addEventListener("click", closeDrawer);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!el("payModal").classList.contains("is-hidden")) closePayment();
      else if (!el("helpModal").classList.contains("is-hidden")) closeHelp();
      else if (!el("detailsDrawer").classList.contains("is-hidden")) closeDrawer();
    }
  });

  // Hero shortcuts
  el("goUpcoming").addEventListener("click", () => setRoute("hackathons"));
  el("goOpportunities").addEventListener("click", () => setRoute("opportunities"));

  // Navbar polish: subtle shadow on scroll
  const topbar = el("topbar");
  const onScroll = () => {
    const scrolled = window.scrollY > 6;
    topbar?.classList.toggle("is-scrolled", scrolled);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Icon actions (demo)
  el("openNotifications")?.addEventListener("click", () => toast("Notifications", "No new notifications (demo).", "warn"));
  el("openProfile")?.addEventListener("click", () => toast("Profile", "Profile actions are UI-only in this prototype.", "warn"));

  // Payment modal
  el("closePay").addEventListener("click", closePayment);
  el("payOverlay").addEventListener("click", closePayment);

  ["payEmail", "payName", "payMethod"].forEach((id) => {
    el(id).addEventListener("input", () => {
      const item = findItemById(UI.pay.itemId);
      if (!item) return;
      renderPayScreen(item, UI.pay.payload || {});
    });
  });

  // Policies modal
  const openHelp = () => {
    el("helpOverlay").classList.remove("is-hidden");
    el("helpModal").classList.remove("is-hidden");
    el("helpOverlay").setAttribute("aria-hidden", "false");
  };
  function closeHelp() {
    el("helpOverlay").classList.add("is-hidden");
    el("helpModal").classList.add("is-hidden");
    el("helpOverlay").setAttribute("aria-hidden", "true");
  }
  window.closeHelp = closeHelp;
  el("openHelp").addEventListener("click", openHelp);
  el("helpOverlay").addEventListener("click", closeHelp);
  el("closeHelp").addEventListener("click", closeHelp);
  el("closeHelp2").addEventListener("click", closeHelp);

  // Reset demo data
  el("wipeLocal").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    const next = loadState();
    state.registrations = next.registrations;
    state.saves = next.saves;
    toast("Demo reset", "Local demo data cleared.", "ok");
    render();
  });
}

document.addEventListener("DOMContentLoaded", init);

