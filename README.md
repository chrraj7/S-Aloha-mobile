# S-Aloha Mobile

Application mobile iOS et Android de [S-Aloha](https://github.com/chrraj7/S-Aloha), construite avec Expo, React Native, TypeScript et Expo Router.

## Démarrer

```bash
cp .env.example .env
# Modifiez EXPO_PUBLIC_API_URL pour désigner l’URL de votre instance S-Aloha.
npm install
npx expo install --check
npx expo start
```

Scannez le QR code avec Expo Go ou lancez `npm run ios` / `npm run android` après avoir installé le client de développement requis. Pour un téléphone physique, `localhost` désigne le téléphone : configurez une URL HTTPS joignable depuis l’appareil. Android et iOS peuvent également imposer HTTPS selon la configuration et le réseau.

## Première version

- Connexion Active Directory via `POST /api/auth/login` avec `returnToken: true`.
- Stockage du jeton JWT dans le stockage sécurisé natif (Expo SecureStore), jamais dans AsyncStorage.
- Reprise de session avec `GET /api/auth/me` et déconnexion via `POST /api/auth/logout`.
- Liste mobile en lecture seule des incidents récents (`GET /api/incidents`).

Le client porte le jeton avec `Authorization: Bearer` et l’en-tête CSRF `X-S-Aloha: 1` sur les appels API. Le backend S-Aloha reste la source de vérité pour l’authentification, les rôles et les périmètres.

## Développement

```bash
npm run typecheck
npx expo start
```

L’API doit être accessible depuis l’appareil ou le simulateur. La connexion à une instance de production doit utiliser HTTPS.

## Licence

AGPL-3.0-or-later, en cohérence avec le projet principal.
