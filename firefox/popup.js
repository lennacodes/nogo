const domainInput = document.getElementById('domainInput');
const addBtn = document.getElementById('addBtn');
const blockedList = document.getElementById('blockedList');
const redirectList = document.getElementById('redirectList');
const fromInput = document.getElementById('fromInput');
const toInput = document.getElementById('toInput');
const addRuleBtn = document.getElementById('addRuleBtn');

// Views
const mainView = document.getElementById('mainView');
const settingsView = document.getElementById('settingsView');
const blockedView = document.getElementById('blockedView');
const redirectView = document.getElementById('redirectView');

// Buttons
const gearBtn = document.getElementById('gearBtn');
const settingsBackBtn = document.getElementById('settingsBackBtn');
const blockedSitesBtn = document.getElementById('blockedSitesBtn');
const blockedBackBtn = document.getElementById('blockedBackBtn');
const redirectSitesBtn = document.getElementById('redirectSitesBtn');
const redirectBackBtn = document.getElementById('redirectBackBtn');
const supportMeBtn = document.getElementById('supportMeBtn');

function showView(view) {
  mainView.classList.add('hidden');
  settingsView.classList.add('hidden');
  blockedView.classList.add('hidden');
  redirectView.classList.add('hidden');
  view.classList.remove('hidden');
}

// Navigation
gearBtn.addEventListener('click', () => showView(settingsView));
settingsBackBtn.addEventListener('click', () => showView(mainView));

blockedSitesBtn.addEventListener('click', () => {
  showView(blockedView);
  loadBlockedDomains();
});
blockedBackBtn.addEventListener('click', () => showView(settingsView));

redirectSitesBtn.addEventListener('click', () => {
  showView(redirectView);
  loadRedirectRules();
});
redirectBackBtn.addEventListener('click', () => showView(settingsView));

supportMeBtn.addEventListener('click', () => {
  browser.tabs.create({ url: 'https://buymeacoffee.com/lennacodes' });
});

// === Blocked Sites ===

function loadBlockedDomains() {
  browser.storage.local.get('blockedDomains').then((result) => {
    const domains = result.blockedDomains || [];
    renderBlockedList(domains);
  });
}

function renderBlockedList(domains) {
  blockedList.textContent = '';

  if (domains.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty-msg';
    p.textContent = 'No blocked sites yet';
    blockedList.appendChild(p);
    return;
  }

  domains.forEach(domain => {
    const item = document.createElement('div');
    item.className = 'blocked-item';

    const span = document.createElement('span');
    span.textContent = domain;

    const btn = document.createElement('button');
    btn.className = 'remove-btn';
    btn.textContent = 'Remove';
    btn.addEventListener('click', () => requestRemoval(domain));

    item.appendChild(span);
    item.appendChild(btn);
    blockedList.appendChild(item);
  });
}

function addDomain() {
  let domain = domainInput.value.trim().toLowerCase();
  domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '');
  if (!domain) return;

  browser.storage.local.get('blockedDomains').then((result) => {
    const domains = result.blockedDomains || [];
    if (!domains.includes(domain)) {
      domains.push(domain);
      browser.storage.local.set({ blockedDomains: domains }).then(() => {
        domainInput.value = '';
      });
    }
  });
}

addBtn.addEventListener('click', addDomain);
domainInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addDomain();
});

// === Removal confirmation ===

const confirmOverlay = document.getElementById('confirmOverlay');
const confirmDomain = document.getElementById('confirmDomain');
const confirmTimer = document.getElementById('confirmTimer');
const confirmCancel = document.getElementById('confirmCancel');
const confirmRemove = document.getElementById('confirmRemove');
let countdownInterval = null;
let pendingDomain = null;

function requestRemoval(domain) {
  pendingDomain = domain;
  confirmDomain.textContent = domain;
  confirmTimer.textContent = '60';
  confirmRemove.disabled = true;
  confirmRemove.classList.remove('enabled');
  confirmOverlay.classList.add('active');

  let seconds = 60;
  countdownInterval = setInterval(() => {
    seconds--;
    confirmTimer.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      confirmRemove.disabled = false;
      confirmRemove.classList.add('enabled');
    }
  }, 1000);
}

function closeConfirm() {
  confirmOverlay.classList.remove('active');
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  pendingDomain = null;
}

confirmCancel.addEventListener('click', closeConfirm);

confirmRemove.addEventListener('click', () => {
  if (confirmRemove.disabled) return;
  removeDomain(pendingDomain);
  closeConfirm();
});

function removeDomain(domain) {
  browser.storage.local.get('blockedDomains').then((result) => {
    const domains = result.blockedDomains || [];
    const updated = domains.filter(d => d !== domain);
    browser.storage.local.set({ blockedDomains: updated }).then(() => {
      loadBlockedDomains();
    });
  });
}

// === Redirect Sites ===

function cleanDomain(value) {
  return value.trim().toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\/.*$/, '');
}

function loadRedirectRules() {
  browser.storage.local.get('redirectRules').then((result) => {
    const rules = result.redirectRules || [];
    renderRedirectList(rules);
  });
}

function renderRedirectList(rules) {
  redirectList.textContent = '';

  if (rules.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty-msg';
    p.textContent = 'No redirects yet';
    redirectList.appendChild(p);
    return;
  }

  rules.forEach((rule, i) => {
    const item = document.createElement('div');
    item.className = 'redirect-item';

    const info = document.createElement('div');
    info.className = 'rule-info';

    const from = document.createElement('span');
    from.className = 'rule-from';
    from.textContent = rule.from;

    const arrow = document.createElement('span');
    arrow.className = 'rule-arrow';
    arrow.textContent = '\u2192';

    const to = document.createElement('span');
    to.className = 'rule-to';
    to.textContent = rule.to;

    info.appendChild(from);
    info.appendChild(arrow);
    info.appendChild(to);

    const btn = document.createElement('button');
    btn.className = 'remove-btn';
    btn.textContent = 'Remove';
    btn.addEventListener('click', () => removeRule(i));

    item.appendChild(info);
    item.appendChild(btn);
    redirectList.appendChild(item);
  });
}

function addRule() {
  const from = cleanDomain(fromInput.value);
  const to = cleanDomain(toInput.value);
  if (!from || !to || from === to) return;

  browser.storage.local.get('redirectRules').then((result) => {
    const rules = result.redirectRules || [];
    if (!rules.some(r => r.from === from)) {
      rules.push({ from, to });
      browser.storage.local.set({ redirectRules: rules }).then(() => {
        fromInput.value = '';
        toInput.value = '';
        loadRedirectRules();
      });
    }
  });
}

function removeRule(index) {
  browser.storage.local.get('redirectRules').then((result) => {
    const rules = result.redirectRules || [];
    rules.splice(index, 1);
    browser.storage.local.set({ redirectRules: rules }).then(() => {
      loadRedirectRules();
    });
  });
}

addRuleBtn.addEventListener('click', addRule);
fromInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') toInput.focus();
});
toInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addRule();
});
