# 🏡 Simulio - Simulateur de Prêt Immobilier

## 📋 Description du Projet

**Simulio** est une application web complète de simulation de prêts immobiliers développée dans le cadre d'un test technique. Elle permet aux utilisateurs authentifiés de créer des simulations financières détaillées pour des projets immobiliers.

### ✨ Fonctionnalités Principales

#### 🔐 Authentification
- **Inscription** et **connexion** sécurisées
- Système d'authentification JWT
- Gestion des sessions utilisateur

#### 👥 Gestion des Clients
- **Création de clients** avec informations complètes
- **Attribution de simulations** à des clients spécifiques
- **Visualisation** de la liste des clients et de leurs simulations

#### 🧮 Simulations Financières
- **Assistant de création** de simulation en 9 étapes :
  1. Montant du prêt
  2. Durée du prêt
  3. Taux d'intérêt
  4. Taux d'assurance
  5. Apport personnel
  6. Valeur du bien
  7. Frais (notaire, agence)
  8. Options avancées (travaux, revalorisation)
  9. Validation et enregistrement

- **Calculs automatiques** :
  - Mensualités de remboursement
  - Tableau d'amortissement complet
  - Coût total du crédit
  - Intérêts totaux
  - Évolution de la valeur du bien
  - Exigence de salaire minimum

#### 📊 Tableaux de Bord
- **Dashboard principal** avec vue d'ensemble
- **Détail des simulations** avec graphiques
- **Historique complet** des calculs

#### 📱 Interface Utilisateur
- **Design moderne** avec Tailwind CSS et Radix UI
- **Interface responsive** (desktop, tablette, mobile)
- **Navigation intuitive** avec sidebar
- **Composants réutilisables** (modales, boutons, inputs)

## 🏗️ Architecture Technique

### 🎨 Frontend
- **Framework** : Vue.js 3 avec TypeScript
- **Styling** : Tailwind CSS + Radix Vue
- **État global** : Pinia
- **Routage** : Vue Router
- **HTTP** : Axios
- **Build** : Vite

### 🔧 Backend
- **Framework** : AdonisJS 6 (Node.js + TypeScript)
- **Base de données** : MySQL 8.0
- **ORM** : Lucid (AdonisJS)
- **Authentification** : JWT avec AdonisJS Auth
- **API** : RESTful

### 🧮 API de Simulation
- **Framework** : FastAPI (Python)
- **Calculs** : NumPy, Pandas, numpy-financial
- **Validation** : Pydantic
- **Documentation** : Swagger UI automatique

## 🚀 Installation et Lancement

### 📋 Prérequis
- Node.js 20+ et npm
- Python 3.9+
- MySQL 8.0
- Git

### 💻 Installation Manuelle

#### 🚀 Installation Rapide

**Windows :**
```bash
git clone <votre-repo>
cd simulio
setup.bat
```

**Linux/Mac :**
```bash
git clone <votre-repo>
cd simulio
chmod +x setup.sh
./setup.sh
```

#### 📋 Installation Détaillée

##### 1. Cloner le projet
```bash
git clone <votre-repo>
cd simulio
```

##### 2. Base de données MySQL
Installez MySQL 8.0 et créez la base de données :
```sql
CREATE DATABASE simulio;
CREATE USER 'simulio_user'@'localhost' IDENTIFIED BY 'simulio_password';
GRANT ALL PRIVILEGES ON simulio.* TO 'simulio_user'@'localhost';
FLUSH PRIVILEGES;
```

##### 3. API de Simulation (Python) - Terminal 1
```bash
cd simulation
python -m venv .venv

# Linux/Mac
source .venv/bin/activate
# Windows
.venv\Scripts\activate

pip install -r requirements.txt
python main.py
```
✅ **API Simulation disponible sur** : http://localhost:8000

##### 4. Backend (AdonisJS) - Terminal 2
```bash
cd back-end
npm install
cp env.example .env
```

Configurez le fichier `.env` avec vos paramètres MySQL :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=simulio_user
DB_PASSWORD=simulio_password
DB_DATABASE=simulio
SIMULATION_API_URL=http://localhost:8000
```

Puis lancez le serveur :
```bash
npm run dev
```
✅ **API Backend disponible sur** : http://localhost:3333

##### 5. Frontend (Vue.js) - Terminal 3
```bash
cd front-end
npm install
cp env.example .env
```

Configurez le fichier `.env` :
```env
VITE_API_URL=http://localhost:3333
```

Puis lancez le serveur de développement :
```bash
npm run dev
```
✅ **Application disponible sur** : http://localhost:5173

#### 🎯 Démarrage Rapide du Développement

Une fois l'installation terminée, utilisez ces scripts pour lancer tous les services :

**Windows :**
```bash
start-dev.bat
```

**Linux/Mac :**
```bash
./start-dev.sh
```

Ces scripts ouvriront automatiquement 3 terminaux pour chaque service.

### 🔑 Comptes de Test

**Administrateur :**
- Email: `admin@simulio.com`
- Mot de passe: `Admin123!`

## 📁 Structure du Projet

```
simulio/
├── 📁 back-end/                 # API AdonisJS
│   ├── 📁 app/
│   │   ├── 📁 controllers/      # Contrôleurs API
│   │   ├── 📁 models/          # Modèles de données
│   │   ├── 📁 middleware/      # Middlewares
│   │   └── 📁 validators/      # Validation des données
│   ├── 📁 database/
│   │   └── 📁 migrations/      # Migrations DB
│   └── 📁 config/              # Configuration
├── 📁 front-end/               # Application Vue.js
│   ├── 📁 src/
│   │   ├── 📁 components/      # Composants réutilisables
│   │   ├── 📁 views/          # Pages de l'application
│   │   ├── 📁 stores/         # Gestion d'état Pinia
│   │   ├── 📁 services/       # Services API
│   │   └── 📁 types/          # Types TypeScript
├── 📁 simulation/              # API Python FastAPI
│   ├── main.py                # Logique de calcul
│   └── requirements.txt       # Dépendances Python
├── docker-compose.yml         # Configuration Docker
├── start.bat                  # Script Windows
├── start.sh                   # Script Linux/Mac
└── README.md                  # Cette documentation
```

## 🔄 API Endpoints

### 🔐 Authentification
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/logout` - Déconnexion
- `GET /auth/me` - Profil utilisateur

### 👥 Clients
- `GET /clients` - Liste des clients
- `POST /clients` - Créer un client
- `GET /clients/:id` - Détail d'un client
- `PUT /clients/:id` - Modifier un client
- `DELETE /clients/:id` - Supprimer un client

### 🧮 Simulations
- `GET /simulations` - Liste des simulations
- `POST /simulations` - Créer une simulation
- `GET /simulations/:id` - Détail d'une simulation
- `PUT /simulations/:id` - Modifier une simulation
- `DELETE /simulations/:id` - Supprimer une simulation

### 📊 API de Calcul (Python)
- `POST /simulate` - Calculer une simulation
- `GET /health` - Status de l'API
- `GET /test` - Test avec paramètres par défaut

## 🛠️ Technologies Utilisées

### Frontend
- **Vue.js 3** - Framework JavaScript progressif
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Radix Vue** - Composants UI accessibles
- **Pinia** - Gestion d'état moderne
- **Vue Router** - Routage SPA
- **Axios** - Client HTTP
- **Vite** - Build tool rapide

### Backend
- **AdonisJS 6** - Framework Node.js
- **TypeScript** - Développement typé
- **MySQL** - Base de données relationnelle
- **Lucid ORM** - Mapping objet-relationnel
- **JWT** - Authentification stateless

### Simulation
- **FastAPI** - Framework Python moderne
- **Pandas** - Manipulation de données
- **NumPy** - Calculs numériques
- **numpy-financial** - Fonctions financières
- **Pydantic** - Validation de données

### DevOps
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration multi-services
- **ESLint** - Linting JavaScript/TypeScript
- **Prettier** - Formatage de code

## ⚠️ État du Projet

> **Note importante :** Ce projet n'est pas totalement terminé et reste perfectible. Il s'agit d'une version fonctionnelle développée dans le cadre d'un test technique.

### ✅ Fonctionnalités Implémentées
- ✅ Authentification complète
- ✅ Gestion des clients
- ✅ Création de simulations avec assistant
- ✅ Calculs financiers avancés
- ✅ Interface responsive
- ✅ API REST complète
- ✅ Conteneurisation Docker

### 🔄 Points d'Amélioration
- 🔄 **Tests unitaires** et d'intégration
- 🔄 **Validation côté client** plus robuste
- 🔄 **Gestion d'erreurs** améliorée
- 🔄 **Performance** et optimisations
- 🔄 **Accessibilité** WCAG
- 🔄 **Internationalisation** (i18n)
- 🔄 **Documentation API** avec Swagger
- 🔄 **Logs** et monitoring
- 🔄 **Sécurité** renforcée
- 🔄 **Cache** et optimisations DB

### 🚧 Fonctionnalités Futures
- 📊 **Graphiques avancés** avec Chart.js
- 📄 **Export PDF** des simulations
- 📧 **Notifications email**
- 🔄 **Historique des modifications**
- 👥 **Gestion des rôles** avancée
- 🌙 **Mode sombre**
- 📱 **Application mobile** (PWA)

## 🤝 Contribution

Ce projet étant un test technique, les contributions ne sont pas ouvertes. Cependant, n'hésitez pas à forker le projet pour vos propres expérimentations !

## 📄 Licence

Ce projet est développé à des fins éducatives dans le cadre d'un test technique.

---

**Développé avec ❤️ pour le test technique Simulio**
