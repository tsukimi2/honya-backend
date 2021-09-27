FROM node:14.17.6-alpine

WORKDIR /app

COPY ./package.json ./
RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm install
COPY . .

EXPOSE 8000

# Default command
CMD ["npm", "run", "start"]