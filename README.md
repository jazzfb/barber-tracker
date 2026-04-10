# Barber Tracker

Daily income tracker for barbers — tracks earnings by payment method (Cash, Venmo, Apple Pay, Cash App, Square, Zelle) with Square fee calculation, weekly/monthly summaries, and CSV export for taxes.

## Install on iPhone (PWA)

1. Deploy to GitHub Pages (see below)
2. Open the URL in **Safari** on your iPhone
3. Tap the **Share** button (box with arrow)
4. Tap **"Add to Home Screen"**
5. Tap **Add** — it'll appear as an app icon

## Deploy to GitHub Pages

1. Create a new repo on GitHub (e.g. `barber-tracker`)
2. Upload all files:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icons/icon-192.png`
   - `icons/icon-512.png`
3. Go to repo **Settings → Pages**
4. Under **Source**, select `main` branch, `/ (root)` folder
5. Click **Save**
6. Your app will be live at `https://yourusername.github.io/barber-tracker`

## Features

- End-of-day entry by payment method
- Square fee auto-calculated (2.6% + $0.15, adjustable)
- Weekly view with 4-week history tabs
- Monthly view with all-time history
- Top metrics: this week + this month gross with Square fees shown
- CSV export with Square Gross / Fee / Net columns for S-corp bookkeeping
- Offline capable — works without internet once installed
- Data stored in browser localStorage

## Files

```
barber-tracker/
├── index.html        # Main app
├── manifest.json     # PWA config
├── sw.js             # Service worker (offline support)
└── icons/
    ├── icon-192.png  # App icon
    └── icon-512.png  # App icon (large)
```
