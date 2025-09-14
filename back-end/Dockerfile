FROM node:20-alpine

RUN apk add --no-cache \
    python3 \
    py3-pip \
    curl \
    && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3333

CMD ["npm", "run", "dev"]
