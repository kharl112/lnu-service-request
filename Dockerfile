FROM node:14 as build

WORKDIR /production

COPY package*.json ./ 
COPY . /production/

ENV NODE_ENV=production
RUN npm run render-postbuild

EXPOSE 5000

CMD ["node", "server.js"]

