<p align="center">
  <img src="./assets/s-aloha-mark.svg" alt="S-Aloha Mobile" width="112" height="112" />
</p>

<h1 align="center">S-Aloha Mobile</h1>

<p align="center"><strong>Le service IT, partout.</strong></p>

<p align="center">
  Application mobile iOS et Android de <a href="https://github.com/chrraj7/S-Aloha">S-Aloha</a>, la plateforme ITIL 4 libre et on-prem pour les équipes IT.
</p>

<p align="center">
  <a href="https://github.com/chrraj7/S-Aloha-mobiles/blob/main/LICENSE"><img alt="License: AGPL-3.0-or-later" src="https://img.shields.io/badge/license-AGPL--3.0--or--later-blue.svg"></a>
  <img alt="Expo SDK 58" src="https://img.shields.io/badge/Expo-SDK%2058-4630EB.svg">
  <img alt="React Native 0.88" src="https://img.shields.io/badge/React%20Native-0.88-61DAFB.svg">
  <img alt="TypeScript 5.9" src="https://img.shields.io/badge/TypeScript-5.9-3178C6.svg">
</p>

<p align="center">
  <a href="https://github.com/chrraj7/S-Aloha">Projet parent</a> ·
  <a href="https://github.com/chrraj7/S-Aloha/blob/main/docs/reference/produit.md">Produit</a> ·
  <a href="docs/ARCHITECTURE.md">Architecture mobile</a> ·
  <a href="https://github.com/chrraj7/S-Aloha/blob/main/docs/reference/securite.md">Sécurité</a>
</p>

## À propos

S-Aloha Mobile est un client Expo pour consulter les incidents et accéder à son compte S-Aloha. L’API du projet parent reste l’autorité pour les sessions, rôles, règles métier et données. L’application ne propose actuellement pas de modification des enregistrements.

## Fonctionnalités

- Connexion avec un compte Active Directory via `POST /api/auth/login`.
- Stockage du jeton de session avec Expo SecureStore.
- Restauration et fermeture de session avec `GET /api/auth/me` et `POST /api/auth/logout`.
- Consultation en lecture seule des incidents récents via `GET /api/incidents`.
- En-tête `Authorization: Bearer` et en-tête applicatif `X-S-Aloha: 1` sur les appels API.

## Démarrage rapide

**Prérequis :** Node.js et npm, une instance S-Aloha accessible, et Expo Go ou un simulateur iOS/Android.

```bash
git clone https://github.com/chrraj7/S-Aloha-mobiles.git
cd S-Aloha-mobiles
cp .env.example .env
npm install
npx expo install --check
npm run start
```

Configurez `EXPO_PUBLIC_API_URL` dans `.env` avec l’URL de votre instance S-Aloha (par défaut : `http://localhost:5000`). Pour un appareil physique, utilisez une adresse IP ou un nom d’hôte joignable depuis le téléphone : `localhost` désigne le téléphone lui-même.

Pour lancer directement un environnement :

```bash
npm run ios
npm run android
npm run web
```

## Scripts utiles

| Commande | Description |
|---|---|
| `npm run start` | Démarre Expo et affiche les options de lancement. |
| `npm run ios` | Démarre Expo avec le simulateur iOS. |
| `npm run android` | Démarre Expo avec l’émulateur Android. |
| `npm run web` | Démarre l’application web. |
| `npm run typecheck` | Vérifie les types TypeScript sans générer de fichiers. |

## Organisation

```text
app/                 Routes Expo Router : connexion, accueil et layout
src/                 Client API, session sécurisée, identité de marque et thème
assets/              Ressources de marque partagées (icône SVG du README)
docs/                Architecture et documentation de contribution
.env.example         Exemple de configuration locale
app.json             Configuration Expo et identifiants natifs
```

Voir [Architecture mobile](docs/ARCHITECTURE.md) pour les flux de navigation, d’authentification et d’accès à l’API, ainsi que [Contribuer](CONTRIBUTING.md) pour les contrôles avant soumission.

## Identité visuelle

Les couleurs de l’application reprennent la palette S-Aloha et sont définies dans [`src/theme.ts`](src/theme.ts). L’emblème mobile est dessiné en SVG dans [`src/BrandMark.tsx`](src/BrandMark.tsx). Les polices natives Geologica et IBM Plex ne sont pas incluses à ce jour : les systèmes mobiles utilisent leurs polices de remplacement.

## État du projet

Cette version est un socle mobile. La modification des incidents, les notifications push, le mode hors ligne, les tests automatisés et la publication sur les stores restent à concevoir.

## Licence

AGPL-3.0-or-later. Consultez [`LICENSE`](LICENSE) et la licence du [projet parent](https://github.com/chrraj7/S-Aloha).
