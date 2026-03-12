# Technology Stack

**Analysis Date:** 2026-03-12

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (strict mode enabled)

**Secondary:**
- JavaScript - Build scripts, configuration files
- SQL - Database schema via Knex migrations

## Runtime

**Environment:**
- Node.js 24 (required, enforced in package.json engines field)

**Package Manager:**
- pnpm 10.31.0 - Monorepo package management
- Lockfile: pnpm-lock.yaml (present)

## Frameworks

**Backend:**
- NestJS 11.1.15 - REST API framework with dependency injection
- Express 5.2.1 - Underlying HTTP server (via NestJS platform-express)

**Frontend:**
- React 19.2.4 - UI library
- Vite 7.3.1 - Build tool and dev server
- Redux Toolkit 2.11.2 - State management with event-based architecture
- React Redux 9.2.0 - React bindings for Redux

**Build & Compilation:**
- NestJS CLI 11.0.16 - Backend build and generation
- SWC 1.15.18 - Fast TypeScript/JavaScript compiler (via unplugin-swc)
- tsdown 0.20.3 - TypeScript to JavaScript transpiler (for shared package)

**Testing:**
- Vitest 4.0.18 - Fast unit test runner (Node.js focus, replaces Jest)
- Playwright 1.58.2 - End-to-end testing framework
- testcontainers 11.12.0 - Docker-based test containers for isolated DB testing
- Supertest 7.2.2 - HTTP assertions for API testing

**Code Quality:**
- oxlint 1.43.0 - Lightning-fast JavaScript linter (ESLint-compatible)
- oxlint-tsgolint 0.11.4 - TypeScript-aware linting plugin
- Prettier 3.8.1 - Code formatter
- @trivago/prettier-plugin-sort-imports 6.0.2 - Import sorting plugin

**Pre-commit Hooks:**
- Husky 9.1.7 - Git hooks manager
- lint-staged 16.2.7 - Run linters on staged files

## Key Dependencies

**API - Core Libraries:**
- pg 8.19.0 - PostgreSQL database driver
- knex 3.1.0 - SQL query builder and migration management
- openid-client 6.8.2 - OpenID Connect client for Pro-Connect authentication
- bcrypt 6.0.0 - Password hashing
- express-session 1.19.0 - Session management
- cookie-parser 1.4.7 - Cookie parsing middleware
- nodemailer 8.0.1 - Email sending (SMTP)
- uuid 13.0.0 - UUID generation
- date-fns 4.1.0 - Date utility library
- zod 4.3.6 - TypeScript-first schema validation
- nestjs-zod 5.1.1 - Zod validation for NestJS
- axios 1.13.6 - HTTP client
- @nestjs/axios 4.0.1 - Axios integration for NestJS
- @nestjs/jwt 11.0.2 - JWT token handling
- @nestjs/event-emitter 3.0.1 - Event publishing (domain events)
- reflect-metadata 0.2.2 - Metadata reflection (required by NestJS)
- rxjs 7.8.2 - Reactive programming (used by NestJS internally)

**Web - Core Libraries:**
- Redux Toolkit 2.11.2 - State management
- React Hook Form 7.71.2 - Form state management
- date-fns 4.1.0 - Date utilities
- uuid 13.0.0 - UUID generation
- zod 4.3.6 - Schema validation
- type-route 1.1.0 - Type-safe routing
- Highcharts 12.2.0 - Impact visualization charts
- highcharts-react-official 3.2.2 - React wrapper for Highcharts
- @react-pdf/renderer 4.3.2 - PDF export
- react-pdf-tailwind 3.0.0 - Tailwind styling for PDFs
- clsx 2.1.1 - Conditional className utility
- reduce-reducers 1.0.4 - Redux reducer composition

**UI Frameworks:**
- @codegouvfr/react-dsfr 1.31.1 - French government design system components
- @headlessui/react 2.2.9 - Accessible UI component primitives
- Tailwind CSS 4.2.1 - Utility-first CSS framework
- @tailwindcss/vite 4.2.1 - Vite plugin for Tailwind CSS

**Shared Package:**
- date-fns 4.1.0
- uuid 13.0.0
- zod 4.3.6

**Third-party SDKs:**
- crisp-sdk-web 1.0.27 - Crisp chat widget (web only)

## Configuration

**Environment:**
- Environment variables per app (`.env`, `.env.example` files)
- Environment variable validation via NestJS ConfigModule (API)
- Runtime env vars passed via docker-compose for staging/production
- Web environment variables compiled at build time and embedded in `env-vars.js`

**Build:**
- TypeScript configuration extends `.tooling/tsconfig.base.json` with strict: true
- Vite configuration: `apps/web/vite.config.ts`
- NestJS configuration via nest-cli.json
- Prettier: Uses import sort plugin (@trivago), cache enabled
- oxlint: Type-aware linting enabled, no config file (defaults apply)

**Knex Migrations:**
- Migration source: `apps/api/migrations/`
- Configuration: `apps/api/src/shared-kernel/adapters/sql-knex/knexfile.ts`
- Migration format: TypeScript (.ts files)

## Platform Requirements

**Development:**
- Node.js 24
- pnpm 10.31.0
- Docker & Docker Compose (for database, mailcatcher, e2e stack)
- PostgreSQL 17-alpine (via docker-compose)
- Mailcatcher (dockage/mailcatcher image - SMTP test server)

**Production:**
- Node.js 24
- PostgreSQL 17+
- SMTP server for email
- OpenID Connect provider (Pro-Connect)
- CRM system (Connect API) for contact sync
- Optional: Mutafriches API for site evaluations
- Optional: PVGIS API (https://re.jrc.ec.europa.eu) for photovoltaic calculations
- Optional: Matomo instance for analytics
- Optional: Crisp chat widget

## Deployment Architecture

**Containerization:**
- Web: `apps/web/Dockerfile` - Node-based SPA build, served on port 80
- API: `apps/api/Dockerfile` - NestJS application on configurable port (default 3001)
- Database: PostgreSQL 17-alpine
- Email: Mailcatcher (dev/e2e only)

**Database:**
- PostgreSQL 17+
- Knex.js for schema management and migrations
- 21 tables including: sites, reconversion_projects, domain_events, soils, etc.
- Table type definitions in `apps/api/src/shared-kernel/adapters/sql-knex/tableTypes.d.ts`

---

*Stack analysis: 2026-03-12*
