# 🐳 Simulio - Configuration Docker

Ce README explique comment lancer l'ensemble du projet Simulio en mode développement avec Docker.

## 📋 Prérequis

- [Docker](https://www.docker.com/get-started) installé
- [Docker Compose](https://docs.docker.com/compose/) installé

## 🚀 Démarrage rapide

1. **Cloner le projet** (si ce n'est pas déjà fait)
   ```bash
   git clone https://github.com/pulsybkr/simulio_test.git
   cd simulio
   ```

2. **Lancer tous les services**
   ```bash
   docker-compose up --build
   ```

3. **Accéder aux applications**
   - **Front-end** : http://localhost:5173
   - **Back-end API** : http://localhost:3333
   - **API Simulation** : http://localhost:8000
   - **Base de données MySQL** : localhost:3306

## 🏗️ Architecture

Le projet est composé de 4 services :

### 🗄️ MySQL Database
- **Port** : 3306
- **Base de données** : `simulio`
- **Utilisateur** : `simulio_user`
- **Mot de passe** : `simulio_password`

### 🔧 Back-end (AdonisJS)
- **Port** : 3333
- **Tech** : Node.js + AdonisJS + TypeScript
- **Auto-reload** : ✅ Activé
- **Migrations** : ✅ Exécutées automatiquement au démarrage

### 🎨 Front-end (Vue.js)
- **Port** : 5173
- **Tech** : Vue.js 3 + Vite + TypeScript + Tailwind
- **Auto-reload** : ✅ Activé

### 🧮 Simulation (FastAPI)
- **Port** : 8000
- **Tech** : Python + FastAPI
- **Auto-reload** : ✅ Activé

## 📝 Commandes utiles

### Démarrer les services
```bash
# Démarrer tous les services
docker-compose up

# Démarrer en arrière-plan
docker-compose up -d

# Forcer la reconstruction des images
docker-compose up --build
```

### Arrêter les services
```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données de la DB)
docker-compose down -v
```

### Logs et débogage
```bash
# Voir les logs de tous les services
docker-compose logs

# Voir les logs d'un service spécifique
docker-compose logs backend
docker-compose logs frontend
docker-compose logs simulation
docker-compose logs mysql

# Suivre les logs en temps réel
docker-compose logs -f backend
```

### Accès aux conteneurs
```bash
# Accéder au conteneur backend
docker-compose exec backend sh

# Accéder au conteneur de simulation
docker-compose exec simulation bash

# Accéder à MySQL
docker-compose exec mysql mysql -u simulio_user -p simulio
```

## 🔧 Développement

### Modifications du code
- **Back-end** : Éditez les fichiers dans `./back-end/` - l'auto-reload est activé
- **Front-end** : Éditez les fichiers dans `./front-end/` - l'auto-reload est activé  
- **Simulation** : Éditez les fichiers dans `./simulation/` - l'auto-reload est activé

### Installation de nouvelles dépendances

#### Back-end (npm)
```bash
docker-compose exec backend npm install <package-name>
```

#### Front-end (npm)
```bash
docker-compose exec frontend npm install <package-name>
```

#### Simulation (pip)
```bash
docker-compose exec simulation pip install <package-name>
# N'oubliez pas de mettre à jour requirements.txt
```

### Migrations de base de données

**✅ Automatiques** : Les migrations sont exécutées automatiquement au démarrage du backend.

Commandes manuelles disponibles :
```bash
# Exécuter les migrations manuellement
docker-compose exec backend npm run migration:run

# Rollback des migrations
docker-compose exec backend npm run migration:rollback

# Seeder la base de données
docker-compose exec backend npm run db:seed
```

## 🐛 Résolution de problèmes

### Les services ne démarrent pas
1. Vérifiez que les ports ne sont pas déjà utilisés
2. Essayez de forcer la reconstruction : `docker-compose up --build`
3. Vérifiez les logs : `docker-compose logs`

### La base de données ne se connecte pas
1. Attendez que MySQL soit complètement démarré (healthcheck)
2. Vérifiez les logs MySQL : `docker-compose logs mysql`
3. Les migrations se lancent automatiquement au démarrage du backend

### Hot-reload ne fonctionne pas
- Assurez-vous que les volumes sont correctement montés
- Redémarrez le service concerné : `docker-compose restart <service-name>`

## 🔄 Redémarrage propre

Si vous rencontrez des problèmes, essayez un redémarrage complet :

```bash
# Arrêter tout
docker-compose down

# Supprimer les images (optionnel)
docker-compose down --rmi all

# Nettoyer les volumes (⚠️ supprime les données)
docker-compose down -v

# Reconstruire et redémarrer
docker-compose up --build
```

## 📊 URLs de test

Une fois tous les services démarrés, vous pouvez tester :

- **Health check backend** : http://localhost:3333/health
- **API docs simulation** : http://localhost:8000/docs
- **Interface principale** : http://localhost:5173

---

🎉 **Bon développement !**

