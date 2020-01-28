# Base Dokcer image for Node.js
FROM node:10

# Working directory
WORKDIR /src/

# Copies package.json and package-lock.json and runs npm install
COPY package*.json ./
RUN npm install

# Bundles app source
COPY . .

RUN npm run-script build

# Exposes the services on the specified port
EXPOSE "${ONTOUML_SERVER_PORT}"

# Initiates the server
CMD [ "npm", "start" ]
