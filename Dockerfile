FROM node:lts-alpine as build-stage

WORKDIR /tmp
COPY package*.json ./
RUN npm install

WORKDIR /app
RUN cp -a /tmp/node_modules /app

COPY . .
RUN npm install vite
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
#CMD ["vite", "dev"]
#CMD ["npm", "run", "dev"]
CMD ["nginx", "-g", "daemon off;"]
