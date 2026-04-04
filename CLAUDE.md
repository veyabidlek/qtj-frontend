# CLAUDE.md — Frontend Rules

## Project

Locomotive digital twin dashboard. Next.js 14+ (App Router), TypeScript, TailwindCSS, shadcn/ui. Real-time telemetry visualization with health index.

## Project Structure

```
app/
├── dashboard/
│   ├── components/            # components ONLY for this page
│   │   ├── DashboardShell.tsx # client orchestrator (3-column layout)
│   │   ├── Sidebar.tsx        # icon-only sidebar navigation
│   │   ├── HealthGauge.tsx    # circular health index gauge (SVG)
│   │   ├── SpeedGauge.tsx     # analog speedometer (SVG)
│   │   ├── LocomotiveHero.tsx # right column: train image, health grade, resources
│   │   ├── EmergencyToggle.tsx # emergency mode toggle
│   │   ├── QuickMetrics.tsx   # compact telemetry overview (speed, temp, voltage, fuel)
│   │   ├── SystemStatus.tsx   # horizontal health bars (engine, electrical, brakes, fuel)
│   │   ├── MetricCard.tsx     # individual metric display with sparkline
│   │   ├── MetricsPanel.tsx   # 8-metric grid
│   │   ├── TrendCharts.tsx    # Recharts time-series line charts
│   │   ├── AlertsPanel.tsx    # scrollable alerts list
│   │   ├── RouteMap.tsx       # Leaflet map with route and live position
│   │   ├── ConnectionStatus.tsx # connection indicator dot + label
│   │   └── ErrorBoundary.tsx  # error boundary with retry
│   ├── hooks/                 # hooks ONLY for this page
│   │   └── useDashboardData.ts
│   └── page.tsx               # server orchestrator — no raw HTML
│
├── layout.tsx                 # root layout (server component)
├── providers.tsx              # client wrapper: WebSocket, Theme, QueryClient
└── globals.css

components/
├── ui/                        # shadcn/ui components (auto-generated here by CLI)
└── icons/
    └── TrainIcons.tsx         # custom SVG icons: TrainIcon, ThermometerIcon, FuelIcon, GaugeIcon
hooks/                         # shared hooks: useWebSocket
lib/                           # shared pure utilities: formatters, smoothing, logger
types/                         # global TypeScript types
config/                        # constants, thresholds
```

## Architecture Rules

1. Use App Router (`/app` directory). No Pages Router.
2. Default all components to `"use client"` only when they need browser APIs, state, or effects. Keep layout and page shells as server components.
3. Colocate page-specific components, hooks, and utils inside the route folder (`app/<route>/components/`, `app/<route>/hooks/`, `app/<route>/utils/`).
4. Keep shared/reusable UI components in `/components/ui/` (project root, outside `/app`).
5. Keep shared hooks in `/hooks/` (project root). One hook per file. Name files `use<Name>.ts`.
6. Keep all TypeScript types/interfaces in `/types/`. One file per domain (e.g. `telemetry.ts`, `health.ts`).
7. Keep all shared utility/helper functions in `/lib/`. Pure functions only, no side effects.
8. Keep all constants, thresholds, config values in `/config/constants.ts`. Never hardcode magic numbers in components.
9. Use `@/` path alias for all imports. Never use relative paths like `../../`.
10. If a page-specific component is used in 2+ pages, move it to `/components/ui/`.

## page.tsx Rules

11. `page.tsx` is an orchestrator. It assembles components and passes data. It must NOT contain raw HTML tags (`<div>`, `<span>`, etc.) except for the top-level wrapper.
12. `page.tsx` must NOT contain `useState`, `useEffect`, or any client hooks. If the page needs client interactivity, create a client component (e.g. `DashboardShell.tsx`) and render it from `page.tsx`.
13. `page.tsx` CAN fetch initial data as a server component (config, historical data) and pass it as props to client components. Use this for initial telemetry history and health index config.
14. Keep `page.tsx` under 40 lines. If it grows beyond that, you are putting too much logic in it.

Example of a correct `page.tsx`:

```tsx
// app/dashboard/page.tsx
import DashboardShell from "./components/DashboardShell";
import { getHealthConfig } from "@/lib/api";

export default async function DashboardPage() {
  const config = await getHealthConfig();
  return <DashboardShell initialConfig={config} />;
}
```

Example of a correct `DashboardShell.tsx` (client orchestrator):

```tsx
// app/dashboard/components/DashboardShell.tsx
"use client";

export default function DashboardShell({ initialConfig }: Props) {
  return (
    <DashboardLayout>
      <HealthGauge />
      <MetricsPanel />
      <TrendCharts />
      <AlertsPanel />
      <RouteMap />
    </DashboardLayout>
  );
}
```

## State Management

15. Use React `useState` and `useReducer` for local component state. No Redux, no Zustand, no MobX.
16. Use React Context only for global concerns: theme, WebSocket connection, current telemetry snapshot. Max 3 contexts.
17. Use `@tanstack/react-query` for all REST API calls (history, config, export). Never `fetch` inside `useEffect`.
18. For WebSocket data, use a custom `useWebSocket` hook that stores latest values in a `useRef` and triggers re-renders via `useState` at a throttled rate (max 5 fps / 200ms interval).
19. Never store the full telemetry history in React state. Keep a sliding window buffer (last 300 data points max) in a `useRef`.

## Component Rules

20. Every component must have TypeScript props interface defined. No `any` types. Use `unknown` if truly needed, then narrow.
21. Keep components under 150 lines. If longer, split into smaller components.
22. No inline styles. Use Tailwind classes only. Exception: dynamic values that must be computed (e.g. gauge rotation angle) — use CSS variables via `style={{ '--value': x } as React.CSSProperties}`.
23. Use `React.memo()` on all metric cards, chart components, and any component receiving telemetry data. These re-render frequently.
24. Use `useMemo` for expensive calculations (health index breakdown, chart data transformations). Use `useCallback` for handlers passed to memoized children.
25. Never use `useEffect` for data transformation. Derive computed values inline or with `useMemo`.
26. Prefer composition over props drilling. Use `children` pattern and compound components.
27. Page-specific components are flat files by default. Do NOT create a folder per component unless it has 2+ private sub-components or a local hook. Flat is faster to navigate and generate.

## shadcn/ui Rules

28. Use shadcn/ui as the base component library. It lives in `/components/ui/` and is installed via `npx shadcn@latest add <component>`.
29. Required shadcn components for this project: `card`, `badge`, `button`, `tooltip`, `select`, `tabs`, `slider`, `sheet`, `alert`, `separator`, `scroll-area`.
30. Never modify shadcn source files in `/components/ui/` directly for project-specific logic. Instead, wrap them in your own component:

```tsx
// GOOD — wrap in your own component
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function MetricCard({ label, value, unit }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>{label}</CardHeader>
      <CardContent>
        <span className="font-mono text-2xl">{value}</span> {unit}
      </CardContent>
    </Card>
  );
}

// BAD — editing /components/ui/card.tsx to add telemetry-specific logic
```

31. Styling overrides on shadcn components: use Tailwind `className` prop, never modify the shadcn CSS variables unless changing the global theme.
32. For the Health Index gauge and sparklines: build custom SVG components. shadcn does not cover these. Do not search for gauge libraries.
33. Use `@heroicons/react` for all icons. Import from `@heroicons/react/24/outline` or `@heroicons/react/24/solid`. For train-domain icons without heroicons equivalents (`Train`, `Thermometer`, `Fuel`, `Gauge`), use custom SVG components from `@/components/icons/TrainIcons`. Common heroicons: `SunIcon`, `MoonIcon`, `Bars3Icon`, `BellIcon`, `BoltIcon`, `WifiIcon`, `SignalSlashIcon`, `ExclamationTriangleIcon`, `ExclamationCircleIcon`, `InformationCircleIcon`, `MagnifyingGlassIcon`, `UserCircleIcon`, `ArrowRightIcon`, `ChevronDownIcon`, `MapIcon`, `Squares2X2Icon`, `ChartBarIcon`, `SignalIcon`, `ShieldExclamationIcon`.
34. shadcn theme (dark/light) is controlled via `class` strategy on `<html>`. Use `next-themes` provider in `providers.tsx`. The toggle is a Light/Dark pill selector using `SunIcon`/`MoonIcon` from heroicons.

## Real-Time / WebSocket Rules

35. Single WebSocket connection for the entire app. Managed in a context provider at the root (`providers.tsx`).
36. Implement auto-reconnect with exponential backoff: 1s → 2s → 4s → 8s → max 30s. Reset on successful connection.
37. Show connection status indicator in the header at all times: green = connected, yellow = reconnecting, red = disconnected.
38. On the client side, batch incoming WebSocket messages. Accumulate in a ref buffer and flush to state every 200ms using `requestAnimationFrame` or `setInterval`. Never setState on every single message.
39. When WebSocket disconnects, freeze the UI on the last known state. Do NOT clear the dashboard. Show a "Данные устарели — переподключение..." banner.
40. Handle WebSocket `onclose` and `onerror` separately. Log both.

## Charting & Visualization Rules

41. Use Recharts for all time-series charts. Keep chart config (colors, axis settings) in constants, not inline.
42. Charts must auto-scale Y axis based on data range. Never hardcode Y min/max.
43. Limit visible time window on charts to last 5 minutes by default. Allow user to switch: 1 min / 5 min / 15 min.
44. Use `isAnimationActive={false}` on Recharts components during live streaming. Animation kills performance on frequent updates.
45. For the Health Index gauge, use SVG with CSS transitions for smooth animation. No canvas, no external gauge libraries.
46. Color coding for health index: green (#22c55e) for 80–100, yellow (#eab308) for 50–79, red (#ef4444) for below 50. Define in constants.

## Styling Rules

47. Use Tailwind CSS. No separate CSS files, no CSS modules, no styled-components. Extend `tailwind.config.ts` with the custom color palette below.
48. Default to light theme. Dark theme is fully supported. Use `next-themes` with `defaultTheme="light"`.
49. Custom color palette — defined via CSS variables in `globals.css` under `:root` (light) and `.dark` (dark):

```
Light theme (default):
  --db-bg: #f2f2f7        // cool light gray page background
  --db-surface: #ffffff    // white card/panel background
  --db-border: #e5e5ea     // subtle gray borders
  --db-accent: #1c1c1e     // near-black primary accent (active states, buttons)
  --db-accent-dim: #8e8e93 // dimmed gray for secondary elements
  --db-text: #1c1c1e       // near-black primary text
  --db-text-muted: #8e8e93 // gray secondary text
  --db-success: #34c759    // green — normal status
  --db-warning: #ff9f0a    // orange — attention status
  --db-danger: #ff3b30     // red — critical status

Dark theme:
  --db-bg: #0a0a0a         // near-black page background
  --db-surface: #1c1c1e    // dark gray card background
  --db-border: #38383a     // subtle dark borders
  --db-accent: #ffffff     // white primary accent
  --db-text: #f5f5f5       // light text
```

50. Card styling: use the `.dash-card` CSS class which provides white background, rounded-2xl corners, subtle box-shadow, and thin border. No glassmorphism or glow effects — keep the design clean and minimal like the reference.
51. Active sidebar icon: white background with `shadow-md` and `ring-1`. No glow effects.
52. Text hierarchy: metric labels in `text-dashboard-textMuted text-xs uppercase tracking-wider`. Metric values in `font-mono text-2xl font-bold text-dashboard-text`. Units in `text-dashboard-textMuted text-sm`.
53. Minimum font size: 14px (`text-sm`). For metric values use `text-2xl` or larger. For the health index number use `text-6xl` or larger.
54. Use `font-mono` for all numeric telemetry values (speed, temperature, voltage, etc.) so digits don't jump when values change.
55. Gauge and circular indicators: use SVG with CSS transitions for smooth animation. No canvas, no external gauge libraries.
56. Chart colors: primary line `#3b82f6` (blue), secondary `#8b5cf6` (violet), tertiary `#f59e0b` (amber). Chart grid lines use `var(--db-border)`. Chart background transparent.
57. Responsive: design for 1920x1080 primary. Must be usable at 1366x768 (laptop). Use Tailwind breakpoints, not media queries.
58. All colors for severity/status must work for colorblind users. Pair color with icon and/or text label. Never rely on color alone.

## Performance Rules

54. Lazy load the map component with `next/dynamic` and `ssr: false` (Leaflet doesn't support SSR).
55. Lazy load the PDF export module. Only import `jspdf` when user clicks export.
56. Never re-render the entire dashboard on every telemetry tick. Each widget subscribes to only the data slice it needs.
57. Use `will-change: transform` on animated elements (gauge needle, sparklines). Remove after animation settles.
58. Target: UI must visually update within 500ms of data arriving over WebSocket. Measure with `performance.now()` in dev mode.

## Error Handling

59. Wrap each dashboard panel in an Error Boundary. One panel crashing must not take down the whole dashboard.
60. Show fallback UI in error boundaries: "Панель недоступна" with a retry button. Never show raw stack traces.
61. Validate all incoming WebSocket messages against expected shape before processing. Silently discard malformed messages, log to console.

## File Naming

62. Components: `PascalCase.tsx` (e.g. `HealthGauge.tsx`).
63. Hooks: `camelCase.ts` starting with `use` (e.g. `useWebSocket.ts`).
64. Utils/lib: `camelCase.ts` (e.g. `formatters.ts`).
65. Types: `camelCase.ts` (e.g. `telemetry.ts`).
66. One component per file. No barrel exports (`index.ts`) — import directly.

## Code Style

67. Use `function` declarations for components, not arrow functions: `export default function HealthGauge() {}`.
68. Props destructuring in function signature: `function MetricCard({ value, label, unit }: MetricCardProps) {}`.
69. Use early returns for loading/error states at the top of components.
70. No `console.log` in committed code. Use a `logger` utility that only logs in development.
71. All user-facing text must be in Russian. Variable names and code stay in English.

## Git

72. Commit after each working feature. Message format: `feat: add health gauge component`, `fix: websocket reconnect loop`.
73. Do not commit `node_modules`, `.next`, `.env.local`.
