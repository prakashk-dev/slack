FROM node:lts-alpine3.9

WORKDIR /usr/app
COPY package*.json ./
RUN npm install -q

# set path to run packages from node_modules
ENV NODE_PATH=/usr/app/node_modules/.bin
COPY . .

CMD ["npm", "run", "dev"]

