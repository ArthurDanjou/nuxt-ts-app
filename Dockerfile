FROM node:15.8.0-alpine3.10

RUN mkdir -p /usr/src/nuxtapp
WORKDIR /usr/src/nuxtapp

COPY . /usr/src/nuxtapp

RUN yarn install

RUN yarn build

EXPOSE 3333

COPY . .

CMD ["yarn", "start"]
