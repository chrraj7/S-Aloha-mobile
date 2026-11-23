# Contributing

Thank you for contributing to S-Aloha Mobile. For major changes, open an issue first. Changes to the API itself belong to the [parent project](https://github.com/chrraj7/S-Aloha).

## Local Environment

1. Install Node.js 22.13+ or 24.3+ (the CI uses 24) and npm.
2. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` for your S-Aloha instance.
3. Install the locked dependencies with `npm ci`.
4. Start the application with `npm run start`.

## Before Submitting

Run the same checks as the CI (type-check, Expo dependency check, web export):

```bash
npm run check
```

Add or upgrade Expo-managed packages with `npx expo install <package>` rather than `npm install`, so versions stay aligned with the SDK, and commit the updated `package-lock.json`.

Open a pull request from a branch; the CI must be green before it is merged. Describe the observed and expected behavior. For interface changes, add iOS or Android screenshots when possible. Never attach tokens or secrets; report vulnerabilities as described in the [security policy](SECURITY.md).

## Project Conventions

- Keep Expo Router routes in `app/`.
- Reuse the API client from `src/api.ts` instead of calling `fetch` directly from a screen.
- Access the token through `src/session.ts`; do not place it in AsyncStorage or logs.
- Branch on `ApiError.status`, never on error message text.
- Use the centralized colors, radii, and fonts from `src/theme.ts`; the interface has a single dark theme.
- Keep user-facing messages consistent with the English interface.
- Document network flow, session, or configuration changes in `docs/ARCHITECTURE.md` and the README when needed.

## License

By contributing, you agree that your contributions will be distributed under the AGPL-3.0-or-later license for this project.
