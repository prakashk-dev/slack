FROM node:lts-alpine3.9 AS builder

WORKDIR /usr/app
COPY package*.json ./
RUN npm i -q

COPY . .

FROM builder AS development

# do multistage where first node_modules contains dependencies + devDependencies and second contains only dependencies
# if we set env to production, babel does not get installed in node_modules and we can not compile code using babel
FROM builder AS prod-builder

WORKDIR /usr/app
RUN npm run build

# remove devDependencies
RUN npm prune --production

FROM prod-builder AS production

ENV NODE_ENV=production
WORKDIR /usr/app
# do not copy static assets from here as they are store in server disk
# look at this again why assests are not copied over
COPY --from=prod-builder /usr/app/node_modules /usr/app/node_modules
COPY --from=prod-builder /usr/app/dist /usr/app/dist
COPY --from=prod-builder /usr/app/package.json /usr/app/package.json
COPY --from=prod-builder /usr/app/version /usr/app/version