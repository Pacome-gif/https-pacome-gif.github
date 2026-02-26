# 📋 TaskFlow - Structure du Projet

## 📁 Organisation des Dossiers

```
src/
├── app/
│   ├── components/              # Composants réutilisables
│   │   └── Navbar.tsx
│   ├── utils/                   # Utilitaires et constantes
│   │   ├── constants.ts         # Constantes de l'app
│   │   ├── types.ts             # Types et interfaces TypeScript
│   │   └── helpers.ts           # Fonctions utilitaires
│   ├── (auth)/                  # Groupe de routes d'authentification
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── accueil/                # Page d'accueil (anciennement dashboard)
│   │   └── page.tsx
│   ├── layout.tsx               # Layout racine
│   ├── page.tsx                 # Page d'accueil
│   └── globals.css              # Styles globaux

public/                           # Fichiers statiques (images, etc.)
```

## 🎯 Convention de Nommage

- **Dossiers**: kebab-case (`auth-page`, `user-profile`)
- **Fichiers composants**: PascalCase (`Navbar.tsx`, `Card.tsx`)
- **Fichiers utilitaires**: camelCase (`constants.ts`, `helpers.ts`)
- **Variables/Fonctions**: camelCase (`getUserData()`, `isLoggedIn`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)

## 📦 Dépendances Principales

- **Next.js 16.1.6**: Framework React avec SSR/SSG
- **React 19.2.3**: Bibliothèque UI
- **TypeScript**: Typage statique
- **Tailwind CSS 4**: Styling utilitaire
- **react-icons**: Bibliothèque d'icônes

## 🚀 Routes de l'Application

| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/accueil`  | Page d'accueil (anciennement dashboard) |
| `/login` | Connexion utilisateur |
| `/register` | Inscription utilisateur |

## 💻 Démarrage du Projet

```bash
npm install      # Installer les dépendances
npm run dev      # Démarrer le serveur de développement (port 3000)
npm run build    # Construire pour la production
npm start        # Démarrer le serveur de production
npm run lint     # Vérifier le code
```

## 🎨 Palette de Couleurs

- **Primaire**: Bleu (#3b82f6)
- **Secondaire**: Vert (#10b981)
- **Accent**: Cyan (#0ea5e9)

## 📝 Notes

- Tous les fichiers utilisent TypeScript
- ESLint configuré pour maintenir la qualité du code
- Next.js App Router pour le routage
- Groupes de routes `(auth)` pour l'organisation

---

**Dernière mise à jour**: 20 février 2026
