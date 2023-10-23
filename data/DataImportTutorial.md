**How to get started with Neo4j and upload the FlyBase data**
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
    --name testneo4j \
    -p7474:7474 -p7687:7687 \
    -v $HOME/neo4j/data:/data \
    -v $HOME/neo4j/logs:/logs \
    -v $HOME/neo4j/import:/import \
    -v $HOME/neo4j/plugins:/plugins \
    --env NEO4J_AUTH=none \
    -e NEO4J_apoc_export_file_enabled=true \
    -e NEO4J_apoc_import_file_enabled=true \
    -e NEO4J_apoc_import_file_use__neo4j__config=true \
    -e NEO4J_PLUGINS=\[\"apoc-extended\"\] \
    -e NEO4J_dbms_security_procedures_unrestricted=apoc.\\\* \
    neo4j:latest
```
- This docker instance has no security restrictions, to change username and password edit:
    `--env NEO4J_AUTH=username/password`

3. Access the docker image at http://localhost:7474/

4. Create constraints before data import.
    `CREATE CONSTRAINT fly_constraint FOR (n:txid7227) REQUIRE n.id IS UNIQUE;`

5. Import data using the following command:
```js
:auto LOAD CSV WITH HEADERS FROM 'file:///interactome-flybase-collapsed-weighted.txt' AS flybase
FIELDTERMINATOR '\t'
CALL {
    with flybase
    MERGE (a:txid7227 {id: flybase.FlyBase1, name: flybase.symbol1})
    MERGE (b:txid7227 {id: flybase.FlyBase2, name: flybase.symbol1})
    MERGE (a)-[r:ProPro]-(b)
} IN TRANSACTIONS OF 100 ROWS;
```
- This will create all of the protein-protein relationships and populate the database.

6. Create a constraint for the GO terms in the database using the following command:
    `CREATE CONSTRAINT go_constraint FOR (n:go_term) REQUIRE n.id IS UNIQUE;`

7. Import the Gene Ontology data into the database using the following command:
```js
:auto LOAD CSV WITH HEADERS FROM 'file:///gene_association.fb' AS flygo
FIELDTERMINATOR '\t'
CALL {
    with flygo
    MATCH (n:txid7227 {id: flygo.db_object_id})
    MERGE (g:go_term {id: flygo.go_id})
    MERGE (n)-[r:ProGo]-(g)
} IN TRANSACTIONS OF 1000 ROWS;
```

8. Import the common names of the proteins using the following command:
```
:auto LOAD CSV WITH HEADERS FROM 'file:///interactome-flybase-collapsed-weighted.txt' AS flybase
FIELDTERMINATOR '\t'
CALL {
    with flybase
    MATCH (n:txid7227 {id: flybase.FlyBase1})
    SET n.name = flybase.symbol1
    with flybase
    MATCH (p:txid7227 {id: flybase.FlyBase2})
    SET p.name = flybase.symbol2
} IN TRANSACTIONS OF 1000 ROWS;
```


9. Import the relationships for the GO terms and proteins using the following commands:
```
:auto LOAD CSV WITH HEADERS FROM 'file:///gene_association.fb' AS flygo
FIELDTERMINATOR '\t'
CALL {
    with flygo
    MATCH (p:txid7227 {id: flygo.db_object_id})-[r:ProGo]-(g:go_term {id: flygo.go_id})
    SET r.relationship = flygo.qualifier
} IN TRANSACTIONS OF 1000 ROWS;
```

10. Prepare the GO term common names for import with the instructions in the `ParseOBOtoTXT.ipynb` file.

11. Import the GO term common names and descriptions with the following Cypher command:
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

12. Import B. subtilis data with the following command:
```
:auto LOAD CSV WITH HEADERS FROM 'file:///bsub_interactome.csv' AS bsub
CALL {
    with bsub
    MERGE (a:txid224308 {id: bsub.protein_1_locus, name: bsub.protein_1_name})
    MERGE (b:txid224308 {id: bsub.protein_2_locus, name: bsub.protein_2_name})
    MERGE (a)-[r:ProPro]-(b)
} IN TRANSACTIONS OF 100 ROWS;
```

13. Add GoPro relationships to B. subtilis nodes:
```
:auto LOAD CSV WITH HEADERS FROM 'file:///bsub_GO_data.csv' AS bsubgo
CALL {
    with bsubgo
    MATCH (n:txid224308 {id: bsubgo.locus})
    MERGE (g:go_term {id: bsubgo.go_term})
    MERGE (n)-[r:ProGo]-(g)
} IN TRANSACTIONS OF 1000 ROWS;
```

14. Set qualifier property for B. subtilis.
```
:auto LOAD CSV WITH HEADERS FROM 'file:///bsub_GO_data.csv' AS bsubgo
CALL {
    with bsubgo
    MATCH (p:txid224308 {id: bsubgo.locus})-[r:ProGo]-(g:go_term {id: bsubgo.go_term})
    SET r.relationship = bsubgo.qualifier
} IN TRANSACTIONS OF 1000 ROWS;
```
