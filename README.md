# UniNest

UniNest is a web based study planner for organizing tasks, subjects, notes, useful links, and focus sessions. The public app is hosted on Cloudflare Workers, and planner accounts and records are stored in Cloudflare D1.

**Open UniNest:** <https://uninest-study-planner.uninest.workers.dev>

## Hosted setup

- **Web app and API:** Cloudflare Worker, using Python, Flask, and Pywrangler.
- **Browser interface:** HTML templates, CSS, and JavaScript, served as Worker static assets.
- **Database:** Cloudflare D1 database `uninest-db`, connected through the Worker binding `DB`.
- **Production session key:** Cloudflare Worker secret named `UNINEST_SECRET_KEY`.

The deployed app writes account and planner records to D1. The browser uses a signed login cookie. A JSON backup is stored on a user's device only if they choose to download one.

## Screenshots

Screenshots are not included because the live interface can display account-specific study information. A sanitized demo capture can be added when one is available.

## Deploy this project

You need Node.js, Python, `uv`, and access to the Cloudflare account that owns the Worker and D1 database. From the project folder in PowerShell, authenticate and configure a new deployment once:

```powershell
npx wrangler login
uvx --from workers-py pywrangler d1 migrations apply uninest-db --remote
uvx --from workers-py pywrangler secret put UNINEST_SECRET_KEY
```

Apply migrations only when Wrangler reports pending migrations. Set the session secret once, or intentionally rotate it; changing it signs users out. The secret command prompts for the value. Then, for each deployment:

```powershell
uv run python scripts/prepare_cloudflare_assets.py
uvx --from workers-py pywrangler deploy
```

Keep the secret private and never commit it. Local development secrets belong in `.dev.vars`, which Git ignores.

## Files needed for the Worker

- `worker.py` connects the Worker runtime to the Flask application.
- `app.py` implements account, planner, and API behavior.
- `wrangler.jsonc` names the Worker and declares its D1 and asset bindings.
- `pyproject.toml` and `pylock.toml` declare and lock the Python dependencies.
- `migrations/` contains the D1 schema migrations.
- `scripts/prepare_cloudflare_assets.py`, `templates/`, and `static/` build the browser assets served by the Worker.

Generated assets, vendored packages, virtual environments, Cloudflare credentials, local databases, and downloaded backups are excluded by `.gitignore`. Keep secret values and personal records out of the public repository.
