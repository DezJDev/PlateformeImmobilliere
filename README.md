# 🏠 ImmoNext - Plateforme d'Annonces Immobilières

ImmoNext est une application web full-stack moderne conçue pour la gestion et la consultation d'annonces immobilières. Construite avec Next.js 15 et une architecture serverless robuste, elle offre une expérience complète de publication et de recherche immobilière.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED)](https://www.docker.com/)

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités-principales)
- [Stack Technique](#️-stack-technique)
- [Architecture](#-architecture-de-la-base-de-données)
- [Installation](#-installation)
- [Tests](#-tests)
- [Contribution](#-contribution)

---

## 🚀 Fonctionnalités Principales

### 👤 Gestion Complète des Utilisateurs

- **Inscription sécurisée** avec validation des données (nom, email, date de naissance)
- **Authentification robuste** via NextAuth.js avec provider credentials
- **Profil personnalisable** avec upload d'avatar
- **Gestion de compte** incluant la mise à jour et la suppression sécurisée

### 🔐 Système de Rôles Avancé

| Rôle | Permissions |
|------|-------------|
| **USER** | Consultation des annonces et possibilité de poser des questions |
| **AGENT** | Création, modification et suppression de ses propres annonces |
| **ADMIN** | Tous les droits d'agent + réponse à toutes les questions |

> **Protection des routes** : Le middleware (`src/middleware.ts`) assure que seuls les utilisateurs autorisés peuvent accéder aux fonctionnalités sensibles.

### 🏘️ Gestion des Annonces (CRUD Complet)

- **Formulaire exhaustif** : prix, surface, nombre de chambres, année de construction, type de bien, etc.
- **Upload multi-images** : image principale et galerie complète
- **Pagination intelligente** : listes d'annonces (Achat/Location) avec chargement progressif
- **Panneau d'édition** : gestion centralisée des informations, images et interactions

### 💬 Système de Questions/Réponses

- Les utilisateurs connectés peuvent **poser des questions** sur n'importe quelle annonce
- Les agents propriétaires et les administrateurs peuvent **y répondre**
- Affichage public des Q&A sur chaque page d'annonce pour plus de transparence

---

## 🛠️ Stack Technique

### Frontend
- **Framework** : Next.js 15 (App Router)
- **UI/UX** : React (Client & Server Components), Tailwind CSS
- **Upload** : React-Dropzone

### Backend
- **API** : Next.js API Routes (serverless)
- **Authentification** : NextAuth.js (Credentials Provider)
- **Base de données** : PostgreSQL
- **ORM** : Prisma

### DevOps & Tests
- **Conteneurisation** : Docker & Docker Compose
- **Tests E2E** : Cypress

---

## 📊 Architecture de la Base de Données

Le schéma Prisma (`prisma/schema.prisma`) définit quatre modèles principaux :

```prisma
model User {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  password    String   // Hashé avec bcrypt
  role        Role     @default(USER)
  avatar      String?
  birthDate   DateTime
  annonces    Annonce[]
  questions   Question[] @relation("QuestionAuthor")
  responses   Question[] @relation("QuestionResponder")
}

model Annonce {
  id              String           @id @default(cuid())
  title           String
  price           Float
  surface         Float
  rooms           Int
  status          RealEstateStatus
  type            Type
  mainImage       String
  galleryImages   GalleryImg[]
  questions       Question[]
  userId          String
  user            User             @relation(fields: [userId], references: [id])
}

model GalleryImg {
  id         String   @id @default(cuid())
  url        String
  annonceId  String
  annonce    Annonce  @relation(fields: [annonceId], references: [id])
}

model Question {
  id          String   @id @default(cuid())
  content     String
  response    String?
  annonceId   String
  annonce     Annonce  @relation(fields: [annonceId], references: [id])
  authorId    String
  author      User     @relation("QuestionAuthor", fields: [authorId], references: [id])
  responderId String?
  responder   User?    @relation("QuestionResponder", fields: [responderId], references: [id])
}
```

---

## 🚀 Installation

### Prérequis

- Docker et Docker Compose installés sur votre machine
- Un éditeur de code (VS Code recommandé)

### Étape 1 : Configuration de l'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Variables pour le service PostgreSQL
POSTGRES_USER=votre_user_ici
POSTGRES_PASSWORD=votre_mot_de_passe_securise_ici
POSTGRES_DB=immonext_db

# URL de connexion Prisma (le host "@db" correspond au service Docker)
DATABASE_URL="postgresql://votre_user_ici:votre_mot_de_passe_securise_ici@db:5432/immonext_db"

# Secret NextAuth.js (générez une clé aléatoire sécurisée)
NEXTAUTH_SECRET=votre_secret_nextauth_tres_securise_ici
```

> 💡 **Astuce** : Générez un secret fort avec `openssl rand -base64 32`

### Étape 2 : Lancer l'application

```bash
# Construire et démarrer les conteneurs
docker-compose up -d --build

# Appliquer les migrations Prisma
docker-compose exec app npx prisma migrate dev

# (Optionnel) Générer un client Prisma à jour
docker-compose exec app npx prisma generate
```

🎉 **Votre application est accessible sur** [http://localhost:3000](http://localhost:3000)

### Étape 3 : Visualiser la base de données (optionnel)

```bash
# Lancer Prisma Studio
docker-compose exec app npx prisma studio
```

Accédez à l'interface sur [http://localhost:5555](http://localhost:5555)

---

## 🧪 Tests

Le projet inclut une suite complète de tests E2E avec Cypress couvrant :

- ✅ **Navigation** : Vérification de l'accessibilité des pages
- ✅ **User CRUD** : Inscription → Connexion → Modification → Suppression
- ✅ **Contrôle d'accès** : Validation des permissions par rôle
- ✅ **Annonce CRUD** : Création → Lecture → Mise à jour → Suppression

### Préparation des tests

Créez manuellement ces utilisateurs de test dans votre base de données (via Prisma Studio) :

| Email | Rôle | Mot de passe |
|-------|------|--------------|
| `user@example.com` | USER | `password123` |
| `agent@example.com` | AGENT | `password123` |
| `admin@example.com` | ADMIN | `password123` |

### Lancer les tests

```bash
# Ouvrir l'interface Cypress
npx cypress open

# Ou lancer en mode headless
npx cypress run
```

---

## 📁 Structure du Projet

```
immonext/
├── src/
│   ├── app/              # App Router Next.js
│   │   ├── api/          # API Routes
│   │   ├── (auth)/       # Pages d'authentification
│   │   └── annonces/     # Pages d'annonces
│   ├── lib/
│   │   ├── components/   # Composants React
│   │   └── utils/        # Utilitaires
│   └── middleware.ts     # Protection des routes
├── prisma/
│   └── schema.prisma     # Schéma de base de données
├── cypress/
│   └── e2e/              # Tests E2E
├── docker-compose.yml    # Configuration Docker
└── .env                  # Variables d'environnement
```

---

## 📝 Licence

Ce projet est distribué sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

---

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

---

**Développé avec ❤️ en utilisant Next.js et Prisma**