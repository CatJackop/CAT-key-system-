# CAT HUB KEY SYSTEM

Starter project for a CAT HUB key website + Netlify Functions API + PostgreSQL (Neon).

## Features
- `cat-` prefixed keys
- GET KEY page (issues a key immediately; no account required)
- Admin dashboard protected by a server-side `ADMIN_SECRET`
- Custom expiration durations chosen by admin (hours/days)
- First-use activation: expiration countdown starts on first successful verification
- Verify, list, and revoke keys
- Netlify Functions API and PostgreSQL schema
- Responsive yellow/black CAT HUB UI

## Before deploying
1. Create a PostgreSQL database, for example in Neon.
2. Run `database.sql` in the database SQL editor.
3. Push this folder to a GitHub repository named `cathub-key-ggs`.
4. Import the repository in Netlify.
5. In Netlify site settings, add environment variables:
   - `DATABASE_URL` = your PostgreSQL connection string
   - `ADMIN_SECRET` = a long, random secret (do NOT use `2012` for a public deployment)
   - `ALLOWED_ORIGIN` = your deployed site origin, e.g. `https://cathub-key-ggs.netlify.app`
6. Deploy. The site URL is only confirmed after Netlify accepts the site name and deployment succeeds.

## API
- `POST /.netlify/functions/get-key` — public key issuance, rate-limited only by simple in-memory protection (see security notes)
- `POST /.netlify/functions/verify-key` — verifies a key and activates it on first use
- `GET /.netlify/functions/admin-keys` — admin list; requires `x-admin-secret`
- `POST /.netlify/functions/admin-create-key` — admin create with `durationHours`; requires `x-admin-secret`
- `POST /.netlify/functions/admin-revoke-key` — revoke by key; requires `x-admin-secret`

Netlify URL rewrite rules in `netlify.toml` expose `/api/...` aliases.

## Important security notes
- Keep `ADMIN_SECRET` and `DATABASE_URL` only in Netlify environment variables.
- Do not hardcode secrets in frontend code or Lua scripts.
- The public GET KEY endpoint issues a key to anyone. Add CAPTCHA, rate limiting, and abuse controls before wide public release.
- Roblox client code is modifiable by players; a client-side check can be bypassed. Do not treat client-only verification as strong access control.
- For a real public service, add durable rate limiting (e.g. database-backed counters or an external rate-limit provider), logging, and stricter CORS.
- This is a starter template, not a production security audit.

## Roblox example
See `examples/verify.lua`. Replace `API_BASE` with your deployed domain. Use only with Roblox-supported HTTP requests and ensure HTTP requests are enabled where applicable. The client-side code can be altered, so don't put secrets in it.

## Android deployment
You can do the setup from your phone:
1. Create the database and run `database.sql`.
2. Upload these files to GitHub (or create the repository and upload the ZIP contents).
3. Import the repo into Netlify.
4. Add environment variables listed above.
5. Deploy and test `/.netlify/functions/verify-key`.

## Admin login
The admin dashboard asks for the secret key and sends it in an HTTPS header. The server checks it. The dashboard does not store it permanently.
