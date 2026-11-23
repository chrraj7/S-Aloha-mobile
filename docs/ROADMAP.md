# Roadmap — S-Aloha Mobile

> iOS and Android mobile application for [S-Aloha](https://github.com/chrraj7/S-Aloha), built with Expo, React Native, and TypeScript.  
> Current state: mobile foundation with Active Directory authentication, secure session storage, and read-only incident review.

## Current Status

The following features are already implemented:

- Active Directory sign-in through `POST /api/auth/login`.
- Session token storage with Expo SecureStore.
- Session restoration at launch, validated through `GET /api/auth/me`.
- Sign-out through `POST /api/auth/logout`.
- Read-only review of recent incidents through `GET /api/incidents`.
- `Authorization: Bearer` and `X-S-Aloha: 1` API headers.
- Expo Router navigation with login and home screens.
- iOS and Android identifiers configured in `app.json`.
- iOS and Android targets through Expo; the web export is a bundling check only (no SecureStore on web).
- CI pipeline for type checks, Expo dependency alignment, and the web export.

## 1. Core Features

### Complete Incident Management
- Create incidents.
- Edit fields allowed by the user's roles.
- Assign or reassign incidents.
- Take ownership of incidents.
- Transfer or escalate incidents.
- Add internal or public comments.
- Change status and close incidents.
- Add, view, and remove authorized attachments.
- Review the change history.

### Search and Filtering
- Search by reference, title, requester, or description.
- Filter by status, priority, category, assignee, team, or period.
- Sort by urgency, date, or due time.
- View recently opened incidents.
- Preserve active filters during navigation.

### Incident Details
- Display the complete description and metadata.
- Display history, comments, and work performed.
- Display people, teams, and assignments.
- Display deadlines, SLAs, and due times.
- Display related requests, problems, or changes.

### Quick Actions
- Take ownership of an incident.
- Quickly change status or priority.
- Transfer to a team or person.
- Escalate or request intervention.
- Reopen or close incidents when permissions allow.

### Dashboard
- Number of open, urgent, and overdue incidents.
- Incidents assigned to the current user.
- Incidents near an SLA breach.
- Volume trends and key indicators.
- Links to the corresponding filtered views.

### Other ITIL Objects
- Review and process service requests.
- Review problems and changes.
- Display relationships between incidents, problems, and changes.
- Respect S-Aloha server workflows and business rules.

## 2. Authentication and Account

- Password recovery, subject to Active Directory capabilities.
- Password change.
- Explicit handling of token expiration.
- Automatic sign-out when a session is no longer valid.
- Refresh or secure reauthentication if added to the backend.
- Biometric authentication using Face ID, Touch ID, or Android fingerprint.
- Reconfiguration and switching between S-Aloha servers.
- Account information and active roles.
- Active session management across devices.
- Hide sensitive information while the app is in the background or in screenshots.

## 3. Notifications

- Push notifications for new assignments.
- Notifications for comments and status changes.
- Alerts for critical incidents or approaching SLA deadlines.
- Preferences by priority, team, category, or event type.
- Local notifications when the server or push service is unavailable.
- Deep links to the related incident.
- Unread notification count.
- Bulk dismissal and cleanup of old notifications.
- Respect system permissions and user notification settings.

## 4. Offline Mode

- Cache recently viewed incidents.
- Keep viewed incident details available offline.
- Clearly identify stale or obsolete data.
- Queue actions performed offline.
- Synchronize automatically when connectivity returns.
- Resolve conflicts between local and server data.
- Support pagination and caching for large datasets.
- Degraded mode with connection diagnostics.
- Cancel or resume an ongoing synchronization.

## 5. Search and Navigation

- Global search across incidents, users, and teams.
- Screen for recently viewed items.
- Favorites or pinned incidents.
- Navigation tailored to frequently used screens.
- Navigate to users or teams from relevant screens.
- Persist settings across sessions.
- Provide direct links to filtered lists from the dashboard.

## 6. Mobile Quality

- Centralized network error handling.
- Handling for invalid or unauthorized API responses.
- Consistent loading states.
- Empty-list states with useful actions.
- Recoverable error states with retry actions.
- Client-side form validation.
- Clear messages for insufficient permissions.
- Pagination or incremental loading.
- Synchronization indicators and last-update timestamps.
- VoiceOver, TalkBack, and screen-reader support.
- Sufficient touch targets and accessible contrast.
- Improved tablet and wide-screen support.
- Light and dark themes.
- System theme support.
- Dynamic font sizes.
- Safe-area and orientation support.
- Handling of phone interruptions and background transitions.

## 7. Collaboration

- Add comments with mentions.
- Attach files from the gallery, filesystem, or camera.
- Preview supported file types.
- Secure attachment downloads.
- Visible change and comment history.
- Controlled incident sharing.
- Indicate users who viewed or modified a ticket.

## 8. Testing and Reliability

- Unit tests for the API client.
- Unit tests for session utilities.
- Unit tests for stores or services added to the application.
- React Native component tests.
- End-to-end tests on iOS.
- End-to-end tests on Android.
- Session restoration and expiration tests.
- Offline and synchronization tests.
- Authorization rule tests.
- Error and crash monitoring.
- Local logging with configurable detail levels.
- Diagnostic UI without sensitive data.
- Add the test suites to the CI pipeline.
- Expo EAS development and staging builds.

## 9. Administration and Operations

- Support for multiple S-Aloha instances.
- Secure storage of multiple server configurations.
- Connection tests and API diagnostics.
- Explicit support for local self-signed servers.
- Language settings.
- Time-zone settings.
- Privacy settings.
- App version and build information.
- App update handling.
- Log retention only as required for operations.

## 10. Store Publication

- Finalize app icons and launch screens.
- Verify iOS and Android screenshots.
- Produce store descriptions and user documentation.
- Configure publishing identifiers.
- Set up TestFlight distribution for iOS.
- Set up internal Android distribution.
- Review requested permissions.
- Prepare privacy disclosures.
- Configure OTA updates if applicable.
- Establish versioning, publishing, and rollback processes.

## 11. Security

- Audit SecureStore storage and cached data.
- Prevent accidental data exports.
- Verify certificates and safely handle connections.
- Protect deep links.
- Limit sensitive content in notifications.
- Validate server responses.
- Avoid secrets in `EXPO_PUBLIC_*` variables.
- Rotate and revoke tokens according to backend capabilities.
- Audit dependencies regularly.

## Recommended Priorities

| Priority | Features | Rationale |
|---|---|---|
| P0 | Complete incident management | Provides the actions required for daily use. |
| P0 | Robust authentication and session handling | Ensures secure, reliable access. |
| P0 | Search, filters, and incident details | Enables efficient incident review. |
| P1 | Push notifications and deep links | Keeps teams informed about critical changes. |
| P1 | Mobile quality, error states, and accessibility | Reduces errors and improves adoption. |
| P1 | Offline mode | Enables use on unstable networks. |
| P1 | Automated tests | Protects API and UI changes. |
| P2 | Advanced collaboration | Adds comments, mentions, and attachments. |
| P2 | Dashboard and SLA indicators | Provides an operational overview. |
| P2 | Publishing, monitoring, and diagnostics | Prepares the application for reliable operation. |

## Proposed Milestones

### Mobile MVP
- Sign-in, session restoration, and sign-out.
- Incident list, search, and details.
- Status changes, assignment, and authorized comments.
- Network error handling.
- Critical tests on iOS and Android.

### Collaborative Release
- Push notifications.
- Attachments and mentions.
- Favorites, persistent filters, and quick actions.
- Lightweight offline support with caching.

### Operational Release
- SLA dashboard.
- Offline synchronization with queued actions.
- Crash monitoring.
- Automated builds.
- Store publication preparation.

## Exit Criteria

Before a public release, the application should:

- support primary actions allowed by user roles;
- restore or terminate a session reliably;
- display network errors without misleading data;
- support essential notifications;
- be tested on iOS and Android;
- meet access, security, and privacy requirements;
- have a reproducible build and publishing process;
- document known risks and operational limitations.
