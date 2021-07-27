FROM node:14.17.3-alpine

WORKDIR /app

COPY ./package.json ./
RUN npm install
COPY . .

EXPOSE 8000

# Default command
CMD ["npm", "run", "start"]