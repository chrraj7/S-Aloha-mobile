<p align="center">
  <img src="./assets/s-aloha-mark.svg" alt="S-Aloha Mobile" width="112" height="112" />
</p>

# S-Aloha Mobile

<p align="center"><strong>IT service, everywhere.</strong></p>

<p align="center">
  Mobile iOS and Android application for <a href="https://github.com/chrraj7/S-Aloha">S-Aloha</a>, the open, on-premises ITIL 4 platform for IT teams.
</p>

<p align="center">
  <a href="https://github.com/chrraj7/S-Aloha-mobile/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/chrraj7/S-Aloha-mobile/actions/workflows/ci.yml/badge.svg"></a>
  <a href="LICENSE"><img alt="License: AGPL-3.0-or-later" src="https://img.shields.io/badge/license-AGPL--3.0--or--later-blue.svg"></a>
  <img alt="Expo SDK 58" src="https://img.shields.io/badge/Expo-SDK%2058-4630EB.svg">
  <img alt="React Native 0.88" src="https://img.shields.io/badge/React%20Native-0.88-61DAFB.svg">
  <img alt="TypeScript 6.0" src="https://img.shields.io/badge/TypeScript-6.0-3178C6.svg">
</p>

<p align="center">
  <a href="https://github.com/chrraj7/S-Aloha">Parent project</a> ·
  <a href="https://github.com/chrraj7/S-Aloha/blob/main/docs/reference/produit.md">Product (FR)</a> ·
  <a href="docs/ARCHITECTURE.md">Mobile architecture</a> ·
  <a href="docs/ROADMAP.md">Roadmap</a> ·
  <a href="docs/SECURITY.md">Security</a>
</p>

## About

S-Aloha Mobile is an Expo client for reviewing incidents from an S-Aloha account. The parent project API remains the authority for sessions, roles, business rules, and data.

## Features

- Sign in with an Active Directory account through `POST /api/auth/login`.
- Store the session token with Expo SecureStore.
- Restore the session at launch (`GET /api/auth/me`) and sign out (`POST /api/auth/logout`).
- View recent incidents in read-only mode through `GET /api/incidents`.
- Send the `Authorization: Bearer` and `X-S-Aloha: 1` headers with API calls.

## Quick Start

**Requirements:** Node.js 22.13+ or 24.3+ (CI uses 24), npm, an accessible S-Aloha instance, and Expo Go or an iOS/Android simulator.

```bash
git clone https://github.com/chrraj7/S-Aloha-mobile.git
cd S-Aloha-mobile
cp .env.example .env
npm ci
npm run start
```

Set `EXPO_PUBLIC_API_URL` in `.env` to the URL of your S-Aloha API. The default, `http://localhost:8080`, is the API port of the parent project's Docker Compose stack. On a physical device, use an IP address or host name reachable from the device, and HTTPS outside a development network.

To start a platform directly:

```bash
npm run ios
npm run android
```

The web target (`npm run web`, `npm run build`) only proves that the app bundles: Expo SecureStore has no web implementation, so sign-in works on iOS and Android only.

## Scripts

| Command | Description |
|---|---|
| `npm run start` | Starts Expo and displays launch options. |
| `npm run ios` | Starts Expo with the iOS simulator. |
| `npm run android` | Starts Expo with the Android emulator. |
| `npm run web` | Starts Expo for the web (bundling check, no sign-in). |
| `npm run typecheck` | Checks TypeScript types without generating files. |
| `npm run doctor` | Checks that dependencies match the Expo SDK (`expo install --check`). |
| `npm run build` | Exports the web bundle to `dist/`. |
| `npm run check` | Runs `typecheck`, `doctor`, and `build`, as the CI does. |

## Organization

```text
app/                 Expo Router routes: entry, login, home, and layout
src/                 API client, secure session, brand mark, and theme
assets/              Brand resources (SVG emblem shown in this README)
docs/                Architecture, contribution guide, security policy, and roadmap
.github/workflows/   CI: type-check, dependency check, and web export
.env.example         Example local configuration
app.json             Expo configuration and native identifiers
```

## Visual Identity

The application has a single dark theme. Its colors follow the S-Aloha palette and are defined in [`src/theme.ts`](src/theme.ts). The mobile emblem is drawn in SVG in [`src/brandMark.tsx`](src/brandMark.tsx).

## Project Status

This version is a mobile foundation. Editing incidents, push notifications, offline mode, automated tests, and store publication remain to be implemented; see the [roadmap](docs/ROADMAP.md).

## Contributing and Security

Read the [contribution guide](docs/CONTRIBUTING.md). Report vulnerabilities privately as described in the [security policy](docs/SECURITY.md), never in a public issue.

## License

AGPL-3.0-or-later, like the [parent project](https://github.com/chrraj7/S-Aloha). See [`LICENSE`](LICENSE).
