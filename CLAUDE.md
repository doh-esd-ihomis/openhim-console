# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenHIM Administration Console - An AngularJS 1.x web application for configuring and managing the OpenHIM-core component. It provides a UI for channels, clients, transactions, monitoring, users, mediators, certificates, and audit logs.

## Common Commands

| Task                          | Command              |
| ----------------------------- | -------------------- |
| Install dependencies          | `npm install`        |
| Start dev server (hot reload) | `npm run start:dev`  |
| Build for development         | `npm run build`      |
| Build for production          | `npm run build:prod` |
| Run tests (single run)        | `npm test`           |
| Run tests (watch mode)        | `npm run test:watch` |
| Lint code                     | `npm run lint`       |
| Auto-fix lint issues          | `npm run lint:fix`   |
| Clean dist folder             | `npm run clean`      |

## Architecture

### Tech Stack

- **Framework**: AngularJS 1.8.x
- **Build**: Webpack 5 (babel-loader, MiniCssExtractPlugin, HtmlWebpackPlugin)
- **Testing**: Karma + Mocha + Sinon-Chai (ChromeHeadless)
- **Linting**: StandardJS
- **CSS**: Bootstrap 3, Morris.js (charts), custom CSS
- **Auth**: Keycloak integration (optional SSO)

### Project Structure

```
app/
├── config/              # Configuration files (default.json, visualizer.json)
├── scripts/
│   ├── app.js           # Main bootstrap, routing, run blocks
│   ├── index.js         # Entry point (imports config)
│   ├── controllers/     # 30+ controllers (one per view/feature)
│   ├── services/        # Shared services (rest, login, notify, authinterceptor, etc.)
│   ├── directives/      # Custom directives
│   ├── utils/           # Utility functions
│   └── external/        # Third-party directive wrappers
├── views/               # HTML templates (loaded via require in routes)
├── styles/              # CSS/SCSS files
└── index.html           # Main HTML (handled by HtmlWebpackPlugin)
```

### Key Files

- **`app/scripts/app.js`**: Main app module, routing config (`$routeProvider`), manual bootstrap with config fetch
- **`app/scripts/index.js`**: Webpack entry point
- **`app/scripts/services/rest.js`**: Main API service for OpenHIM-core communication
- **`app/scripts/services/authinterceptor.js`**: HTTP interceptor for auth tokens
- **`app/scripts/services/login.js`**: Authentication service
- **`app/config/default.json`**: Default configuration (copied to dist/config/ on build)

### Routing

Routes defined in `app.js` map URLs to views/controllers:

- `/` → Dashboard
- `/channels` → Channels list
- `/channels/:channelId` → Channel monitoring
- `/clients` → Client management
- `/transactions` → Transaction list
- `/transactions/:transactionId` → Transaction details
- `/tasks` / `/tasks/:taskId` → Task management
- `/users` → User management
- `/mediators` / `/mediators/:urn` → Mediator management
- `/monitoring` → System monitoring
- `/visualizer` → Visualizer
- `/certificates` → Certificate management
- `/export-import` → Config import/export
- `/audits` / `/audits/:auditId` → Audit logs
- `/logs` → Log viewer
- `/login`, `/logout`, `/profile`, `/forgot-password`, `/set-password/:token`

### Configuration

Config loaded at runtime from `config/default.json` (served by nginx in production). Key settings:

- `protocol`, `host`, `port` - OpenHIM-core API connection
- `title`, `footerTitle`, `footerPoweredBy` - UI branding
- `mediatorLastHeartbeatWarningSeconds`, `mediatorLastHeartbeatDangerSeconds` - Mediator health thresholds
- `ssoEnabled`, `keyCloakUrl`, `keyCloakRealm`, `keyCloakClientId` - Keycloak SSO

### Testing

- Tests in `test/spec/controllers/` and `test/spec/services/`
- Run via Karma with `dist/bundle.js` (must build first)
- Uses Angular mocks, Mocha, Sinon-Chai
- CI runs on Node 16.x, 18.x, and latest

### Docker

- `Dockerfile` builds production bundle and serves via nginx
- Config mounted at `/usr/share/nginx/html/config/default.json`
- Port 9000 exposed

### CI/CD

- GitHub Actions: `.github/workflows/tests.yml` runs lint, build, tests on push/PR
- Docker image pushed to Harbor registry on master branch commits
