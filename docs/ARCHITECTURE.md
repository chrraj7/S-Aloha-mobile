# Mobile Architecture

## Overview

S-Aloha Mobile is an Expo/React Native application written in TypeScript. Expo Router uses the files in `app/` as routes; the entry point `app/index.tsx` opens the home screen when a session token is stored, and the login screen otherwise. The shared source is grouped under `src/`.

```text
                    stored token
app/index.tsx ────────────────────────────────────┐
      │ no token                                  ▼
      └────────> app/login.tsx ──signs in──> app/home.tsx
                       │                          │
                       └────────────┬─────────────┘
                                    ▼
                               src/api.ts ──token──> src/session.ts
                               ├── /api/auth/login   (Expo SecureStore)
                               ├── /api/auth/me
                               ├── /api/auth/logout
                               └── /api/incidents
                                    │
                                    ▼
                               S-Aloha API (parent server)
```

## Navigation and Screens

- `app/_layout.tsx` configures the global Stack navigator, the dark screen background, and the light status bar.
- `app/index.tsx` reads the stored token and redirects to `/home` or `/login`.
- `app/login.tsx` collects credentials, calls `api.login`, stores the token, then replaces the route with `/home`.
- `app/home.tsx` loads the profile and incidents, and allows logout. A missing or rejected token (HTTP 401) clears the local session and returns the user to login.

The screens are React Native components and use `SafeAreaView` to account for system areas. Expo Router provides declarative navigation.

## Network Access

`src/api.ts` reads `EXPO_PUBLIC_API_URL` and uses `http://localhost:8080`, the API port of the parent Docker Compose stack, as the default. The client adds the `/api` prefix, the `X-S-Aloha: 1` header, and the `Authorization: Bearer` header when a token is available. Login sends `returnToken: true`, so the API returns the session token in the response body in addition to its cookie.

The `api.me`, `api.incidents`, and `api.logout` functions retrieve the token from session storage before making requests. Failures raise an `ApiError` carrying the HTTP status (`0` when the server cannot be reached); screens branch on that status, never on the message text. Incidents are displayed in read-only mode in this version.

## Session and Security

`src/session.ts` wraps Expo SecureStore with read, write, and delete operations for a token. The application does not store the JWT in AsyncStorage. The parent server remains responsible for validating session status and permissions.

Use HTTPS for shared and production environments. `localhost` is only suitable for a server reachable from the development environment; a physical device must use a LAN address or a valid host name.

## Theme and Identity

- `src/theme.ts` contains the colors, radii, and typography references used by the screens.
- `src/brandMark.tsx` draws the vector emblem with `react-native-svg`.
- `assets/s-aloha-mark.svg` is the brand icon displayed in the README. It is not currently configured as a native Expo icon.

The theme references Geologica and IBM Plex, but native font files are not included; compatible system fallback fonts should be provided.

## Configuration and Running

Expo configuration is in `app.json`, scripts and dependencies are in `package.json` (locked by `package-lock.json`), and TypeScript paths are in `tsconfig.json`. Dependency versions follow the Expo SDK 58 template; `npm run doctor` reports any drift. See the README for the quick start and `.env.example` for the local environment variable.

```bash
cp .env.example .env
npm ci
npm run check
npm run start
```

The CI (`.github/workflows/ci.yml`) runs `npm ci` and `npm run check` on every push to `main` and every pull request, with the DCO, workflow (actionlint, zizmor) and dependency review checks; `.github/workflows/codeql.yml` runs CodeQL. These are the checks that `main` requires, as in the parent repository.

## Current Limitations

The application does not support incident editing, push notifications, offline operation, or automatic token renewal. A full automated test suite and store publication process are not yet included.

The web target only checks that the app bundles: Expo SecureStore has no web implementation, so sign-in is not available in a browser. Native app icons and splash screens are not configured yet.
