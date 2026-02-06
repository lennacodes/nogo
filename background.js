let blockedDomains = [];
let redirectRules = [];

// Track pending redirects: tabId -> target URL
const pendingRedirects = new Map();

// Load from storage on startup
browser.storage.local.get(['blockedDomains', 'redirectRules']).then((result) => {
  blockedDomains = result.blockedDomains || [];
  redirectRules = result.redirectRules || [];
  updateRules();
});

// Listen for storage changes
browser.storage.onChanged.addListener((changes) => {
  if (changes.blockedDomains) {
    blockedDomains = changes.blockedDomains.newValue || [];
  }
  if (changes.redirectRules) {
    redirectRules = changes.redirectRules.newValue || [];
  }
  if (changes.blockedDomains || changes.redirectRules) {
    updateRules();
  }
});

function updateRules() {
  // Remove existing listeners
  if (browser.webRequest.onBeforeRequest.hasListener(handleRequest)) {
    browser.webRequest.onBeforeRequest.removeListener(handleRequest);
  }

  // Build URL patterns from both blocked and redirect domains
  const allDomains = new Set();
  blockedDomains.forEach(d => allDomains.add(d));
  redirectRules.forEach(r => allDomains.add(r.from));

  if (allDomains.size > 0) {
    const patterns = [...allDomains].flatMap(domain => [
      `*://${domain}/*`,
      `*://*.${domain}/*`
    ]);

    browser.webRequest.onBeforeRequest.addListener(
      handleRequest,
      { urls: patterns },
      ["blocking"]
    );
  }
}

// Detect when interstitial page finishes loading, then navigate after 2s
const interstitialBase = browser.runtime.getURL('redirecting.html');

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && pendingRedirects.has(tabId)) {
    const target = pendingRedirects.get(tabId);
    pendingRedirects.delete(tabId);
    setTimeout(() => {
      browser.tabs.update(tabId, { url: target });
    }, 2000);
  }
});

// Clean up if a tab with a pending redirect is closed
browser.tabs.onRemoved.addListener((tabId) => {
  pendingRedirects.delete(tabId);
});

function getRedirectDomains() {
  return new Set(redirectRules.map(r => r.from));
}

function handleRequest(details) {
  const url = new URL(details.url);
  const hostname = url.hostname.replace(/^www\./, '');

  // Check redirects first (they ALWAYS take priority over blocks)
  for (const rule of redirectRules) {
    // Allow traffic to the redirect target so it doesn't get blocked
    if (hostname === rule.to || hostname.endsWith('.' + rule.to)) {
      return {};
    }
    if (hostname === rule.from || hostname.endsWith('.' + rule.from)) {
      if (details.type === 'main_frame') {
        const target = 'https://' + rule.to;
        const interstitialUrl = interstitialBase + '?to=' + encodeURIComponent(target);
        // Store the pending redirect so onUpdated can handle navigation
        pendingRedirects.set(details.tabId, target);
        return { redirectUrl: interstitialUrl };
      }
      return { cancel: true };
    }
  }

  // Block — but skip domains that have a redirect rule
  const redirectDomains = getRedirectDomains();
  if (redirectDomains.has(hostname)) return {};
  for (const rd of redirectDomains) {
    if (hostname.endsWith('.' + rd)) return {};
  }

  if (blockedDomains.some(d => hostname === d || hostname.endsWith('.' + d))) {
    return { cancel: true };
  }

  return {};
}
