<p align="center">
  <img src="./assets/s-aloha-mark.svg" alt="S-Aloha Mobile" width="112" height="112" />
</p>

# S-Aloha Mobile

<p align="center"><strong>IT service, everywhere.</strong></p>

<p align="center">
  Mobile iOS and Android application for <a href="https://github.com/chrraj7/S-Aloha">S-Aloha</a>, the open, on-premises ITIL 4 platform for IT teams.
</p>

<p align="center">
  <a href="https://github.com/chrraj7/S-Aloha-mobile/blob/main/LICENSE"><img alt="License: AGPL-3.0-or-later" src="https://img.shields.io/badge/license-AGPL--3.0--or--later-blue.svg"></a>
  <img alt="Expo SDK 58" src="https://img.shields.io/badge/Expo-SDK%2058-4630EB.svg">
  <img alt="React Native 0.88" src="https://img.shields.io/badge/React%20Native-0.88-61DAFB.svg">
  <img alt="TypeScript 5.9" src="https://img.shields.io/badge/TypeScript-5.9-3178C6.svg">
</p>

<p align="center">
  <a href="https://github.com/chrraj7/S-Aloha">Parent project</a> ·
  <a href="https://github.com/chrraj7/S-Aloha/blob/main/docs/reference/product.md">Product</a> ·
  <a href="docs/ARCHITECTURE.md">Mobile architecture</a> ·
  <a href="docs/roadmap.md">Roadmap</a> ·
  <a href="https://github.com/chrraj7/S-Aloha/blob/main/docs/reference/security.md">Security</a>
</p>

## About

S-Aloha Mobile is an Expo client for reviewing incidents and accessing an S-Aloha account. The parent project API remains the authority for sessions, roles, business rules, and data.

## Features

- Sign in with an Active Directory account through `POST /api/auth/login`.
- Store the session token with Expo SecureStore.
- Restore and end sessions with `GET /api/auth/me` and `POST /api/auth/logout`.
- View recent incidents in read-only mode through `GET /api/incidents`.
- Send `Authorization: Bearer` and the application `X-S-Aloha: 1` headers with API calls.

## Quick Start

**Requirements:** Node.js and npm, an accessible S-Aloha instance, and Expo Go or an iOS/Android simulator.

```bash
git clone https://github.com/chrraj7/S-Aloha-mobile.git
cd S-Aloha-mobile
cp .env.example .env
npm install
npx expo install --check
npm run start
```

Set `EXPO_PUBLIC_API_URL` in `.env` to the URL of your S-Aloha instance (default: `http://localhost:5000`). On a physical device, use an IP address or host name reachable from the device.

To start an environment directly:

```bash
npm run ios
npm run android
npm run web
```

## Useful Scripts

| Command | Description |
|---|---|
| `npm run start` | Starts Expo and displays launch options. |
| `npm run ios` | Starts Expo with the iOS simulator. |
| `npm run android` | Starts Expo with the Android emulator. |
| `npm run web` | Starts Expo for the web. |
| `npm run typecheck` | Checks TypeScript types without generating files. |

## Organization

```text
app/                 Expo Router routes: login, home, and layout
src/                 API client, secure session, brand identity, and theme
assets/              Shared brand resources (SVG icon in README)
docs/                Architecture, contribution documentation, and roadmap
.env.example         Example local configuration
app.json             Expo configuration and native identifiers
```

See [Mobile Architecture](docs/ARCHITECTURE.md), [Contributing](docs/CONTRIBUTING.md), and the [Roadmap](docs/roadmap.md) for documentation. The roadmap tracks planned work and future priorities.

## Visual Identity

The application colors follow the S-Aloha palette and are defined in [`src/theme.ts`](src/theme.ts). The mobile emblem is drawn in SVG in [`src/BrandMark.tsx`](src/BrandMark.tsx).

## Project Status

This version is a mobile foundation. Editing incidents, push notifications, offline mode, automated tests, and store publication remain to be implemented.

## License

AGPL-3.0-or-later. See [`LICENSE`](LICENSE) and the [parent project](https://github.com/chrraj7/S-Aloha) license.
