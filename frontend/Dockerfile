FROM node:lts-alpine3.9 as builder

# first installed node_modules in cache and copy them to src folder
RUN mkdir /usr/cache
WORKDIR /usr/cache
RUN npm config set save-exact=true

COPY package.json .
RUN npm install -q

# now make a different directory for src code 
RUN mkdir /usr/app
WORKDIR /usr/app

# set path to run packages from node_modules
ENV NODE_PATH=/usr/app/node_modules/.bin

COPY . .

FROM node:lts-alpine3.9 as production
WORKDIR /usr/app

COPY --from=builder /usr/cache ./
COPY --from=builder /usr/app ./

RUN npm run build

FROM nginx:mainline
COPY --from=production /usr/app/dist /usr/share/nginx/html

# pre-compress everything
RUN find /usr/share/nginx/html \! -name "*.png" \! -name "*.ico" -size +1k -type f -exec gzip -9k {} \;

RUN nginx