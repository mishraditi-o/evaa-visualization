# EVAA Visualization UI Starter

React + Vite dashboard prototype for event-camera data. It currently renders generated demo events and charts; selecting a file changes the displayed filename only and does not parse the file yet.

## Run locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## API integration

Copy `.env.example` to `.env` and set `VITE_EVAA_API_URL` to your backend API base URL. The `src/services/api.js` file contains proposed API paths (`/events/preview` and `/events/metrics`); update them to match your actual Express routes before enabling live data calls.

## Current scope

- Dashboard layout, event canvas, polarity filter, sample event inspector, temporal activity chart, event-rate chart.
- Demo data only; file upload is UI-only and does not upload or parse the selected file.
- No backend route is assumed to exist.
