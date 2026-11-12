# Security Policy

## Known Vulnerabilities

### Bootstrap 3.4.1 (CVE-2019-8331, CVE-2018-14040, CVE-2018-14041, CVE-2018-14042)

**Status:** Accepted Risk / Documented Exception

**Reason:** The OpenHIM Console is built on **AngularJS 1.8.x** (end-of-life) and depends on `angular-ui-bootstrap` which **only supports Bootstrap 3.x**.

Upgrading to Bootstrap 5 would break the entire UI:
- 30+ view templates use Bootstrap 3 classes: `panel-*`, `glyphicon-*`, `well`, `col-md-*`, `navbar-*`, `btn-group-*`, `input-group-*`, etc.
- `angular-ui-bootstrap` directives have no Bootstrap 5 equivalent for AngularJS 1.x
- Migration would require rewriting all templates and replacing directive library

**Risk Assessment:**
- This is an **internal administration console**, not a public-facing application
- Access requires authentication (Keycloak/local auth)
- Vulnerabilities are primarily XSS in tooltip/popover data attributes (mitigated by trusted internal content)

**Mitigations:**
- All other dependencies updated to latest secure versions
- Content Security Policy recommended in production nginx config
- Input sanitization via AngularJS `$sce` and server-side validation

**Long-term Roadmap:**
1. Migrate from AngularJS 1.x to a supported framework (Angular 17+, React, Vue)
2. Or replace `angular-ui-bootstrap` with custom directives supporting Bootstrap 5
3. Or use a maintained fork like `ng-bootstrap` (requires Angular 2+)

## Reporting Security Issues

Please report security vulnerabilities to the project maintainers via GitHub Issues or the contact information in package.json.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.19.x  | ✅ Current |
| < 1.19  | ❌ EOL |