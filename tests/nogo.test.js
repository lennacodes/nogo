const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { cleanDomain, matchesDomain } = require('./helpers');

// === cleanDomain ===
// This function normalizes user input into a bare domain.
// Source: popup.js:171-175 (identical in Firefox and Chrome)

describe('cleanDomain', () => {
  it('returns a bare domain unchanged', () => {
    assert.equal(cleanDomain('example.com'), 'example.com');
  });

  it('strips https:// protocol', () => {
    assert.equal(cleanDomain('https://example.com'), 'example.com');
  });

  it('strips http:// protocol', () => {
    assert.equal(cleanDomain('http://example.com'), 'example.com');
  });

  it('strips www. prefix', () => {
    assert.equal(cleanDomain('www.example.com'), 'example.com');
  });

  it('strips both protocol and www', () => {
    assert.equal(cleanDomain('https://www.example.com'), 'example.com');
  });

  it('strips trailing path', () => {
    assert.equal(cleanDomain('example.com/page/subpage'), 'example.com');
  });

  it('strips protocol, www, and path together', () => {
    assert.equal(cleanDomain('https://www.example.com/some/path'), 'example.com');
  });

  it('converts to lowercase', () => {
    assert.equal(cleanDomain('Example.COM'), 'example.com');
  });

  it('trims whitespace', () => {
    assert.equal(cleanDomain('  example.com  '), 'example.com');
  });

  it('handles subdomain input (does not strip non-www subdomains)', () => {
    assert.equal(cleanDomain('sub.example.com'), 'sub.example.com');
  });

  it('returns empty string for empty input', () => {
    assert.equal(cleanDomain(''), '');
  });

  it('returns empty string for whitespace-only input', () => {
    assert.equal(cleanDomain('   '), '');
  });

  it('handles domain with port-like path', () => {
    assert.equal(cleanDomain('example.com/path:8080'), 'example.com');
  });

  it('strips trailing slash', () => {
    assert.equal(cleanDomain('example.com/'), 'example.com');
  });
});

// === matchesDomain ===
// This function checks if a hostname matches a domain exactly or is a subdomain.
// Source: firefox/background.js:103, chrome/background.js:26
// Used for both blocked domain checking and redirect rule matching.

describe('matchesDomain', () => {
  it('matches exact domain', () => {
    assert.equal(matchesDomain('example.com', 'example.com'), true);
  });

  it('matches subdomain', () => {
    assert.equal(matchesDomain('sub.example.com', 'example.com'), true);
  });

  it('matches deeply nested subdomain', () => {
    assert.equal(matchesDomain('a.b.c.example.com', 'example.com'), true);
  });

  it('does not match different domain', () => {
    assert.equal(matchesDomain('other.com', 'example.com'), false);
  });

  it('does not match partial suffix (notexample.com vs example.com)', () => {
    assert.equal(matchesDomain('notexample.com', 'example.com'), false);
  });

  it('does not match reversed containment', () => {
    assert.equal(matchesDomain('example.com', 'sub.example.com'), false);
  });

  it('does not match domain that merely contains the pattern', () => {
    assert.equal(matchesDomain('myexample.com', 'example.com'), false);
  });

  it('matches www subdomain', () => {
    assert.equal(matchesDomain('www.example.com', 'example.com'), true);
  });

  it('does not match empty hostname', () => {
    assert.equal(matchesDomain('', 'example.com'), false);
  });

  it('does not match empty domain', () => {
    assert.equal(matchesDomain('example.com', ''), false);
  });

  it('handles single-label domain', () => {
    assert.equal(matchesDomain('localhost', 'localhost'), true);
  });

  it('does not match unrelated single-label domain', () => {
    assert.equal(matchesDomain('localhost', 'other'), false);
  });
});
