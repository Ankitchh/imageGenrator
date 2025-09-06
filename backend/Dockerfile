FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p ./image

EXPOSE 3000

CMD ["npm", "start"]
