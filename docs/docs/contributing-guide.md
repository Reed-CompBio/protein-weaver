# Contributing Guide
This is the guide for getting started with ProteinWeaver and will set you up to contribute to whichever aspects of ProteinWeaver interest you.

## Fork & Installation
ProteinWeaver uses a Dockerized version of Neo4j as the database. [Follow these instructions](https://docs.docker.com/get-docker/) to install Docker Desktop.

We will also be using GitHub to contribute to ProteinWeaver. It is recommended to install [GitHub Desktop](https://docs.github.com/en/desktop/installing-and-authenticating-to-github-desktop/installing-github-desktop) because of its easy user interface.

Then you will need to [fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) the [`contributing-guide`](https://github.com/Reed-CompBio/protein-weaver/tree/contributing-guide) branch of the ProteinWeaver GitHub repository to get the Zebrafish datasets and the base code for the front and backends in your own repository.

Once forked, clone the repository to your local desktop so that you have access to ProteinWeaver locally.

## Data Import
The following section will be using a [`bash`](https://en.wikipedia.org/wiki/Bash_(Unix_shell)) terminal to set up the Dockerized Neo4j environment.

1. Open the Docker Desktop application.

2. Navigate to a terminal window and pull the official Neo4j Docker image with the following command:
```bash
docker pull neo4j
```

3. Create a folder in your root directory named `neo4j`:

- Within the new `~/neo4j` directory create the following directories:
  - `~/neo4j/data/` to allow storage of database state between Docker instances
  - `~/neo4j/logs/` to allow storage of logs between Docker instances
  - `~/neo4j/import/` to store data for import
  - `~/neo4j/plugins/` to store any necessary plugins for production environments

4. Copy over all of the files in the cloned ProteinWeaver `/data/tutorial` directory to `~/neo4j/import/`.

5. Create a Neo4j Docker instance with GDS and APOC plugins using the following command:
```sh
docker run \
    --name proteinweaver \
    -p7474:7474 -p7687:7687 \
    -v $HOME/neo4j/data:/data \
    -v $HOME/neo4j/logs:/logs \
    -v $HOME/neo4j/import:/import \
    -v $HOME/neo4j/plugins:/plugins \
    --env NEO4J_AUTH=none \
    -e NEO4J_apoc_export_file_enabled=true \
    -e NEO4J_apoc_import_file_enabled=true \
    -e NEO4J_apoc_import_file_use__neo4j__config=true \
    -e NEO4J_PLUGINS='["graph-data-science"]' \
    -e NEO4JLABS_PLUGINS=\[\"apoc\"\] \
    neo4j:5.12.0-community-bullseye
```
- This docker instance has no security restrictions, to change username and password edit:
    `--env NEO4J_AUTH=username/password`

6. Access the docker image at [http://localhost:7474](http://localhost:7474) in your browser.

7. Once in the Neo4j Browser, create constraints before data import. We use NCBI as the source of the unique taxon identifiers.
    `CREATE CONSTRAINT txid_constraint FOR (n:protein) REQUIRE (n.txid, n.id) IS UNIQUE;`
    Create a constraint for the GO terms in the database using the following command:
    `CREATE CONSTRAINT go_constraint FOR (n:go_term) REQUIRE n.id IS UNIQUE;`

8. Import *D. rerio* [protein interactome](https://github.com/Reed-CompBio/protein-weaver/blob/database-tutorial/data/tutorial/zfish_interactome_Mar12_2024.txt) with the following command:
```js
:auto LOAD CSV WITH HEADERS FROM 'file:///zfish_interactome_Mar12_2024.txt' AS zfish
FIELDTERMINATOR '\t'
CALL {
    with zfish
    MERGE (a:protein {id: zfish.uniprotID1, name: zfish.name1, txid: "txid7955", species: "Danio rerio"})
    MERGE (b:protein {id: zfish.uniprotID2, name: zfish.name2, txid: "txid7955", species: "Danio rerio"})
    MERGE (a)-[r:ProPro]-(b)
} IN TRANSACTIONS OF 100 ROWS;
```

9. Set a relationship property for the evidence
```js
:auto LOAD CSV WITH HEADERS FROM 'file:///zfish_interactome_Mar12_2024.txt' AS zfish
FIELDTERMINATOR '\t'
CALL {
    with zfish
    MATCH (s:protein {id: zfish.uniprotID1, txid: "txid7955"})-[r:ProPro]-(t:protein {id: zfish.uniprotID2, txid: "txid7955"})
    SET r.evidence = zfish.evidence
} IN TRANSACTIONS OF 1000 ROWS;
```

10. Add [GO data](https://github.com/Reed-CompBio/protein-weaver/blob/database-tutorial/data/tutorial/zfish_GO_data_Mar12_24.tsv) to *D. rerio* nodes:
```js
:auto LOAD CSV WITH HEADERS FROM 'file:///zfish_GO_data_Mar12_24.tsv' AS zfishgo
FIELDTERMINATOR '\t'
CALL {
    with zfishgo
    MATCH (n:protein {id: zfishgo.GENE_PRODUCT_ID, txid: "txid7955"})
    MERGE (g:go_term {id: zfishgo.GO_TERM})
    MERGE (n)-[r:ProGo]-(g)
} IN TRANSACTIONS OF 1000 ROWS;
```

12. Set qualifier property for *D. rerio*.
```js
:auto LOAD CSV WITH HEADERS FROM 'file:///zfish_GO_data_Mar12_24.tsv' AS zfishgo
FIELDTERMINATOR '\t'
CALL {
    with zfishgo
    MATCH (p:protein {id: zfishgo.GENE_PRODUCT_ID, txid: "txid7955"})-[r:ProGo]-(g:go_term {id: zfishgo.GO_TERM})
    SET r.relationship = zfishgo.QUALIFIER
} IN TRANSACTIONS OF 1000 ROWS;
```

13. The last step is calling a graph projection for pathfinding algorithms. We also have to change the ProPro edges to be undirected for the pathfinding algorithms in order to be more biologically accurate for protein-protein interaction networks.
```js
CALL gds.graph.project('proGoGraph',['go_term', 'protein'],['ProGo', 'ProPro']);
CALL gds.graph.relationships.toUndirected( 'proGoGraph', {relationshipType: 'ProPro', mutateRelationshipType: 'ProProUndirected'} ) YIELD inputRelationships, relationshipsWritten;
```

### Useful Commands:

1. Drop graph projection:
`CALL gds.graph.drop('proGoGraph') YIELD graphName;`

2. Drop constraints:
`DROP CONSTRAINT txid_constraint;`
`DROP CONSTRAINT go_constraint;`

3. Delete nodes:
`MATCH (n:protein {txid: 'txid7955'}) DETACH DELETE n;`

4. Show database information:
`:schema`

## Create a New Query in Neo4j
Now that you have imported the _D. rerio_ interaction network and annotations. It's time to explore the network and generate a new interesting query to you.

### First practice with some example commands:

1. Count how many nodes there are in the database:
`MATCH (n) RETURN COUNT(n);`

2. Now count how many protein nodes there are:
`MATCH (n:protein) RETURN COUNT(n);`

3. Return the first 25 nodes in the zebrafish txid:
`MATCH (n:protein {txid: 'txid7955'}) RETURN n LIMIT 25;`

4. Retrieve all the species in the database:
`MATCH (n:protein) RETURN COLLECT(DISTINCT n.species);`

5. Find nodes with a ProGo relationship (limit 25):
`MATCH (p)-[r:ProGo]->(g) RETURN p, r, g LIMIT 25;`

6. Return the relationship qualifier property for the ProGo relationship (limit 25):
`MATCH (p)-[r:ProGo]->(g) RETURN r.relationship LIMIT 25;`

7. Update property of existing node (for fun):
`MATCH (n:protein {species: 'Danio rerio'}) SET n.species = 'Ranio derio';`

8. Set species property back to proper one:
`MATCH (n:protein {species: 'Ranio derio'}) SET n.species = 'Danio rerio';`

9. Now it is your turn to devise a new Cypher query. Your query should end in a RETURN statement rather than change a property. We will use this query in the next step to create a new webpage that returns and presents the results of this query on ProteinWeaver's user interface.

## Create a New Page with Query