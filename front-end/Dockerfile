FROM node:20

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Nettoyer le cache npm et installer les dépendances
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install

# Copier le reste du code
COPY . .

# Exposer le port de Vite
EXPOSE 5173

# Commande par défaut (sera surchargée par docker-compose)
CMD ["npm", "run", "dev"]

