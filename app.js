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
const minutesAgo = (m) => {
  const t = new Date();
  t.setMinutes(t.getMinutes() - m);
  return t.toISOString();
};
function relTime(iso) {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "—";
  const diffSec = Math.max(0, (now().getTime() - t) / 1000);
  if (diffSec < 90) return "Just now";
  const diffMin = diffSec / 60;
  if (diffMin < 60) return `${Math.floor(diffMin)}m ago`;
  const diffHr = diffMin / 60;
  if (diffHr < 48) return `${Math.floor(diffHr)}h ago`;
  return fmtDate(iso);
}
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

let DATA = { hackathons: [], workshops: [], seminars: [], opportunities: { jobs: [], internships: [], freelancing: [] } };

const UI = {
  route: "home",
  scope: "all",
  q: "",
  networkSearch: "",
  requirementTab: "company",
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
let state = { registrations: {}, saves: {} };

const NETWORK = {
  me: {
    id: "usr-me",
    name: "Shivam Gupta",
    headline: "Full Stack Developer | Community Builder",
    about:
      "Building practical products, mentoring students, and helping teams ship polished user experiences with measurable impact.",
    photo: "SG",
    skills: ["React", "Python", "Flask", "UI/UX", "SQL"],
    experience: [
      { role: "Frontend Developer", company: "BluePeak Labs", period: "2024 - Present" },
      { role: "Community Lead", company: "DevCircle", period: "2022 - 2024" },
    ],
    education: "B.Tech Computer Science • 2025",
    projects: ["Hirex Platform", "Campus Mentor Hub"],
    contact: "shivam@example.com",
  },
  people: [
    { id: "usr-1", name: "Aditi Sharma", role: "Product Manager", skills: ["Product", "Growth", "Analytics"], mutual: 14, status: "none" },
    { id: "usr-2", name: "Kunal Mehta", role: "Software Engineer", skills: ["Backend", "API", "Python"], mutual: 9, status: "connected" },
    { id: "usr-3", name: "Riya Singh", role: "Data Analyst", skills: ["SQL", "Power BI", "Finance"], mutual: 5, status: "incoming" },
    { id: "usr-4", name: "Dev Patel", role: "UI/UX Designer", skills: ["Figma", "Design Systems", "Research"], mutual: 11, status: "none" },
    { id: "usr-5", name: "Meera Nair", role: "Marketing Specialist", skills: ["Marketing", "Content", "Brand"], mutual: 6, status: "none" },
    { id: "usr-6", name: "Harsh Verma", role: "Cybersecurity Engineer", skills: ["Security", "SOC", "Cloud"], mutual: 4, status: "connected" },
  ],
  feed: [
    {
      id: "nx1",
      category: "markets",
      breaking: true,
      ticker: "APOLLO",
      move: "+18%",
      moveDir: "up",
      title: "Apollo Micro Systems surged 18% on a government license for missile manufacturing",
      deck: "The stock rallied sharply following the critical defense clearance.",
      body: "Investors cheered the approval, viewing it as a major catalyst for the company's defense footprint. Trading volumes spiked to multi-month highs during morning trade.",
      source: "MarketWire Defense",
      at: minutesAgo(1),
    },
    {
      id: "nx2",
      category: "markets",
      breaking: true,
      ticker: "GUJGAS",
      move: "+8%",
      moveDir: "up",
      title: "Gujarat Gas jumped 8% following a rating upgrade to 'buy'",
      deck: "Multiple brokerages turned bullish citing improved margin visibility.",
      body: "The rating upgrades pointed to easing raw material costs and stabilizing industrial demand, prompting aggressive buying from institutional desks across the board.",
      source: "CapitalDesk",
      at: minutesAgo(3),
    },
    {
      id: "n1",
      category: "markets",
      breaking: true,
      ticker: "NIFTY 50",
      move: "+0.58%",
      moveDir: "up",
      title: "Nifty reclaims 24,200 as IT majors lift benchmarks",
      deck: "Buying returned across large-caps after a steady start to the session, with breadth improving through the afternoon.",
      body: "Traders pointed to fresh allocations in software services and selective PSU banks as sentiment steadied. Volatility cooled slightly versus last week, though global cues remain the swing factor for near-term direction.",
      source: "MarketWire Live",
      at: minutesAgo(5),
    },
    {
      id: "n2",
      category: "markets",
      breaking: false,
      ticker: "SENSEX",
      move: "+0.41%",
      moveDir: "up",
      title: "Sensex extends gains; investors watch currency and crude",
      deck: "The rupee and Brent moves are in focus ahead of overseas inflation prints.",
      body: "Desk commentary highlights a preference for quality balance sheets and exporters hedging FX exposure. Mid-caps lagged briefly but participation ticked higher in the final hour.",
      source: "CapitalDesk",
      at: minutesAgo(18),
    },
    {
      id: "n3",
      category: "markets",
      breaking: false,
      ticker: "BANK NIFTY",
      move: "-0.22%",
      moveDir: "down",
      title: "Bank Nifty slips as traders book profits after a strong run",
      deck: "Private lenders saw two-way action while PSU names held relatively firm.",
      body: "Analysts note that credit growth narratives remain intact, but short-term positioning is lighter ahead of scheduled macro data. Flows from domestic institutions stayed net supportive on dips.",
      source: "TradeStream",
      at: minutesAgo(42),
    },
    {
      id: "n4",
      category: "markets",
      breaking: true,
      ticker: "USD/INR",
      move: "-0.05%",
      moveDir: "flat",
      title: "Rupee steady as RBI watchers flag balanced liquidity stance",
      deck: "FX desks report range-bound trading with importers and exporters offsetting each other.",
      body: "Policy expectations are priced for continuity, with emphasis on anchoring inflation expectations. Offshore dollar moves overnight will set the tone for Monday’s opening.",
      source: "FX Pulse India",
      at: minutesAgo(63),
    },
    {
      id: "n5",
      category: "tech",
      breaking: true,
      title: "Chip majors signal sustained AI accelerator demand through 2026",
      deck: "Cloud hyperscalers are still expanding GPU clusters for training and inference workloads.",
      body: "Supply chains for advanced packaging remain tight, pushing lead times for high-end accelerators. Enterprise buyers are shifting budgets toward retrieval-augmented stacks and smaller fine-tuned models to control cost per token.",
      source: "Silicon Brief",
      at: minutesAgo(7),
    },
    {
      id: "n6",
      category: "tech",
      breaking: false,
      title: "Major cloud providers post resilient enterprise spend on data and AI services",
      deck: "Consumption-based revenue grew even as customers optimize legacy footprints.",
      body: "CFO commentary emphasized multi-year commitments on analytics and security SKUs. Partners report stronger pipeline for migration plus modernization bundles rather than lift-and-shift alone.",
      source: "Cloud Ledger",
      at: minutesAgo(26),
    },
    {
      id: "n7",
      category: "tech",
      breaking: false,
      title: "EU AI Act implementation spurs tooling rush for compliance and documentation",
      deck: "Vendors are bundling risk registers, eval harnesses, and audit trails for model releases.",
      body: "Legal and engineering teams are collaborating earlier in the SDLC. Mid-size SaaS firms are prioritizing EU deployments with transparent logging to avoid rework when rules tighten further.",
      source: "Policy & Code",
      at: minutesAgo(55),
    },
    {
      id: "n8",
      category: "tech",
      breaking: false,
      title: "Indian SaaS and devtools startups raise follow-on rounds on strong NRR",
      deck: "Investors cite durable expansion revenue and India-first GTM before global scale.",
      body: "Founders highlighted tighter CAC payback and community-led adoption on campuses as differentiators. Secondary interest is rising for employee liquidity in later-stage names.",
      source: "Startup Circuit",
      at: minutesAgo(120),
    },
  ],
  companyPosts: [
    { id: "req-1", title: "Hiring: Junior Frontend Engineer", company: "BluePeak Labs", domain: "Web", location: "Remote", kind: "Job", description: "Need strong React fundamentals, API integration, and component-driven development." },
    { id: "req-2", title: "Need UI Audit Consultant", company: "NovaMart", domain: "UI/UX", location: "Mumbai", kind: "Service", description: "Looking for UI experts to audit onboarding and checkout journeys." },
  ],
  opportunityPosts: [
    { id: "op-1", title: "Hiring Need: Data Intern", company: "FinSight", domain: "Data", location: "Pune", kind: "Hiring need", description: "Internship role for dashboarding, reporting, and SQL-based analysis." },
    { id: "op-2", title: "Open Requirement: Security Analyst", company: "SecureOps Guild", domain: "Security", location: "Delhi", kind: "Job", description: "Entry role for threat detection, incident triage, and reporting workflows." },
  ],
};

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

async function apiCall(endpoint, payload) {
  try {
    const res = await fetch(`/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("API error");
    state = await res.json();
    return true;
  } catch (err) {
    console.error(err);
    toast("Error", "Could not connect to backend server.", "bad");
    return false;
  }
}

async function setSaved(item, isSaved) {
  if (await apiCall("save", { itemId: item.id, isSaved })) {
    toast(isSaved ? "Saved" : "Removed", isSaved ? "Added to your saved list." : "Removed from saved.", "warn");
    render();
  }
}

async function registerFree(item, payload) {
  return await apiCall("register", { item, payload, paymentStatus: "not_required" });
}

async function applyOpportunity(item, payload) {
  return await apiCall("apply", { item, payload });
}

async function cancelRegistration(item, reason) {
  if (await apiCall("cancel", { item, reason, eventStarted: isEvent(item) ? eventStarted(item) : false })) {
    const reg = state.registrations[item.id];
    const refund = reg?.refund;
    if (refund?.status === "refunded") toast("Cancelled", "Registration cancelled. Refund issued.", "ok");
    else toast("Cancelled", "Registration cancelled.", "warn");
    render();
    return true;
  }
}

async function organizerCancel(item) {
  if (await apiCall("cancel", { item, byOrganizer: true })) {
    const reg = state.registrations[item.id];
    if (reg?.refund?.status === "refunded") toast("Organizer cancelled", "Listing cancelled. Full refund issued automatically.", "bad");
    else toast("Organizer cancelled", "Listing cancelled.", "bad");
    render();
    return true;
  }
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
  if (route === "events") return ["Events", "Hackathons, workshops, and seminars with one structured flow."];
  if (route === "opportunities") return ["Opportunities", "Jobs, internships, and freelance projects with apply flows."];
  if (route === "networking") return ["Networking", "Professional profiles, connections, community feed, and requirement board."];
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

function spotlightCardHtml(item) {
  const meta = isEvent(item)
    ? `${item.type[0].toUpperCase() + item.type.slice(1)} • ${item.venue || item.mode || "Event"}`
    : `${item.company || "Company"} • ${item.location || item.mode || "Opportunity"}`;
  const salary = item.type === "job" ? salaryLPA(item) : null;
  const moneyLine = salary
    ? `Salary: ${salary}`
    : item.type === "internship"
      ? item.paid
        ? `Stipend: ₹${item.stipend}/mo`
        : "Unpaid internship"
      : item.type === "freelance"
        ? `Budget: ${moneyINR(item.budget || 0)}`
        : itemIsPaid(item)
          ? `Fee: ${moneyINR(itemFee(item))}`
          : "Free";

  return `
    <article class="spot-card">
      <div class="spot-card__top">
        <div>
          <div class="spot-card__title">${escapeHtml(item.title)}</div>
          <div class="spot-card__meta">${escapeHtml(meta)}</div>
        </div>
        <div class="badge-row">
          ${item.verified ? badge("Verified", "verified") : ""}
          ${badge(`Trust ${item.trust || "—"}`, "trust")}
        </div>
      </div>
      <div class="badge-row" style="margin-top:10px">
        ${(item.domain || []).slice(0, 2).map((d) => badge(d)).join("")}
      </div>
      <div class="spot-card__foot">
        <div class="kv__item"><span class="dot"></span>${escapeHtml(moneyLine)}</div>
        <button class="btn btn--ghost" data-spot-open="${escapeHtml(item.id)}" type="button">View</button>
      </div>
    </article>
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
  const all = allItemsFlat();
  const trending = applyFilters(all)
    .sort((a, b) => (b.trust || 0) - (a.trust || 0))
    .slice(0, 8);
  const spotlight = applyFilters(all)
    .filter((x) => x.verified)
    .sort((a, b) => (b.trust || 0) - (a.trust || 0))
    .slice(0, 8);
  const paidCount = all.filter((x) => itemIsPaid(x)).length;
  const freeCount = all.filter((x) => !itemIsPaid(x)).length;
  const jobsCount = (DATA.opportunities?.jobs || []).length;

  const home = el("sectionHome");
  home.innerHTML = [
    sectionHtml("Upcoming hackathons", "Team-based events with trust scores, reviews, and clean payment flow.", upcomingHackathons),
    sectionHtml("Registered / applied", "Your saved state persists locally in this demo.", regItems),
    sectionHtml("Recommended for you", "Based on trust, verification, and your current filters.", suggestions),
  ].join("");

  const ticker = el("trendTicker");
  if (ticker) {
    const line = trending
      .map((i) => `${i.title} (${(i.domain || []).slice(0, 1).join("") || i.type})`)
      .join("  •  ");
    ticker.textContent = `${line}  •  ${line}`;
  }
  if (el("pulsePaid")) el("pulsePaid").textContent = String(paidCount);
  if (el("pulseFree")) el("pulseFree").textContent = String(freeCount);
  if (el("pulseJobs")) el("pulseJobs").textContent = String(jobsCount);
  if (el("spotlightRow")) {
    el("spotlightRow").innerHTML =
      spotlight.map(spotlightCardHtml).join("") || `<div class="muted">No spotlight items right now.</div>`;
    el("spotlightRow")
      .querySelectorAll("[data-spot-open]")
      .forEach((btn) => btn.addEventListener("click", () => openDetails(btn.dataset.spotOpen)));
  }
}

function profileCardHtml() {
  const p = NETWORK.me;
  return `
    <div class="section">
      <div class="section__head">
        <div>
          <div class="section__title">Professional Profile</div>
          <div class="section__sub">LinkedIn-style profile with editable cards</div>
        </div>
      </div>
      <div class="section__body">
        <div class="net-profile">
          <div class="net-profile__top">
            <div class="net-avatar">${escapeHtml(p.photo)}</div>
            <div>
              <div class="net-name">${escapeHtml(p.name)}</div>
              <div class="net-headline">${escapeHtml(p.headline)}</div>
              <div class="badge-row" style="margin-top:8px">${badge("Connections", "verified")} ${badge(String(NETWORK.people.filter((x) => x.status === "connected").length), "trust")}</div>
            </div>
            <button class="btn btn--ghost" data-edit-profile type="button">Edit Profile</button>
          </div>
          <div class="net-grid">
            <div class="net-box"><div class="net-box__title">About</div><div class="net-box__text">${escapeHtml(p.about)}</div></div>
            <div class="net-box"><div class="net-box__title">Skills</div><div class="badge-row">${p.skills.map((s) => badge(s)).join("")}</div></div>
            <div class="net-box"><div class="net-box__title">Experience</div>${p.experience.map((e) => `<div class="net-line"><b>${escapeHtml(e.role)}</b> • ${escapeHtml(e.company)} <span>${escapeHtml(e.period)}</span></div>`).join("")}</div>
            <div class="net-box"><div class="net-box__title">Education & Projects</div><div class="net-line">${escapeHtml(p.education)}</div><div class="net-line">${escapeHtml(p.projects.join(" • "))}</div><div class="net-line">${escapeHtml(p.contact)}</div></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function connectionCardHtml(person) {
  const action =
    person.status === "connected"
      ? `<button class="btn btn--secondary" disabled type="button">Connected</button><button class="btn btn--ghost" type="button">Message</button>`
      : person.status === "requested"
        ? `<button class="btn btn--ghost" disabled type="button">Requested</button>`
        : person.status === "incoming"
          ? `<button class="btn btn--primary" data-accept="${person.id}" type="button">Accept</button><button class="btn btn--ghost" data-reject="${person.id}" type="button">Reject</button>`
          : `<button class="btn btn--primary" data-connect="${person.id}" type="button">Connect</button><button class="btn btn--ghost" type="button">Message</button>`;

  return `
    <article class="net-person">
      <div class="net-person__top">
        <div class="net-avatar net-avatar--sm">${escapeHtml(person.name.split(" ").map((x) => x[0]).join("").slice(0, 2))}</div>
        <div>
          <div class="net-person__name">${escapeHtml(person.name)}</div>
          <div class="net-person__role">${escapeHtml(person.role)}</div>
          <div class="net-person__mutual">${person.mutual} mutual connections</div>
        </div>
      </div>
      <div class="badge-row" style="margin-top:8px">${person.skills.slice(0, 3).map((s) => badge(s)).join("")}</div>
      <div class="net-person__actions">${action}</div>
    </article>
  `;
}

function liveNewsTickerSeg(posts) {
  return posts
    .map(
      (p) =>
        `<span class="net-live-ticker__item net-live-ticker__item--${p.category === "markets" ? "markets" : "tech"}"><span class="net-live-ticker__tag">${escapeHtml(
          p.category === "markets" ? "MKTS" : "TECH",
        )}</span><span class="net-live-ticker__text">${escapeHtml(p.title)}</span></span>`,
    )
    .join("");
}

function feedCardHtml(post, index = 0) {
  const cat = post.category === "markets" ? "markets" : "tech";
  const delay = Math.min(index * 0.08, 0.85);
  const breaking = post.breaking ? `<span class="net-news-card__flag" aria-label="Breaking">Breaking</span>` : "";
  const moveBlock =
    post.move && post.ticker
      ? `<span class="net-news-card__ticker-pill net-news-card__ticker-pill--${post.moveDir || "up"}"><span class="net-news-card__sym">${escapeHtml(
          post.ticker,
        )}</span><span class="net-news-card__mv">${escapeHtml(post.move)}</span></span>`
      : post.move
        ? `<span class="net-news-card__ticker-pill net-news-card__ticker-pill--${post.moveDir || "up"}"><span class="net-news-card__mv">${escapeHtml(post.move)}</span></span>`
        : "";
  const catLabel = cat === "markets" ? "Markets" : "Tech";
  return `
    <article class="net-news-card net-news-card--${cat}" style="--enter-delay:${delay}s">
      <div class="net-news-card__shine" aria-hidden="true"></div>
      <div class="net-news-card__top">
        <div class="net-news-card__meta">
          ${breaking}
          <span class="net-news-card__pill">${escapeHtml(catLabel)}</span>
          <span class="net-news-card__time"><span class="net-news-card__time-dot" aria-hidden="true"></span>${escapeHtml(relTime(post.at))}</span>
        </div>
        ${moveBlock}
      </div>
      <h3 class="net-news-card__headline">${escapeHtml(post.title)}</h3>
      <p class="net-news-card__deck">${escapeHtml(post.deck)}</p>
      <p class="net-news-card__body">${escapeHtml(post.body)}</p>
      <div class="net-news-card__foot">
        <span class="net-news-card__source">${escapeHtml(post.source)}</span>
        <div class="net-news-card__actions">
          <button class="btn btn--ghost net-news-card__btn" type="button" data-news-action="save">Save</button>
          <button class="btn btn--ghost net-news-card__btn" type="button" data-news-action="share">Share</button>
        </div>
      </div>
    </article>
  `;
}

function requirementCardHtml(item) {
  return `
    <article class="net-req-card">
      <div class="net-req-card__title">${escapeHtml(item.title)}</div>
      <div class="net-req-card__meta">${escapeHtml(item.company)} • ${escapeHtml(item.location)}</div>
      <div class="badge-row" style="margin-top:8px">${badge(item.domain)} ${badge(item.kind, "paid")}</div>
      <div class="net-req-card__body">${escapeHtml(item.description)}</div>
      <div class="net-req-card__actions">
        <button class="btn btn--primary" type="button">${UI.requirementTab === "company" ? "Post Similar" : "Express Interest"}</button>
      </div>
    </article>
  `;
}

function renderNetworking() {
  const wrap = el("sectionNetworking");
  const query = UI.networkSearch.trim().toLowerCase();
  const filteredPeople = NETWORK.people.filter((p) => {
    if (!query) return true;
    const text = `${p.name} ${p.role} ${p.skills.join(" ")}`.toLowerCase();
    return text.includes(query);
  });
  const suggested = filteredPeople.filter((p) => p.status !== "connected").slice(0, 6);
  const reqItems = UI.requirementTab === "company" ? NETWORK.companyPosts : NETWORK.opportunityPosts;
  wrap.innerHTML = `
    ${profileCardHtml()}
    <div class="section">
      <div class="section__head"><div><div class="section__title">Connections & Discovery</div><div class="section__sub">Send, accept, and discover professionals by skills/domains.</div></div></div>
      <div class="section__body">
        <div class="search search--hero net-search">
          <span class="search__icon" aria-hidden="true">⌕</span>
          <input id="networkSearch" class="search__input" type="search" placeholder="Search professionals by name, role, skill…" value="${escapeHtml(UI.networkSearch)}" />
        </div>
        <div class="net-people-grid">${suggested.map(connectionCardHtml).join("") || `<div class="muted">No profiles match this search.</div>`}</div>
      </div>
    </div>
    <div class="section section--live-news">
      <div class="section__head">
        <div>
          <div class="section__title">Community Feed</div>
          <div class="section__sub">Live-style wire for markets and tech — curated headlines with a broadcast feel (demo).</div>
        </div>
        <div class="net-live-feed__head-aside" aria-hidden="true">
          <span class="net-live-feed__wow">Wow</span>
        </div>
      </div>
      <div class="section__body net-live-feed">
        <div class="net-live-feed__mast">
          <div class="net-live-feed__brand">
            <span class="net-live-pulse" aria-hidden="true"><span class="net-live-pulse__ring"></span><span class="net-live-pulse__core"></span></span>
            <div>
              <div class="net-live-feed__label">
                <span class="net-live-feed__live-text">LIVE</span>
                <span class="net-live-feed__wire">WIRE</span>
              </div>
              <p class="net-live-feed__hint">Headlines refresh as you explore — ticker below mirrors the stream.</p>
            </div>
          </div>
          <div class="net-live-feed__chips">
            <span class="net-live-chip net-live-chip--markets">Nifty • Sensex • FX</span>
            <span class="net-live-chip net-live-chip--tech">Chips • Cloud • Policy</span>
          </div>
        </div>
        <div class="net-live-ticker" role="region" aria-label="Scrolling headlines">
          <div class="net-live-ticker__viewport">
            <div class="net-live-ticker__track">
              <div class="net-live-ticker__seg">${liveNewsTickerSeg(NETWORK.feed)}</div>
              <div class="net-live-ticker__seg" aria-hidden="true">${liveNewsTickerSeg(NETWORK.feed)}</div>
            </div>
          </div>
        </div>
        <div class="net-live-stream">${NETWORK.feed.map((p, i) => feedCardHtml(p, i)).join("")}</div>
      </div>
    </div>
    <div class="section">
      <div class="section__head"><div><div class="section__title">Company Requirements Board</div><div class="section__sub">Requirements posted by companies and opportunities for users.</div></div></div>
      <div class="section__body">
        <div class="pillbar">
          <button class="pill ${UI.requirementTab === "company" ? "is-active" : ""}" data-req-tab="company" type="button">Company Posts</button>
          <button class="pill ${UI.requirementTab === "opportunity" ? "is-active" : ""}" data-req-tab="opportunity" type="button">Opportunities for Users</button>
        </div>
        <div class="net-req-grid">${reqItems.map(requirementCardHtml).join("")}</div>
      </div>
    </div>
  `;

  wrap.querySelectorAll("[data-connect]").forEach((b) =>
    b.addEventListener("click", () => {
      const person = NETWORK.people.find((p) => p.id === b.dataset.connect);
      if (!person) return;
      person.status = "requested";
      toast("Request sent", `Connection request sent to ${person.name}.`, "ok");
      renderNetworking();
    }),
  );
  wrap.querySelectorAll("[data-accept]").forEach((b) =>
    b.addEventListener("click", () => {
      const person = NETWORK.people.find((p) => p.id === b.dataset.accept);
      if (!person) return;
      person.status = "connected";
      toast("Connected", `You are now connected with ${person.name}.`, "ok");
      renderNetworking();
    }),
  );
  wrap.querySelectorAll("[data-reject]").forEach((b) =>
    b.addEventListener("click", () => {
      const person = NETWORK.people.find((p) => p.id === b.dataset.reject);
      if (!person) return;
      person.status = "none";
      toast("Request rejected", `${person.name}'s request was removed.`, "warn");
      renderNetworking();
    }),
  );
  wrap.querySelector("#networkSearch")?.addEventListener("input", (e) => {
    UI.networkSearch = e.target.value || "";
    renderNetworking();
  });
  wrap.querySelectorAll("[data-req-tab]").forEach((b) =>
    b.addEventListener("click", () => {
      UI.requirementTab = b.dataset.reqTab;
      renderNetworking();
    }),
  );
  wrap.querySelector("[data-edit-profile]")?.addEventListener("click", () => {
    toast("Profile editor", "Editable profile sections are simulated in this prototype.", "warn");
  });
  wrap.querySelectorAll("[data-news-action]").forEach((b) =>
    b.addEventListener("click", () => {
      const kind = b.getAttribute("data-news-action");
      if (kind === "save") toast("Reading list", "Story saved (demo).", "ok");
      else toast("Share", "Link copied to clipboard (demo).", "ok");
    }),
  );
}

function renderList() {
  const titleEl = el("pageTitle");
  const subEl = el("pageSubtitle");
  const [t, s] = listTitleForRoute(UI.route);
  titleEl.textContent = t;
  subEl.textContent = s;

  let items = [];
  if (UI.route === "events") items = [...DATA.hackathons, ...DATA.workshops, ...DATA.seminars];
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
  // Keep backward compatibility with older quick-route values.
  const wantsOpportunities = route === "opportunities";
  if (route === "events" || wantsOpportunities) {
    route = "home";
    if (wantsOpportunities) UI.scope = "opps";
  }
  UI.route = route;
  document.querySelectorAll(".navlink").forEach((b) => b.classList.toggle("is-active", b.dataset.route === route));
  el("sectionHome").classList.toggle("is-hidden", route !== "home");
  el("homeEnhancements")?.classList.toggle("is-hidden", route !== "home");
  document.querySelector(".hero--home")?.classList.toggle("is-hidden", route !== "home");
  el("eventsPillstrip")?.classList.toggle("is-hidden", route === "networking");
  el("app").classList.toggle("app--networking", route === "networking");
  document.querySelector(".content .grid")?.classList.toggle("grid--full", route === "networking");
  el("sectionList").classList.toggle("is-hidden", route === "home" || route === "networking");
  el("sectionNetworking").classList.toggle("is-hidden", route !== "networking");
  const [t, s] = listTitleForRoute(route);
  el("pageTitle").textContent = t;
  el("pageSubtitle").textContent = s;
  const showFilters = route !== "networking";
  document.querySelector(".filters")?.classList.toggle("is-hidden", !showFilters);
  document.querySelector(".content__controls")?.classList.toggle("is-hidden", !showFilters);
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
  else if (UI.route === "networking") renderNetworking();
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
    b.addEventListener("click", async () => {
      if (b.dataset.cancel === "user") await cancelRegistration(item, "User cancelled via demo UI");
      if (b.dataset.cancel === "org") await organizerCancel(item);
      refreshDrawerIfOpen();
    }),
  );
}

async function onRegister(item) {
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
    if (await registerFree(item, payload)) {
      toast("Registration Confirmed", "You’re registered. No payment required.", "ok");
      refreshDrawerIfOpen();
      render();
    }
    return;
  }

  openPayment(item, payload);
}

async function onApply(item) {
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
  if (await applyOpportunity(item, payload)) {
    toast("Application submitted", "Your application was recorded.", "ok");
    refreshDrawerIfOpen();
    render();
  }
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

    const finalize = async () => {
      const emailFinal = (el("payEmail").value || email || "").trim();
      const nameFinal = (el("payName").value || name || "").trim();
      
      const payloadForm = { ...payload, email: emailFinal, name: nameFinal };
      if (await apiCall("register", { item, payload: payloadForm, paymentStatus: "paid", receiptId })) {
        toast("Payment Successful", "Registration Confirmed. Receipt sent to registered email.", "ok");
        closePayment();
        refreshDrawerIfOpen();
        render();
      }
    };

    back.onclick = () => {
      finalize();
    };
    cta.onclick = () => {
      finalize();
    };
  }
}

async function init() {
  try {
    const [dRes, sRes] = await Promise.all([fetch("/api/data"), fetch("/api/state")]);
    DATA = await dRes.json();
    state = await sRes.json();
  } catch (err) {
    console.error("Backend not reachable", err);
    toast("Network Error", "Could not connect to Python backend.", "bad");
  }

  setRoute(UI.route);

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
  el("goUpcoming").addEventListener("click", () => setRoute("events"));
  el("goOpportunities").addEventListener("click", () => setRoute("opportunities"));
  document.querySelectorAll("[data-quick-route]").forEach((btn) =>
    btn.addEventListener("click", () => setRoute(btn.dataset.quickRoute)),
  );

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

  el("wipeLocal").addEventListener("click", async () => {
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      const data = await res.json();
      state = data.state;
      toast("Demo reset", "Backend state cleared.", "ok");
      render();
    } catch {}
  });
}

document.addEventListener("DOMContentLoaded", init);

