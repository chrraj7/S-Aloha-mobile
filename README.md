# S-Aloha Mobile

<p align="center">
  <strong>Le service IT, partout.</strong><br />
  Application iOS et Android de <a href="https://github.com/chrraj7/S-Aloha">S-Aloha</a>, la plateforme ITIL 4 libre et on-prem pour les équipes IT.
</p>

<p align="center">
  <a href="https://github.com/chrraj7/S-Aloha">Projet parent</a> ·
  <a href="https://github.com/chrraj7/S-Aloha/blob/main/docs/reference/produit.md">Produit</a> ·
  <a href="https://github.com/chrraj7/S-Aloha/blob/main/docs/reference/architecture.md">Architecture</a> ·
  <a href="https://github.com/chrraj7/S-Aloha/blob/main/docs/reference/securite.md">Sécurité</a>
</p>

## Identité S-Aloha

Le mobile reprend le langage visuel du dépôt parent : fonds bleu nuit en couches, accents bleu action et turquoise lagon, texte à contraste élevé, cartes aux angles adoucis et emblème S hexagonal. L’emblème est le `BrandMark` du parent, adapté au rendu natif : un S d’un seul trait dans un hexagone, avec le losange « premier point » d’*Aloha*.

Les jetons natifs sont centralisés dans [`src/theme.ts`](src/theme.ts) et suivent ceux de [`frontend/src/styles.css`](https://github.com/chrraj7/S-Aloha/blob/main/frontend/src/styles.css) :

| Rôle | Jeton parent | Valeur |
|---|---|---|
| Fond principal | `--bg-app` | `#070d1a` |
| Surface | `--bg-surface` | `#0d1729` |
| Surface élevée | `--bg-surface-raised` | `#13213b` |
| Bleu de marque | `--brand-blue` | `#4aa8ff` |
| Turquoise lagon | `--brand-teal` | `#2fe0b5` |
| Texte principal | `--text-primary` | `#f2f4f8` |
| Texte secondaire | `--text-secondary` | `#aeb6c8` |
| Alerte rouge | `--accent-red` | `#ff6b5f` |
| Alerte ambre | `--accent-amber` | `#ffad4a` |

Le parent emploie Geologica pour les titres, IBM Plex Sans pour le texte et IBM Plex Mono pour les références. Les styles mobiles gardent cette hiérarchie. Les polices du parent sont actuellement fournies en WOFF2, format web ; les versions natives pourront être ajoutées avec leurs licences OFL lorsqu’elles seront disponibles dans un format pris en charge par iOS et Android.

## Démarrer

```bash
cp .env.example .env
# Définissez EXPO_PUBLIC_API_URL avec l’URL de votre instance S-Aloha.
npm install
npx expo install --check
npx expo start
```

Scannez le QR code avec Expo Go ou démarrez un simulateur avec `npm run ios` ou `npm run android`. Sur un téléphone physique, `localhost` désigne le téléphone : configurez une URL joignable depuis l’appareil. Les connexions de production doivent utiliser HTTPS.

## Fonctionnalités actuelles

- Authentification par compte Active Directory via `POST /api/auth/login` (`returnToken: true`).
- Stockage du JWT avec Expo SecureStore ; le jeton n’est jamais écrit dans AsyncStorage.
- Reprise de session via `GET /api/auth/me` et déconnexion par `POST /api/auth/logout`.
- Liste des incidents récents en lecture seule via `GET /api/incidents`.
- En-tête `Authorization: Bearer` et protection CSRF `X-S-Aloha: 1` sur les appels API.

Le backend parent reste la source de vérité pour les sessions, rôles, règles métier et périmètres. L’application mobile est un client, pas un remplacement de l’API.

## Développement

```bash
npm run typecheck
npx expo start
```

La première version est un socle mobile. Les modifications d’enregistrements, notifications push, accès hors ligne, captures et déploiement sur les stores restent à concevoir.

## Licence

AGPL-3.0-or-later, en cohérence avec [S-Aloha](https://github.com/chrraj7/S-Aloha). Consultez [`LICENSE`](LICENSE) pour le texte de la licence.
