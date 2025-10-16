# Empire Investment (MVP)
- Frontend: Vite + React + Tailwind, hosted on Cloudflare Pages under `/investment`
- Backend data: Supabase (auth + DB)
- Workflows: n8n (fetch prices/news, summarize, alerts)

## Deploy
Cloudflare Pages
- Build: `npm ci && npm run build`
- Output: `apps/web/dist`
- Env: see `.env.example`

## Local dev (optional later)
npm run dev from `apps/web`
