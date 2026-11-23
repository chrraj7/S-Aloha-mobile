# Security Policy

## Reporting a Vulnerability

**Do not open a public issue.** Use GitHub private reporting: **Security** tab → **Report a vulnerability** ([direct link](https://github.com/chrraj7/S-Aloha-mobile/security/advisories/new)).

Include the affected commit, the platform (iOS or Android, OS version), the steps to reproduce, and the estimated impact. You will receive an acknowledgment within 7 days.

A vulnerability in the S-Aloha API or server rather than in the mobile client belongs to the [parent project's security policy](https://github.com/chrraj7/S-Aloha/security/policy).

## Supported Versions

Only the `main` branch receives security fixes.

## Scope Reminders

- The session token is stored with Expo SecureStore only, never in AsyncStorage or logs.
- `EXPO_PUBLIC_*` variables are embedded in the app bundle: never put a secret in them.
- Use HTTPS to reach any shared or production S-Aloha instance.
