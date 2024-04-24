# Data Import Tutorial

**NOTE: This tutorial will show you how to import a protein interaction and gene association dataset into Neo4j. To get to the local dev state you will need to follow the import process in the main branch.**

## How to get started with Neo4j and upload the data
1. Create a directory in your `$HOME` named `neo4j`
 - Within `~/neo4j` directory create the following directories:
    - `~/neo4j/data/` to allow storage of data between docker instances
    - `~/neo4j/logs/` to allow storage of logs between docker instances
    - `~/neo4j/import/` to import data
        - Add Zebrafish gene association and interactome datasets to this directory from the GitHub `/data/tutorial/` directory.
    - `~/neo4j/plugins/` to store any necessary plugins for production environments

2. Create a docker instance with APOC plugin using the following command:
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
    neo4j:latest
```
- This docker instance has no security restrictions, to change username and password edit:
    `--env NEO4J_AUTH=username/password`

3. Access the docker image at [http://localhost:7474](http://localhost:7474)

4. Once in the Neo4j Browser, create constraints before data import. We use NCBI as the source of the unique taxon identifiers.
    `CREATE CONSTRAINT txid_constraint FOR (n:protein) REQUIRE (n.txid, n.id) IS UNIQUE;`
    Create a constraint for the GO terms in the database using the following command:
    `CREATE CONSTRAINT go_constraint FOR (n:go_term) REQUIRE n.id IS UNIQUE;`

5. Import *D. rerio* [protein interactome](https://github.com/Reed-CompBio/protein-weaver/blob/database-tutorial/data/tutorial/zfish_interactome_Mar12_2024.txt) with the following command:
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

6. Set a relationship property for the evidence
```js
:auto LOAD CSV WITH HEADERS FROM 'file:///zfish_interactome_Mar12_2024.txt' AS zfish
FIELDTERMINATOR '\t'
CALL {
    with zfish
    MATCH (s:protein {id: zfish.uniprotID1, txid: "txid7955"})-[r:ProPro]-(t:protein {id: zfish.uniprotID2, txid: "txid7955"})
    SET r.evidence = zfish.evidence
} IN TRANSACTIONS OF 1000 ROWS;
```

7. Add [GO data](https://github.com/Reed-CompBio/protein-weaver/blob/database-tutorial/data/tutorial/zfish_GO_data_Mar12_24.tsv) to *D. rerio* nodes:
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

8. Set qualifier property for *D. rerio*.
```js
:auto LOAD CSV WITH HEADERS FROM 'file:///zfish_GO_data_Mar12_24.tsv' AS zfishgo
FIELDTERMINATOR '\t'
CALL {
    with zfishgo
    MATCH (p:protein {id: zfishgo.GENE_PRODUCT_ID, txid: "txid7955"})-[r:ProGo]-(g:go_term {id: zfishgo.GO_TERM})
    SET r.relationship = zfishgo.QUALIFIER
} IN TRANSACTIONS OF 1000 ROWS;
```

### Call the graph projection
```js
CALL gds.graph.project(
  'proGoGraph',
  {
    go_term: {
      label: 'go_term'
    },
    protein: {
      label: 'protein'
    }
  },
  {
    ProGo: {
      type: 'ProGo',
      orientation: 'NATURAL',
      properties: {}
    },
    ProPro: {
      type: 'ProPro',
      orientation: 'UNDIRECTED',
      properties: {}
    }
  }
);
```

## Now practice some example commands:

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

7. Update property of existing node:
`MATCH (n:protein {species: 'Danio rerio'}) SET n.species = 'Ranio derio';`


### Useful Commands to Reset the Database:
**Do these before attempting full database import**

1. Drop graph projection:
`CALL gds.graph.drop('proGoGraph') YIELD graphName;`

2. Drop constraints:
`DROP CONSTRAINT txid_constraint;`
`DROP CONSTRAINT go_constraint;`

3. Delete nodes:
`MATCH (n:protein {txid: 'txid7955'}) DETACH DELETE n;`

### Other Commands:

1. Show database information:
`:schema`