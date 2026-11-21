# Contributing

Thank you for contributing to S-Aloha Mobile. For major changes, open an issue or discussion in the repository first.

## Local Environment

1. Install a Node.js version compatible with Expo SDK 58 and npm.
2. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` for your S-Aloha instance.
3. Install dependencies with `npm install`.
4. Start the application with `npm run start`.

## Before Submitting

Run the available checks:

```bash
npm run typecheck
npx expo install --check
```

Describe the observed and expected behavior in your pull request. For interface changes, add iOS or Android screenshots when possible. Never attach tokens or secrets.

## Project Conventions

- Keep Expo Router routes in `app/`.
- Reuse the API client from `src/api.ts` instead of calling `fetch` directly from a screen.
- Access the token through `src/session.ts`; do not place it in AsyncStorage or logs.
- Use the centralized colors, radii, and fonts from `src/theme.ts`.
- Keep user-facing messages consistent with the English interface.
- Document network flow, session, or configuration changes in `docs/ARCHITECTURE.md` and the README when needed.

## License

By contributing, you agree that your contributions will be distributed under the AGPL-3.0-or-later license for this project.
