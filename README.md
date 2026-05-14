# BIU — BREEAM In Use Certification Tracker

**Vite + React** · deploys to **Vercel** · demo project pre-loaded

A certification tracker for BREEAM In Use assessors and building managers. Track 46 BREEAM credits across Part 1 (Asset Performance) and Part 2 (Building Management), write assessment narratives, upload evidence, and generate PDF evidence packages for submission.

---

## 🚀 Quick Start

```bash
git clone https://github.com/FilhoRicardo/biu-app-rf.git
cd biu-app-rf
npm install
npm run dev
```

App opens at `http://localhost:5173` with a built-in **Greenwich Office Building** demo project — no configuration needed.

---

## ✨ Features

| Page | What it does |
|---|---|
| **Home** | Dashboard — overall score, Part 1/Part 2 progress, category breakdown |
| **Pre-Assessment** | Toggle each credit Pursuing / Skip with reasons |
| **Assessment** | Write narratives, set scores, upload evidence files per credit |
| **Evidence Vault** | Browse all uploaded evidence across the project |
| **Evidence Package** | Select credits → preview → generate a PDF evidence report |

**Score tracking:** credits stored locally (localStorage). Overall score = sum of Part 1 + Part 2. Rating thresholds: Pass 30 / Good 45 / Very Good 55 / Excellent 70 / Outstanding 85.

---

## 📁 Project Structure

```
biu-app-rf/
├── src/
│   ├── App.jsx          # All pages + components
│   ├── main.jsx         # React entry
│   ├── index.css        # Global styles
│   └── data/
│       ├── credits.js   # 46 BREEAM credit definitions
│       └── projects.js  # Demo project data
├── dist/                # Production build (auto-generated)
├── index.html
├── vite.config.js
└── package.json
```

---

## 🏢 Demo Project: Greenwich Office Building

3,200 m² commercial office, Greenwich, London (built 2008).

| Category | Part 1 Score | Status |
|---|---|---|
| Management | 10/14 | In Progress |
| Energy | 14/21 | In Progress |
| Water | 5/6 | Complete |
| Transport | 4/8 | Complete |
| Materials | 2/8 | In Progress |
| Health & Wellbeing | 5/10 | In Progress |
| Ecology | 4/10 | In Progress |

**Part 1 target: ≥ 40 credits** · **Part 2 target: ≥ 16 credits**

---

## 🛠️ Tech Stack

- **Vite** — build tool
- **React 18** — UI framework
- **localStorage** — data persistence (no backend needed to run locally)
- **Vercel** — deployment

To deploy to Vercel: `npm run build` then connect the `dist/` folder in vercel.com dashboard or run `vercel`.
