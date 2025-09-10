# Tests du Chat Application

Cette suite de tests couvre trois niveaux de test pour l'application de chat :

## Structure des Tests

### 1. Tests Unitaires (`tests/routes.test.js`, `tests/api.test.js`)

- **But** : Tester des fonctions ou modules isolés
- **Outil** : Jest
- **Exemples** :
  - Validation des paramètres de limite de messages
  - Formatage des messages
  - Validation des pseudos et messages
  - Fonctions utilitaires

### 2. Tests d'Intégration (`tests/socket.test.js`)

- **But** : Tester l'interaction entre plusieurs composants
- **Outil** : Jest + Socket.IO Client
- **Exemples** :
  - Connexion Socket.IO
  - Envoi/réception de messages via Socket.IO
  - Sauvegarde en base et diffusion
  - Gestion des événements système

### 3. Tests End-to-End (`tests/chat.e2e.test.js`)

- **But** : Simuler le comportement d'un utilisateur réel
- **Outil** : Playwright
- **Exemples** :
  - Session complète (ouverture, saisie pseudo, envoi messages)
  - Simulation de plusieurs utilisateurs
  - Tests d'interface utilisateur

## Commandes de Test

```bash
# Tous les tests
npm test

# Tests unitaires uniquement
npm run test:unit

# Tests d'intégration uniquement
npm run test:integration

# Tests E2E uniquement
npm run test:e2e

# Tous les types de tests
npm run test:all

# Tests en mode watch
npm run test:watch

# Couverture de code
npm run test:coverage

# Installer Playwright (première fois)
npm run playwright:install

# Voir le rapport Playwright
npm run playwright:report
```

## Configuration

- **Jest** : Configuration dans `jest.config.cjs`
- **Playwright** : Configuration dans `playwright.config.js`
- **Setup** : Fichier de configuration dans `tests/setup.js`

## Notes Importantes

1. Les tests d'intégration Socket.IO nécessitent un serveur de test
2. Les tests E2E nécessitent que l'application soit démarrée
3. Les mocks Prisma sont utilisés pour éviter les dépendances à la base de données
4. Les tests suivent la préférence de l'utilisateur pour des tests simples avec des vérifications minimales
