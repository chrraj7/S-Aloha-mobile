# Mobile Architecture

## Overview

S-Aloha Mobile is an Expo/React Native application written in TypeScript. Expo Router uses the files in `app/` as routes; the entry point `app/index.tsx` redirects to login. The shared source is grouped under `src/`.

```text
app/index.tsx ──redirect──> app/login.tsx ──authenticates──> app/home.tsx
                                  │                             │
                                  └──────────┬──────────────────┘
                                             ▼
                                      src/api.ts
                                      ├── /api/auth/login
                                      ├── /api/auth/me
                                      ├── /api/auth/logout
                                      └── /api/incidents
                                             │
                         ┌────────────────────┴────────────────────┐
                         ▼                                         ▼
                  S-Aloha API                            src/session.ts
                  (parent server)                         Expo SecureStore
```

## Navigation and Screens

- `app/_layout.tsx` configures the global Stack navigator and status bar.
- `app/index.tsx` redirects the root route to `/login`.
- `app/login.tsx` collects credentials, calls `api.login`, stores the token, then replaces the route with `/home`.
- `app/home.tsx` checks for a session, loads the profile and incidents, and allows logout. A missing or expired session returns the user to login.

The screens are React Native components and use `SafeAreaView` to account for system areas. Expo Router provides declarative navigation.

## Network Access

`src/api.ts` reads `EXPO_PUBLIC_API_URL` and uses `http://localhost:5000` as the default. The client adds the `/api` prefix, the `X-S-Aloha: 1` header, and the `Authorization: Bearer` header when a token is available.

The `api.me`, `api.incidents`, and `api.logout` functions retrieve the token from session storage before making requests. Incidents are displayed in read-only mode in this version.

## Session and Security

`src/session.ts` wraps Expo SecureStore with read, write, and delete operations for a token. The application does not store the JWT in AsyncStorage. The parent server remains responsible for validating session status and permissions.

Use HTTPS for shared and production environments. `localhost` is only suitable for a server reachable from the development environment; a physical device must use a LAN address or a valid host name.

## Theme and Identity

- `src/theme.ts` contains the colors, radii, and typography references used by the screens.
- `src/BrandMark.tsx` draws the vector emblem with `react-native-svg`.
- `assets/s-aloha-mark.svg` is the brand icon displayed in the README. It is not currently configured as a native Expo icon.

The theme references Geologica and IBM Plex, but native font files are not included; compatible system fallback fonts should be provided.

## Configuration and Running

Expo configuration is in `app.json`, scripts and dependencies are in `package.json`, and TypeScript paths are in `tsconfig.json`. See the README for the quick start and `.env.example` for the local environment variable.

```bash
cp .env.example .env
npm install
npx expo install --check
npm run typecheck
npm run start
```

## Current Limitations

The application does not support incident editing, push notifications, offline operation, or automatic token renewal. A full automated test suite and store publication process are not yet included.
