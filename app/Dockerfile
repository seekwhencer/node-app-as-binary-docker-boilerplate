FROM node:14

WORKDIR /home/node/project/app
COPY app/package.json .
RUN npm install
COPY . .

WORKDIR /home/node/project/shared
COPY shared/package.json .
RUN npm install
COPY . .

WORKDIR /home/node/project