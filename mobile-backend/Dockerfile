FROM node:slim

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY src ./src
COPY tsconfig.json ./

EXPOSE 3000

CMD ["yarn", "run", "start"]