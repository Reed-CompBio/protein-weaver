**How to get started with Neo4j and upload the FlyBase data**
1. Create a directory in your $HOME named `neo4j`
 - Within `~/neo4j` directory create the following directories:
    - `~/neo4j/data/` to allow storage of data between docker instances
    - `~/neo4j/logs/` to allow storage of logs between docker instances
    - `~/neo4j/import/` to import data
        - Load any FlyBase data by copying `interactome-flybase-collapsed-weighted.txt`
        into import directory
        - Import the GO terms using the following command:

        `wget ftp://ftp.flybase.net/releases/current/precomputed_files/go/gene_association.fb.gz ~/neo4j/import`

        - Unzip the .gz before continuing.
        - Remove the first few lines from the file that do not contain the data.
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
    `CREATE CONSTRAINT FOR (n:txid7227) REQUIRE n.id IS UNIQUE;`

5. Import data using the following command:
```js
:auto LOAD CSV WITH HEADERS FROM 'file:///interactome-flybase-collapsed-weighted.txt' AS flybase
FIELDTERMINATOR '\t'
CALL {
    with flybase
    MERGE (a:txid7227 {id: flybase.FlyBase1})
    MERGE (b:txid7227 {id: flybase.FlyBase2})
    MERGE (a)-[r:ProPro]-(b)
} IN TRANSACTIONS OF 1000 ROWS
```
- This will create all of the protein-protein relationships and populate the database.

6. Create a constraint for the GO terms in the database using the following command:
    `CREATE CONSTRAINT FOR (n:go_term) REQUIRE n.id IS UNIQUE;`

7. Import the Gene Ontology data in chunks of 10000 for all 133824 rows into the database using the following command:
```js
:auto LOAD CSV FROM 'file:///gene_association.fb' AS flygo
FIELDTERMINATOR '\t'
WITH flygo
SKIP 0  // Adjust the starting point for each batch (10000 next time)
LIMIT 10000  // The number of rows to import in each batch
CALL {
    with flygo
    MERGE (g:go_term {id: flygo[4]})
    MERGE (f:txid7227 {id: flygo[1], go: flygo[4]})
    MERGE (f)-[r:ProGo]-(g)
} IN TRANSACTIONS OF 100 ROWS
```
