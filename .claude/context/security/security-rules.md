# Security Rules - Benefriches

> Shared security rules referenced by both the `security-review` skill and `security-reviewer` agent.

---

## 1. Secrets Management (CRITICAL)

| Rule | Check |
|------|-------|
| No hardcoded API keys, passwords, tokens | Grep for secret patterns |
| Environment variables for all secrets | Check config files |
| `.gitignore` includes `.env*` (except `.env.example`) | Verify gitignore |
| No secrets in error messages or logs | Review error handling |

**Benefriches-specific:**
- Check `apps/api/.env` patterns
- Verify Scalingo environment variable usage

**Secret patterns to detect:**
- `api[_-]?key\s*[:=]\s*['"]` (API keys)
- `password\s*[:=]\s*['"][^'"]+['"]` (hardcoded passwords)
- `secret\s*[:=]\s*['"][^'"]+['"]` (secrets)
- `token\s*[:=]\s*['"][^'"]+['"]` (tokens)
- `AKIA[0-9A-Z]{16}` (AWS access keys)
- `postgres://.*:.*@` or `mysql://.*:.*@` (database URLs with credentials)
- `bearer\s+[a-zA-Z0-9_-]+` (bearer tokens)

Exclude from secret scan: `.env.example`, `*.spec.ts`, `*.test.ts`, documentation files.

---

## 2. Input Validation (CRITICAL)

| Rule | Check |
|------|-------|
| All user input validated with Zod schemas | Check DTOs in `/packages/shared/src/api-dtos/` |
| `ZodValidationPipe` in NestJS controllers | Check `@UsePipes()` or global pipe |
| Whitelist allowed values, don't blacklist | Review validation logic |

**Patterns to flag:**
```typescript
// ❌ No validation
@Post()
create(@Body() body: any) { ... }

// ✅ With validation
@Post()
@UsePipes(new ZodValidationPipe(createSiteDtoSchema))
create(@Body() body: CreateSiteDto) { ... }
```

---

## 3. SQL Injection Prevention (CRITICAL)

| Rule | Check |
|------|-------|
| No string concatenation in SQL | Grep for template literals in queries |
| Knex parameterized queries only | Check `.where()` usage |
| Review all `.raw()`, `.whereRaw()`, `.selectRaw()` | Verify bindings used |

**Patterns to flag:**
```typescript
// ❌ VULNERABLE
knex.raw(`SELECT * FROM sites WHERE id = '${userId}'`)
knex('sites').whereRaw(`name = '${userInput}'`)

// ✅ SAFE
knex('sites').where({ id: userId })
knex.raw('SELECT * FROM sites WHERE id = ?', [userId])
knex('sites').whereRaw('name = ?', [userInput])
```

---

## 4. Authentication & Authorization (CRITICAL)

| Rule | Check |
|------|-------|
| All non-public routes have `@UseGuards(JwtAuthGuard)` | Check controllers |
| User owns resource before access/modification | Check UseCases verify ownership |
| HttpOnly cookies for JWT tokens | Check cookie config |
| Generic error messages on auth failures | No user enumeration |
| Rate limit on auth endpoints | Check throttling |

**Benefriches-specific:**
- Auth is delegated (OpenID Connect via ProConnect + email magic links) - no passwords stored
- Verify `userId` from JWT scopes queries
- Check `createdBy` field validation in UseCases
- Check `SameSite` attribute on session cookies (currently missing)

**Patterns to flag:**
```typescript
// ❌ Missing auth guard
@Controller('sites')
export class SitesController {
  @Get(':id')
  getSite() { ... } // No @UseGuards!

// ❌ No ownership check
async execute({ siteId }: Request) {
  const site = await this.siteRepository.getById(siteId);
  return success(site); // Anyone can access any site!
}

// ✅ With ownership check
async execute({ siteId, userId }: Request) {
  const site = await this.siteRepository.getById(siteId);
  if (site.createdBy !== userId) return fail("Forbidden");
  return success(site);
}
```

---

## 5. Cross-Site Scripting (XSS) Prevention (HIGH)

| Rule | Check |
|------|-------|
| No `dangerouslySetInnerHTML` without sanitization | Grep React code |
| Sanitize user HTML with DOMPurify | Check rich text handling |
| Validate URLs (no `javascript:` protocol) | Check link rendering |
| Content-Security-Policy headers set | Check API response headers |

**Patterns to flag:**
```typescript
// ❌ VULNERABLE
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ SAFE
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

---

## 6. CSRF Protection (HIGH)

| Rule | Check |
|------|-------|
| `SameSite=Strict` or `SameSite=Lax` on cookies | Check cookie config |
| CSRF tokens for state-changing operations | Check form handling |
| Verify `Origin` header on sensitive endpoints | Check middleware |

---

## 7. Rate Limiting (HIGH)

| Rule | Check |
|------|-------|
| Rate limiting on all API endpoints | Check NestJS throttler |
| Stricter limits on: auth, email magic links | Check rate configs |
| Return `429 Too Many Requests` with `Retry-After` | Check error responses |

**Benefriches-specific:**
- Email auth link endpoint has app-level throttling but no HTTP middleware
- Check expensive operations (photovoltaic calculations via PVGIS API)

---

## 8. Sensitive Data Exposure (HIGH)

| Rule | Check |
|------|-------|
| Never log passwords, tokens, or PII | Check logging statements |
| Mask sensitive data in logs | Show only last 4 chars |
| Generic error messages to users | Detailed logs server-side only |
| No stack traces in production | Check error handling |
| Remove sensitive fields from API responses | Check ViewModels |

**Patterns to flag:**
```typescript
// ❌ Exposing sensitive data
console.log('User login:', { email, password });
return { user, passwordHash }; // Don't return hash!

// ✅ SAFE
console.log('User login:', { email });
return { user: { id, email, name } }; // Only safe fields
```

---

## 9. Dependency Security (HIGH)

| Rule | Check |
|------|-------|
| Run `pnpm audit` regularly | Execute and review |
| Keep `pnpm-lock.yaml` committed | Check git status |
| Review new dependencies before adding | Check recent package.json changes |
| Check for known vulnerabilities | Review audit output |

**Benefriches-specific:**
- Check all workspaces: `pnpm -r audit`

---

## 10. API Security (HIGH)

| Rule | Check |
|------|-------|
| Validate Content-Type header | Check request handling |
| Request size limits implemented | Check body parser config |
| HTTPS only (redirect HTTP) | Check deployment config |
| Security headers set | `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security` |
| No internal error details exposed | Check error responses |

---

## 11. Database Security (HIGH)

| Rule | Check |
|------|-------|
| Least-privilege database users | Check connection config |
| Row-level security where appropriate | Check multi-tenant queries |
| Transactions for multi-step operations | Check Repository implementations |
| Data validated before database operations | Check UseCase validation |

**Benefriches-specific:**
- Check Knex transaction usage for multi-table operations
- Verify Repository implementations use parameterized queries

---

## OWASP Top 10 Checklist

| ID | Category | What to Check |
|----|----------|---------------|
| A01 | Broken Access Control | Missing auth guards, IDOR vulnerabilities |
| A02 | Cryptographic Failures | Weak encryption, exposed secrets |
| A03 | Injection | SQL, command, XSS injection points |
| A04 | Insecure Design | Missing security controls by design |
| A05 | Security Misconfiguration | Default configs, verbose errors |
| A06 | Vulnerable Components | Outdated dependencies (`pnpm audit`) |
| A07 | Auth Failures | Weak auth, session issues |
| A08 | Data Integrity Failures | Missing validation, unsigned data |
| A09 | Logging Failures | Missing audit logs, sensitive data in logs |
| A10 | SSRF | Unvalidated URLs in server-side requests (PVGIS, ProConnect, ConnectCRM) |

---

## Benefriches-Specific Checks

### API (NestJS + Knex)

| Check | How to Verify |
|-------|---------------|
| JWT Guard on routes | Grep controllers for `@UseGuards(JwtAuthGuard)` |
| Zod validation | Check DTOs have schemas in `packages/shared/src/api-dtos/` |
| Parameterized queries | Review `*.repository.ts` for `.raw()` usage |
| Result pattern errors | Ensure no sensitive data in error types |
| Transaction usage | Multi-table ops use `sqlConnection.transaction()` |
| SameSite on session cookies | Check `httpServer.ts` session config |
| Helmet/security headers | Check middleware setup (currently missing) |

### External Services

| Service | Security Concern |
|---------|-----------------|
| PVGIS (`re.jrc.ec.europa.eu`) | User-provided lat/long coordinates passed as query params |
| ProConnect (OpenID) | OAuth tokens, provider domain from config |
| ConnectCRM | `client_id`/`client_secret` in headers, host from env var |

### Web (React + Redux)

| Check | How to Verify |
|-------|---------------|
| No `dangerouslySetInnerHTML` | Grep `.tsx` files |
| URL validation | Check link/redirect handling |
| Sensitive data in state | Review Redux state for tokens |
| HTTP service validation | Check Zod `safeParse()` in HTTP services |
