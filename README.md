# nogo

A Firefox browser extension that lets you block and redirect websites by domain. All data is stored locally on your device — nothing is collected, transmitted, or shared. Built with a soft trans-themed pastel UI.

## Features

- **Block websites** — Add any domain to your block list and it will be completely blocked, including all subdomains
- **Redirect websites** — Set up rules to automatically redirect one site to another (e.g., reddit.com to wikipedia.org). A brief "redirecting to a safe site..." interstitial is shown before navigating
- **60-second removal cooldown** — When removing a site from your block list, a 60-second countdown timer makes you pause and reconsider before confirming
- **Redirect priority** — If a domain is in both your block list and redirect list, the redirect takes priority

## How It Works

1. Click the nogo icon in your Firefox toolbar to open the popup
2. Type a domain and click **Block** to add it to your block list
3. Click the gear icon to access settings:
   - **Blocked Sites** — View and manage your blocked domains
   - **Redirect Sites** — Create redirect rules (source domain → destination domain)
   - **Support Me** — Link to support the developer

## Installation

1. Open Firefox and go to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select any file in the extension folder (e.g., `manifest.json`)
4. Pin the extension to your toolbar by clicking the puzzle piece icon and selecting **Pin to Toolbar**

## Permissions

- `webRequest` / `webRequestBlocking` — Intercept and block/redirect web requests
- `storage` — Save your block list and redirect rules locally
- `tabs` — Navigate tabs for redirects and opening links
- `<all_urls>` — Monitor requests across all sites to enforce your rules

## Support

If you like nogo, consider supporting development at [buymeacoffee.com/lennacodes](https://buymeacoffee.com/lennacodes)
