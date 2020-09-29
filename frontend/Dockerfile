FROM node:lts-alpine3.9 As builder

WORKDIR /usr/app
COPY package*.json ./
RUN npm install -q
ENV NODE_PATH=/usr/app/node_modules/.bin
COPY . .

FROM builder AS development

WORKDIR /usr/app
CMD ["npm", "run", "dev"]


FROM builder AS prod-builder

WORKDIR /usr/app
ARG SOCKET_URL

ENV NODE_ENV="production"
ENV SOCKET_URL=SOCKET_URL
RUN npm run build


FROM nginx:alpine AS production

COPY --from=prod-builder /usr/app/public /usr/share/nginx/html
# pre-compress everything
RUN find /usr/share/nginx/html \! -name "*.png" \! -name "*.ico" -size +1k -type f -exec gzip -9k {} \;
CMD ["nginx", "-g", "daemon off;"]