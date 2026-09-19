const STORAGE_KEY = "loopa.subscriptions.v1";
const ONBOARDING_KEY = "loopa.onboarding.v1";
const VALID_SCREENS = new Set(["inicio", "calendario", "assinaturas", "economia"]);

const demoSubscriptions = [
  { id: "chatgpt", name: "ChatGPT", amount: 119.90, day: 20, category: "IA", cycle: "monthly", payment: "Nubank •••• 4821", status: "active", tone: "green" },
  { id: "spotify", name: "Spotify", amount: 21.90, day: 23, category: "Música", cycle: "monthly", payment: "Nubank •••• 4821", status: "active", tone: "green" },
  { id: "disney", name: "Disney+", amount: 46.90, day: 24, category: "Streaming", cycle: "monthly", payment: "Inter •••• 0934", status: "active", tone: "purple", lowUse: true, previousAmount: 43.90 },
  { id: "icloud", name: "iCloud+", amount: 14.90, day: 28, category: "Armazenamento", cycle: "monthly", payment: "Inter •••• 0934", status: "active", tone: "blue" },
  { id: "canva", name: "Canva Pro", amount: 34.90, day: 30, category: "Trabalho", cycle: "monthly", payment: "Nubank •••• 4821", status: "trial", tone: "orange", lowUse: true },
  { id: "figma", name: "Figma", amount: 85.00, day: 7, category: "Trabalho", cycle: "monthly", payment: "Mercado Pago", status: "active", tone: "purple" },
  { id: "adobe", name: "Adobe", amount: 74.90, day: 12, category: "Trabalho", cycle: "monthly", payment: "Nubank •••• 4821", status: "active", tone: "orange" },
  { id: "cloud", name: "Cloud Storage", amount: 39.90, day: 16, category: "Armazenamento", cycle: "monthly", payment: "Mercado Pago", status: "active", tone: "blue", variable: true }
];

const serviceMatchers = [
  { re: /openai|chatgpt/i, name: "ChatGPT", category: "IA", tone: "green" },
  { re: /spotify/i, name: "Spotify", category: "Música", tone: "green" },
  { re: /disney/i, name: "Disney+", category: "Streaming", tone: "purple" },
  { re: /netflix/i, name: "Netflix", category: "Streaming", tone: "orange" },
  { re: /canva/i, name: "Canva Pro", category: "Trabalho", tone: "orange" },
  { re: /icloud|apple\.com\/bill|apple services/i, name: "Apple / iCloud", category: "Armazenamento", tone: "blue" },
  { re: /adobe/i, name: "Adobe", category: "Trabalho", tone: "orange" },
  { re: /google one|google storage/i, name: "Google One", category: "Armazenamento", tone: "blue" },
  { re: /youtube.*premium/i, name: "YouTube Premium", category: "Streaming", tone: "orange" },
  { re: /figma/i, name: "Figma", category: "Trabalho", tone: "purple" },
  { re: /github/i, name: "GitHub", category: "Trabalho", tone: "green" },
  { re: /prime video|amazon prime/i, name: "Amazon Prime", category: "Streaming", tone: "blue" }
];

let subscriptions = loadSubscriptions();
let ascendingSort = true;
let onboardingState = { step: 0, pain: null, start: null };

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function cloneDemo() {
  return demoSubscriptions.map(item => ({ ...item }));
}

function loadSubscriptions() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) && stored.length ? stored : cloneDemo();
  } catch {
    return cloneDemo();
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
}

function monthlyEquivalent(item) {
  if (item.cycle === "yearly") return Number(item.amount) / 12;
  if (item.cycle === "weekly") return Number(item.amount) * 52 / 12;
  return Number(item.amount);
}

function initials(name) {
  return name
    .replace(/[^\p{L}\p{N}\s+]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase() || "•";
}

function daysUntil(day) {
  const now = new Date();
  const today = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();
  let target = new Date(year, month, Math.min(day, new Date(year, month + 1, 0).getDate()));

  if (target < new Date(year, month, today)) {
    target = new Date(year, month + 1, Math.min(day, new Date(year, month + 2, 0).getDate()));
  }

  const start = new Date(year, month, today);
  return Math.round((target - start) / 86400000);
}

function dueLabel(day) {
  const diff = daysUntil(day);
  if (diff === 0) return "hoje";
  if (diff === 1) return "amanhã";
  return `em ${diff} dias`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderMetrics() {
  const active = subscriptions.filter(item => item.status !== "cancelled");
  const monthly = active.reduce((sum, item) => sum + monthlyEquivalent(item), 0);
  const waste = active.filter(item => item.lowUse).reduce((sum, item) => sum + monthlyEquivalent(item), 0);
  const upcoming = active.filter(item => {
    const diff = daysUntil(item.day);
    return diff >= 0 && diff <= 7;
  });
  const upcomingTotal = upcoming.reduce((sum, item) => sum + Number(item.amount), 0);

  document.querySelector("#monthlyTotal").textContent = brl.format(monthly);
  document.querySelector("#yearlyTotal").textContent = brl.format(monthly * 12);
  document.querySelector("#wasteTotal").textContent = `${brl.format(waste)}/mês`;
  document.querySelector("#nextSevenTotal").textContent = brl.format(upcomingTotal);
  document.querySelector("#calendarSevenTotal").textContent = brl.format(upcomingTotal);
  document.querySelector("#calendarCount").textContent = String(active.length);

  const countLabel = document.querySelector("#subscriptionCountLabel");
  if (countLabel) countLabel.textContent = `${active.length} recorrência${active.length === 1 ? "" : "s"}`;

  const heroCopy = document.querySelector(".hero-copy");
  if (!upcoming.length) {
    heroCopy.textContent = "Nenhuma cobrança prevista para os próximos 7 dias.";
  } else {
    const largest = upcoming.reduce((a, b) => Number(a.amount) > Number(b.amount) ? a : b);
    heroCopy.textContent = `${upcoming.length} cobrança${upcoming.length > 1 ? "s" : ""} chegando. A maior é ${largest.name}, ${dueLabel(largest.day)}.`;
  }

  const ring = document.querySelector(".hero-ring span");
  if (ring) ring.textContent = String(upcoming.length);
}

function renderSubscriptions() {
  const list = document.querySelector("#subscriptionsList");
  const ordered = [...subscriptions].sort((a, b) => {
    const delta = daysUntil(a.day) - daysUntil(b.day);
    return ascendingSort ? delta : -delta;
  });

  if (!ordered.length) {
    list.innerHTML = '<div class="import-result">Nenhuma assinatura cadastrada ainda.</div>';
    return;
  }

  list.innerHTML = ordered.map(item => {
    const cycleLabel = item.cycle === "yearly" ? "anual" : item.cycle === "weekly" ? "semanal" : "mensal";
    const statusLabel = item.status === "trial" ? "teste grátis" : item.variable ? "valor variável" : cycleLabel;
    const previous = item.previousAmount ? `<span>antes ${brl.format(item.previousAmount)}</span>` : "";

    return `
      <article class="subscription-row" data-id="${item.id}">
        <div class="subscription-main">
          <div class="service-icon ${item.tone || "green"}">${initials(item.name)}</div>
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(item.category)} · ${statusLabel}</span>
          </div>
        </div>
        <div class="subscription-meta">
          <strong>Dia ${item.day}</strong>
          <span>${dueLabel(item.day)}</span>
        </div>
        <div class="subscription-meta">
          <strong>${escapeHtml(item.payment || "Não informado")}</strong>
          <span>pagamento</span>
        </div>
        <div class="subscription-amount">
          <strong>${brl.format(Number(item.amount))}</strong>
          <span>${cycleLabel}</span>
          ${previous}
        </div>
        <button class="row-menu" data-remove="${item.id}" title="Remover assinatura" aria-label="Remover ${escapeHtml(item.name)}">×</button>
      </article>`;
  }).join("");
}

function renderCalendar() {
  const grid = document.querySelector("#calendarGrid");
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(now);
  const heading = document.querySelector("#calendarMonth");

  heading.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push('<div class="calendar-day muted" aria-hidden="true"></div>');
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const items = subscriptions.filter(item => item.status !== "cancelled" && Number(item.day) === day);
    const total = items.reduce((sum, item) => sum + Number(item.amount), 0);
    const weight = total >= 120 ? "heavy" : total >= 50 ? "medium" : "light";
    const labels = items.map(item =>
      `<span class="day-charge ${weight}" title="${escapeHtml(item.name)} — ${brl.format(Number(item.amount))}">${escapeHtml(item.name)} · ${brl.format(Number(item.amount))}</span>`
    ).join("");

    cells.push(`<div class="calendar-day ${day === now.getDate() ? "today" : ""}">
      <span class="day-number">${day}</span>
      ${labels}
    </div>`);
  }

  grid.innerHTML = cells.join("");
}

function renderAll() {
  renderMetrics();
  renderSubscriptions();
  renderCalendar();
}

function navigate(screen, historyMode = "push") {
  const target = VALID_SCREENS.has(screen) ? screen : "inicio";

  document.querySelectorAll("[data-app-screen]").forEach(section => {
    const active = section.dataset.appScreen === target;
    section.hidden = !active;
    section.classList.toggle("active", active);
    if (active) section.querySelector(".screen-scroll")?.scrollTo({ top: 0, behavior: "instant" });
  });

  document.querySelectorAll(".nav-link[data-screen]").forEach(link => {
    const active = link.dataset.screen === target;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  const nextHash = `#${target}`;
  if (historyMode === "push" && location.hash !== nextHash) history.pushState({ screen: target }, "", nextHash);
  if (historyMode === "replace" && location.hash !== nextHash) history.replaceState({ screen: target }, "", nextHash);
}

function openModal(id) {
  document.querySelector("#" + id)?.classList.remove("hidden");
}

function closeModal(id) {
  document.querySelector("#" + id)?.classList.add("hidden");
}

function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2400);
}

function parseAmountFromLine(line) {
  const values = [...line.matchAll(/(?:R\$\s*)?(-?\d{1,6}(?:[.,]\d{2}))/g)]
    .map(match => Number(match[1].replace(/\./g, "").replace(",", ".")))
    .filter(value => Number.isFinite(value) && value > 0 && value < 10000);

  return values.length ? values.at(-1) : 0;
}

function parseDayFromLine(line) {
  const match = line.match(/\b(\d{1,2})[\/-](\d{1,2})(?:[\/-]\d{2,4})?\b/);
  if (!match) return new Date().getDate();
  const day = Number(match[1]);
  return day >= 1 && day <= 31 ? day : new Date().getDate();
}

function scanCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const found = [];

  for (const line of lines) {
    for (const service of serviceMatchers) {
      if (!service.re.test(line)) continue;
      const amount = parseAmountFromLine(line);
      const key = service.name.toLowerCase();

      if (found.some(item => item.name.toLowerCase() === key)) continue;

      found.push({
        id: `import-${Date.now()}-${found.length}`,
        name: service.name,
        amount: amount || 0,
        day: parseDayFromLine(line),
        category: service.category,
        cycle: "monthly",
        payment: "Importado da fatura",
        status: "active",
        tone: service.tone
      });
    }
  }

  return found;
}

function showImportCandidates(candidates) {
  const result = document.querySelector("#importResult");
  result.classList.remove("hidden");

  if (!candidates.length) {
    result.innerHTML = "<strong>Nenhuma assinatura conhecida encontrada.</strong><br>Você pode cadastrar a cobrança manualmente. A Loopa ainda não envia este arquivo para nenhum servidor.";
    return;
  }

  result.innerHTML = `
    <strong>Encontramos ${candidates.length} possível${candidates.length > 1 ? "is" : ""} assinatura${candidates.length > 1 ? "s" : ""}.</strong>
    <p>${candidates.map(item => `${escapeHtml(item.name)}${item.amount ? " · " + brl.format(item.amount) : ""}`).join("<br>")}</p>
    <button class="button primary full" id="confirmImport">Adicionar encontrados</button>`;

  document.querySelector("#confirmImport").addEventListener("click", () => {
    const existing = new Set(subscriptions.map(item => item.name.toLowerCase()));
    let added = 0;

    for (const item of candidates) {
      if (existing.has(item.name.toLowerCase())) continue;
      subscriptions.push(item);
      existing.add(item.name.toLowerCase());
      added++;
    }

    persist();
    renderAll();
    closeModal("importModal");
    navigate("assinaturas", "push");
    toast(added ? `${added} assinatura${added > 1 ? "s" : ""} adicionada${added > 1 ? "s" : ""}.` : "Essas assinaturas já estavam na Loopa.");
  }, { once: true });
}

function renderOnboarding() {
  const content = document.querySelector("#onboardingContent");
  const progress = document.querySelector("#onboardingProgress");
  const steps = 3;
  progress.style.width = `${((onboardingState.step + 1) / steps) * 100}%`;

  if (onboardingState.step === 0) {
    content.innerHTML = `
      <div class="onboarding-body">
        <span class="eyebrow">Bem-vindo à Loopa</span>
        <h2>O que mais incomoda nas suas assinaturas?</h2>
        <p>Isso ajusta o que a Loopa destaca primeiro. Você pode mudar tudo depois.</p>
        <div class="choice-grid" data-choice="pain">
          <button class="choice" data-value="forget">Esquecer cobranças que continuam chegando</button>
          <button class="choice" data-value="trials">Testes grátis virando cobrança</button>
          <button class="choice" data-value="waste">Pagar por algo que quase não uso</button>
          <button class="choice" data-value="total">Não saber quanto gasto no total</button>
        </div>
        <div class="onboarding-actions">
          <button class="text-button" data-skip>Explorar demonstração</button>
          <button class="button primary" data-next disabled>Continuar</button>
        </div>
      </div>`;
  } else if (onboardingState.step === 1) {
    content.innerHTML = `
      <div class="onboarding-body">
        <span class="eyebrow">Automação primeiro</span>
        <h2>Como você quer começar?</h2>
        <p>O objetivo é reduzir trabalho manual. A importação já funciona com CSV nesta versão.</p>
        <div class="choice-grid" data-choice="start">
          <button class="choice" data-value="demo">Usar dados de demonstração</button>
          <button class="choice" data-value="import">Importar uma fatura CSV</button>
          <button class="choice" data-value="manual">Adicionar uma assinatura</button>
        </div>
        <div class="onboarding-actions">
          <button class="text-button" data-back>Voltar</button>
          <button class="button primary" data-next disabled>Continuar</button>
        </div>
      </div>`;
  } else {
    content.innerHTML = `
      <div class="onboarding-body">
        <span class="eyebrow">Seu radar está pronto</span>
        <h2>Veja primeiro o que pode mexer no seu dinheiro.</h2>
        <p>A Loopa prioriza próximas cobranças, testes grátis, aumentos e possíveis desperdícios.</p>
        <div class="choice-grid">
          <div class="choice selected"><strong>Próximos 7 dias</strong><br><span style="color:var(--muted)">urgências em primeiro plano</span></div>
          <div class="choice selected"><strong>Uma tela por tarefa</strong><br><span style="color:var(--muted)">menos rolagem, mais clareza no celular</span></div>
        </div>
        <div class="onboarding-actions">
          <button class="text-button" data-back>Voltar</button>
          <button class="button primary" data-finish>Entrar na Loopa</button>
        </div>
      </div>`;
  }

  bindOnboardingControls();
}

function bindOnboardingControls() {
  const container = document.querySelector("#onboardingContent");
  const choiceGroup = container.querySelector("[data-choice]");
  const next = container.querySelector("[data-next]");

  choiceGroup?.querySelectorAll(".choice").forEach(button => {
    button.addEventListener("click", () => {
      choiceGroup.querySelectorAll(".choice").forEach(item => item.classList.remove("selected"));
      button.classList.add("selected");
      onboardingState[choiceGroup.dataset.choice] = button.dataset.value;
      if (next) next.disabled = false;
    });
  });

  next?.addEventListener("click", () => {
    onboardingState.step += 1;
    renderOnboarding();
  });

  container.querySelector("[data-back]")?.addEventListener("click", () => {
    onboardingState.step = Math.max(0, onboardingState.step - 1);
    renderOnboarding();
  });

  container.querySelector("[data-skip]")?.addEventListener("click", finishOnboarding);

  container.querySelector("[data-finish]")?.addEventListener("click", () => {
    const start = onboardingState.start;
    finishOnboarding();
    if (start === "import") openModal("importModal");
    if (start === "manual") openModal("addModal");
  });
}

function finishOnboarding() {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify({
    completedAt: new Date().toISOString(),
    pain: onboardingState.pain,
    start: onboardingState.start
  }));
  document.querySelector("#onboarding").classList.add("hidden");
}

function setupNavigation() {
  document.querySelectorAll(".nav-link[data-screen]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      navigate(link.dataset.screen, "push");
    });
  });

  window.addEventListener("popstate", () => {
    navigate(location.hash.slice(1), "none");
  });
}

function setupEvents() {
  document.querySelectorAll("[data-modal-open]").forEach(button => {
    button.addEventListener("click", () => openModal(button.dataset.modalOpen));
  });

  document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => closeModal(button.dataset.close));
  });

  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", event => {
      if (event.target === backdrop) backdrop.classList.add("hidden");
    });
  });

  document.querySelector("#subscriptionForm").addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const amount = Number(String(data.get("amount")).replace(/\./g, "").replace(",", "."));
    const day = Number(data.get("day"));

    if (!Number.isFinite(amount) || amount <= 0 || day < 1 || day > 31) {
      toast("Confira o valor e o dia da cobrança.");
      return;
    }

    subscriptions.push({
      id: `manual-${Date.now()}`,
      name: String(data.get("name")).trim(),
      amount,
      day,
      category: String(data.get("category")),
      cycle: String(data.get("cycle")),
      payment: String(data.get("payment")).trim() || "Não informado",
      status: "active",
      tone: "green"
    });

    persist();
    renderAll();
    event.currentTarget.reset();
    closeModal("addModal");
    navigate("assinaturas", "push");
    toast("Assinatura adicionada.");
  });

  document.querySelector("#subscriptionsList").addEventListener("click", event => {
    const remove = event.target.closest("[data-remove]");
    if (!remove) return;

    const item = subscriptions.find(sub => sub.id === remove.dataset.remove);
    if (!item) return;
    if (!confirm(`Remover ${item.name} da Loopa?`)) return;

    subscriptions = subscriptions.filter(sub => sub.id !== item.id);
    persist();
    renderAll();
    toast("Assinatura removida.");
  });

  document.querySelector("#sortButton").addEventListener("click", event => {
    ascendingSort = !ascendingSort;
    event.currentTarget.textContent = ascendingSort ? "Próxima cobrança ↓" : "Próxima cobrança ↑";
    renderSubscriptions();
  });

  document.querySelector("#statementFile").addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      showImportCandidates([]);
      toast("Use um CSV de até 4 MB neste MVP.");
      return;
    }

    try {
      const text = await file.text();
      showImportCandidates(scanCsv(text));
    } catch {
      showImportCandidates([]);
      toast("Não consegui ler esse arquivo.");
    }
  });

  document.querySelector("#resetDemo").addEventListener("click", () => {
    if (!confirm("Restaurar os dados de demonstração? Seus dados locais atuais serão substituídos.")) return;

    subscriptions = cloneDemo();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    renderAll();
    navigate("inicio", "push");
    toast("Demonstração restaurada.");
  });

  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    document.querySelectorAll(".modal-backdrop").forEach(modal => modal.classList.add("hidden"));
  });
}

function updateDate() {
  const label = document.querySelector("#todayLabel");
  if (!label) return;

  label.textContent = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long"
  }).format(new Date());
}

function init() {
  persist();
  updateDate();
  renderAll();
  setupNavigation();
  setupEvents();

  const initial = VALID_SCREENS.has(location.hash.slice(1)) ? location.hash.slice(1) : "inicio";
  navigate(initial, location.hash ? "none" : "replace");

  if (!localStorage.getItem(ONBOARDING_KEY)) {
    document.querySelector("#onboarding").classList.remove("hidden");
    renderOnboarding();
  }
}

document.addEventListener("DOMContentLoaded", init);
