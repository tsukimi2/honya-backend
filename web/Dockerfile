FROM node:14.17.3-alpine
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

# Install PM2 globally
RUN npm install --global pm2

COPY ./package*.json ./
USER node
RUN npm install --production
COPY --chown=node:node ./ ./
RUN npm run build
EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
# https://github.com/nodejs/docker-node/issues/740
USER node

# CMD ["npm", "start"]
CMD [ "pm2-runtime", "npm", "--", "start" ]
