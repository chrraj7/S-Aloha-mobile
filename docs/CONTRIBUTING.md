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

Run locally, `npm run check` also reports newer Expo patch versions, which the CI ignores (it runs `doctor` offline, `EXPO_OFFLINE=1`). Updating them belongs in a pull request of its own, usually after a red run of the weekly **Expo updates** workflow.

Open a pull request from a branch: `main` is protected and only accepts pull requests whose required checks are green (type-check and build, DCO, workflows, dependency review, hygiene, CodeQL without high alerts), merged with a linear history. Describe the observed and expected behavior. For interface changes, add iOS or Android screenshots when possible. Never attach tokens or secrets; report vulnerabilities as described in the [security policy](SECURITY.md).

## Developer Certificate of Origin (DCO)

Every commit carries the line `Signed-off-by: Your Name <address>`, added by `git commit -s`, at the address of the commit author. With this sign-off, you certify that you have the right to submit your contribution under the project license, according to the [Developer Certificate of Origin 1.1](https://developercertificate.org/). You keep your rights; no copyright assignment is requested. The parent project follows the same rule.

Forgot it on the last commit: `git commit --amend -s --no-edit`, then `git push --force-with-lease` on your branch. To sign every commit of the branch afterwards: `git rebase --signoff main`. The **DCO** job of the CI blocks the merge of an unsigned commit. `Signed-off-by` is the only trailer allowed: the **Hygiene** job refuses any other (co-author, session link...).

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
