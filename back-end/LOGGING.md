# 📊 Système de Logging - Simulio Backend

## 🎯 Vue d'ensemble

Le système de logging d'AdonisJS a été configuré pour fournir un suivi complet de toutes les requêtes HTTP et des événements importants de l'application.

## 📝 Configuration du Logger

### Fichiers de configuration
- `config/logger.ts` - Configuration principale du système de logging
- `.env` - Variables d'environnement pour le logging

### Variables d'environnement
```env
# Niveau de log général (debug, info, warn, error)
LOG_LEVEL=debug

# Configuration du logging HTTP
HTTP_LOG_ENABLED=true
HTTP_LOG_LEVEL=info
```

### Loggers configurés

#### 1. Logger principal (`app`)
- **Niveau** : `debug` en développement, `info` en production
- **Destination** : Console (dev) / Fichier (prod)
- **Utilisation** : Logs généraux de l'application

#### 2. Logger HTTP (`http`)
- **Niveau** : `info`
- **Destination** : Console (dev) / `logs/http.log` (prod)
- **Utilisation** : Logs spécifiques aux requêtes HTTP

## 🔍 Middleware de Logging HTTP

### Fonctionnalités
Le middleware `HttpLoggerMiddleware` capture automatiquement :

#### Informations de requête
- ✅ **Méthode HTTP** (GET, POST, PUT, DELETE)
- ✅ **URL complète** de la requête
- ✅ **IP client** avec géolocalisation potentielle
- ✅ **User-Agent** (navigateur/client)
- ✅ **Taille du contenu** (Content-Length)
- ✅ **Utilisateur connecté** (ID + email)

#### Informations de réponse
- ✅ **Code de statut HTTP** (200, 404, 500, etc.)
- ✅ **Temps de réponse** en millisecondes
- ✅ **Taille de la réponse**
- ✅ **Timestamp précis**

#### Gestion des erreurs
- ✅ **Logs d'erreur** avec stack trace
- ✅ **Niveau de log adaptatif** selon le statut HTTP
- ✅ **Informations contextuelles** préservées

### Format des logs

#### Requête entrante
```json
{
  "message": "→ HTTP Request",
  "method": "POST",
  "url": "http://localhost:3333/auth/login",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "ip": "127.0.0.1",
  "contentLength": "67",
  "user": "User:1(admin@simulio.com)",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

#### Réponse sortante
```json
{
  "message": "← HTTP Response",
  "method": "POST",
  "url": "http://localhost:3333/auth/login",
  "status": 200,
  "responseTime": "245.67ms",
  "responseSize": "512 bytes",
  "user": "User:1(admin@simulio.com)",
  "timestamp": "2024-01-15T10:30:45.368Z"
}
```

#### Erreur
```json
{
  "message": "✗ HTTP Error",
  "method": "POST",
  "url": "http://localhost:3333/auth/login",
  "status": 500,
  "responseTime": "12.34ms",
  "error": "Database connection failed",
  "user": "Anonymous",
  "timestamp": "2024-01-15T10:30:45.145Z"
}
```

## 📊 Utilisation du Logger dans le Code

### Import du logger
```typescript
import logger from '@adonisjs/core/services/logger'
```

### Niveaux de log disponibles

#### `logger.info()` - Informations générales
```typescript
logger.info('Utilisateur connecté', {
  userId: user.id,
  email: user.email,
  ip: request.ip()
})
```

#### `logger.warn()` - Avertissements
```typescript
logger.warn('Tentative de connexion échouée', {
  email: request.input('email'),
  ip: request.ip(),
  attempts: 3
})
```

#### `logger.error()` - Erreurs
```typescript
logger.error('Erreur base de données', {
  error: error.message,
  stack: error.stack,
  query: sqlQuery
})
```

#### `logger.debug()` - Debug (développement uniquement)
```typescript
logger.debug('Variables de session', {
  sessionId: session.id,
  data: sessionData
})
```

### Logger spécialisé HTTP
```typescript
logger.child({ http: true }).info('Requête API externe', {
  endpoint: '/api/external',
  responseTime: '150ms'
})
```

## 🧪 Test des Logs

### Script de test intégré
```bash
npm run test:logs
```

### Test manuel avec curl
```bash
# Test de santé
curl -v http://localhost:3333/health

# Test d'authentification
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'
```

## 📁 Structure des Logs

### En développement
```
[2024-01-15 10:30:45.123] INFO  → HTTP Request {"method":"GET","url":"http://localhost:3333/health"}
[2024-01-15 10:30:45.145] INFO  ← HTTP Response {"method":"GET","status":200,"responseTime":"22.45ms"}
```

### En production
- **Console** : Logs principaux de l'application
- **Fichier** : `logs/app.log` - Logs généraux
- **Fichier** : `logs/http.log` - Logs HTTP uniquement

## 🔧 Configuration Avancée

### Rotation des logs (production)
```typescript
// config/logger.ts
transport: {
  targets: targets()
    .pushIf(app.inProduction, targets.file({
      destination: 'logs/http.log',
      size: '10mb',
      keep: 5
    }))
    .toArray(),
}
```

### Filtrage par IP
```typescript
// Dans HttpLoggerMiddleware
if (request.ip() === '127.0.0.1') {
  return next() // Ne pas logger les requêtes locales
}
```

### Métriques personnalisées
```typescript
logger.child({ metrics: true }).info('Performance', {
  endpoint: ctx.request.url(),
  databaseQueries: 5,
  cacheHits: 3,
  memoryUsage: '45MB'
})
```

## 🚨 Monitoring et Alertes

### Seuils de performance
- ⚠️ **Avertissement** : > 500ms de temps de réponse
- 🚨 **Alerte** : > 2000ms de temps de réponse
- 🔴 **Critique** : > 5000ms de temps de réponse

### Codes d'erreur à surveiller
- `5xx` : Erreurs serveur
- `429` : Rate limiting
- `401/403` : Problèmes d'authentification
- `400` : Requêtes malformées

## 📈 Analyse des Logs

### Commandes utiles
```bash
# Recherche d'erreurs
grep "ERROR" logs/http.log

# Comptage des requêtes par endpoint
grep "HTTP Request" logs/http.log | cut -d'"' -f6 | sort | uniq -c

# Temps de réponse moyens
grep "responseTime" logs/http.log | grep -o '"[0-9]*\.[0-9]*ms"' | sort -n
```

### Outils de visualisation
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Grafana + Loki**
- **Datadog** ou **New Relic**
- **Sentry** pour les erreurs

---

**🎯 Le système de logging fournit une visibilité complète sur l'activité de l'application avec des performances minimales et une configuration flexible.**


Comptes de test :
Admin : admin@simulio.com / Admin123!
Agent : agent@simulio.com / Agent123!
Client : client@simulio.com / Client123!
