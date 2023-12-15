**How to get started with Neo4j and upload the data**
1. Create a directory in your $HOME named `neo4j`
 - Within `~/neo4j` directory create the following directories:
    - `~/neo4j/data/` to allow storage of data between docker instances
    - `~/neo4j/logs/` to allow storage of logs between docker instances
    - `~/neo4j/import/` to import data
        - Load any FlyBase data by copying `interactome-flybase-collapsed-weighted.txt`
        into import directory
        	- Delete 'sy#' preceding the first column name in `interactome-flybase-collapsed-weighted.txt`
        - Import the properly formatted GO terms file from FlyBase and store in the GitHub repository: `gene_association.fb`.
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
    --env NEO4J_PLUGINS='["graph-data-science"]' \
    neo4j:latest
```
- This docker instance has no security restrictions, to change username and password edit:
    `--env NEO4J_AUTH=username/password`

3. Access the docker image at http://localhost:7474/

4. Create constraints before data import. We use NCBI as the source of the unique taxon identifiers.
    `CREATE CONSTRAINT txid_constraint FOR (n:protein) REQUIRE (n.txid, n.id) IS UNIQUE;`

5. Import data for D. melanogaster using the following command:
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

6. Set a relationship property for the PubmedID
```
:auto LOAD CSV WITH HEADERS FROM 'file:///interactome-flybase-collapsed-weighted.txt' AS fly
FIELDTERMINATOR '\t'
CALL {
    with fly
    MATCH (s:protein {id: fly.FlyBase1, txid:"txid7227"})-[r:ProPro]-(t:protein {id: fly.FlyBase2, txid: "txid7227"})
    SET r.pubmed_id = fly.PubMedIDs
} IN TRANSACTIONS OF 1000 ROWS;
```

6. Create a constraint for the GO terms in the database using the following command:
    `CREATE CONSTRAINT go_constraint FOR (n:go_term) REQUIRE n.id IS UNIQUE;`

7. Import the Gene Ontology data into the database using the following command:
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

8. Import the relationships qualifiers for the GO terms and fly proteins using the following commands:
```
:auto LOAD CSV WITH HEADERS FROM 'file:///gene_association.fb' AS flygo
FIELDTERMINATOR '\t'
CALL {
    with flygo
    MATCH (p:protein {id: flygo.db_object_id, txid:"txid7227"})-[r:ProGo]-(g:go_term {id: flygo.go_id})
    SET r.relationship = flygo.qualifier
} IN TRANSACTIONS OF 1000 ROWS;
```

9. Import B. subtilis data with the following command:
```
:auto LOAD CSV WITH HEADERS FROM 'file:///bsub_interactome.csv' AS bsub
CALL {
    with bsub
    MERGE (a:protein {id: bsub.protein_1_locus, name: bsub.protein_1_name, txid: "txid224308", species: "Bacillus subtilis 168"})
    MERGE (b:protein {id: bsub.protein_2_locus, name: bsub.protein_2_name, txid: "txid224308", species: "Bacillus subtilis 168"})
    MERGE (a)-[r:ProPro]-(b)
} IN TRANSACTIONS OF 100 ROWS;
```

10. Add GoPro relationships to B. subtilis nodes:
```
:auto LOAD CSV WITH HEADERS FROM 'file:///bsub_GO_data.csv' AS bsubgo
CALL {
    with bsubgo
    MATCH (n:protein {id: bsubgo.locus, txid: "txid224308"})
    MERGE (g:go_term {id: bsubgo.go_term})
    MERGE (n)-[r:ProGo]-(g)
} IN TRANSACTIONS OF 1000 ROWS;
```

11. Set qualifier property for B. subtilis.
```
:auto LOAD CSV WITH HEADERS FROM 'file:///bsub_GO_data.csv' AS bsubgo
CALL {
    with bsubgo
    MATCH (p:protein {id: bsubgo.locus, txid: "txid224308"})-[r:ProGo]-(g:go_term {id: bsubgo.go_term})
    SET r.relationship = bsubgo.qualifier
} IN TRANSACTIONS OF 1000 ROWS;
```

12. Import D. rerio data with the following command:
```
:auto LOAD CSV WITH HEADERS FROM 'file:///zfish_interactome.txt' AS zfish
FIELDTERMINATOR '\t'
CALL {
    with zfish
    MERGE (a:protein {id: zfish.uniprotID1, name: zfish.name1, alt_name: zfish.alt_name1, txid: "txid7955", species: "Danio rerio"})
    MERGE (b:protein {id: zfish.uniprotID2, name: zfish.name2, alt_name: zfish.alt_name2, txid: "txid7955", species: "Danio rerio"})
    MERGE (a)-[r:ProPro]-(b)
} IN TRANSACTIONS OF 100 ROWS;
```

13. Add GoPro relationships to D. rerio nodes:
```
:auto LOAD CSV WITH HEADERS FROM 'file:///zfish_GO_data.tsv' AS zfishgo
FIELDTERMINATOR '\t'
CALL {
    with zfishgo
    MATCH (n:protein {id: zfishgo.GENE_PRODUCT_ID, txid: "txid7955"})
    MERGE (g:go_term {id: zfishgo.GO_TERM})
    MERGE (n)-[r:ProGo]-(g)
} IN TRANSACTIONS OF 1000 ROWS;
```

14. Set qualifier property for D. rerio.
```
:auto LOAD CSV WITH HEADERS FROM 'file:///zfish_GO_data.tsv' AS zfishgo
FIELDTERMINATOR '\t'
CALL {
    with zfishgo
    MATCH (p:protein {id: zfishgo.GENE_PRODUCT_ID, txid: "txid7955"})-[r:ProGo]-(g:go_term {id: zfishgo.GO_TERM})
    SET r.relationship = zfishgo.QUALIFIER
} IN TRANSACTIONS OF 1000 ROWS;
```

15. Prepare the GO term common names for import with the instructions in the `ParseOBOtoTXT.ipynb` file.

16. Import the GO term common names and descriptions with the following Cypher command:
```
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
17. Import the GO hierarchy with the following command:

```
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

18. Don't forget to call the graph before running queries using the following command:
```
CALL gds.graph.project(
'proGoGraph',
['go_term', 'protein'],
['ProGo', 'ProPro']
)
```