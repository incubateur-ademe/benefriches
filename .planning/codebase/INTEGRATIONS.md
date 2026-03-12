# External Integrations

**Analysis Date:** 2026-03-12

## APIs & External Services

**Authentication & Identity:**
- Pro-Connect (French government OIDC provider)
  - SDK/Client: openid-client 6.8.2
  - Implementation: `apps/api/src/auth/adapters/pro-connect/HttpProConnectClient.ts`
  - Auth: ENV vars `PRO_CONNECT_CLIENT_ID`, `PRO_CONNECT_CLIENT_SECRET`, `PRO_CONNECT_PROVIDER_DOMAIN`
  - Purpose: User login via French government credentials (OIDC/OpenID Connect)

**Site Evaluation & Mutation Analysis:**
- Mutafriches API (external mutation site evaluation service)
  - Implementation: `apps/api/src/site-evaluations/adapters/secondary/queries/MutafrichesEvaluationQuery.ts`
  - Endpoint: Evaluates site "mutability" (land reuse potential)
  - HTTP GET: `{MUTAFRICHES_API_URL}/friches/evaluations/{mutafrichesId}`
  - Env: `MUTAFRICHES_API_URL`
  - Purpose: Returns reliability scores and usage recommendations for brownfield sites

**Photovoltaic Performance:**
- PVGIS API (Joint Research Centre photovoltaic calculation service)
  - Endpoint: https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?outputformat=json
  - Implementation: `apps/api/src/photovoltaic-performance/adapters/secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi.ts`
  - HTTP GET: Calculates PV energy production based on location, slope, azimuth, system loss
  - Auth: None (public API)
  - Purpose: Annual energy production estimates for photovoltaic projects

**CRM & Contact Management:**
- Connect CRM API (French government CRM platform)
  - SDK/Client: HTTP client (axios via @nestjs/axios)
  - Implementation: `apps/api/src/marketing/adapters/secondary/ConnectCrm.ts`
  - Endpoints:
    - `POST {CONNECT_CRM_URL}/api/v1/personnes` - Create contact
    - `PATCH {CONNECT_CRM_URL}/api/v1/personnes` - Update contact (e.g., last login)
  - Auth: Custom headers via `getAuthHeaders()` (likely API key or basic auth)
  - Env: `CONNECT_CRM_URL`, `CONNECT_CRM_CLIENT_ID`, `CONNECT_CRM_CLIENT_SECRET`
  - Purpose: Sync user registrations and login activity to CRM

## Data Storage

**Databases:**
- PostgreSQL 17-alpine
  - Connection: `apps/api/src/shared-kernel/adapters/sql-knex/knexfile.ts`
  - Client: Knex.js 3.1.0 (query builder)
  - ENV: `DATABASE_URL` (postgres://user:password@host:5432/dbname)
  - Tables: ~21 tables including sites, reconversion_projects, domain_events, soils, evaluations
  - Type definitions: `apps/api/src/shared-kernel/adapters/sql-knex/tableTypes.d.ts`

**File Storage:**
- Local filesystem only (no S3 or cloud storage)
- PDFs generated client-side via @react-pdf/renderer (no server upload)

**Caching:**
- None detected (no Redis, Memcached)

## Authentication & Identity

**Auth Provider:**
- OpenID Connect (Pro-Connect government provider)
  - Implementation: `apps/api/src/auth/adapters/pro-connect/HttpProConnectClient.ts`
  - JWT tokens issued by API: `apps/api/src/auth/core/gateways/`
  - Session management: express-session + JWT
  - Env vars:
    - `AUTH_JWT_SECRET` - JWT signing secret
    - `AUTH_JWT_EXPIRES_IN` - Token expiration duration
    - `SESSION_SECRET` - Express session secret
    - `AUTH_CREATE_USER_ACCOUNT_URL` - Account creation URL (callback)
    - `AUTH_LOGOUT_CALLBACK_URL` - Post-logout redirect
    - `AUTH_LINK_TOKEN_EXPIRATION_MINUTES` - Auth link validity period

**Email Authentication:**
- Magic link authentication via email
  - Implementation: `apps/api/src/auth/adapters/auth-link-mailer/SmtpAuthLinkMailer.ts`
  - SMTP server: nodemailer 8.0.1
  - Env vars:
    - `SMTP_HOST` - SMTP server hostname
    - `SMTP_PORT` - SMTP port (default 1025 for dev)
    - `SMTP_USER` - SMTP username (optional)
    - `SMTP_PASSWORD` - SMTP password (optional)
    - `SMTP_FROM_ADDRESS` - Sender email address

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Console logs only (no centralized logging service)
- Standard Express/NestJS request logging

**Analytics & Tracking (Web Only):**
- Matomo (if enabled)
  - Implementation: `apps/web/src/features/analytics/infrastructure/MatomoAnalytics.ts`
  - Env vars:
    - `WEBAPP_MATOMO_URL` - Matomo instance URL
    - `WEBAPP_MATOMO_SITE_ID` - Matomo site ID
  - Tracks: Page views, events (category, action, name, value)
  - Disabled if WEBAPP_MATOMO_SITE_ID is empty

## CI/CD & Deployment

**Hosting:**
- Docker-based deployment
- Containers: Web (Nginx/Node), API (Node/NestJS), PostgreSQL
- Orchestration: Docker Compose (development, e2e, production-like setups)

**CI Pipeline:**
- Not detected in codebase (assumed GitHub Actions or similar external)

**E2E Environment:**
- docker-compose.e2e.yml orchestrates: PostgreSQL, Mailcatcher, Web container, API container
- Database auto-cleanup after tests via global hooks (`test/integration-tests-global-hooks.ts`)

## Environment Configuration

**Required env vars (API):**
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - API server port
- `SESSION_SECRET` - Express session encryption key
- `AUTH_JWT_SECRET` - JWT signing secret
- `AUTH_JWT_EXPIRES_IN` - Token TTL (e.g., "7d")
- `WEBAPP_URL` - Frontend URL (for CORS, redirects)
- `AUTH_LINK_TOKEN_EXPIRATION_MINUTES` - Magic link validity
- `PRO_CONNECT_PROVIDER_DOMAIN` - Government OIDC provider domain
- `PRO_CONNECT_CLIENT_ID` - OIDC client ID
- `PRO_CONNECT_CLIENT_SECRET` - OIDC client secret
- `PRO_CONNECT_LOGIN_CALLBACK_URL` - OIDC redirect URI
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM_ADDRESS` - Email sending
- `CONNECT_CRM_URL` - CRM endpoint base
- `CONNECT_CRM_CLIENT_ID` - CRM credentials
- `CONNECT_CRM_CLIENT_SECRET` - CRM credentials
- `MUTAFRICHES_API_URL` - Site evaluation API (optional)

**Required env vars (Web):**
- `API_HOST` / `API_HOST_URL` - Backend API hostname (for proxying)
- `WEBAPP_PORT` - Web server port
- `WEBAPP_MATOMO_URL` - Analytics URL (optional)
- `WEBAPP_MATOMO_SITE_ID` - Analytics site ID (optional)
- `WEBAPP_CRISP_WEBSITE_ID` - Chat widget ID (optional)
- `WEBAPP_ALLOWED_DEVELOPMENT_PLAN_CATEGORIES` - Feature flag (comma-separated)
- `WEBAPP_MUTAFRICHES_FRAME_SRC` - Mutafriches iframe source
- `WEBAPP_MUTAFRICHES_INTEGRATOR` - Mutafriches integrator ID
- `WEBAPP_ENABLE_SITE_URBAN_ZONE` - Feature flag for urban zone sites

**Secrets location:**
- Docker Compose: `docker-compose.e2e.yml` environment blocks
- Development: `.env.e2e` file (e2e tests)
- Production: Container environment variables (e.g., Kubernetes secrets, ECS task definition)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- Pro-Connect login callback: `{AUTH_LOGOUT_CALLBACK_URL}` (redirect-based)
- CRM contact sync: POST requests to Connect CRM API

## Integration Implementation Patterns

**HTTP Services (API):**
- NestJS HttpModule with Axios
- Modules register HttpModule then inject HttpService into services
- Example: `apps/api/src/photovoltaic-performance/adapters/primary/photovoltaicPerformance.module.ts` → HttpModule + PhotovoltaicGeoInfoSystemApi
- Error handling: catchError with RxJS operators, lastValueFrom for async

**Third-Party SDK (Web):**
- Crisp chat SDK (crisp-sdk-web)
  - Lazy initialization via service abstraction
  - Implementation: `apps/web/src/features/support/infrastructure/support-chat-service/CrispSupportChatService.ts`
  - Gateway interface: `apps/web/src/features/support/core/gateways/SupportChatGateway.ts`
  - Initialization: `Crisp.configure()`, manual `Crisp.load()` on user action
  - Disabled when WEBAPP_CRISP_WEBSITE_ID is empty

**Matomo Analytics (Web):**
- Script injection at runtime
- Implementation: `apps/web/src/features/analytics/infrastructure/MatomoAnalytics.ts`
- Methods: init() (loads script), trackPageView(), trackEvent()
- Tracking: Window.\_paq array push (standard Matomo pattern)

---

*Integration audit: 2026-03-12*
