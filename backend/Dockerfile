FROM node:lts-alpine3.9

# first installed node_modules in cache and copy them to src folder
RUN mkdir /usr/cache
WORKDIR /usr/cache

COPY package.json .
RUN npm install -q

# now make a different directory for src code 
RUN mkdir /usr/app
WORKDIR /usr/app

# set path to run packages from node_modules
ENV NODE_PATH=/usr/app/node_modules/.bin

RUN npm config set save-exact=true

COPY . .