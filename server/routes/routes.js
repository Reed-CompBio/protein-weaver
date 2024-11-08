import { Router } from "express";
import { getDriver } from "../src/neo4j.js";
import http from 'http';
import bodyParser from "body-parser";
import EdgeDataService from "../services/edge.data.service.js";
import ProteinService from "../services/protein.service.js";
import GoTermService from "../services/go.term.service.js";
import QueryService from "../services/query.service.js";
import AncestorsService from "../services/ancestors.service.js";
import DescendantsService from "../services/descendants.service.js";
import NeighborService from "../services/neighbor.service.js";
import { neighborParser } from "../tools/data.parsing.js";
import GoNodeService from "../services/go.node.service.js";
import AllShortestPathsService from "../services/dijkstra.all.service.js";
import ProteinFinderService from "../services/protein.finder.service.js";
import GoFinderService from "../services/go.finder.service.js";
import AvgDegreeService from "../services/avg.degree.service.js";
import PGStats from "../services/pro.go.stats.service.js";
import PhysicalDegree from "../services/physical.degree.service.js";
import RegulatoryDegree from "../services/regulatory.degree.service.js";
import MotifService from "../services/motif.service.js";
import LocalDegreeService from "../services/local.degree.service.js";

const router = new Router();
const jsonParser = bodyParser.json();


router.get("/test", (req, res) => {
  res.json({ message: "Successfully connected to the backend API" });
  console.log("successfully connected to the backend API");
});

router.post("/getProteinOptions", jsonParser, async (req, res, next) => {
  const data = req.body;
  const species = data.species;

  try {
    const proteinService = new ProteinService(getDriver());

    const proteinOptions = await proteinService.getProtein(species);

    res.json(proteinOptions);
  } catch (e) {
    next(e);
  }
});

router.post("/getAncestors", jsonParser, async (req, res, next) => {
  const data = req.body;
  let species = data.species;
  let goTerm = data.goTerm.id || data.goTerm.name;

  try {
    const ancestorService = new AncestorsService(getDriver());

    const ancestors = await ancestorService.getAncestors(goTerm, species);

    res.json(ancestors);
  } catch (e) {
    next(e);
  }
});

router.post("/getDescendants", jsonParser, async (req, res, next) => {
  const data = req.body;
  let species = data.species;
  let goTerm = data.goTerm.id || data.goTerm.name;

  try {
    const descendantsService = new DescendantsService(getDriver());

    const descendants = await descendantsService.getDescendants(
      goTerm,
      species
    );

    res.json(descendants);
  } catch (e) {
    next(e);
  }
});

router.get("/getGoTermOptions", jsonParser, async (req, res, next) => {
  try {
    const goTermService = new GoTermService(getDriver());

    const goTermOptions = await goTermService.getGoTerm();

    res.json(goTermOptions);
  } catch (e) {
    next(e);
  }
});

router.post("/getEdgeData", jsonParser, async (req, res, next) => {
  const data = req.body;
  const nodeList = data.nodeList;

  try {
    const edgeDataService = new EdgeDataService(getDriver());

    const edgeData = await edgeDataService.getEdgeData(nodeList);

    res.json(edgeData);
  } catch (e) {
    next(e);
  }
});

router.post("/getAvgDegree", jsonParser, async (req, res, next) => {
  const data = req.body;
  const nodeList = data.nodeList;
  const species = data.species;

  try {
    const avgDegreeService = new AvgDegreeService(getDriver());

    const avgDegree = await avgDegreeService.getAvgDegree(species, nodeList);
    console.log("Average Degree:");
    console.log(avgDegree);

    res.json(avgDegree);
  } catch (e) {
    next(e);
  }
});

router.post("/getProGoStats", jsonParser, async (req, res, next) => {
  try {
    const data = req.body;
    const GoName = data.GoName;
    const txid = data.txid;
    const PGS = new PGStats(getDriver());
    const edges = await PGS.ProGoStats(GoName, txid);
    res.json(edges);

  }
  catch (e) {
    next(e);
  }
});

router.post("/getPhysicalDegree", jsonParser, async (req, res, next) => {
  try {
    const data = req.body;
    const id = data.id.id;
    const DEG = new PhysicalDegree(getDriver());
    const degrees = await DEG.getdegree(id);
    res.json(degrees);
  }
  catch (e) {
    next(e);
  }
});

router.post("/getRegulatoryDegree", jsonParser, async (req, res, next) => {
  try {
    const data = req.body;
    const id = data.id.id;
    const DEG = new RegulatoryDegree(getDriver());
    const degrees = await DEG.getDegree(id);
    res.json(degrees);
  }
  catch (e) {
    next(e);
  }
});

router.post("/getMotif", jsonParser, async (req, res, next) => {
  try {
    const data = req.body;
    const nodeList = data.nodeList
    const motif = new MotifService(getDriver());
    const mCount = await motif.getMotif(nodeList);
    res.json(mCount);
  }
  catch (e) {
    next(e);
  }
});

router.post("/getLocalDegrees", jsonParser, async (req, res, next) => {
  try {
    const data = req.body;
    const nodeList = data.nodeList
    const degrees = new LocalDegreeService(getDriver());
    const localDegrees = await degrees.getLocalDegrees(nodeList);
    res.json(localDegrees);
  }
  catch (e) {
    next(e);
  }
});

// dynamic query
router.post("/getQueryByPath", jsonParser, async (req, res, next) => {
  const data = req.body;
  const species = data.species;
  const protein = data.protein.replace(/[^a-zA-Z0-9\s]/g, '.');
  const goTerm = data.goTerm.replace(/[^a-zA-Z0-9\s]/g, '.');
  const k = data.k;
  const ppi = data.ppi
  const regulatory = data.regulatory

  console.log("Species:", species);
  console.log("Protein:", protein);
  console.log("GO Term:", goTerm);
  console.log("k:", k);

  try {
    const proteinFinderService = new ProteinFinderService(getDriver());
    var sourceProtein = await proteinFinderService.getProteinFinder(
      protein,
      species
    );

    if (sourceProtein == "") {
      console.log("Source protein not found.");
      res.status(404).send({ error: "Source protein not found." });
    } else {
      const goFinderService = new GoFinderService(getDriver());
      var goResult = await goFinderService.getGoFinder(goTerm);
      if (goResult == "") {
        console.log("GO term not found");
        res.status(404).send({ error: "GO term not found." });
      } else {
        //finds all specief GO terms

        const neighborService = new NeighborService(getDriver());

        var neighborData = await neighborService.getNeighbor(goTerm, species);
        neighborData = neighborParser(neighborData);

        console.log(neighborData.length);
        if (neighborData.length == 0) {
          console.log(
            "No direct proteins connected to GO term for this species"
          );
          res
            .status(404)
            .send({
              error: "No direct proteins connected to GO term for this species",
            });
        } else {
          //DO this to all GOterm
          let relType = ["ProGo"]
          if (ppi) {
            relType.push("ProProUndirected")
          }
          if (regulatory) {
            relType.push("Reg")
          }

          const queryService = new QueryService(getDriver());
          const queryResult = await queryService.getQuery(
            species,
            protein,
            goTerm,
            k,
            relType
          );

          if (queryResult.length === 0) {
            console.log(
              "No paths connecting protein of interest to nearby proteins labeled with the GO term."
            );
            res.status(404).send({
              error:
                "No paths connecting protein of interest to nearby proteins labeled with the GO term.",
            });
          } else {
            res.status(200).json(queryResult);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in /getQueryByPath:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/getQueryByNode", jsonParser, async (req, res, next) => {
  const data = req.body;
  const species = data.species;
  const protein = data.protein.replace(/[^a-zA-Z0-9\s]/g, '.');
  const goTerm = data.goTerm.replace(/[^a-zA-Z0-9\s]/g, '.');
  const k = data.k;
  const ppi = data.ppi
  const regulatory = data.regulatory

  console.log("Species:", species);
  console.log("Protein:", protein);
  console.log("GO Term:", goTerm);
  console.log("k:", k);

  console.log("getQueryByNode");

  try {
    const proteinFinderService = new ProteinFinderService(getDriver());
    var sourceProtein = await proteinFinderService.getProteinFinder(
      protein,
      species
    );

    if (sourceProtein == "") {
      console.log("Source protein not found.");
      res.status(404).send({ error: "Source protein not found." });
    } else {
      const goFinderService = new GoFinderService(getDriver());
      var goResult = await goFinderService.getGoFinder(goTerm);
      if (goResult == "") {
        console.log("GO term not found.");
        res.status(404).send({ error: "GO term not found." });
      } else {
        //find the neighbor of all the associated GO terms
        const neighborService = new NeighborService(getDriver());
        var neighborData = await neighborService.getNeighbor(goTerm, species);
        neighborData = neighborParser(neighborData);

        console.log(neighborData.length);
        if (neighborData.length == 0) {
          console.log(
            "No direct proteins connected to GO term for this species"
          );
          res
            .status(404)
            .send({
              error: "No direct proteins connected to GO term for this species",
            });
        } else {
          let relType = ["ProGo"]
          if (ppi) {
            relType.push("ProProUndirected")
          }
          if (regulatory) {
            relType.push("Reg")
          }
          const allShortestPathsService = new AllShortestPathsService(
            getDriver()
          );
          var allPaths = await allShortestPathsService.getAllShortestPaths(
            protein, relType
          );
          let neighborFound = 0;
          var paths = [];
          for (let i = 0; i < allPaths.length; i++) {
            if (neighborData.includes(allPaths[i]._fields[2])) {
              neighborFound++;
              console.log("FOUND", allPaths[i]._fields[2]);
              paths.push(allPaths[i]._fields[3]);
            }
          }
          if (paths.length == 0) {
            console.log(
              "No paths connecting protein of interest to nearby proteins labeled with the GO term."
            );
            res.status(404).send({
              error:
                "No paths connecting protein of interest to nearby proteins labeled with the GO term.",
            });
          } else {
            console.log("Neighbors found: ", neighborFound);
            console.log("Neighbors total: ", neighborData.length);

            const goNodeService = new GoNodeService(getDriver());
            var goTermNode = await goNodeService.getGoNode(goTerm);
            paths.push(goTermNode);

            res.json(paths);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in /getQuery:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.get('/call-flask', (req, res) => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/test',
    method: 'GET'
  };

  const flaskReq = http.request(options, (flaskRes) => {
    let data = '';

    // A chunk of data has been received.
    flaskRes.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    flaskRes.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.status(500).json({ message: 'Error parsing JSON from Flask API' });
      }
    });
  });

  flaskReq.on('error', (error) => {
    console.error('Error calling Flask API:', error);
    res.status(500).json({ message: 'Error calling Flask API' });
  });

  flaskReq.end();
});

router.post('/getPageRank', (req, res) => {
  const postData = JSON.stringify({
    protein: req.body.protein,
    goTerm: req.body.goTerm,
    species: req.body.species
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/pageRank',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const flaskReq = http.request(options, (flaskRes) => {
    let data = '';

    // A chunk of data has been received.
    flaskRes.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    flaskRes.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.status(500).json({ message: 'Error parsing JSON from Flask API' });
      }
    });
  });

  flaskReq.on('error', (error) => {
    console.error('Error calling Flask API:', error);
    res.status(500).json({ message: 'Error calling Flask API' });
  });

  // Write data to request body
  flaskReq.write(postData);
  flaskReq.end();
});


export default router;
