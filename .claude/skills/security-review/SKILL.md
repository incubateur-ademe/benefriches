---
name: security-review
description: Comprehensive security audit for authentication, input validation, secrets, and API security. Use for pre-deployment audits or targeted security analysis.
---

# Security Review

Perform a comprehensive security audit of code changes or specified files.

## Instructions

### 1. Determine Scope

If `$ARGUMENTS` provided, review those specific files/directories.
Otherwise, review recent changes with `git diff` (or `git diff HEAD~1` if no uncommitted changes).

### 2. Load Security Rules

Read `.claude/context/security/security-rules.md` for the complete security checklist.

### 3. Run Automated Scans

```bash
# Dependency vulnerabilities
pnpm -r audit
```

Use Grep to search for secret patterns listed in security-rules.md section 1.

Search for vulnerability patterns:

| Pattern | What It Finds | Files to Check |
|---------|---------------|----------------|
| `.raw(` without `?` | SQL injection | `*.repository.ts`, `*Query.ts` |
| `whereRaw(` without bindings | SQL injection | Same |
| `dangerouslySetInnerHTML` | XSS | `*.tsx` |
| `eval(` | Code injection | `*.ts`, `*.js` |
| `child_process.exec` with variables | Command injection | `*.ts` |
| `console.log` with sensitive context | Data exposure | Auth-related files |
| Missing `@UseGuards` | Auth bypass | `*.controller.ts` |

### 4. Apply Security Rules

Apply all 11 rule sections from `security-rules.md` to the scoped code:

1. Secrets Management (CRITICAL)
2. Input Validation (CRITICAL)
3. SQL Injection Prevention (CRITICAL)
4. Authentication & Authorization (CRITICAL)
5. XSS Prevention (HIGH)
6. CSRF Protection (HIGH)
7. Rate Limiting (HIGH)
8. Sensitive Data Exposure (HIGH)
9. Dependency Security (HIGH)
10. API Security (HIGH)
11. Database Security (HIGH)

Then evaluate against the OWASP Top 10 checklist and Benefriches-specific checks.

### 5. Report Format

For each finding:

```
### [SEVERITY] Finding Title

**File:** path/to/file.ts:line
**Category:** OWASP A0X - Category Name
**Description:** What the vulnerability is
**Impact:** What could happen if exploited
**Remediation:** How to fix it

// Vulnerable code
<code snippet>

// Fixed code
<code snippet>
```

**Severity Levels:**
- **CRITICAL**: Exploitable vulnerabilities, data exposure, auth bypass
- **HIGH**: Security weaknesses requiring immediate attention
- **MEDIUM**: Defense-in-depth improvements
- **LOW**: Best practice recommendations

### 6. Summary

End with:

```markdown
## Security Review Summary

### Scan Results
- Dependency Audit: X vulnerabilities (X critical, X high, X moderate)
- Secret Scan: X potential secrets found
- Pattern Scan: X suspicious patterns

### Findings by Severity
- Critical: X
- High: X
- Medium: X
- Low: X

### Verdict

✅ **PASS** - No critical or high severity issues
⚠️ **REVIEW NEEDED** - Medium issues require attention before production
❌ **BLOCK** - Critical/high issues must be fixed before deployment
```

---

## Pre-Deployment Checklist

Before deploying to production, verify:

- [ ] `pnpm -r audit` shows no critical/high vulnerabilities
- [ ] No hardcoded secrets in codebase
- [ ] All API endpoints have appropriate authentication
- [ ] All user input is validated with Zod schemas
- [ ] Database queries use parameterized queries only
- [ ] Error messages don't expose internal details
- [ ] Security headers are configured
- [ ] Rate limiting is enabled
- [ ] Logging doesn't include sensitive data
- [ ] File uploads are validated and sanitized

---

## Scope

$ARGUMENTS

If no scope provided, review all uncommitted changes.
