# Contribuer

Merci de contribuer à S-Aloha Mobile. Pour les changements importants, ouvrez d’abord une issue ou une discussion dans le dépôt.

## Environnement local

1. Installez une version de Node.js compatible avec Expo SDK 58 et npm.
2. Copiez `.env.example` vers `.env` et définissez `EXPO_PUBLIC_API_URL` pour votre instance S-Aloha.
3. Installez les dépendances avec `npm install`.
4. Lancez l’application avec `npm run start`.

## Avant de soumettre

Exécutez les vérifications disponibles :

```bash
npm run typecheck
npx expo install --check
```

Décrivez le comportement observé et attendu dans votre pull request. Pour les changements d’interface, ajoutez des captures d’écran iOS ou Android si possible. Ne joignez jamais de jetons, mots de passe, données personnelles ou fichiers `.env`.

## Conventions du projet

- Conservez les routes Expo Router dans `app/`.
- Réutilisez le client API de `src/api.ts` au lieu d’appeler `fetch` directement dans un écran.
- Accédez au jeton via les fonctions de `src/session.ts` ; ne le placez pas dans AsyncStorage ou dans les logs.
- Utilisez les couleurs, rayons et polices centralisés dans `src/theme.ts`.
- Gardez les messages destinés à l’utilisateur cohérents avec l’interface actuellement en français.
- Documentez les changements de flux réseau, de session ou de configuration dans `docs/ARCHITECTURE.md` et le README lorsque nécessaire.

## Licence

En contribuant, vous acceptez que vos contributions soient distribuées sous la licence AGPL-3.0-or-later du projet.
