**How to get started with Neo4j and upload the FlyBase data**
1. Create a directory in your $HOME named `neo4j`
 - Within `~/neo4j` directory create the following directories:
    - `~/neo4j/data/` to allow storage of data between docker instances
    - `~/neo4j/logs/` to allow storage of logs between docker instances
    - `~/neo4j/import/` to import data
        - Load any FlyBase data by copying `interactome-flybase-collapsed-weighted.txt`
        into import directory
        	- Delete 'sy#' preceding the first column name in `interactome-flybase-collapsed-weighted.txt`
        - Import the properly formatted GO terms file `gene_association.fb` from the GitHub repository.
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