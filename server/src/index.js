import express from 'express';
import { APP_PORT } from './constants.js';
import router from '../routes/routes.js';
import { initDriver } from './neo4j.js';
import { API_PREFIX, NEO4J_PASSWORD, NEO4J_URI, NEO4J_USERNAME } from './constants.js';

const app = express();
app.use(express.json());

// Listen
const port = APP_PORT;

initDriver(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD);

app.use(API_PREFIX, router);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}/`)
});
