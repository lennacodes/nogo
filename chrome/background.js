async function rebuildRules() {
  const { blockedDomains = [], redirectRules = [] } =
    await chrome.storage.local.get(['blockedDomains', 'redirectRules']);

  const rules = [];
  let id = 1;

  const redirectFromDomains = new Set(redirectRules.map(r => r.from));

  const allResourceTypes = [
    'main_frame', 'sub_frame', 'stylesheet', 'script', 'image',
    'font', 'object', 'xmlhttprequest', 'ping', 'media',
    'websocket', 'other'
  ];

  const subResourceTypes = allResourceTypes.filter(t => t !== 'main_frame');

  // Block rules (priority 1) — skip domains that have a redirect rule
  for (const domain of blockedDomains) {
    if (redirectFromDomains.has(domain)) continue;
    rules.push({
      id: id++,
      priority: 1,
      action: { type: 'block' },
      condition: {
        urlFilter: `||${domain}`,
        resourceTypes: allResourceTypes
      }
    });
  }

  // Redirect rules (priority 2)
  for (const rule of redirectRules) {
    const interstitialUrl = chrome.runtime.getURL('redirecting.html')
      + '?to=' + encodeURIComponent('https://' + rule.to);

    // Redirect main_frame to interstitial
    rules.push({
      id: id++,
      priority: 2,
      action: {
        type: 'redirect',
        redirect: { url: interstitialUrl }
      },
      condition: {
        urlFilter: `||${rule.from}`,
        resourceTypes: ['main_frame']
      }
    });

    // Block sub-resources from redirect source domains
    rules.push({
      id: id++,
      priority: 2,
      action: { type: 'block' },
      condition: {
        urlFilter: `||${rule.from}`,
        resourceTypes: subResourceTypes
      }
    });
  }

  // Allow rules (priority 3) — redirect target domains should never be blocked
  const targetDomains = new Set(redirectRules.map(r => r.to));
  for (const domain of targetDomains) {
    rules.push({
      id: id++,
      priority: 3,
      action: { type: 'allow' },
      condition: {
        urlFilter: `||${domain}`,
        resourceTypes: allResourceTypes
      }
    });
  }

  // Replace all existing dynamic rules with the new set
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existingRules.map(r => r.id);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules: rules
  });
}

// Rebuild rules on install, startup, and storage changes
chrome.runtime.onInstalled.addListener(() => rebuildRules());
chrome.runtime.onStartup.addListener(() => rebuildRules());

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && (changes.blockedDomains || changes.redirectRules)) {
    rebuildRules();
  }
});
