# touchstay-guidebook

An Express + TypeScript backend service that scrapes [TouchStay](https://touchstay.com) guidebook data using Puppeteer and exposes it through a simple REST API.

## Overview

The service launches a headless Chromium instance, loads a guest-facing TouchStay guidebook page, intercepts the internal `/v2api/wb/guide/` network response, and returns the captured JSON payload to the caller.

## Tech Stack

- **Node.js** with **TypeScript**
- **Express 5** — HTTP server and routing
- **Puppeteer** — headless browser automation
- **CORS** — cross-origin request support

## Project Structure

```
.
├── index.ts                    # App entry point (Express setup)
├── routes/
│   ├── touchstay.routes.ts     # GET /api/:id route
│   ├── util.ts                 # Puppeteer scraping logic
│   ├── error.ts                # Logger service
│   └── types.ts                # Shared type definitions
├── dist/                       # Compiled JS output
├── package.json
└── tsconfig.json
```

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
npm install
```

The `postinstall` hook will automatically download the Chromium binary required by Puppeteer:

```bash
npx puppeteer browsers install chrome
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run serve` | Run the server in development mode with auto-reload via `nodemon` + `ts-node` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server from `dist/index.js` |

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `80` | Port the Express server listens on |

## API

### `GET /`

Health check.

**Response:** `200 OK` — `Welcome..... Successfully connected to the server`

### `GET /api/:id`

Fetch the TouchStay guidebook data for a given guest ID. Internally loads `https://guide.touchstay.com/guest/:id/` in a headless browser and returns the intercepted guidebook JSON.

**Path parameters**

- `id` — the TouchStay guest guidebook identifier

**Success response** — `200 OK`

```json
{ "...": "guidebook JSON payload from TouchStay" }
```

**Error response** — `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Error fetching data for id <id>: <reason>",
  "error": "<reason>"
}
```

**Example**

```bash
curl http://localhost/api/<guest-id>
```

## Development

```bash
npm run serve
```

The server will restart automatically on changes to any `.ts` file in the project.

## Production

```bash
npm run build
npm start
```

## Notes

- Puppeteer is launched with `--no-sandbox` and related flags for compatibility in containerized environments.
- The scraper waits up to 3 minutes for the guidebook API response before timing out.
- If a browser instance fails to close cleanly, the error is surfaced via the `LoggerService`.
