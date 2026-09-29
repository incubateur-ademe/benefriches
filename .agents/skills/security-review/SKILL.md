---
name: security-review
description: Comprehensive security audit for authentication, input validation, secrets, and API security. Use for pre-deployment audits or targeted security analysis.
effort: high
allowed-tools: Bash, Read, Grep, Glob
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

With Grep, run the secret patterns of `security-rules.md` section 1 (with its exclusions) and every row of its "Pattern scan" table over the scope.

### 4. Apply Security Rules

Check the scoped code against each section of `security-rules.md`: Benefriches' known weak spots and where each control lives. Then apply general OWASP Top 10 knowledge to anything it doesn't cover.

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
- [ ] New third-party origins are allowed in the web CSP (security-rules.md section 8)
- [ ] Rate limiting is enabled
- [ ] Logging doesn't include sensitive data

---

## Scope

$ARGUMENTS

If no scope provided, review all uncommitted changes.
