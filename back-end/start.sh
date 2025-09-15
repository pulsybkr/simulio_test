#!/bin/bash

echo "🚀 Démarrage du backend Simulio..."

# Attendre que MySQL soit disponible
echo "⏳ Attente de la base de données..."
until nc -z mysql 3306; do
  echo "MySQL n'est pas encore prêt, nouvelle tentative dans 2 secondes..."
  sleep 2
done

echo "✅ Base de données disponible!"

# Exécuter les migrations
echo "🔄 Exécution des migrations..."
npm run migration:run

# Vérifier si des seeds existent et les exécuter
if [ -d "database/seeders" ] && [ "$(ls -A database/seeders 2>/dev/null)" ]; then
  echo "🌱 Exécution des seeds..."
  npm run db:seed
else
  echo "ℹ️  Aucun seed trouvé, on continue..."
fi

echo "🎯 Lancement du serveur de développement..."

# Lancer le serveur
exec npm run dev
