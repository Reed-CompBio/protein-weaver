# Data Import Tutorial

**NOTE: NEVER MERGE THIS BRANCH. This tutorial will show you how to import a protein interaction and gene association dataset into Neo4j. To get to the local dev state you will need to follow the import process in the main branch.**

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

**NOTE: NEVER MERGE THIS BRANCH.**