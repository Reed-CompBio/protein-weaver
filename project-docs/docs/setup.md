# Setup
The setup guide will include the backend database, server, and the frontend

## Backend Database
Neo4j is the database. We will need Docker to setup the database. [Follow this page](https://docs.docker.com/get-docker/) to install the Docker Desktop. First pull the official Neo4j Docker image

```
docker pull neo4j
```
Run the Neo4j Docker image
```
docker run --interactive --tty -p7687:7687 -p7474:7474 -p7473:7473 --env NEO4J_AUTH=neo4j/testpassword --env NEO4J_ACCEPT_LICENSE_AGREEMENT=yes neo4j:5.11.0-community-bullseye
```
Visit your [http://localhost:7474/browser/](http://localhost:7474/browser/) to view the database. You will need to input the username and password credentials which is outlined in the previous docker command.

For the first iteration, we need to manually input the Movies database provided by Neo4j. You can create this data by opening the live data guide, and inputting the first code block in the editor. The database is now hosted locally, and you will need to keep the terminal window open

## Backend Server
The backend server is run using Express.js

Open a new terminal window and clone the repository. Locate the server in the `server directory`
```
cd server
```
Next we need to install node.js, and the recommended way is to use an Node Version Manager. Follow the [NVM Github](https://github.com/nvm-sh/nvm) instruction before proceeding.

The node version is outlined in the `.nvmrc` file in both of the client and server directories. Follow the command below to use the correct version.
```
nvm use
```
If the node version is not installed, follow the instuction to do so.
```
npm install
```
You can verify the node version currently being used using:
```
node -v
```
To start the server, do the following function:
```
npm start
```
The server should be running on [http://localhost:3000/](http://localhost:3000/). There are several APIs, and you can verify it works by using [http://localhost:3000/api/test](http://localhost:3000/api/test) which should output a JSON object. Please keep the terminal window open.

## Frontend
The frontend uses the React.js framework, and uses Vite.js as a bundler.

Open a new terminal window and clone the repository. Locate the server in the `server directory`
```
cd client
```

Similar to the backend server setup, we need to use and install the correct node.js version.
Follow the commands below, and you may need to install the correct node version:
```
nvm use
npm install
node -v
```

To start the frontend, do the following command:
```
npm run dev
```
The website should be running on [http://localhost:5173/](http://localhost:5173/)