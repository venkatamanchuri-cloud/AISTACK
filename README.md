# AETHER INTEL v4.2 - Enterprise Meteorological Decision Engine

**AETHER INTEL** is an advanced, enterprise-grade weather intelligence and operational decision support system built for C-suite logistics, energy grid managers, civil infrastructure directors, and supply chain operators. 

Powered by real-time meteorological telemetry from high-resolution satellite APIs and server-side **Google Gemini AI**, AETHER INTEL converts raw atmospheric data into actionable risk metrics, operational protocols, and cross-sector impact forecasts.

---

## 🌟 Key Capabilities & Feature Modules

### 1. 📊 Executive Dashboard
- **Real-Time Telemetry Cards**: Temperature, apparent heat index, precipitation probability, wind velocity, gust speed, barometric pressure, dew point, relative humidity, UV index, and cloud cover.
- **Aviation & Marine Operational Risk Radar**: Calculates crosswind component vectors, density altitude offsets, cloud ceiling height, wave swell estimation, and flight rule status (VFR/MVFR/IFR).
- **Interactive Multi-Metric Forecast Charts**: Interactive trend visualizations for hourly temperature curves, precipitation likelihood, wind profile dynamics, and daily 7-day high/low projections.

### 2. 🎛️ Cross-Industry Operational Decision Engine
Automated risk modeling tailored specifically for six enterprise sectors:
- **Logistics & Fleet Freight**: Highway jackknife risk, visibility degradation, re-routing advisories, driver rest mandates.
- **Aviation & Airport Ops**: Runway crosswind limits, ground crew lightning hold protocols, de-icing queue forecasts.
- **Renewable Energy & Power Grid**: Solar PV cloud shading loss, wind turbine curtailment cut-offs, transmission line sagging risks.
- **Civil Infrastructure & Construction**: High-altitude crane wind holds, concrete cure thermal limits, trench flooding hazards.
- **Agriculture & Precision Ag**: Soil moisture retention, crop frost mitigation alerts, spray drift boundary windows.
- **Offshore & Maritime Supply**: Wave swell impact, port loading crane holds, coastal gale surge warnings.

### 3. 🛰️ Spatial Doppler & Asset Vulnerability Radar Map
- Interactive map interface (powered by Leaflet.js) centered on live station coordinates.
- Spatial weather layer overlays: Precipitation Radar, Cloud Density, Temperature Gradient, Wind Shear.
- Interactive facility asset pins with live telemetry drawers and risk badge indicators.
- Animated timeline playback sweep for spatial forecast motion.

### 4. 🏢 Enterprise Facility Fleet Tracker
- Asset tracking fleet management across warehouses, solar farms, data centers, port terminals, and flight corridors.
- Real-time vulnerability risk scoring (0-100) combining ambient temperature, local wind velocity, and extreme weather threat factors.
- Ability to register new enterprise facilities with geographic coordinates for ongoing tracking.

### 5. 🤖 Gemini AI Executive Intelligence & Natural Language Console
- **Automated C-Suite Threat Briefings**: Generates structured executive summaries, hazard impact windows, sector takeaways, and actionable mitigations via `@google/genai`.
- **Interactive Weather AI Chatbot**: Natural language query engine to ask specific operational questions (e.g., *"Will wind shear affect crane operations at our Berlin warehouse tomorrow?"*) with dynamic quick-action suggestions.

### 6. ⚠️ Automated Threshold Alert Rules Engine & Live Breach Log
- Custom rule creation with targeted metrics (`windSpeed`, `temperature`, `precipProb`), relational operators (`>`, `<`), and severity levels (`Low`, `Medium`, `High`, `Critical`).
- Continuous automated background evaluation against incoming meteorological telemetry.
- Real-time incident breach log capturing triggered rules, asset targets, breach values, and automated webhook dispatch status.

### 7. 📄 Multi-Format Report Exporter
- Export official operational compliance documents in **Executive Summary (.txt)**, **CSV Telemetry Data (.csv)**, or **Structured Incident JSON (.json)** format for C-suite distribution or BI integration.

---

## 🏗️ Architecture & Tech Stack

AETHER INTEL strictly enforces a **secure full-stack architecture** with server-side proxy routes to safeguard API keys and external service credentials.

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons, Leaflet.js, Recharts
- **Backend**: Node.js / Express server (`server.ts`)
- **API Proxy Layer**:
  - `/api/weather/forecast`: Fetches Open-Meteo high-resolution hourly/daily meteorological telemetry.
  - `/api/weather/geocode`: High-performance location search and station geocoding.
  - `/api/ai/briefing`: Server-side Gemini AI generation for executive briefings.
  - `/api/ai/chat`: Server-side Gemini AI conversational assistance for operational queries.
- **AI Engine**: `@google/genai` (Google Gemini 2.5 Flash / Gemini 2.0 Flash)

---

## 🚀 Getting Started

### Environment Configuration
Copy `.env.example` to `.env` (managed automatically in Cloud Run environment):
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### Local Development
To launch the dev server with Vite + Express:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### Building for Production
To bundle the frontend and compile the backend into a single CommonJS server (`dist/server.cjs`):
```bash
npm run build
```

To run the production server:
```bash
npm start
```

---

## 🛰️ Global Station Presets
AETHER INTEL comes pre-configured with major global infrastructure hubs:
- **Frankfurt Main Hub (EDDF)** - Germany
- **Rotterdam Port Terminal** - Netherlands
- **Chicago O'Hare Corridor** - USA
- **Tokyo Haneda Terminal** - Japan
- **Singapore Logistics Hub** - Singapore
- **Sydney Maritime Port** - Australia

---

## 🔒 Security & Best Practices
- **API Key Safeguarding**: `GEMINI_API_KEY` is retained strictly on the backend Express server and is never exposed to browser context or network inspectors.
- **Lazy SDK Instantiation**: The Gemini SDK client is initialized lazily upon route invocation to prevent startup crashes when keys are missing or being configured.
- **Zero Mock API Stubs**: Real meteorological telemetry is fetched live from Open-Meteo APIs, with fallback server logic handling edge cases seamlessly.

---

*AETHER INTEL © Enterprise Meteorological Decision Engine*
