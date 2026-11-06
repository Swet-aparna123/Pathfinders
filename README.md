# PathFinders

Career exploration and guidance app built with Next.js 15 and React 19. The frontend and its Next.js API routes live in `frontend/`; model integration lives in `backend/`.

## Run locally on Windows

1. Install Node.js 20 or newer.
2. Double-click `start.bat` (or run it from a terminal).
3. The launcher installs frontend dependencies when needed, starts Next.js, and opens `http://localhost:3000`.

For manual startup:

```powershell
cd frontend
npm install
npm run dev
```

## Environment

The root `.env` file is loaded by `frontend/next.config.js`. It contains the server-side `GROQ_API_KEY` and `GROQ_MODEL` settings. The key is never sent to the browser. Keep `.env` private; it is ignored by Git.

The project also uses Supabase Auth. Replace `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env` with credentials from your Supabase project to enable registration and sign-in.

The chat endpoint calls Groq's Chat Completions API through `backend/groq.js`. Change `GROQ_MODEL` in `.env` to select another model available to your Groq account. Rapid Fire assessment scoring remains a deterministic application engine. Parent/student linking currently has no server implementation and does not create simulated approvals or sample profiles.

## Project layout

```text
backend/
  groq.js                 Server-side Groq client
frontend/
  app/                    Pages and API routes
  components/             React UI
  lib/                    Assessment, auth, and localization logic
  public/                 Static assets
  package.json
  next.config.js
start.bat                 Windows local launcher
.env                      Local credentials (ignored by Git)
```
