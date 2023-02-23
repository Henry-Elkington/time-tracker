FROM node:19

WORKDIR /usr/src/app
COPY . .
ENV DATABASE_URL=file:./db.sqlite
RUN npm install
RUN npm run push
RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]