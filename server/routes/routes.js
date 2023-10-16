import { Router } from 'express';
import { getDriver } from '../src/neo4j.js';
import bodyParser from 'body-parser';
import MovieService from '../services/movie.service.js';
import NetworkService from '../services/network.service.js';
import FlyBaseService from '../services/flybase.service.js';
import EdgeDataService from '../services/edge.data.service.js';
import ProteinService from '../services/protein.service.js';

const router = new Router()
const jsonParser = bodyParser.json();

router.get("/test", (req, res) => {
  res.json({ "message": "Successfully connected to the backend API" })
})

router.get('/getMovie', async (res, next) => {
  try {

    const movieService = new MovieService(
      getDriver()
    )

    const movies = await movieService.getMovie(
    )

    res.json(movies)
  }
  catch (e) {
    next(e)
  }
})

router.get('/getNetwork', async (res, next) => {
  try {

    const networkService = new NetworkService(
      getDriver()
    )

    const network = await networkService.getNetwork()

    res.json(network)
  }
  catch (e) {
    next(e)
  }
});

router.get('/proteinOptions', async (res, next) => {
  try {
    const proteinService = new ProteinService(
      getDriver()
    )

    const proteinOptions = await proteinService.getProtein()

    res.json(proteinOptions)
  }
  catch (e) {
    next(e)
  }
});

router.post('/getEdgeData', jsonParser, async (req, res, next) => {
  const data = req.body;
  const nodeList = data.nodeList

  try {
    const edgeDataService = new EdgeDataService(
      getDriver()
    )

    const edgeData = await edgeDataService.getEdgeData(nodeList)

    res.json(edgeData)
  } catch (e) {
    next(e)
  }
});

router.post('/getFlyBase', jsonParser, async (req, res, next) => {
  const data = req.body;
  const protein = data.protein;
  const goTerm = data.goTerm;
  const k = data.k;

  console.log('Protein:', protein);
  console.log('GO Term:', goTerm);
  console.log('k:', k);

  try {
    const flyBaseService = new FlyBaseService(getDriver());
    const queryResult = await flyBaseService.getFlyBase(protein, goTerm, k);
    console.log(queryResult)

    if (queryResult.length === 0) {
      console.log("no data found")
      res.status(404).send({ error: 'No data found' });
    } else {
      res.status(200).json(queryResult);
    }
  } catch (error) {
    console.error('Error in /getFlyBase:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/postRequest', async (req, res) => {
  const body = req.body
  res.json(body)
})

export default router
