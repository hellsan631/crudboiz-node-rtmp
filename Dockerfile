FROM node:8.12.0-slim

RUN apt-get update -y
RUN apt-get install -y sudo

RUN apt-get update -y
RUN apt-get install -y git \
                       build-essential \
                       libssl-dev \
                       node-gyp \
                       node-bindings \
                       g++ \
                       gcc

WORKDIR /tmp
RUN git clone https://github.com/uNetworking/uWebSockets.git
RUN cd uWebSockets && make && make install

COPY ./ /app
WORKDIR /app
RUN npm install

CMD ["node", "server/server.js"]
