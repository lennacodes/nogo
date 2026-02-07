# nogo

A browser extension that lets you block and redirect websites by domain. All data is stored locally on your device — nothing is collected, transmitted, or shared. Built with a soft trans-themed pastel UI.

Available for **Firefox** and **Chrome**.

## Features

- **Block websites** — Add any domain to your block list and it will be completely blocked, including all subdomains
- **Redirect websites** — Set up rules to automatically redirect one site to another (e.g., reddit.com to wikipedia.org). A brief "redirecting to a safe site..." interstitial is shown before navigating
- **60-second removal cooldown** — When removing a site from your block list, a 60-second countdown timer makes you pause and reconsider before confirming
- **Redirect priority** — If a domain is in both your block list and redirect list, the redirect takes priority

## How It Works

1. Click the nogo icon in your browser toolbar to open the popup
2. Type a domain and click **Block** to add it to your block list
3. Click the gear icon to access settings:
   - **Blocked Sites** — View and manage your blocked domains
   - **Redirect Sites** — Create redirect rules (source domain → destination domain)
   - **Support Me** — Link to support the developer

## Installation

### Firefox
1. Install from [Firefox Add-ons](https://addons.mozilla.org) (search "nogo")
2. Or load manually: go to `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on**, and select any file in the `firefox/` folder

### Chrome
1. Go to `chrome://extensions` and enable **Developer mode**
2. Click **Load unpacked** and select the `chrome/` folder
3. Pin the extension to your toolbar by clicking the puzzle piece icon

## Project Structure

```
firefox/    — Firefox extension (Manifest V2)
chrome/     — Chrome extension (Manifest V3)
```

## Privacy

nogo does not collect, store, or transmit any user data. All data is stored locally using the browser's built-in storage API. See [PRIVACY.md](PRIVACY.md) for details.

## Support

If you like nogo, consider supporting development at [buymeacoffee.com/lennacodes](https://buymeacoffee.com/lennacodes)
