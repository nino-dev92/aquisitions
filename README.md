# Acquisitions App with Neon Database

## Development with Neon Local

Use Docker Compose to run the app together with a local Neon proxy for database access.

1. Create a local environment file if needed:
   - `.env.development`
2. Start the stack:
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```
3. The app will connect to:
   ```text
   postgres://user:password@neon-local:5432/dbname
   ```
4. Neon Local runs as a container and exposes Postgres on port `5432`.

### Notes
- `DATABASE_URL` is injected from `.env.development`.
- The dev compose file uses the `neon-local` service so the app can reach a local Postgres-compatible endpoint.

## Production with Neon Cloud

For production, keep the real Neon cloud connection string in a secret environment variable.

1. Set the production database URL:
   ```bash
   export DATABASE_URL="postgres://<user>:<password>@<host>/<database>?sslmode=require"
   ```
2. Start the production stack:
   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```
3. The app uses the Neon cloud URL from `DATABASE_URL` and does not start the Neon Local container.

## Environment Switching

- Development uses `.env.development` and `docker-compose.dev.yml`
- Production uses `.env.production` and `docker-compose.prod.yml`
- The app reads `DATABASE_URL` from the environment, so the same container image works in both modes
