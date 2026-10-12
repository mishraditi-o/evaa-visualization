# EVAA Visualization

**Event Visualization & Analysis Application — Frontend Dashboard**

EVAA Visualization is a React-based dashboard designed to explore and analyze event-camera recordings. It provides an interactive interface for visualizing event activity, inspecting event data, reviewing dataset statistics, and understanding event polarity distributions.

The dashboard is designed to integrate with the **EVAA Engine**, which handles event-data ingestion, validation, and HDF5/Parquet generation.

## Features

- **Event visualization:** Displays event coordinates on an HTML Canvas, with colors representing event polarity.
- **Dataset overview:** Dashboard panels for event count, recording duration, sensor resolution, and event rate.
- **Polarity analysis:** Visual summaries of positive and negative events.
- **Event inspector:** Interface for searching and inspecting event information.
- **Playback controls:** UI controls for navigating event recordings.
- **Interactive charts:** Chart panels for exploring event activity and related statistics.
- **Responsive interface:** Dark-themed dashboard designed for desktop and smaller screens.
- **Backend integration:** Designed to communicate with the EVAA Engine API.

> **Current implementation note:** Some dashboard elements may still use demo data. Upload processing, live metrics, playback, and export should be considered fully implemented only after they have been connected to and tested against the backend.

## Technology Stack

- React 18
- Vite 6
- Recharts
- Lucide React
- JavaScript
- HTML Canvas API
- CSS

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mishraditi-o/evaa-visualization.git
cd evaa-visualization
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed in the terminal. The default Vite URL is usually:

`http://localhost:5173`

## Connecting to EVAA Engine

The frontend is intended to work with the EVAA Engine backend.

Clone and run the backend in a separate terminal:

```bash
git clone https://github.com/mishraditi-o/evaa-engine.git
cd evaa-engine
npm install
npm start
```

The backend defaults to:

`http://localhost:3004`

### Configure the Vite proxy

In `vite.config.js`, configure the development server to forward API requests to the backend. Add this setting while preserving any existing configuration:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3004',
      changeOrigin: true
    }
  }
}
```

Restart the frontend server after modifying the configuration.

### Available backend endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/status` | Check backend availability |
| POST | `/api/ingest` | Upload and process an event-data file |

Additional preview, query, and download endpoints may be needed for complete dashboard integration.

## Event Data Format

The event canvas expects event records containing timestamp, position, and polarity fields.

Example:

```js
[
  { t: 1000, x: 120, y: 80, p: 1 },
  { t: 1010, x: 124, y: 82, p: -1 }
]
```

| Field | Description |
|---|---|
| `t` | Event timestamp |
| `x` | Horizontal pixel coordinate |
| `y` | Vertical pixel coordinate |
| `p` | Event polarity |

The visualization uses sensor width and height to map event coordinates onto the canvas. Input records should follow the expected schema and coordinate range.

## Uploading Event Data

The backend ingestion endpoint accepts a file through a multipart form request using the field name `file`.

Example:

```js
const formData = new FormData();
formData.append('file', selectedFile);

const response = await fetch('/api/ingest', {
  method: 'POST',
  body: formData
});

if (!response.ok) {
  throw new Error('Event data ingestion failed');
}

const result = await response.json();
```

This example demonstrates the API request contract. The dashboard must handle loading states, ingestion errors, metadata, and preview results to provide a complete upload experience.

Do not manually set the `Content-Type` header when sending `FormData`; the browser sets the multipart boundary automatically.

## Production Build

Build the frontend for deployment:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Vite writes the production build to the `dist/` directory.

## Project Structure

```text
evaa-visualization/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── components/
│   │   └── EventCanvas.jsx
│   └── styles.css
└── README.md
```

The exact component and stylesheet names may differ in future revisions.

## Development Roadmap

- [ ] Connect file uploads to the EVAA Engine API.
- [ ] Replace demo events with actual ingested event data.
- [ ] Populate dashboard statistics from backend metadata.
- [ ] Connect polarity charts to real event distributions.
- [ ] Implement timestamp-based playback.
- [ ] Add real CSV export and processed-file downloads.
- [ ] Add clear loading and error states.
- [ ] Test with representative and large event datasets.
- [ ] Validate responsive behavior and accessibility.

## Security and Data Handling

- Do not commit credentials, `.env` files, or private event recordings.
- Keep dependencies and build artifacts out of Git using `.gitignore`.
- Configure production API routing and access controls appropriately.
- Apply suitable upload-size limits and validation on the backend.

## License

No license is currently specified. Add a `LICENSE` file if the project will be distributed under an open-source license.
