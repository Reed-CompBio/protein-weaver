
## How to get started with Neo4j and upload the data

1. Create a directory in your $HOME named `neo4j`

- Within `~/neo4j` directory create the following directories:
  - `~/neo4j/data/` to allow storage of data between docker instances
  - `~/neo4j/logs/` to allow storage of logs between docker instances
  - `~/neo4j/import/` to import data
    - Load any FlyBase data by copying [`interactome-flybase-collapsed-weighted.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DrosophilaMelanogaster/interactome-flybase-collapsed-weighted.txt)
      into import directory - Delete 'sy#' preceding the first column name in `interactome-flybase-collapsed-weighted.txt`
    - Import the properly formatted GO terms file from FlyBase and store in the GitHub repository: [`gene_association.fb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DrosophilaMelanogaster/gene_association.fb).
  - `~/neo4j/plugins/` to store any necessary plugins for production environments

2. Download all the content of [`/import`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/) and place it inside of your `~/neo4j/import/`. These are all the prerequisite files you will need for this tutorial.

3. Create a docker instance with APOC plugin using the following command:

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

4. Access the docker image at [http://localhost:7474](http://localhost:7474)

5. Create constraints before data import. We use NCBI as the source of the unique taxon identifiers.
   `CREATE CONSTRAINT txid_constraint FOR (n:protein) REQUIRE (n.txid, n.id) IS UNIQUE;`
   Create a constraint for the GO terms in the database using the following command:
   `CREATE CONSTRAINT go_constraint FOR (n:go_term) REQUIRE n.id IS UNIQUE;`

6. Import _D. melanogaster_ [protein interactome](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/interactome-flybase-collapsed-weighted.txt) using the following command:

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///interactome-flybase-collapsed-weighted.txt' AS fly
FIELDTERMINATOR '\t'
CALL {
    with fly
    MERGE (a:protein {id: fly.FlyBase1, name: fly.symbol1, txid: "txid7227", species: "Drosophila melanogaster"})
    MERGE (b:protein {id: fly.FlyBase2, name: fly.symbol2, txid: "txid7227", species: "Drosophila melanogaster"})
    MERGE (a)-[r:ProPro]-(b)
} IN TRANSACTIONS OF 100 ROWS;
```

- This will create all of the protein-protein relationships and populate the database.

7. Set a relationship property for the PubmedID

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///interactome-flybase-collapsed-weighted.txt' AS fly
FIELDTERMINATOR '\t'
CALL {
    with fly
    MATCH (s:protein {id: fly.FlyBase1, txid:"txid7227"})-[r:ProPro]-(t:protein {id: fly.FlyBase2, txid: "txid7227"})
    SET r.pubmed_id = fly.PubMedIDs
} IN TRANSACTIONS OF 1000 ROWS;
```

8. Import the Gene Ontology data, [gene_association.fb](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/gene_association.fb), into the database using the following command:

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///gene_association.fb' AS flygo
FIELDTERMINATOR '\t'
CALL {
    with flygo
    MATCH (n:protein {id: flygo.db_object_id, txid:"txid7227"})
    MERGE (g:go_term {id: flygo.go_id})
    MERGE (n)-[r:ProGo]-(g)
} IN TRANSACTIONS OF 1000 ROWS;
```

9. Import the relationships qualifiers for the GO terms and fly proteins using the following commands:

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///gene_association.fb' AS flygo
FIELDTERMINATOR '\t'
CALL {
    with flygo
    MATCH (p:protein {id: flygo.db_object_id, txid:"txid7227"})-[r:ProGo]-(g:go_term {id: flygo.go_id})
    SET r.relationship = flygo.qualifier
} IN TRANSACTIONS OF 1000 ROWS;
```

10. Import _B. subtilis_ [protein interactome](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/bsub_interactome.csv) with the following command:

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///bsub_interactome.csv' AS bsub
CALL {
    with bsub
    MERGE (a:protein {id: bsub.protein_1_locus, name: bsub.protein_1_name, txid: "txid224308", species: "Bacillus subtilis 168"})
    MERGE (b:protein {id: bsub.protein_2_locus, name: bsub.protein_2_name, txid: "txid224308", species: "Bacillus subtilis 168"})
    MERGE (a)-[r:ProPro]-(b)
} IN TRANSACTIONS OF 100 ROWS;
```

11. Add [GO data](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/bsub_GO_data.csv) to _B. subtilis_ nodes:

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///bsub_GO_data.csv' AS bsubgo
CALL {
    with bsubgo
    MATCH (n:protein {id: bsubgo.locus, txid: "txid224308"})
    MERGE (g:go_term {id: bsubgo.go_term})
    MERGE (n)-[r:ProGo]-(g)
} IN TRANSACTIONS OF 1000 ROWS;
```

12. Set qualifier property for _B. subtilis_.

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///bsub_GO_data.csv' AS bsubgo
CALL {
    with bsubgo
    MATCH (p:protein {id: bsubgo.locus, txid: "txid224308"})-[r:ProGo]-(g:go_term {id: bsubgo.go_term})
    SET r.relationship = bsubgo.qualifier
} IN TRANSACTIONS OF 1000 ROWS;
```

13. Download and import the [GO hierarchy]https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/is_a_import.tsv) using the commands below. This is made from the script [ParseOntologyRelationship.ipynb](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ParseOntologyRelationship.ipynb) if you are interested.

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///is_a_import.tsv' AS go
FIELDTERMINATOR '\t'
CALL {
    with go
    MERGE (a:go_term {id: go.id})
    MERGE (b:go_term {id: go.id2})
    MERGE (a)-[r:GoGo]->(b)
    SET r.relationship = go.is_a
} IN TRANSACTIONS OF 100 ROWS;
```

14. Download and import the [GO term common names](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/go.txt) and descriptions with the Cypher commands below. This file is made from the script [ParseOBOtoTXT.ipynb](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ParseOBOtoTXT.ipynb) if you are interested.

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///go.txt' AS go
FIELDTERMINATOR '\t'
CALL {
    with go
    MATCH (n:go_term {id: go.id})
    SET n.name = go.name,
    n.namespace = go.namespace,
    n.def = go.def
} IN TRANSACTIONS OF 1000 ROWS;
```

### March 18, 2024 Major Data Update

Don't forget to drop the existing projection before adding more data.
`call gds.graph.drop("proGoGraph") YIELD graphName`

1. Import more [GO data](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/dmel_GO_data_Mar15_24.tsv) for _D. melanogaster_

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///dmel_GO_data_Mar15_24.tsv' AS dmelgo
FIELDTERMINATOR '\t'
CALL {
    with dmelgo
    MATCH (n:protein {id: dmelgo.FB_ID, txid: "txid7227"})
    MERGE (g:go_term {id: dmelgo.GO_TERM})
    MERGE (n)-[r:ProGo]-(g)
} IN TRANSACTIONS OF 1000 ROWS;
```

2. Set qualifier property for _D. melanogaster_.

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///dmel_GO_data_Mar15_24.tsv' AS dmelgo
FIELDTERMINATOR '\t'
CALL {
    with dmelgo
    MATCH (p:protein {id: dmelgo.FB_ID, txid: "txid7227"})-[r:ProGo]-(g:go_term {id: dmelgo.GO_TERM})
    SET r.relationship = dmelgo.QUALIFIER
} IN TRANSACTIONS OF 1000 ROWS;
```

3. Import more [GO data](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/bsub_GO_data_Mar18_24.tsv) for _B. subtilis_

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///bsub_GO_data_Mar18_24.tsv' AS bsubgo
FIELDTERMINATOR '\t'
CALL {
    with bsubgo
    MATCH (n:protein {id: bsubgo.BSU_ID, txid: "txid224308"})
    MERGE (g:go_term {id: bsubgo.GO_TERM})
    MERGE (n)-[r:ProGo]-(g)
} IN TRANSACTIONS OF 1000 ROWS;
```

4. Set qualifier property for _B. subtilis_.

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///bsub_GO_data_Mar18_24.tsv' AS bsubgo
FIELDTERMINATOR '\t'
CALL {
    with bsubgo
    MATCH (p:protein {id: bsubgo.BSU_ID, txid: "txid224308"})-[r:ProGo]-(g:go_term {id: bsubgo.GO_TERM})
    SET r.relationship = bsubgo.QUALIFIER
} IN TRANSACTIONS OF 1000 ROWS;
```

5. Import _D. rerio_ [protein interactome](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/zfish_interactome_Mar12_2024.txt) with the following command:

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

7. Add [GO data](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/zfish_GO_data_Mar12_24.tsv) to _D. rerio_ nodes:

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///zfish_GO_data_2024-04-03.tsv' AS zfishgo
FIELDTERMINATOR '\t'
CALL {
    with zfishgo
    MATCH (n:protein {id: zfishgo.GENE_PRODUCT_ID, txid: "txid7955"})
    MERGE (g:go_term {id: zfishgo.GO_TERM})
    MERGE (n)-[r:ProGo]-(g)
} IN TRANSACTIONS OF 1000 ROWS;
```

8. Set qualifier property for _D. rerio_.

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///zfish_GO_data_2024-04-03.tsv' AS zfishgo
FIELDTERMINATOR '\t'
CALL {
    with zfishgo
    MATCH (p:protein {id: zfishgo.GENE_PRODUCT_ID, txid: "txid7955"})-[r:ProGo]-(g:go_term {id: zfishgo.GO_TERM})
    SET r.relationship = zfishgo.QUALIFIER
} IN TRANSACTIONS OF 1000 ROWS;
```

9. Import the GO hierarchy with the following command:

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///is_a_import.tsv' AS go
FIELDTERMINATOR '\t'
CALL {
    with go
    MERGE (a:go_term {id: go.id})
    MERGE (b:go_term {id: go.id2})
    MERGE (a)-[r:GoGo]->(b)
    SET r.relationship = go.is_a
} IN TRANSACTIONS OF 100 ROWS;
```

10. Import the GO term common names and descriptions with the following Cypher command:

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///go.txt' AS go
FIELDTERMINATOR '\t'
CALL {
    with go
    MATCH (n:go_term {id: go.id})
    SET n.name = go.name,
    n.namespace = go.namespace,
    n.def = go.def
} IN TRANSACTIONS OF 1000 ROWS;
```

### Mar. 28, 2024

1. Add blacklist indicator to GO term nodes from [new dataset](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/go_2024-03-28.txt):

```js
:auto LOAD CSV WITH HEADERS FROM 'file:///go_2024-03-28.txt' AS go
FIELDTERMINATOR '\t'
CALL {
    with go
    MATCH (n:go_term {id: go.id})
    SET n.never_annotate = go.never_annotate
} IN TRANSACTIONS OF 1000 ROWS;
```

### April. 1, 2024

- We added inferred ProGo edges from descendant ProGo edges. This means that proteins annotated to a specific GO term, such as Mbs to enzyme inhibitor activity, will also be annotated to that GO term's ancestors, such as molecular function inhibitor activity and molecular_function. We need to create more ProGo edges across all the species using the following commands:

1. Add ancestral edges for _D. rerio_.

```js
MATCH (p:protein {txid: 'txid7955'})-[:ProGo]-(g:go_term)
WITH p, collect(g) AS go_terms

UNWIND go_terms as go_input
MATCH (p)-[:ProGo]-(g:go_term {id: go_input.id})-[:GoGo*]->(g2)
WITH p, collect(distinct g2) AS parent_terms
UNWIND parent_terms AS parent_term

MERGE (p)-[r:ProGo]-(parent_term)
```

2. Add ancestral edges for _B. subtilis_.

```js
MATCH (p:protein {txid: 'txid224308'})-[:ProGo]-(g:go_term)
WITH p, collect(g) AS go_terms

UNWIND go_terms as go_input
MATCH (p)-[:ProGo]-(g:go_term {id: go_input.id})-[:GoGo*]->(g2)
WITH p, collect(distinct g2) AS parent_terms
UNWIND parent_terms AS parent_term

MERGE (p)-[r:ProGo]-(parent_term)
```

3. Add ancestral edges for _D. melanogaster_.

```js
MATCH (p:protein {txid: 'txid7227'})-[:ProGo]-(g:go_term)
WITH p, collect(g) AS go_terms

UNWIND go_terms as go_input
MATCH (p)-[:ProGo]-(g:go_term {id: go_input.id})-[:GoGo*]->(g2)
WITH p, collect(distinct g2) AS parent_terms
UNWIND parent_terms AS parent_term

MERGE (p)-[r:ProGo]-(parent_term)
```

4. Add qualifiers for new ProGo edges.

```js
MATCH (p:protein)-[r:ProGo]-(g:go_term)
WHERE r.relationship IS NULL
SET r.relationship = "inferred_from_descendant"
```

| Species         | Relationships Added |
| --------------- | :------------------ |
| D. Melanogaster | 415,493             |
| B. Subtilis     | 39,215              |
| D.Rerio         | 86,304              |
| Total           | 541,012             |

### Call the graph projection

```js
CALL gds.graph.project('proGoGraph',['go_term', 'protein'],['ProGo', 'ProPro']);
CALL gds.graph.relationships.toUndirected( 'proGoGraph', {relationshipType: 'ProPro', mutateRelationshipType: 'ProProUndirected'} ) YIELD inputRelationships, relationshipsWritten;
```

# Verify Guide

Once you have completed the guide, you can use the following query to verify that the database matches the most updated version (AS OF 05/06/2024).

```
match (fly:protein {txid :"txid7227"})
WITH COUNT(fly) AS flyCount
match (bsub:protein {txid :"txid224308"})
WITH flyCount, COUNT(bsub) AS bsubCount
match (drerio:protein {txid :"txid7955"})
WITH flyCount, bsubCount, COUNT(drerio) AS drerioCount
match (go:go_term)
WITH flyCount, bsubCount, drerioCount, COUNT(go) AS goCount
match (fly1 {txid :"txid7227"}) -[flyProPro:ProPro]- (fly2 {txid :"txid7227"})
WITH flyCount, bsubCount, drerioCount, goCount, COUNT(flyProPro)/2 AS flyProProCount
match (bsub1 {txid :"txid224308"}) -[bsubProPro:ProPro]- (bsub2 {txid :"txid224308"})
WITH flyCount, bsubCount, drerioCount, goCount, flyProProCount, COUNT(bsubProPro)/2 AS bsubProProCount
match (drerio1 {txid :"txid7955"}) -[drerioProPro:ProPro]- (drerio2 {txid :"txid7955"})
WITH flyCount, bsubCount, drerioCount, goCount, flyProProCount, bsubProProCount, COUNT(drerioProPro)/2 AS drerioProProProCount
match (go1:go_term) -[goGoGo:GoGo]- (go2:go_term)
WITH flyCount, bsubCount, drerioCount, goCount, flyProProCount, bsubProProCount, drerioProProProCount, COUNT(goGoGo) AS goGoGoCount
match (fly:protein {txid :"txid7227"}) -[flyProGo:ProGo]- (go)
WITH flyCount, bsubCount, drerioCount, goCount, flyProProCount, bsubProProCount, drerioProProProCount, goGoGoCount, COUNT(flyProGo) AS flyProGoCount
match (bsub:protein {txid :"txid224308"}) -[bsubProGo:ProGo]- (go)
WITH flyCount, bsubCount, drerioCount, goCount, flyProProCount, bsubProProCount, drerioProProProCount, goGoGoCount,flyProGoCount, COUNT(bsubProGo) AS bsubProGoCount
match (drerio:protein {txid :"txid7955"}) -[drerioProGo:ProGo]- (go)
WITH flyCount, bsubCount, drerioCount, goCount, flyProProCount, bsubProProCount, drerioProProProCount, goGoGoCount,flyProGoCount, bsubProGoCount, COUNT(drerioProGo) AS drerioProGoCount
RETURN flyCount, bsubCount, drerioCount, goCount, flyProProCount, bsubProProCount, drerioProProProCount, goGoGoCount,flyProGoCount, bsubProGoCount,drerioProGoCount
```

You should get the following output

```
╒════════╤═════════╤═══════════╤═══════╤══════════════╤═══════════════╤════════════════════╤═══════════╤═════════════╤══════════════╤════════════════╕
│flyCount│bsubCount│drerioCount│goCount│flyProProCount│bsubProProCount│drerioProProProCount│goGoGoCount│flyProGoCount│bsubProGoCount│drerioProGoCount│
╞════════╪═════════╪═══════════╪═══════╪══════════════╪═══════════════╪════════════════════╪═══════════╪═════════════╪══════════════╪════════════════╡
│11501   │1394     │6438       │42858  │233054        │2715           │45018               │136616     │513425       │48705         │108758          │
└────────┴─────────┴───────────┴───────┴──────────────┴───────────────┴────────────────────┴───────────┴─────────────┴──────────────┴────────────────┘
```

### Useful Commands

Delete nodes:
`MATCH (n:protein {txid: "example", species: "example"}) DETACH DELETE n`

Drop constraints:
`DROP CONSTRAINT constraint`

Drop graph projection:
`CALL gds.graph.drop('proGoGraph') YIELD graphName`

Show database information:
`:schema`
