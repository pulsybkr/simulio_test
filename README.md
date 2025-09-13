# 🚀 Simulio - Simulateur Financier

Une application web moderne de simulation financière immobilière développée avec une architecture microservices.

## 📋 Table des matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technologies](#️-technologies)
- [🚀 Installation & Lancement](#-installation--lancement)
- [📖 Utilisation](#-utilisation)
- [🔧 Configuration](#-configuration)
- [🤝 Contribution](#-contribution)

## ✨ Fonctionnalités

### 👤 Gestion des Utilisateurs
- **Authentification JWT** sécurisée
- **3 rôles utilisateur** : Admin, Agent, Client
- **Inscription/Connexion** avec validation
- **Gestion des permissions** par rôle

### 🏠 Gestion des Clients (Admin & Agent uniquement)
- **CRUD complet** des clients
- **Assignation d'agents** aux clients
- **Filtrage par agent** pour les administrateurs

### 📊 Simulations Financières
- **Calculs avancés** de prêt immobilier
- **Tableau d'amortissement** détaillé
- **Évolution de la valeur** du bien immobilier
- **Calcul du salaire minimum** requis
- **Statut temps réel** des simulations

### 🎨 Interface Utilisateur
- **Design moderne** inspiré d'Apple et Airbnb
- **Responsive** (desktop, tablette, mobile)
- **Navigation intuitive** avec rôles adaptés
- **Composants réutilisables** avec Shadcn UI

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Services      │
│   Vue.js        │◄──►│   (Nginx)       │◄──►│   - Auth        │
│   + TypeScript  │    │                 │    │   - Simulation  │
└─────────────────┘    └─────────────────┘    │   - Clients     │
                                              └─────────────────┘
                                                     │
                                                     ▼
                                              ┌─────────────────┐
                                              │   Database      │
                                              │   MySQL         │
                                              └─────────────────┘
```

### Microservices
1. **Backend AdonisJS** (Port 3333)
   - Authentification et autorisation
   - Gestion des utilisateurs et clients
   - Orchestration des simulations

2. **API Simulation Python** (Port 8000)
   - Calculs financiers complexes
   - Intégration de la fonction de simulation existante
   - API REST avec validation Pydantic

3. **Frontend Vue.js** (Port 8080)
   - Interface utilisateur moderne
   - Gestion d'état avec Pinia
   - Routing avec Vue Router

4. **Base de données MySQL** (Port 3306)
   - Stockage persistant des données
   - Migrations automatisées

## 🛠️ Technologies

### Backend (AdonisJS + TypeScript)
- **AdonisJS 6** - Framework web Node.js
- **TypeScript** - Typage statique
- **Lucid ORM** - ORM pour MySQL
- **Vine** - Validation des données
- **JWT** - Authentification sécurisée
- **Logging avancé** - Suivi complet des requêtes HTTP

### API Simulation (Python)
- **FastAPI** - Framework API moderne
- **Pydantic** - Validation et sérialisation
- **Pandas & Numpy** - Calculs financiers
- **Uvicorn** - Serveur ASGI

### Frontend (Vue.js)
- **Vue 3** - Framework JavaScript progressif
- **TypeScript** - Typage statique
- **Pinia** - Gestion d'état
- **Vue Router** - Routing
- **Tailwind CSS** - Framework CSS utilitaire
- **Shadcn Vue** - Composants UI accessibles

### Infrastructure
- **Docker & Docker Compose** - Conteneurisation
- **MySQL 8.0** - Base de données
- **Nginx** - Reverse proxy et serveur statique

## 🚀 Installation & Lancement

### Prérequis
- **Docker & Docker Compose** pour le mode production
- **Node.js 20+** et **Python 3.11+** pour le développement local
- **Git** pour cloner le repository
- **4GB RAM** minimum recommandé

### 🐳 Mode Production (Docker)

```bash
# Cloner le repository
git clone <repository-url>
cd simulio

# Lancer tous les services
docker-compose up -d

# Ou utiliser le script Windows
start.bat

# Attendre que tous les services soient prêts (2-3 minutes)
```

### 💻 Mode Développement Local

Pour développer avec rechargement automatique :

```bash
# Installation des dépendances
cd back-end && npm install && cd ..
cd front-end && npm install && cd ..
cd simulation && pip install -r requirements.txt && cd ..

# Démarrage des services (Linux/Mac)
./start-dev.sh

# Ou manuellement sur Windows :
# Terminal 1: MySQL Docker
docker run --name simulio_mysql_dev -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=simulio -e MYSQL_USER=simulio_user -e MYSQL_PASSWORD=simulio_password -p 3306:3306 -d mysql:8.0

# Terminal 2: API Simulation
cd simulation && python main.py

# Terminal 3: Backend
cd back-end && npm run dev

# Terminal 4: Frontend
cd front-end && npm run dev
```

### 🛑 Arrêt du Mode Développement

```bash
# Linux/Mac
./stop-dev.sh

# Windows - arrêter manuellement
# Ctrl+C dans chaque terminal, puis :
docker stop simulio_mysql_dev && docker rm simulio_mysql_dev
```

### Accès aux Services

| Service | URL | Description |
|---------|-----|-------------|
| **Application** | http://localhost:8080 | Interface utilisateur Vue.js |
| **API Backend** | http://localhost:3333 | API REST AdonisJS |
| **API Simulation** | http://localhost:8000 | API calculs Python |
| **phpMyAdmin** | http://localhost:8081 | Gestion BD (optionnel) |

### Comptes de Test
Après le premier lancement, créez un compte administrateur ou utilisez :
- **Email** : admin@simulio.com
- **Mot de passe** : Admin123!

## 📊 Logging et Monitoring

### Logs des Requêtes HTTP
Le backend enregistre automatiquement toutes les requêtes HTTP avec :
- ✅ **Méthode, URL, statut HTTP**
- ✅ **Temps de réponse, taille des données**
- ✅ **IP client, User-Agent**
- ✅ **Utilisateur connecté**
- ✅ **Erreurs et stack traces**

### Consultation des Logs

#### En développement (console)
```bash
cd back-end && npm run dev
# Les logs apparaissent directement dans le terminal
```

#### Test des logs
```bash
cd back-end && npm run test:logs
```

#### Logs de production (fichiers)
```
logs/
├── app.log          # Logs généraux
└── http.log         # Logs HTTP uniquement
```

### Configuration du Logging
Voir le fichier `back-end/LOGGING.md` pour une documentation complète du système de logging.

## 📖 Utilisation

### 🔐 Authentification
1. **Inscription** : Créez un compte avec email et mot de passe
2. **Connexion** : Utilisez vos identifiants
3. **Rôles** : Choisissez entre Admin, Agent ou Client

### 👥 Gestion des Clients (Admin/Agent)
1. Accédez à la section "Clients"
2. **Créer** un nouveau client avec ses informations
3. **Assigner** un agent au client (Admin uniquement)
4. **Modifier/Supprimer** les clients selon vos permissions

### 📈 Simulations
1. Cliquez sur "Nouvelle Simulation"
2. Remplissez les paramètres :
   - Montant du prêt
   - Durée (1-30 ans)
   - Taux d'intérêt
   - Taux d'assurance
   - Apport initial
   - Frais (notaire, agence)
   - Valeur du bien
3. Lancez le calcul
4. Consultez les résultats détaillés

### 📊 Dashboard
- **Vue d'ensemble** avec statistiques
- **Simulations récentes** par statut
- **Actions rapides** selon le rôle
- **Navigation adaptée** aux permissions

## 🔧 Configuration

### Variables d'Environnement

#### Backend (.env)
```env
NODE_ENV=production
PORT=3333
DB_HOST=mysql
DB_USER=simulio_user
DB_PASSWORD=simulio_password
DB_DATABASE=simulio
SIMULATION_API_URL=http://simulation:8000
JWT_SECRET=your-secret-key
```

#### Frontend (docker-compose.yml)
```yaml
environment:
  VITE_API_URL: http://localhost:3333
```

### Base de Données

Les migrations sont automatiquement exécutées au premier lancement. La structure inclut :

- **users** : Utilisateurs avec rôles
- **clients** : Clients avec agent assigné
- **simulations** : Simulations avec paramètres et résultats
- **access_tokens** : Tokens JWT

## 🤝 Contribution

### Structure du Projet
```
simulio/
├── back-end/          # API AdonisJS
├── front-end/         # Application Vue.js
├── simulation/        # API Python
├── docker-compose.yml # Orchestration
└── README.md         # Documentation
```

### Développement Local

#### Backend
```bash
cd back-end
npm install
npm run dev
```

#### Simulation API
```bash
cd simulation
pip install -r requirements.txt
python main.py
```

#### Frontend
```bash
cd front-end
npm install
npm run dev
```

### Tests
```bash
# Backend
cd back-end && npm test

# API Simulation
cd simulation && python -m pytest
```

## 📋 Roadmap

### ✅ Implémenté
- [x] Architecture microservices
- [x] Authentification JWT
- [x] Gestion des rôles utilisateur
- [x] CRUD Clients
- [x] API Simulation Python
- [x] Interface Vue.js moderne
- [x] Docker & orchestration
- [x] Design responsive

### 🚧 En cours
- [ ] Tests unitaires et d'intégration
- [ ] Documentation API (Swagger)
- [ ] Export PDF des simulations
- [ ] Notifications par email
- [ ] Mode hors ligne

### 📅 Planifié
- [ ] Multi-tenancy
- [ ] API GraphQL
- [ ] Analytics avancés
- [ ] Intégration bancaire
- [ ] Application mobile

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs Docker : `docker-compose logs`
2. Consultez la documentation API : http://localhost:8000/docs
3. Ouvrez une issue sur le repository

---

**Développé avec ❤️ pour simplifier les simulations financières**
