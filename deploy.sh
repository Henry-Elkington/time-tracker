#!/bin/sh

git pull

npm install
npm push

npm run build
npm run start
