FROM node:alpine

WORKDIR /app

COPY package.json ./

COPY . /app

RUN npm install

CMD ["npm", "start"]