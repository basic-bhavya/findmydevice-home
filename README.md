# Find My Device — Home Hub 📱🔔

A modern, touch-first dashboard designed for a repurposed Android tablet mounted on a wall or desk. Provides **one-tap loud ringing and pinging** for Android smartphones in the household across 2.4 GHz and 5 GHz Wi-Fi networks with **0% background battery drain** on target phones.

---

## ✨ Features

- 🚨 **One-Tap Loud Alarm:** Bypasses "Silent" and "Do Not Disturb" (DND) modes using Android's native Alarm channel (`Priority: 5` urgent push).
- 🔔 **Gentle Chime Mode:** Send a subtle chime when you just want someone's attention without sounding a continuous siren.
- ⚡ **Zero Background Battery Consumption:** Uses Google Play Services' native FCM push channel. Smartphones stay in deep sleep (Doze mode) without keeping background sockets open.
- 📲 **Instant QR Code Pairing:** Each phone card generates a QR code. Family members scan it with their phone camera or inside the `ntfy` app to connect in seconds.
- 📱 **Designed for Kiosk Tablets:** Includes a live digital clock, date, tactile audio clicks via Web Audio API, fullscreen mode, dark aesthetic, and responsive touch controls.
- 💾 **Local Persistence & Backup:** Saves all configured devices in browser storage with full JSON Export & Import capabilities.
- 🔒 **Private & Customizable:** Create your own secret topic names or point to a self-hosted `ntfy` server if desired.

---

## 🚀 Quick Start (Running Locally)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```
   *The server runs with `--host`, so your tablet can immediately load it by navigating to `http://<your-computer-ip>:3000` on your home Wi-Fi.*

3. **Build production static files:**
   ```bash
   npm run build
   ```

---

## 🌐 Free Deployment (GitHub Pages / Vercel)

Because this is a pure static web app, you can host it for free forever:

### Option A: GitHub Pages
1. Push this repository to GitHub.
2. In your GitHub repository, go to **Settings &rarr; Pages**.
3. Under **Build and deployment**, select **GitHub Actions** and choose the **Static HTML / Vite** template (or deploy the `dist/` branch).
4. Access your dashboard from `https://<your-username>.github.io/findmydevice-home/`.

### Option B: Vercel / Cloudflare Pages / Netlify
1. Connect your GitHub repository to [Vercel](https://vercel.com) or [Cloudflare Pages](https://pages.cloudflare.com).
2. Framework preset: **Vite**.
3. Click **Deploy**.

---

## 📱 Setting Up Family Smartphones (3-Step Setup)

1. **Install ntfy:**
   - Download the free **ntfy** app from the **Google Play Store** on the target smartphone.
2. **Subscribe:**
   - In the ntfy app, tap the **+** (Subscribe) button.
   - Tap the QR icon and scan the QR code displayed on the tablet for that phone (or type the topic name, e.g. `fmd-home-dad-xxxx`).
3. **Configure Sound & DND Bypass (Crucial):**
   - In the ntfy app, tap on the subscription and open **Topic Settings**.
   - Toggle **ON** `"Keep alerting until dismissed"` (this loops the alarm continuously like a phone call).
   - In Android Phone Settings: Go to *Apps &rarr; ntfy &rarr; Notifications* and ensure Urgent notifications are allowed to **Bypass Do Not Disturb**.

---

## 🖥️ Setting Up the Old Android Tablet (Kiosk Mode)

1. Open your deployed URL on the tablet in Google Chrome.
2. Tap the Chrome menu (`⋮`) and select **"Add to Home Screen"** or **"Install app"**.
3. *(Recommended for Wall/Desk Mounts):* Install **Fully Kiosk Browser** from the Google Play Store on the tablet:
   - Set the Start URL to your dashboard link.
   - Enable **Keep Screen On** (or auto-wake using front-camera motion detection).
   - Turn on **Kiosk Mode** to prevent accidental closing.
