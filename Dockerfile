FROM node:16

WORKDIR /usr/app

COPY package.json ./

#RUN npm config set unsafe-perm true
RUN npm install -g typescript
RUN npm install -g ts-node

COPY .env ./

RUN npm install

# TypeScript
#RUN npm run tsc

COPY ./ ./



EXPOSE 30009
CMD [ "npm", "start" ]