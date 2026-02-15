# Manual Testing Checklist

Use this checklist before each release to verify all features work correctly across both browsers.

## Blocking

- [ ] Add a domain (e.g., `example.com`) via the popup input
- [ ] Verify the domain is blocked when navigating to it
- [ ] Verify subdomains are also blocked (e.g., `sub.example.com`)
- [ ] Verify `www.example.com` is blocked
- [ ] Verify other sites still load normally
- [ ] Add a domain with `https://` prefix — confirm it gets cleaned to just the domain
- [ ] Add a domain with `www.` prefix — confirm it gets cleaned
- [ ] Add a domain with a trailing path (e.g., `example.com/page`) — confirm it gets cleaned
- [ ] Try adding a duplicate domain — confirm it is not added twice
- [ ] Try adding an empty string — confirm nothing happens
- [ ] Press Enter in the domain input — confirm it adds the domain (same as clicking Block)

## Block Removal (60-second cooldown)

- [ ] Click Remove on a blocked domain — confirm the overlay appears
- [ ] Verify the domain name is displayed correctly in the overlay
- [ ] Verify the timer starts at 60 and counts down
- [ ] Verify the Remove button is disabled and grayed out during countdown
- [ ] Wait for the timer to reach 0 — confirm the Remove button becomes enabled (pink)
- [ ] Click Remove after the timer completes — confirm the domain is removed
- [ ] Click Cancel during the countdown — confirm the overlay closes and the domain is NOT removed
- [ ] Open the overlay and close it — confirm the timer resets on the next open

## Redirect Rules

- [ ] Add a redirect rule (e.g., `reddit.com` → `wikipedia.org`)
- [ ] Navigate to `reddit.com` — confirm the interstitial ("redirecting to a safe site...") appears
- [ ] Confirm the interstitial redirects to `wikipedia.org` after ~2 seconds
- [ ] Verify subdomains of the source (e.g., `old.reddit.com`) also redirect
- [ ] Verify the destination domain (`wikipedia.org`) is NOT blocked even if it's in the block list
- [ ] Add a domain that is both blocked and has a redirect rule — confirm the redirect takes priority
- [ ] Verify sub-resources (images, scripts) from the redirect source domain are blocked (not redirected)
- [ ] Press Enter in the "from" input — confirm focus moves to the "to" input
- [ ] Press Enter in the "to" input — confirm the rule is added
- [ ] Try adding a rule where from === to — confirm nothing happens
- [ ] Try adding a duplicate "from" domain — confirm it is not added
- [ ] Remove a redirect rule — confirm it is removed from the list

## Popup Navigation

- [ ] Click the gear icon — confirm Settings view opens
- [ ] Click "Blocked Sites" — confirm Blocked Sites view opens and list loads
- [ ] Click Back from Blocked Sites — confirm return to Settings
- [ ] Click "Redirect Sites" — confirm Redirect Sites view opens and list loads
- [ ] Click Back from Redirect Sites — confirm return to Settings
- [ ] Click "Support Me" — confirm it opens buymeacoffee.com/lennacodes in a new tab
- [ ] Click Back from Settings — confirm return to Main view

## Interstitial Page

- [ ] Verify the interstitial page displays the pulsing arrow and heart animation
- [ ] Verify the "redirecting to a safe site..." message is shown
- [ ] Verify the page redirects to the target after ~2 seconds
- [ ] Close the tab during the interstitial — confirm no errors (Firefox: background cleans up pending redirect)

## Persistence

- [ ] Add blocked domains and redirect rules, then close and reopen the popup — confirm data persists
- [ ] Add blocked domains and redirect rules, then restart the browser — confirm data persists
- [ ] Confirm blocking/redirecting works immediately after browser startup (no need to open popup first)

## Edge Cases

- [ ] Block a domain, then add a redirect rule for the same domain — confirm the redirect takes over
- [ ] Remove the redirect rule — confirm the block resumes
- [ ] Add many domains (10+) — confirm the scrollable list works correctly
- [ ] Test with international domain names (e.g., `münchen.de`)
- [ ] Test with very long domain names

## Cross-Browser

### Firefox (Manifest V2)
- [ ] Load the extension from `about:debugging#/runtime/this-firefox`
- [ ] Verify blocking uses the webRequest API (requests are intercepted, not just declaratively blocked)
- [ ] Verify the interstitial navigation is handled by the background script (tabs.onUpdated listener)

### Chrome (Manifest V3)
- [ ] Load the extension from `chrome://extensions` (Developer mode)
- [ ] Verify blocking uses the declarativeNetRequest API
- [ ] Verify the interstitial navigation is handled by `redirecting.js` (client-side setTimeout)
- [ ] Verify the service worker activates on install and startup
