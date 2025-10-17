# Empire Investment

Full-stack investor dashboard running on Vite + React + Tailwind with Supabase auth/data and an n8n webhook for refresh jobs. The production app is hosted on Cloudflare Pages under the `/investment` base path.

## Local development

```bash
cd apps/web
cp .env.local.example .env.local # or create manually, see env vars below
npm install
npm run dev -- --host
```

Then open `http://localhost:5173/investment`.

### Required environment variables

Create `apps/web/.env.local` with your Supabase project values:

```
VITE_SUPABASE_URL=https://<PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_N8N_REFRESH_WEBHOOK_URL=https://n8n.empireautom.org/webhook/investment-refresh
```

In Supabase console add the following redirect URLs under **Authentication → URL Configuration**:

- `https://<your-dev-host>/investment`
- `https://<your-dev-host>/investment/`
- Production Cloudflare Pages domain with the same `/investment` suffix.

### Building

```bash
cd apps/web
npm run build
```

The production assets are generated in `apps/web/dist` and all paths are rooted at `/investment/` for nested hosting.

## Cloudflare Pages deployment

- Project directory: `apps/web`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: same as local `.env.local`

Ensure the `_redirects` file at the repo root is deployed so all `/investment/*` routes resolve to the SPA entry point.
