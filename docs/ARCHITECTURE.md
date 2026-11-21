# Architecture mobile

## Vue d’ensemble

S-Aloha Mobile est une application Expo/React Native en TypeScript. Expo Router utilise les fichiers de `app/` comme routes ; le point d’entrée `app/index.tsx` redirige vers la connexion. Les écrans appellent un client HTTP partagé, tandis que le backend S-Aloha conserve la responsabilité des règles métier et des données.

```text
app/index.tsx ──redirect──> app/login.tsx ──authentifie──> app/home.tsx
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
                 API S-Aloha                          src/session.ts
                 (serveur parent)                     Expo SecureStore
```

## Navigation et écrans

- `app/_layout.tsx` configure le navigateur Stack global et la barre d’état.
- `app/index.tsx` redirige la route racine vers `/login`.
- `app/login.tsx` recueille les identifiants, appelle `api.login`, stocke le jeton puis remplace la route par `/home`.
- `app/home.tsx` vérifie la présence d’une session, charge le profil et les incidents, et permet la déconnexion. Une session absente ou expirée renvoie l’utilisateur à la connexion.

Les écrans sont des composants React Native et utilisent `SafeAreaView` pour tenir compte des zones système. Expo Router fournit la navigation déclarative.

## Accès réseau

`src/api.ts` lit `EXPO_PUBLIC_API_URL` et utilise `http://localhost:5000` comme valeur par défaut. Le client ajoute le préfixe `/api`, l’en-tête `X-S-Aloha: 1`, et l’en-tête `Authorization: Bearer` pour les requêtes nécessitant une session. Les erreurs réseau et réponses HTTP non réussies sont converties en messages d’erreur destinés à l’interface.

Les fonctions `api.me`, `api.incidents` et `api.logout` récupèrent le jeton dans le stockage de session avant d’effectuer les requêtes. Les incidents affichés dans cette version sont en lecture seule et limités aux vingt premiers éléments côté application.

## Session et sécurité

`src/session.ts` encapsule Expo SecureStore avec les opérations de lecture, d’écriture et de suppression d’un jeton. L’application ne stocke pas le JWT dans AsyncStorage. Le serveur parent reste responsable de valider le jeton et d’appliquer les autorisations. N’inscrivez jamais de secret dans `EXPO_PUBLIC_*` : les variables Expo publiques sont intégrées au client.

Utilisez HTTPS pour les environnements partagés et de production. `localhost` ne convient qu’à un serveur accessible depuis l’environnement de développement ; un appareil physique doit utiliser une adresse joignable sur le réseau.

## Thème et identité

- `src/theme.ts` contient les couleurs, rayons et références typographiques utilisés par les écrans.
- `src/BrandMark.tsx` dessine l’emblème vectoriel avec `react-native-svg`.
- `assets/s-aloha-mark.svg` est l’icône de marque affichée dans le README. Le fichier SVG n’est pas actuellement configuré comme icône native Expo.

Le thème référence Geologica et IBM Plex, mais les fichiers de polices natifs ne sont pas livrés ; prévoir des polices de remplacement compatibles avec le système.

## Configuration et exécution

La configuration Expo est dans `app.json`, les scripts et dépendances dans `package.json`, et les chemins TypeScript dans `tsconfig.json`. Consultez le README pour le démarrage rapide et `.env.example` pour le nom de la variable d’URL API.

```bash
cp .env.example .env
npm install
npx expo install --check
npm run typecheck
npm run start
```

## Limites actuelles

L’application ne prend pas en charge les modifications d’incidents, les notifications push, le fonctionnement hors ligne ni le renouvellement autonome des jetons. Il n’y a pas encore de suite de tests automatisés ou de pipeline de publication configuré dans le dépôt.
