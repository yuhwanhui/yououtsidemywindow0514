# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

UECADA PHM Dashboard — a Vue 3 + TypeScript SPA for industrial equipment monitoring (SCADA/PHM). Frontend-only repo; no backend code or database in this repository.

### Quick reference

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` (serves at `http://127.0.0.1:5173/`) |
| Type check | `npm run typecheck` |
| Build | `npm run build` (runs `vue-tsc --noEmit && vite build`) |
| Preview build | `npm run preview` |

See `README.md` for full details and changelog.

### Environment setup

Copy `.env.example` to `.env` before first run. Default values enable **mock mode** (no backend needed). All pages, routing, auth guards, and alarm polling work without external services.

### Mock mode

When `VITE_API_BASE_URL` is empty or `VITE_USE_MOCK_ALARMS=true`, alarm data is simulated locally. Login generates demo tokens in-browser (no real auth server). Two demo roles are available on the login page: **admin** (관리자) and **operator** (운영자). Only admin can access the user management page (`/users`); operators are redirected to the dashboard by the router guard.

### No linter configured

There is no ESLint or Prettier configuration in this repo. Type checking via `vue-tsc --noEmit` (`npm run typecheck`) is the primary code quality gate. The `npm run build` script also runs typecheck before building.

### Gotchas

- The `package.json` includes an unused dependency `"l"` — this is harmless but may cause confusion.
- Build produces large chunks (>500 kB) due to ECharts + ApexCharts bundled together; this is a known issue noted in the README.
- Auth tokens are stored in `sessionStorage` (not `localStorage`) per project security rules.
