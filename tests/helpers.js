// Pure functions extracted from the extension source code for testing.
// These are copied from the IIFE/module-scoped code so they can be imported.

// From popup.js:171-175 (both Firefox and Chrome)
// Cleans user input into a bare domain: strips protocol, www prefix, and paths.
function cleanDomain(value) {
  return value.trim().toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .replace(/\/.*$/, '');
}

// From firefox/background.js:103 and chrome/background.js:26
// Pattern used throughout both background scripts to check if a hostname
// matches a domain (exact match or subdomain).
function matchesDomain(hostname, domain) {
  return hostname === domain || hostname.endsWith('.' + domain);
}

module.exports = { cleanDomain, matchesDomain };
