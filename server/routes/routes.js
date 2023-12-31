import { Router } from 'express';
import { getDriver } from '../src/neo4j.js';
import bodyParser from 'body-parser';
import MovieService from '../services/movie.service.js';
import NetworkService from '../services/network.service.js';
import EdgeDataService from '../services/edge.data.service.js';
import ProteinService from '../services/protein.service.js';
import GoTermService from '../services/go.term.service.js';
import Txid7227Service from '../services/txid7227.service.js';
import QueryService from '../services/query.service.js';
import AncestorsService from '../services/ancestors.service.js';
import DescendantsService from '../services/descendants.service.js';

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

router.post('/getProteinOptions', jsonParser, async (req, res, next) => {
  const data = req.body;
  const species = data.species

  try {
    const proteinService = new ProteinService(
      getDriver()
    )

    const proteinOptions = await proteinService.getProtein(species)

    res.json(proteinOptions)
  }
  catch (e) {
    next(e)
  }
});

router.post('/getAncestors', jsonParser, async (req, res, next) => {
  const data = req.body;
  let goTerm = data.goTerm.id || data.goTerm.name;


  try {
    const ancestorService = new AncestorsService(
      getDriver()
    )

    const ancestors = await ancestorService.getAncestors(goTerm)

    res.json(ancestors)
  }
  catch (e) {
    next(e)
  }
});

router.post('/getDescendants', jsonParser, async (req, res, next) => {
  const data = req.body;
  let goTerm = data.goTerm.id || data.goTerm.name;

  try {
    const descendantsService = new DescendantsService(
      getDriver()
    );

    const descendants = await descendantsService.getDescendants(goTerm);

    res.json(descendants);
  } catch (e) {
    next(e);
  }
});


router.get('/getGoTermOptions', jsonParser, async (req, res, next) => {
  try {
    const goTermService = new GoTermService(
      getDriver()
    )

    const goTermOptions = await goTermService.getGoTerm()

    res.json(goTermOptions)
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

// get D. melanogaster data
router.post('/getTxid7227', jsonParser, async (req, res, next) => {
  const data = req.body;
  const species = data.species;
  const protein = data.protein;
  const goTerm = data.goTerm;
  const k = data.k;

  console.log('Species:', species);
  console.log('Protein:', protein);
  console.log('GO Term:', goTerm);
  console.log('k:', k);

  try {
    const queryService = new Txid7227Service(getDriver());
    const queryResult = await queryService.getTxid7227(protein, goTerm, k);
    // console.log(queryResult)

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

router.post('/postRequest', async (req, res, next) => {
  const body = req.body
  res.json(body)
});

// dynamic query
router.post('/getQuery', jsonParser, async (req, res, next) => {
  const data = req.body;
  const species = data.species;
  const protein = data.protein;
  const goTerm = data.goTerm;
  const k = data.k;

  console.log('Species:', species);
  console.log('Protein:', protein);
  console.log('GO Term:', goTerm);
  console.log('k:', k);

  try {
    const queryService = new QueryService(getDriver());
    const queryResult = await queryService.getQuery(species, protein, goTerm, k);
    // console.log(queryResult)

    if (queryResult.length === 0) {
      console.log("no data found")
      res.status(404).send({ error: 'No data found' });
    } else {
      res.status(200).json(queryResult);
    }
  } catch (error) {
    console.error('Error in /getQuery:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router
