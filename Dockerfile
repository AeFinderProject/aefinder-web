FROM node:v20.11.1

ARG web=/opt/workspace/aefinder-web

WORKDIR ${web}

COPY . ${web}

RUN yarn \
  && yarn build:devnet

ENTRYPOINT yarn start

EXPOSE 3000
