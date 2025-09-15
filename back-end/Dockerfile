FROM node:20-alpine

# Installation des outils nécessaires
RUN apk add --no-cache git

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 3333

# Commande par défaut (sera surchargée par docker-compose)
CMD ["npm", "run", "dev"]

