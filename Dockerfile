FROM node:10-alpine as build

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

RUN echo "Start building ===>"
RUN echo NODE_ENV for build is $NODE_ENV;
# Installing dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --production

# Copying source files
COPY . .
COPY .env.sample .env

# Building app
RUN yarn build

FROM node:10-alpine

WORKDIR /usr/app

ARG DOCKER_ENV=production
ARG TASK_DEFINITION
ARG BITBUCKET_BUILD_ID

ENV NODE_ENV=${DOCKER_ENV}
ENV TASK_DEFINITION=${TASK_DEFINITION}
ENV BITBUCKET_BUILD_ID=${BITBUCKET_BUILD_ID}

COPY --from=build /usr/src/app/node_modules /usr/app/node_modules
COPY --from=build /usr/src/app/public /usr/app/public
COPY --from=build /usr/src/app/.next /usr/app/.next
COPY --from=build /usr/src/app/package.json /usr/app/package.json
COPY --from=build /usr/src/app/next.config.js /usr/app/next.config.js

# Running the app
CMD [ "yarn", "prod" ]
