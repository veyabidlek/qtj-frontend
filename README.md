# KTJ Digital Twin — Frontend

Real-time locomotive monitoring dashboard for the KZ8A electric locomotive. Displays live telemetry, health index, alerts, route progress, and system analysis via WebSocket streaming.

**Live:** https://app.165.22.216.205.nip.io/dashboard

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** TailwindCSS, shadcn/ui
- **Charts:** Recharts
- **Maps:** Leaflet / React-Leaflet
- **State:** React Query, WebSocket (custom hook)
- **Icons:** Heroicons, custom SVG

## Getting Started

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Edit .env.local with your backend URL

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_WS_URL` | WebSocket endpoint (relative or absolute) | `/ws/telemetry` |
| `NEXT_PUBLIC_API_KEY` | Backend API key | `dev-api-key` |
| `BACKEND_URL` | Backend URL for Next.js rewrites (server-side) | `http://localhost:8000` |

### Local development with remote backend

```env
BACKEND_URL=https://api.165.22.216.205.nip.io
NEXT_PUBLIC_WS_URL=wss://app.165.22.216.205.nip.io/ws/telemetry
NEXT_PUBLIC_API_KEY=dev-api-key
```

## Project Structure

```
app/
├── dashboard/
│   ├── components/          # Dashboard-specific components
│   │   ├── DashboardShell   # Main layout orchestrator
│   │   ├── SpeedCard        # SVG speedometer gauge
│   │   ├── HealthIndexPanel # Health score with breakdown
│   │   ├── QuickMetrics     # Vehicle data overview
│   │   ├── SystemStatus     # Subsystem health bars
│   │   ├── TrendCharts      # Time-series line charts
│   │   ├── AlertsPanel      # Alert list with severity
│   │   ├── RouteMap         # Leaflet map with live position
│   │   └── StationBackground # Dynamic background per station
│   ├── hooks/               # Dashboard-specific hooks
│   └── page.tsx             # Server component entry
├── admin/                   # Admin panel (scenario switching)
├── layout.tsx               # Root layout
└── providers.tsx            # WebSocket, Theme, QueryClient

components/ui/               # shadcn/ui components
hooks/                       # Shared hooks (useWebSocket)
lib/                         # Utilities (formatters, logger)
types/                       # TypeScript types
config/                      # Constants, thresholds
```

## Key Features

- **Real-time telemetry** via WebSocket with 200ms buffer flush
- **Health Index** — weighted score (engine 30%, electrical 25%, brakes 25%, fuel 20%) with alert penalties
- **Dynamic backgrounds** — station-specific images/videos based on `backgroundKey` from backend
- **Train states** — `stopped`, `moving`, `approaching_station` drive UI transitions
- **KZ8A locomotive model** — realistic speed (max 120 km/h), traction, current simulation
- **Station stops** — 5s idle at each station with acceleration ramp on departure
- **5 scenarios** — normal, overheat, brake_failure, low_fuel, demo
- **Dark/Light theme** with glass-panel HUD design
- **Responsive** — optimized for 1920x1080, usable on iPad (1024x768)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run generate` | Regenerate OpenAPI types from backend |

## Backend

See [qtj-backend](https://github.com/veyabidlek/qtj-backend) for the FastAPI backend, simulator, and health calculator.
