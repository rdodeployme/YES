const STORAGE_KEY = "naudic-business-pulse-v1";

const money = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
const moneyPrecise = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const number = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 1 });

const treatmentNames = {
  operating_expense: "Operating expense",
  one_off: "One-off expense",
  inventory_purchase: "Inventory purchase",
  staff: "Staff",
  fulfilment: "Fulfilment",
  marketing: "Marketing",
  cogs: "COGS",
  revenue: "Sales revenue",
  other_income: "Other income",
  cash_only: "Cash only",
  uncategorised: "Uncategorised"
};

function scaledSeries(values, target) {
  const sum = values.reduce((a, b) => a + b, 0);
  const result = values.map((v) => Math.round((v / sum) * target * 100) / 100);
  result[result.length - 1] += Math.round((target - result.reduce((a, b) => a + b, 0)) * 100) / 100;
  return result;
}

function makeDemoData() {
  const revenues = scaledSeries([22, 27, 25, 32, 26, 29, 31, 35, 27, 40, 30, 34, 31, 36], 42460);
  const orders = scaledSeries([15, 18, 17, 23, 19, 19, 21, 23, 18, 26, 20, 22, 21, 25], 287).map(Math.round);
  orders[orders.length - 1] += 287 - orders.reduce((a, b) => a + b, 0);
  const metaSpend = scaledSeries([380, 410, 400, 430, 420, 440, 450, 470, 455, 490, 460, 480, 465, 480], 6230);
  const googleSpend = scaledSeries([120, 135, 140, 150, 145, 155, 160, 170, 165, 180, 175, 180, 170, 175], 2220);
  const metaRevenue = scaledSeries([13, 15, 14, 18, 15, 17, 18, 18, 16, 20, 18, 19, 18, 21], 18900);
  const googleRevenue = scaledSeries([7, 8, 7, 9, 8, 8, 9, 10, 8, 11, 9, 9, 9, 10], 8400);
  const edmRevenue = scaledSeries([0, 19, 0, 0, 12, 0, 17, 0, 0, 21, 0, 15, 0, 16], 7850);
  const daily = revenues.map((revenue, index) => ({
    date: `2026-09-${String(index + 1).padStart(2, "0")}`,
    revenue,
    orders: orders[index],
    metaSpend: metaSpend[index],
    metaRevenue: metaRevenue[index],
    googleSpend: googleSpend[index],
    googleRevenue: googleRevenue[index],
    edmRevenue: edmRevenue[index],
    refunds: index === 8 ? 540 : index === 12 ? 310 : 0
  }));

  return {
    version: 1,
    selectedMonth: "2026-09",
    settings: {
      revenueTarget: 85000,
      orderTarget: 575,
      marketingBudget: 20000,
      staffBudget: 38000,
      metaBudget: 14000,
      googleBudget: 5000,
      otherBudget: 1000,
      cogsPercent: 31.6,
      paymentFeePercent: 2.0,
      fulfilmentPerOrder: 6.4,
      openingCash: 72800,
      inventoryValue: 126400,
      paceTolerance: 5
    },
    daily,
    previousRevenue: scaledSeries([20, 23, 24, 25, 27, 26, 28, 29, 25, 31, 27, 30, 29, 31], 35920),
    people: [
      { id: crypto.randomUUID(), name: "Retail & operations team", type: "Wages", base: 18800, onCosts: 2256, budget: 21500 },
      { id: crypto.randomUUID(), name: "Ecommerce & marketing", type: "Contractors", base: 9400, onCosts: 0, budget: 10000 },
      { id: crypto.randomUUID(), name: "Warehouse support", type: "Casual", base: 7100, onCosts: 852, budget: 6500 }
    ],
    items: [
      { id: crypto.randomUUID(), name: "Warehouse rent", direction: "out", amount: 4500, treatment: "operating_expense", date: "2026-09-01", dueDate: "", status: "paid", recurrence: "monthly", notes: "Monthly facility cost" },
      { id: crypto.randomUUID(), name: "Shopify", direction: "out", amount: 450, treatment: "operating_expense", date: "2026-09-02", dueDate: "", status: "paid", recurrence: "monthly", notes: "Platform subscription" },
      { id: crypto.randomUUID(), name: "Klaviyo", direction: "out", amount: 525, treatment: "operating_expense", date: "2026-09-04", dueDate: "", status: "paid", recurrence: "monthly", notes: "EDM platform" },
      { id: crypto.randomUUID(), name: "Software & apps", direction: "out", amount: 680, treatment: "operating_expense", date: "2026-09-06", dueDate: "", status: "paid", recurrence: "monthly", notes: "Monthly tools" },
      { id: crypto.randomUUID(), name: "Accounting & admin", direction: "out", amount: 650, treatment: "operating_expense", date: "2026-09-09", dueDate: "", status: "paid", recurrence: "monthly", notes: "Operating services" },
      { id: crypto.randomUUID(), name: "Phone & internet", direction: "out", amount: 260, treatment: "operating_expense", date: "2026-09-10", dueDate: "", status: "paid", recurrence: "monthly", notes: "Communications" },
      { id: crypto.randomUUID(), name: "Spring supplier deposit", direction: "out", amount: 12500, treatment: "inventory_purchase", date: "2026-09-05", dueDate: "", status: "paid", recurrence: "once", notes: "New stock deposit" },
      { id: crypto.randomUUID(), name: "Summer PO balance", direction: "out", amount: 31000, treatment: "inventory_purchase", date: "2026-09-14", dueDate: "2026-10-03", status: "committed", recurrence: "once", notes: "Balance on summer delivery" },
      { id: crypto.randomUUID(), name: "Campaign photography", direction: "out", amount: 1850, treatment: "one_off", date: "2026-09-11", dueDate: "", status: "paid", recurrence: "once", notes: "In Focus creative" },
      { id: crypto.randomUUID(), name: "Supplier credit", direction: "in", amount: 780, treatment: "other_income", date: "2026-09-12", dueDate: "", status: "paid", recurrence: "once", notes: "Damaged shipment credit" }
    ]
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.version === 1) return saved;
  } catch (error) {
    console.warn("Could not load saved state", error);
  }
  const demo = makeDemoData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  return demo;
}

let state = loadState();

function saveState(message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  renderAll();
  if (message) toast(message);
}

function monthParts() {
  const [year, month] = state.selectedMonth.split("-").map(Number);
  return { year, month, days: new Date(year, month, 0).getDate() };
}

function monthRecords() {
  return state.daily.filter((row) => row.date.startsWith(state.selectedMonth)).sort((a, b) => a.date.localeCompare(b.date));
}

function monthItems() {
  return state.items.filter((item) => item.date.startsWith(state.selectedMonth));
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + Number(row[key] || 0), 0);
}

function signedItem(item) {
  return Number(item.amount || 0) * (item.direction === "in" ? 1 : -1);
}

function treatmentTotal(items, treatment, status = ["paid"]) {
  return items.filter((item) => item.treatment === treatment && status.includes(item.status)).reduce((total, item) => total + signedItem(item), 0);
}

function getMetrics() {
  const daily = monthRecords();
  const items = monthItems();
  const { days } = monthParts();
  const elapsed = Math.max(daily.length, 1);
  const progress = elapsed / days;
  const customRevenue = treatmentTotal(items, "revenue");
  const otherIncome = treatmentTotal(items, "other_income");
  const grossRevenue = sum(daily, "revenue") + customRevenue;
  const refunds = sum(daily, "refunds");
  const netRevenue = grossRevenue - refunds;
  const orders = sum(daily, "orders");
  const metaSpend = sum(daily, "metaSpend");
  const googleSpend = sum(daily, "googleSpend");
  const customMarketing = Math.abs(Math.min(0, treatmentTotal(items, "marketing")));
  const marketingSpend = metaSpend + googleSpend + customMarketing;
  const paidRevenue = sum(daily, "metaRevenue") + sum(daily, "googleRevenue");
  const edmRevenue = sum(daily, "edmRevenue");
  const cogsBase = netRevenue * (state.settings.cogsPercent / 100);
  const cogsAdjustment = -treatmentTotal(items, "cogs");
  const cogs = cogsBase + cogsAdjustment;
  const grossProfit = netRevenue - cogs;
  const contribution = grossProfit - marketingSpend;
  const teamMonthly = state.people.reduce((total, person) => total + Number(person.base) + Number(person.onCosts), 0);
  const teamMtd = teamMonthly * progress + Math.abs(Math.min(0, treatmentTotal(items, "staff")));
  const fulfilment = orders * state.settings.fulfilmentPerOrder + Math.abs(Math.min(0, treatmentTotal(items, "fulfilment")));
  const paymentFees = netRevenue * state.settings.paymentFeePercent / 100;
  const operatingCosts = Math.abs(Math.min(0, treatmentTotal(items, "operating_expense"))) + Math.abs(Math.min(0, treatmentTotal(items, "one_off")));
  const operatingIncomeAdjustments = Math.max(0, treatmentTotal(items, "operating_expense")) + Math.max(0, treatmentTotal(items, "one_off")) + otherIncome;
  const operatingPosition = contribution - teamMtd - fulfilment - paymentFees - operatingCosts + operatingIncomeAdjustments;
  const inventoryPaid = Math.abs(Math.min(0, treatmentTotal(items, "inventory_purchase", ["paid"])));
  const inventoryIncoming = Math.max(0, treatmentTotal(items, "inventory_purchase", ["paid"]));
  const cashOnly = treatmentTotal(items, "cash_only");
  const cashIn = netRevenue + otherIncome + inventoryIncoming + Math.max(0, cashOnly);
  const cashOut = marketingSpend + teamMtd + fulfilment + paymentFees + operatingCosts + inventoryPaid + Math.abs(Math.min(0, cashOnly));
  const cashPosition = state.settings.openingCash + cashIn - cashOut;
  const last7 = daily.slice(-7);
  const dailyRevenueAvg = netRevenue / elapsed;
  const last7RevenueAvg = (sum(last7, "revenue") - sum(last7, "refunds")) / Math.max(last7.length, 1);
  const projectedRevenue = netRevenue + (daily.length > 7 ? .6 * last7RevenueAvg + .4 * dailyRevenueAvg : dailyRevenueAvg) * (days - elapsed);
  const dailySpendAvg = marketingSpend / elapsed;
  const last7Spend = sum(last7, "metaSpend") + sum(last7, "googleSpend");
  const last7SpendAvg = last7Spend / Math.max(last7.length, 1);
  const projectedMarketing = marketingSpend + (daily.length > 7 ? .6 * last7SpendAvg + .4 * dailySpendAvg : dailySpendAvg) * (days - elapsed);
  const projectedOrders = orders / elapsed * days;
  const expectedRevenue = state.settings.revenueTarget * progress;
  const expectedMarketing = state.settings.marketingBudget * progress;
  const expectedOrders = state.settings.orderTarget * progress;
  const roas = marketingSpend ? paidRevenue / marketingSpend : 0;
  const mer = marketingSpend ? netRevenue / marketingSpend : 0;
  const paidOrders = Math.round(paidRevenue / Math.max(netRevenue / Math.max(orders, 1), 1));
  const cpa = paidOrders ? marketingSpend / paidOrders : 0;
  const aov = orders ? netRevenue / orders : 0;
  const stockValue = Math.max(0, state.settings.inventoryValue + inventoryPaid - cogs);
  const stockOnOrder = Math.abs(Math.min(0, treatmentTotal(items, "inventory_purchase", ["planned", "committed"])));
  const stockCoverMonths = cogs ? stockValue / (cogs / progress) : 0;

  return { daily, items, days, elapsed, progress, grossRevenue, refunds, netRevenue, otherIncome, orders, metaSpend, googleSpend, marketingSpend, paidRevenue, edmRevenue, cogs, grossProfit, contribution, teamMonthly, teamMtd, fulfilment, paymentFees, operatingCosts, operatingPosition, inventoryPaid, cashIn, cashOut, cashPosition, projectedRevenue, projectedMarketing, projectedOrders, expectedRevenue, expectedMarketing, expectedOrders, roas, mer, paidOrders, cpa, aov, stockValue, stockOnOrder, stockCoverMonths };
}

function fmtPercent(value, digits = 1) {
  return `${Number(value || 0).toFixed(digits)}%`;
}

function variancePercent(actual, comparison) {
  return comparison ? ((actual - comparison) / comparison) * 100 : 0;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function cumulative(values) {
  let running = 0;
  return values.map((value) => (running += Number(value || 0)));
}

function projectionSeries(actual, totalDays, projectedEnd) {
  const result = [...actual];
  const current = actual[actual.length - 1] || 0;
  const remaining = totalDays - actual.length;
  for (let i = 1; i <= remaining; i++) result.push(current + (projectedEnd - current) * (i / remaining));
  return result;
}

function lineChart({ series, days, height = 250, currency = true }) {
  const width = 780;
  const pad = { top: 18, right: 12, bottom: 28, left: 48 };
  const all = series.flatMap((item) => item.values.filter((v) => Number.isFinite(v)));
  const max = Math.max(...all, 1) * 1.08;
  const x = (index) => pad.left + (index / Math.max(days - 1, 1)) * (width - pad.left - pad.right);
  const y = (value) => height - pad.bottom - (value / max) * (height - pad.top - pad.bottom);
  const levels = [0, .25, .5, .75, 1];
  const grid = levels.map((level) => {
    const value = max * level;
    return `<line class="grid-line" x1="${pad.left}" x2="${width - pad.right}" y1="${y(value)}" y2="${y(value)}"/><text x="${pad.left - 8}" y="${y(value) + 3}" text-anchor="end">${currency ? money.format(value).replace(".00", "") : Math.round(value)}</text>`;
  }).join("");
  const labels = [1, Math.ceil(days / 2), days].map((day) => `<text x="${x(day - 1)}" y="${height - 5}" text-anchor="middle">Day ${day}</text>`).join("");
  const lines = series.map((item) => {
    const points = item.values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
    const area = item.area ? `<polygon class="chart-area" fill="${item.color}" points="${x(0)},${height - pad.bottom} ${points} ${x(item.values.length - 1)},${height - pad.bottom}"/>` : "";
    const dash = item.dash ? `stroke-dasharray="7 7"` : "";
    const dot = item.dot ? `<circle class="chart-dot" cx="${x(item.values.length - 1)}" cy="${y(item.values[item.values.length - 1])}" r="5" fill="${item.color}"/>` : "";
    return `${area}<polyline class="chart-line" points="${points}" stroke="${item.color}" stroke-width="${item.width || 2}" ${dash}/>${dot}`;
  }).join("");
  return `<svg viewBox="0 0 ${width} ${height}" role="img">${grid}${labels}${lines}</svg>`;
}

function barChart(values) {
  const width = 720, height = 250, left = 44, bottom = 28, top = 18;
  const max = Math.max(...values, 1) * 1.12;
  const step = (width - left - 8) / values.length;
  const bars = values.map((value, index) => {
    const barHeight = (value / max) * (height - top - bottom);
    return `<rect x="${left + index * step + step * .16}" y="${height - bottom - barHeight}" width="${step * .68}" height="${barHeight}" rx="3" fill="#5d2338"/><text x="${left + index * step + step * .5}" y="${height - 7}" text-anchor="middle">${index + 1}</text>`;
  }).join("");
  const levels = [0, .5, 1].map((level) => {
    const y = height - bottom - level * (height - top - bottom);
    return `<line class="grid-line" x1="${left}" x2="${width}" y1="${y}" y2="${y}"/><text x="${left - 7}" y="${y + 3}" text-anchor="end">${money.format(max * level)}</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${width} ${height}" role="img">${levels}${bars}</svg>`;
}

function miniMetric(label, value, note = "") {
  return `<article class="mini-metric"><span>${label}</span><strong>${value}</strong>${note ? `<small>${note}</small>` : ""}</article>`;
}

function kpiCard({ label, value, context, delta, good, progress, featured }) {
  return `<article class="kpi-card ${featured ? "featured" : ""}"><div class="kpi-label"><span>${label}</span><span>${Math.round(progress)}%</span></div><div class="kpi-value">${value}</div><div class="kpi-context">${context}</div><span class="delta ${good ? "good" : "bad"}">${delta}</span><div class="progress-track"><div class="progress-fill" style="width:${Math.min(progress, 100)}%"></div></div></article>`;
}

function renderOverview(metrics) {
  const revenueVar = variancePercent(metrics.netRevenue, metrics.expectedRevenue);
  const marketingVar = variancePercent(metrics.marketingSpend, metrics.expectedMarketing);
  const orderVar = variancePercent(metrics.orders, metrics.expectedOrders);
  const tolerance = state.settings.paceTolerance;
  const status = revenueVar > tolerance ? "ahead" : revenueVar < -tolerance ? "behind" : "track";
  const statusText = status === "ahead" ? "Ahead of plan" : status === "behind" ? "Behind plan" : "On track";
  const monthName = new Date(`${state.selectedMonth}-01T12:00:00`).toLocaleDateString("en-AU", { month: "long", year: "numeric" });
  document.getElementById("selected-month").textContent = monthName;
  document.getElementById("date-label").textContent = `${monthName} business pulse`;
  document.getElementById("month-progress-label").textContent = `Day ${metrics.elapsed} of ${metrics.days} · ${fmtPercent(metrics.progress * 100)} complete`;
  const statusEl = document.getElementById("overall-status");
  statusEl.className = `pulse-status ${status}`;
  statusEl.querySelector("strong").textContent = statusText;

  document.getElementById("overview-kpis").innerHTML = [
    kpiCard({ label: "Net revenue", value: money.format(metrics.netRevenue), context: `Expected ${money.format(metrics.expectedRevenue)} · Projected ${money.format(metrics.projectedRevenue)}`, delta: `${revenueVar >= 0 ? "↑" : "↓"} ${fmtPercent(Math.abs(revenueVar))} ${revenueVar >= 0 ? "ahead" : "behind"}`, good: revenueVar >= 0, progress: metrics.netRevenue / state.settings.revenueTarget * 100, featured: true }),
    kpiCard({ label: "Operating position", value: money.format(metrics.operatingPosition), context: `${fmtPercent(metrics.netRevenue ? metrics.operatingPosition / metrics.netRevenue * 100 : 0)} operating margin · COGS estimated`, delta: metrics.operatingPosition >= 0 ? "Positive this month" : "Costs exceed contribution", good: metrics.operatingPosition >= 0, progress: Math.max(0, metrics.operatingPosition / Math.max(metrics.netRevenue, 1) * 100), featured: false }),
    kpiCard({ label: "Marketing budget", value: money.format(metrics.marketingSpend), context: `${money.format(state.settings.marketingBudget - metrics.marketingSpend)} remaining · Projected ${money.format(metrics.projectedMarketing)}`, delta: `${Math.abs(marketingVar).toFixed(1)}% ${marketingVar > 0 ? "over" : "under"} pace`, good: Math.abs(marketingVar) <= 10, progress: metrics.marketingSpend / state.settings.marketingBudget * 100, featured: false }),
    kpiCard({ label: "Orders", value: number.format(metrics.orders), context: `Expected ${Math.round(metrics.expectedOrders)} · Projected ${Math.round(metrics.projectedOrders)}`, delta: `${orderVar >= 0 ? "↑" : "↓"} ${fmtPercent(Math.abs(orderVar))} ${orderVar >= 0 ? "ahead" : "behind"}`, good: orderVar >= 0, progress: metrics.orders / state.settings.orderTarget * 100, featured: false })
  ].join("");

  const actual = cumulative(metrics.daily.map((d) => d.revenue - d.refunds));
  const actualProjected = projectionSeries(actual, metrics.days, metrics.projectedRevenue);
  const target = Array.from({ length: metrics.days }, (_, i) => state.settings.revenueTarget * ((i + 1) / metrics.days));
  const prevActual = cumulative(state.previousRevenue || []);
  const prevProjected = projectionSeries(prevActual, metrics.days, (prevActual.at(-1) || 0) / Math.max(prevActual.length, 1) * metrics.days);
  document.getElementById("revenue-chart").innerHTML = lineChart({ days: metrics.days, series: [
    { values: target, color: "#a8a097", width: 1.5, dash: true },
    { values: prevProjected, color: "#c9c2b9", width: 2 },
    { values: actualProjected, color: "#5d2338", width: 3, area: true, dot: true }
  ] });
  document.getElementById("revenue-chart-summary").innerHTML = `<div><span>MTD actual</span><strong>${money.format(metrics.netRevenue)}</strong></div><div><span>Target pace</span><strong>${money.format(metrics.expectedRevenue)}</strong></div><div><span>Projected</span><strong>${money.format(metrics.projectedRevenue)}</strong></div>`;

  const attention = [];
  const positive = [];
  if (metrics.projectedMarketing > state.settings.marketingBudget) attention.push(["Marketing may exceed budget", `${money.format(metrics.projectedMarketing - state.settings.marketingBudget)} projected overspend`]);
  if (metrics.stockCoverMonths < 2) attention.push(["Stock cover is tightening", `${metrics.stockCoverMonths.toFixed(1)} months estimated cover`]);
  if (state.items.some((item) => item.treatment === "uncategorised")) attention.push(["Transactions need classification", "Uncategorised items are excluded from operating performance"]);
  if (revenueVar < -tolerance) attention.push(["Revenue is behind pace", `${fmtPercent(Math.abs(revenueVar))} below the expected position`]);
  if (metrics.cpa > 40) attention.push(["Acquisition cost is elevated", `${moneyPrecise.format(metrics.cpa)} blended paid CPA`]);
  if (!attention.length) attention.push(["No critical performance issues", "Continue monitoring spend and stock commitments"]);
  if (revenueVar > 0) positive.push(["Revenue is ahead of pace", `${money.format(metrics.netRevenue - metrics.expectedRevenue)} above plan today`]);
  if (metrics.mer >= 4) positive.push(["Strong marketing efficiency", `${metrics.mer.toFixed(2)}× MER across paid spend`]);
  if (metrics.edmRevenue > 5000) positive.push(["EDM is contributing", `${money.format(metrics.edmRevenue)} attributed this month`]);
  document.getElementById("attention-list").innerHTML = attention.slice(0, 3).map(([title, detail]) => `<div class="signal"><i class="signal-dot"></i><div><strong>${title}</strong><small>${detail}</small></div></div>`).join("");
  document.getElementById("positive-list").innerHTML = positive.slice(0, 3).map(([title, detail]) => `<div class="signal good"><i class="signal-dot"></i><div><strong>${title}</strong><small>${detail}</small></div></div>`).join("");
  document.getElementById("signal-count").textContent = `${Math.min(attention.length, 3) + Math.min(positive.length, 3)} signals`;

  document.getElementById("performance-waterfall").innerHTML = [
    ["Net revenue", metrics.netRevenue, ""], ["Product COGS (estimated)", -metrics.cogs, ""], ["Gross profit", metrics.grossProfit, "highlight"], ["Marketing", -metrics.marketingSpend, ""], ["Contribution after marketing", metrics.contribution, "highlight"], ["People", -metrics.teamMtd, ""], ["Fulfilment & payment fees", -(metrics.fulfilment + metrics.paymentFees), ""], ["Operating costs", -metrics.operatingCosts, ""], ["Operating position", metrics.operatingPosition, "result"]
  ].map(([label, value, cls]) => `<div class="waterfall-row ${cls}"><span>${label}</span><strong>${value < 0 ? "−" : ""}${money.format(Math.abs(value))}</strong></div>`).join("");

  document.getElementById("cash-flow").innerHTML = `<div class="cash-columns"><div class="cash-column"><span>Cash in</span><strong>${money.format(metrics.cashIn)}</strong></div><div class="cash-column"><span>Cash out</span><strong>−${money.format(metrics.cashOut)}</strong></div></div><div class="cash-position"><span>Estimated current cash</span><strong>${money.format(metrics.cashPosition)}</strong><small>Opening balance ${money.format(state.settings.openingCash)}</small></div>`;
  renderCommitments(metrics);
}

function renderCommitments(metrics) {
  const now = new Date(`${state.selectedMonth}-${String(metrics.elapsed).padStart(2, "0")}T12:00:00`);
  const future = state.items.filter((item) => ["planned", "committed"].includes(item.status) && item.direction === "out").map((item) => ({ ...item, due: new Date(`${item.dueDate || item.date}T12:00:00`) })).sort((a, b) => a.due - b.due);
  const within = (days) => future.filter((item) => item.due >= now && item.due <= new Date(now.getTime() + days * 86400000)).reduce((total, item) => total + Number(item.amount), 0);
  document.getElementById("commitment-totals").innerHTML = [[7, "Next 7 days"], [30, "Next 30 days"], [90, "Next 90 days"]].map(([days, label]) => `<div><span>${label}</span><strong>${money.format(within(days))}</strong></div>`).join("");
  document.getElementById("commitment-list").innerHTML = future.slice(0, 5).map((item) => `<div class="commitment-item"><span class="date">${item.due.toLocaleDateString("en-AU", { day: "numeric", month: "short" })}</span><div><strong>${escapeHtml(item.name)}</strong><small>${treatmentNames[item.treatment]} · ${item.status}</small></div><b>${money.format(item.amount)}</b></div>`).join("") || `<div class="empty-state">No upcoming commitments recorded.</div>`;
}

function renderRevenue(metrics) {
  const revenueVar = variancePercent(metrics.netRevenue, metrics.expectedRevenue);
  document.getElementById("revenue-metrics").innerHTML = [
    miniMetric("Net revenue", money.format(metrics.netRevenue), `${fmtPercent(revenueVar)} vs pace`),
    miniMetric("Orders", number.format(metrics.orders), `${moneyPrecise.format(metrics.aov)} AOV`),
    miniMetric("Gross profit", money.format(metrics.grossProfit), `${fmtPercent(metrics.netRevenue ? metrics.grossProfit / metrics.netRevenue * 100 : 0)} gross margin`),
    miniMetric("Projected finish", money.format(metrics.projectedRevenue), `${money.format(state.settings.revenueTarget)} target`)
  ].join("");
  document.getElementById("daily-revenue-chart").innerHTML = barChart(metrics.daily.map((row) => row.revenue - row.refunds));
  const sources = [
    ["Meta attributed", sum(metrics.daily, "metaRevenue")],
    ["Google attributed", sum(metrics.daily, "googleRevenue")],
    ["EDM", metrics.edmRevenue],
    ["Organic / direct", Math.max(0, metrics.netRevenue - sum(metrics.daily, "metaRevenue") - sum(metrics.daily, "googleRevenue") - metrics.edmRevenue)]
  ];
  document.getElementById("revenue-source-list").innerHTML = sources.map(([label, value]) => `<div class="bar-row"><div class="bar-row-header"><span>${label}</span><strong>${money.format(value)} · ${fmtPercent(metrics.netRevenue ? value / metrics.netRevenue * 100 : 0)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, metrics.netRevenue ? value / metrics.netRevenue * 100 : 0)}%"></div></div></div>`).join("");
}

function renderMarketing(metrics) {
  document.getElementById("marketing-metrics").innerHTML = [
    miniMetric("Spend MTD", money.format(metrics.marketingSpend), `${fmtPercent(metrics.marketingSpend / state.settings.marketingBudget * 100)} of budget`),
    miniMetric("Blended ROAS", `${metrics.roas.toFixed(2)}×`, `${money.format(metrics.paidRevenue)} attributed revenue`),
    miniMetric("MER", `${metrics.mer.toFixed(2)}×`, "Total revenue ÷ marketing"),
    miniMetric("Paid CPA", moneyPrecise.format(metrics.cpa), `${metrics.paidOrders} estimated paid orders`)
  ].join("");
  const actual = cumulative(metrics.daily.map((row) => row.metaSpend + row.googleSpend));
  const projected = projectionSeries(actual, metrics.days, metrics.projectedMarketing);
  const target = Array.from({ length: metrics.days }, (_, i) => state.settings.marketingBudget * ((i + 1) / metrics.days));
  document.getElementById("marketing-chart").innerHTML = lineChart({ days: metrics.days, series: [{ values: target, color: "#a8a097", dash: true }, { values: projected, color: "#5d2338", width: 3, area: true, dot: true }] });
  document.getElementById("edm-summary").innerHTML = `<div class="edm-hero"><span>EDM revenue MTD</span><strong>${money.format(metrics.edmRevenue)}</strong><small>${fmtPercent(metrics.netRevenue ? metrics.edmRevenue / metrics.netRevenue * 100 : 0)} of total revenue</small></div><div class="edm-grid"><div><span>Recipients</span><strong>18,460</strong></div><div><span>Revenue / recipient</span><strong>${moneyPrecise.format(metrics.edmRevenue / 18460)}</strong></div><div><span>Click rate</span><strong>4.2%</strong></div></div>`;

  const channels = [
    { name: "Meta", spend: metrics.metaSpend, revenue: sum(metrics.daily, "metaRevenue"), budget: state.settings.metaBudget },
    { name: "Google", spend: metrics.googleSpend, revenue: sum(metrics.daily, "googleRevenue"), budget: state.settings.googleBudget }
  ];
  const rows = channels.map((channel) => {
    const orders = Math.round(channel.revenue / Math.max(metrics.aov, 1));
    const expected = channel.budget * metrics.progress;
    const pace = variancePercent(channel.spend, expected);
    return `<tr><td><strong>${channel.name}</strong></td><td>${money.format(channel.spend)}</td><td>${money.format(channel.revenue)}</td><td>${orders}</td><td>${moneyPrecise.format(channel.spend / Math.max(orders, 1))}</td><td>${(channel.revenue / Math.max(channel.spend, 1)).toFixed(2)}×</td><td>${fmtPercent(channel.spend / channel.budget * 100)}</td><td><span class="status-pill ${Math.abs(pace) < 10 ? "good" : "warn"}">${pace > 0 ? "+" : ""}${pace.toFixed(1)}%</span></td></tr>`;
  }).join("");
  document.getElementById("channel-table").innerHTML = rows + `<tr><td><strong>Total</strong></td><td><strong>${money.format(metrics.marketingSpend)}</strong></td><td><strong>${money.format(metrics.paidRevenue)}</strong></td><td>${metrics.paidOrders}</td><td>${moneyPrecise.format(metrics.cpa)}</td><td>${metrics.roas.toFixed(2)}×</td><td>${fmtPercent(metrics.marketingSpend / state.settings.marketingBudget * 100)}</td><td>—</td></tr>`;
}

function renderPeople(metrics) {
  document.getElementById("people-metrics").innerHTML = [
    miniMetric("People cost MTD", money.format(metrics.teamMtd), `${fmtPercent(metrics.teamMtd / (state.settings.staffBudget * metrics.progress) * 100)} of expected`),
    miniMetric("Monthly run rate", money.format(metrics.teamMonthly), `${money.format(state.settings.staffBudget)} budget`),
    miniMetric("Projected variance", money.format(metrics.teamMonthly - state.settings.staffBudget), metrics.teamMonthly > state.settings.staffBudget ? "Over budget" : "Under budget"),
    miniMetric("Share of revenue", fmtPercent(metrics.netRevenue ? metrics.teamMtd / metrics.netRevenue * 100 : 0), "People cost ÷ net revenue")
  ].join("");
  document.getElementById("people-list").innerHTML = state.people.map((person) => {
    const total = Number(person.base) + Number(person.onCosts);
    return `<div class="record-row"><div><strong>${escapeHtml(person.name)}</strong><span>${escapeHtml(person.type)}</span></div><div><span>Base</span><strong>${money.format(person.base)}</strong></div><div><span>On-costs</span><strong>${money.format(person.onCosts)}</strong></div><div><span>Total</span><strong>${money.format(total)}</strong></div><div><span>Budget</span><strong>${money.format(person.budget)}</strong></div><button class="delete-item delete-person" data-id="${person.id}">Remove</button></div>`;
  }).join("") || `<div class="empty-state">No people costs added yet.</div>`;
}

function renderInventory(metrics) {
  document.getElementById("inventory-metrics").innerHTML = [
    miniMetric("Inventory at cost", money.format(metrics.stockValue), "Estimated current holding"),
    miniMetric("Stock purchased MTD", money.format(metrics.inventoryPaid), "Cash paid, not operating cost"),
    miniMetric("COGS MTD", money.format(metrics.cogs), `${fmtPercent(state.settings.cogsPercent)} of net revenue`),
    miniMetric("Stock on order", money.format(metrics.stockOnOrder), `${metrics.stockCoverMonths.toFixed(1)} months estimated cover`)
  ].join("");
  document.getElementById("inventory-flow").innerHTML = [
    ["Opening inventory", state.settings.inventoryValue, ""],
    ["Stock purchases received", metrics.inventoryPaid, ""],
    ["Cost of stock sold", -metrics.cogs, ""],
    ["Estimated stock on hand", metrics.stockValue, "result"]
  ].map(([label, value, cls]) => `<div class="waterfall-row ${cls}"><span>${label}</span><strong>${value < 0 ? "−" : ""}${money.format(Math.abs(value))}</strong></div>`).join("");
  const orders = state.items.filter((item) => item.treatment === "inventory_purchase").sort((a, b) => (b.dueDate || b.date).localeCompare(a.dueDate || a.date));
  document.getElementById("stock-orders").innerHTML = orders.map((item) => `<div class="record-row"><div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.notes || "Stock order")}</span></div><div><span>Amount</span><strong>${money.format(item.amount)}</strong></div><div><span>Status</span><strong>${item.status}</strong></div><div><span>Due</span><strong>${item.dueDate ? new Date(`${item.dueDate}T12:00:00`).toLocaleDateString("en-AU", { day: "numeric", month: "short" }) : "—"}</strong></div><div><span>Performance</span><strong>No impact</strong></div><button class="delete-item" data-id="${item.id}">Remove</button></div>`).join("") || `<div class="empty-state">No stock orders recorded.</div>`;
}

function impactFor(item) {
  const amount = Number(item.amount || 0);
  const sign = item.direction === "in" ? 1 : -1;
  const cash = item.status === "paid" ? amount * sign : 0;
  let operating = 0;
  let inventory = 0;
  if (["revenue", "other_income"].includes(item.treatment)) operating = amount * sign;
  if (["operating_expense", "one_off", "staff", "fulfilment", "marketing", "cogs"].includes(item.treatment)) operating = amount * sign;
  if (item.treatment === "inventory_purchase") inventory = amount * (item.direction === "out" ? 1 : -1);
  return { cash, operating, inventory };
}

function signedDisplay(value) {
  if (value === 0) return "No change";
  return `${value > 0 ? "+" : "−"}${money.format(Math.abs(value))}`;
}

function renderExpenses(metrics) {
  const categoryTotals = {
    marketing: metrics.marketingSpend,
    people: metrics.teamMtd,
    fulfilment: metrics.fulfilment + metrics.paymentFees,
    operating: metrics.operatingCosts
  };
  document.getElementById("expense-metrics").innerHTML = [
    miniMetric("Total operating outgoings", money.format(categoryTotals.marketing + categoryTotals.people + categoryTotals.fulfilment + categoryTotals.operating), "Excludes inventory purchases"),
    miniMetric("Marketing", money.format(categoryTotals.marketing), `${fmtPercent(metrics.netRevenue ? categoryTotals.marketing / metrics.netRevenue * 100 : 0)} of revenue`),
    miniMetric("People", money.format(categoryTotals.people), `${fmtPercent(metrics.netRevenue ? categoryTotals.people / metrics.netRevenue * 100 : 0)} of revenue`),
    miniMetric("Stock cash out", money.format(metrics.inventoryPaid), "Shown separately from COGS")
  ].join("");
  renderItemsTable();
}

function renderItemsTable() {
  const filter = document.getElementById("expense-filter")?.value || "all";
  const items = monthItems().filter((item) => filter === "all" || item.treatment === filter).sort((a, b) => b.date.localeCompare(a.date));
  document.getElementById("items-table").innerHTML = items.map((item) => {
    const impact = impactFor(item);
    return `<tr><td>${new Date(`${item.date}T12:00:00`).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}</td><td><strong>${escapeHtml(item.name)}</strong><br><small class="muted">${escapeHtml(item.notes || item.recurrence)}</small></td><td>${treatmentNames[item.treatment]}</td><td><span class="status-pill ${item.status === "paid" ? "good" : "warn"}">${item.status}</span></td><td>${signedDisplay(impact.cash)}</td><td>${signedDisplay(impact.operating)}</td><td><button class="delete-item" data-id="${item.id}">Remove</button></td></tr>`;
  }).join("") || `<tr><td colspan="7"><div class="empty-state">No items in this category.</div></td></tr>`;
}

function renderData(metrics) {
  const s = state.settings;
  document.getElementById("settings-summary").innerHTML = [["Revenue target", money.format(s.revenueTarget)], ["Marketing budget", money.format(s.marketingBudget)], ["Order target", number.format(s.orderTarget)], ["COGS assumption", fmtPercent(s.cogsPercent)], ["Opening cash", money.format(s.openingCash)], ["Opening inventory", money.format(s.inventoryValue)]].map(([label, value]) => `<div class="summary-row"><span>${label}</span><strong>${value}</strong></div>`).join("");
  const uncategorised = state.items.filter((item) => item.treatment === "uncategorised").length;
  document.getElementById("data-health").innerHTML = [["Daily records", `${metrics.daily.length} days`], ["Custom items", `${state.items.length} items`], ["People records", `${state.people.length} records`], ["Uncategorised", uncategorised ? `${uncategorised} needs review` : "None"], ["COGS quality", "Estimated"]].map(([label, value]) => `<div class="summary-row"><span>${label}</span><strong>${value}</strong></div>`).join("");
}

function renderAll() {
  const metrics = getMetrics();
  renderOverview(metrics);
  renderRevenue(metrics);
  renderMarketing(metrics);
  renderPeople(metrics);
  renderInventory(metrics);
  renderExpenses(metrics);
  renderData(metrics);
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => modal.querySelector("input, select")?.focus(), 50);
}

function closeModals() {
  document.querySelectorAll(".modal-backdrop.open").forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
  document.body.style.overflow = "";
}

function toast(message) {
  const element = document.getElementById("toast");
  element.textContent = message;
  element.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove("show"), 2400);
}

function setItemDefaults(treatment = "operating_expense") {
  const form = document.getElementById("item-form");
  form.reset();
  form.elements.treatment.value = treatment;
  form.elements.direction.value = ["revenue", "other_income"].includes(treatment) ? "in" : "out";
  form.elements.status.value = treatment === "inventory_purchase" ? "committed" : "paid";
  form.elements.date.value = `${state.selectedMonth}-${String(getMetrics().elapsed).padStart(2, "0")}`;
  updateImpactPreview();
}

function updateImpactPreview() {
  const form = document.getElementById("item-form");
  const item = Object.fromEntries(new FormData(form));
  const impact = impactFor(item);
  document.getElementById("impact-preview-grid").innerHTML = [["Cash", impact.cash], ["Operating position", impact.operating], ["Inventory purchases", impact.inventory]].map(([label, value]) => `<div class="impact-box"><span>${label}</span><strong>${signedDisplay(value)}</strong></div>`).join("");
}

function openSettings() {
  const form = document.getElementById("settings-form");
  Object.entries(state.settings).forEach(([key, value]) => { if (form.elements[key]) form.elements[key].value = value; });
  openModal("settings-modal");
}

document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
  button.classList.add("active");
  document.getElementById(`page-${button.dataset.page}`).classList.add("active");
  document.querySelector(".sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}));

document.getElementById("mobile-menu").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("open"));
document.getElementById("add-item").addEventListener("click", () => { setItemDefaults(); openModal("item-modal"); });
document.getElementById("add-expense").addEventListener("click", () => { setItemDefaults("operating_expense"); openModal("item-modal"); });
document.querySelectorAll("[data-quick-add]").forEach((button) => button.addEventListener("click", () => { setItemDefaults(button.dataset.quickAdd); openModal("item-modal"); }));
document.querySelectorAll(".close-modal").forEach((button) => button.addEventListener("click", closeModals));
document.querySelectorAll(".modal-backdrop").forEach((backdrop) => backdrop.addEventListener("click", (event) => { if (event.target === backdrop) closeModals(); }));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModals(); });
document.getElementById("item-form").addEventListener("input", updateImpactPreview);

document.getElementById("item-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget));
  state.items.push({ id: crypto.randomUUID(), ...values, amount: Number(values.amount) });
  closeModals();
  saveState("Item added and dashboard recalculated");
});

document.getElementById("update-today").addEventListener("click", () => {
  const metrics = getMetrics();
  const date = `${state.selectedMonth}-${String(metrics.elapsed).padStart(2, "0")}`;
  const row = metrics.daily.find((item) => item.date === date) || { revenue: 0, orders: 0, metaSpend: 0, metaRevenue: 0, googleSpend: 0, googleRevenue: 0, edmRevenue: 0, refunds: 0 };
  const form = document.getElementById("today-form");
  Object.entries(row).forEach(([key, value]) => { if (form.elements[key]) form.elements[key].value = value; });
  form.dataset.date = date;
  openModal("today-modal");
});

document.getElementById("today-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const values = Object.fromEntries(new FormData(form));
  const record = { date: form.dataset.date };
  Object.entries(values).forEach(([key, value]) => record[key] = Number(value));
  const index = state.daily.findIndex((item) => item.date === record.date);
  if (index >= 0) state.daily[index] = record; else state.daily.push(record);
  closeModals();
  saveState("Today’s numbers updated");
});

document.getElementById("add-person").addEventListener("click", () => { document.getElementById("person-form").reset(); openModal("person-modal"); });
document.getElementById("person-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget));
  state.people.push({ id: crypto.randomUUID(), ...values, base: Number(values.base), onCosts: Number(values.onCosts), budget: Number(values.budget) });
  closeModals();
  saveState("People cost added");
});

document.addEventListener("click", (event) => {
  const itemButton = event.target.closest(".delete-item:not(.delete-person)");
  if (itemButton) {
    const item = state.items.find((entry) => entry.id === itemButton.dataset.id);
    if (item && confirm(`Remove “${item.name}”? This will recalculate the dashboard.`)) {
      state.items = state.items.filter((entry) => entry.id !== item.id);
      saveState("Item removed");
    }
  }
  const personButton = event.target.closest(".delete-person");
  if (personButton) {
    const person = state.people.find((entry) => entry.id === personButton.dataset.id);
    if (person && confirm(`Remove “${person.name}” from people costs?`)) {
      state.people = state.people.filter((entry) => entry.id !== person.id);
      saveState("People cost removed");
    }
  }
});

document.getElementById("expense-filter").addEventListener("change", renderItemsTable);
document.querySelectorAll(".open-settings").forEach((button) => button.addEventListener("click", openSettings));
document.getElementById("open-settings-sidebar").addEventListener("click", openSettings);
document.getElementById("settings-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget));
  Object.keys(state.settings).forEach((key) => { if (values[key] !== undefined) state.settings[key] = Number(values[key]); });
  closeModals();
  saveState("Targets and assumptions updated");
});

function changeMonth(offset) {
  const [year, month] = state.selectedMonth.split("-").map(Number);
  const date = new Date(year, month - 1 + offset, 1);
  state.selectedMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  saveState();
}
document.getElementById("previous-month").addEventListener("click", () => changeMonth(-1));
document.getElementById("next-month").addEventListener("click", () => changeMonth(1));

document.getElementById("export-data").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `naudic-business-pulse-${state.selectedMonth}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  toast("Backup exported");
});

document.getElementById("import-data").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    if (imported?.version !== 1 || !Array.isArray(imported.daily) || !Array.isArray(imported.items)) throw new Error("Invalid backup format");
    state = imported;
    saveState("Backup imported successfully");
  } catch (error) {
    toast("Could not import this backup");
  }
  event.target.value = "";
});

function parseCsvLine(line) {
  const cells = [];
  let current = "", quoted = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' && line[i + 1] === '"') { current += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { cells.push(current.trim()); current = ""; }
    else current += char;
  }
  cells.push(current.trim());
  return cells;
}

document.getElementById("import-csv").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const lines = (await file.text()).split(/\r?\n/).filter(Boolean);
    const headers = parseCsvLine(lines.shift()).map((h) => h.toLowerCase());
    const required = ["date", "name", "amount", "type", "treatment"];
    if (!required.every((header) => headers.includes(header))) throw new Error("Missing required columns");
    const imported = lines.map((line) => {
      const cells = parseCsvLine(line);
      const row = Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""]));
      const treatment = treatmentNames[row.treatment] ? row.treatment : "uncategorised";
      const direction = row.type.toLowerCase().includes("in") ? "in" : "out";
      return { id: crypto.randomUUID(), name: row.name, amount: Math.abs(Number(row.amount)), direction, treatment, date: row.date, dueDate: "", status: "paid", recurrence: "once", notes: "Imported from CSV" };
    }).filter((row) => row.name && row.date && Number.isFinite(row.amount));
    state.items.push(...imported);
    saveState();
    document.getElementById("csv-result").textContent = `${imported.length} transactions imported.`;
    toast("CSV import complete");
  } catch (error) {
    document.getElementById("csv-result").textContent = "Import failed. Required headers: date, name, amount, type, treatment.";
    toast("Could not import CSV");
  }
  event.target.value = "";
});

document.getElementById("reset-demo").addEventListener("click", () => {
  if (confirm("Reset all browser data back to the original demonstration?")) {
    state = makeDemoData();
    saveState("Demonstration data restored");
  }
});

renderAll();
