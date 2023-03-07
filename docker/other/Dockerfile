FROM node:19-alpine3.16

ENV NODE_ENV=production

ENV DATABASE_URL=file:./db.sqlite?connection_limit=1
ENV SESSION_SECRET=20cbc75cbb2c1ac49e69b11295de8201

WORKDIR /app

COPY package*.json ./
COPY package.json ./

RUN npm install

COPY . .

RUN npm run push
RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
