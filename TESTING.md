There's no start:local script in package.json. The available options are:

- npm run start:dev - Webpack dev server with hot reload (development)
- npm run build + npm start - Build then serve production bundle on port 9000
- npm test - Run unit tests (single run)
- npm run test:watch - Run tests in watch mode

For local development with hot reload, use:
npm run start:dev

This starts the webpack-dev-server (typically on port 8080 or 9000 depending on config). Let me check the webpack dev config to confirm the port:

Searched for 1 pattern, read 1 file

The dev server runs on port 9000 with hot reload. Use:

npm run start:dev

This will:

- Start webpack-dev-server on http://localhost:9000
- Open browser automatically (open: true)
- Enable hot module replacement (hot: true)
- Serve from the app/ directory

For production-like local testing:
npm run build:prod && npm start
This builds the production bundle and serves it via http-server on port 9000.

For running tests:
npm test # single run
npm run test:watch # watch mode
