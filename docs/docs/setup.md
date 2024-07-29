# Setup
The setup guide will include instructions for creating the front and backenbd local dev environments (database, server, and client).

## Backend Database
ProteinWeaver uses a Dockerized version of Neo4j as the database. [Follow these instructions](https://docs.docker.com/get-docker/) to install Docker Desktop. Once installed continue with the following steps:

1. Pull the official Neo4j Docker image in terminal:
`docker pull neo4j`

2. Create a directory in your `$HOME` named `neo4j`

    - Within `~/neo4j` directory create the following directories:
        - `~/neo4j/data/` to allow storage of database state between Docker instances
        - `~/neo4j/logs/` to allow storage of logs between Docker instances
        - `~/neo4j/import/` to store data for import
        - `~/neo4j/plugins/` to store any necessary plugins for production environments

3. Download the most recent datasets from the [`/import`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/) directory on GitHub and place them inside of your `~/neo4j/import/` local directory. These are all the prerequisite files you will need for this tutorial and will be updated as new versions are released.

4. Create a Docker instance with GDS and APOC plugins using the following command:

        ```bash
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

    - This example Docker instance has no security restrictions, to set a username and password edit this line in the previous command:
        `--env NEO4J_AUTH=username/password`

5. Access the Docker image at [http://localhost:7474](http://localhost:7474). You will need to input the username and password you defined in the `run` command.

6. Create constraints before data import. We use NCBI as the source of the unique taxon identifiers:

        ```cypher
        CREATE CONSTRAINT txid_constraint FOR (n:protein) REQUIRE (n.txid, n.id) IS UNIQUE;
        CREATE CONSTRAINT go_constraint FOR (n:go_term) REQUIRE n.id IS UNIQUE;
        ```

##### _D. melanogaster_ imports
1. Import _D. melanogaster_ [protein interactome](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/interactome-flybase-collapsed-weighted.txt) using the following command:

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///interactome-flybase-collapsed-weighted.txt' AS fly
        FIELDTERMINATOR '\t'
        CALL {
            with fly
            MERGE (a:protein {id: fly.FlyBase1, name: fly.symbol1, txid: "txid7227", species: "Drosophila melanogaster"})
            MERGE (b:protein {id: fly.FlyBase2, name: fly.symbol2, txid: "txid7227", species: "Drosophila melanogaster"})
            MERGE (a)-[r:ProPro]-(b)
        } IN TRANSACTIONS OF 100 ROWS;
        ```

2. Set the alt_name parameter as the same as the name.

        ```cypher
        MATCH (n:protein {txid: "txid7227"}) SET n.alt_name = n.name;
        ```

3. Import the first batch of _D. melanogaster_ [GO data from FlyBase](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/gene_association_fb_2024-04-03.tsv) into the database using the following command:

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///gene_association_fb_2024-04-03.tsv' AS flygo
        FIELDTERMINATOR '\t'
        CALL {
            with flygo
            MATCH (n:protein {id: flygo.db_object_id, txid:"txid7227"})
            MERGE (g:go_term {id: flygo.go_id})
            MERGE (n)-[r:ProGo]-(g)
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

4. Import the relationships qualifiers for the first batch of GO terms and _D. melanogaster_ proteins using the following commands:

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///gene_association_fb_2024-04-03.tsv' AS flygo
        FIELDTERMINATOR '\t'
        CALL {
            with flygo
            MATCH (p:protein {id: flygo.db_object_id, txid:"txid7227"})-[r:ProGo]-(g:go_term {id: flygo.go_id})
            SET r.relationship = flygo.qualifier
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

5. Import more [GO data](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/dmel_GO_data_2024-04-03.tsv) for _D. melanogaster_.

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///dmel_GO_data_2024-04-03.tsv' AS dmelgo
        FIELDTERMINATOR '\t'
        CALL {
            with dmelgo
            MATCH (n:protein {id: dmelgo.FB_ID, txid: "txid7227"})
            MERGE (g:go_term {id: dmelgo.GO_TERM})
            MERGE (n)-[r:ProGo]-(g)
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

6. Set second batch of qualifier properties for _D. melanogaster_.

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///dmel_GO_data_2024-04-03.tsv' AS dmelgo
        FIELDTERMINATOR '\t'
        CALL {
            with dmelgo
            MATCH (p:protein {id: dmelgo.FB_ID, txid: "txid7227"})-[r:ProGo]-(g:go_term {id: dmelgo.GO_TERM})
            SET r.relationship = dmelgo.QUALIFIER
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

##### _B. subtilis_ imports
1. Import _B. subtilis_ [protein interactome](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/file:///bsub_interactome_2024-05-31.txt) with the following command:

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///interactome_txid224308_2024-06-06.txt' AS bsub
        FIELDTERMINATOR '\t'
        CALL {
        with bsub
        MERGE (a:protein {id: bsub.protein_1_locus, name: bsub.protein_1_name, alt_name: bsub.protein_1_alt_name, txid: "txid224308", species: "Bacillus subtilis 168"})
        MERGE (b:protein {id: bsub.protein_2_locus, name: bsub.protein_2_name, alt_name: bsub.protein_2_alt_name, txid: "txid224308", species: "Bacillus subtilis 168"})
        MERGE (a)-[r:ProPro]-(b)
        } IN TRANSACTIONS OF 100 ROWS;
        ```

2. Add first batch of [GO data from SubtiWiki](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/bsub_GO_data.csv) to _B. subtilis_ nodes:

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///bsub_GO_data.csv' AS bsubgo
        CALL {
            with bsubgo
            MATCH (n:protein {id: bsubgo.locus, txid: "txid224308"})
            MERGE (g:go_term {id: bsubgo.go_term})
            MERGE (n)-[r:ProGo]-(g)
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

3. Set qualifier property from first batch of GO data for _B. subtilis_.

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///bsub_GO_data.csv' AS bsubgo
        CALL {
            with bsubgo
            MATCH (p:protein {id: bsubgo.locus, txid: "txid224308"})-[r:ProGo]-(g:go_term {id: bsubgo.go_term})
            SET r.relationship = bsubgo.qualifier
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

4. Import more [GO data](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/annotations_txid224308_2024-06-03.txt) for _B. subtilis_.

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///annotations_txid224308_2024-06-03.txt' AS bsubgo
        FIELDTERMINATOR '\t'
        CALL {
            with bsubgo
            MATCH (n:protein {id: bsubgo.BSU_ID, txid: "txid224308"})
            MERGE (g:go_term {id: bsubgo.GO_TERM})
            MERGE (n)-[r:ProGo]-(g)
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

5. Set qualifier property for second batch of GO data (_B. subtilis_).

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///annotations_txid224308_2024-06-03.txt' AS bsubgo
        FIELDTERMINATOR '\t'
        CALL {
            with bsubgo
            MATCH (p:protein {id: bsubgo.BSU_ID, txid: "txid224308"})-[r:ProGo]-(g:go_term {id: bsubgo.GO_TERM})
            SET r.relationship = bsubgo.QUALIFIER
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

##### _D. rerio_ imports
1. Import _D. rerio_ [protein interactome](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/interactome_txid7955_2024-06-24.txt) with the following command:

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///interactome_txid7955_2024-06-24.txt' AS zfish
        FIELDTERMINATOR '\t'
        CALL {
            with zfish
            MERGE (a:protein {id: zfish.uniprotID1, name: zfish.name1, alt_name: zfish.alt_name1, txid: "txid7955", species: "Danio rerio"})
            MERGE (b:protein {id: zfish.uniprotID2, name: zfish.name2, alt_name: zfish.alt_name2, txid: "txid7955", species: "Danio rerio"})
            MERGE (a)-[r:ProPro]-(b)
        } IN TRANSACTIONS OF 100 ROWS;
        ```

2. Add [GO data](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/zfish_GO_data_2024-04-03.tsv) to _D. rerio_ nodes:

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///zfish_GO_data_2024-04-03.tsv' AS zfishgo
        FIELDTERMINATOR '\t'
        CALL {
            with zfishgo
            MATCH (n:protein {id: zfishgo.GENE_PRODUCT_ID, txid: "txid7955"})
            MERGE (g:go_term {id: zfishgo.GO_TERM})
            MERGE (n)-[r:ProGo]-(g)
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

3. Set qualifier property for _D. rerio_.

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///zfish_GO_data_2024-04-03.tsv' AS zfishgo
        FIELDTERMINATOR '\t'
        CALL {
            with zfishgo
            MATCH (p:protein {id: zfishgo.GENE_PRODUCT_ID, txid: "txid7955"})-[r:ProGo]-(g:go_term {id: zfishgo.GO_TERM})
            SET r.relationship = zfishgo.QUALIFIER
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

##### Gene Ontology hierarchy imports
1. Import the [GO hierarchy](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/is_a_import.tsv) with the following command:

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///is_a_import_2024-07-17.tsv' AS go
        FIELDTERMINATOR '\t'
        CALL {
            with go
            MERGE (a:go_term {id: go.id})
            MERGE (b:go_term {id: go.id2})
            MERGE (a)-[r:GoGo]->(b)
            SET r.relationship = go.is_a
        } IN TRANSACTIONS OF 100 ROWS;
        ```

2. Import the [GO term common names and descriptions](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/Import/go_2024-03-28.txt) with the following Cypher command:

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///go_2024-07-17.txt' AS go
        FIELDTERMINATOR '\t'
        CALL {
            with go
            MATCH (n:go_term {id: go.id})
            SET n.name = go.name,
            n.namespace = go.namespace,
            n.def = go.def
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

3. Add blacklist indicator to GO term nodes:

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///go_2024-07-17.txt' AS go
        FIELDTERMINATOR '\t'
        CALL {
            with go
            MATCH (n:go_term {id: go.id})
            SET n.never_annotate = go.never_annotate
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

##### Propogation of ancestral ProGo edges
1. Add ancestral edges for _D. rerio_.

        ```cypher
        MATCH (p:protein {txid: 'txid7955'})-[:ProGo]-(g:go_term)
        WITH p, collect(g) AS go_terms
        
        UNWIND go_terms as go_input
        MATCH (p)-[:ProGo]-(g:go_term {id: go_input.id})-[:GoGo*]->(g2)
        WITH p, collect(distinct g2) AS parent_terms
        UNWIND parent_terms AS parent_term
        
        MERGE (p)-[r:ProGo]-(parent_term)
        ```

2. Add ancestral edges for _B. subtilis_.

        ```cypher
        MATCH (p:protein {txid: 'txid224308'})-[:ProGo]-(g:go_term)
        WITH p, collect(g) AS go_terms

        UNWIND go_terms as go_input
        MATCH (p)-[:ProGo]-(g:go_term {id: go_input.id})-[:GoGo*]->(g2)
        WITH p, collect(distinct g2) AS parent_terms
        UNWIND parent_terms AS parent_term

        MERGE (p)-[r:ProGo]-(parent_term)
        ```

3. Add ancestral edges for _D. melanogaster_.

        ```cypher
        MATCH (p:protein {txid: 'txid7227'})-[:ProGo]-(g:go_term)
        WITH p, collect(g) AS go_terms
        
        UNWIND go_terms as go_input
        MATCH (p)-[:ProGo]-(g:go_term {id: go_input.id})-[:GoGo*]->(g2)
        WITH p, collect(distinct g2) AS parent_terms
        UNWIND parent_terms AS parent_term
        
        MERGE (p)-[r:ProGo]-(parent_term)
        ```

4. Add qualifiers for new ProGo edges for each species.

        ```cypher
        MATCH (p:protein  {txid: 'txid7227'})-[r:ProGo]-(g:go_term)
        WHERE r.relationship IS NULL
        SET r.relationship = "inferred_from_descendant"
        ```

        ```cypher
        MATCH (p:protein {txid: 'txid224308'})-[r:ProGo]-(g:go_term)
        WHERE r.relationship IS NULL
        SET r.relationship = "inferred_from_descendant"
        ```

        ```cypher
        MATCH (p:protein {txid: 'txid7955'})-[r:ProGo]-(g:go_term)
        WHERE r.relationship IS NULL
        SET r.relationship = "inferred_from_descendant"
        ```

5. Now remove all the Protein-Protein edges from the same protein to itself with the following command (these edges may causes issues with our path algorithms).

        ```cypher
        MATCH (p:protein)-[rel:ProPro]-(p) DETACH DELETE rel;
        ```

6. Now remove obsolete/disconnected GO terms:

        ```cypher
        MATCH (g:go_term)
        WHERE NOT (g)-[:GoGo]-()
        DETACH DELETE g
        ```

7. Now add the degree for all nodes for each species as a property:

        ```cypher
        MATCH (pr:protein{txid: "txid224308"})
        SET pr.degree = COUNT{(pr)-[:ProPro]-(:protein)}

        MATCH (pr:protein{txid: "txid7955"})
        SET pr.degree = COUNT{(pr)-[:ProPro]-(:protein)}

        MATCH (pr:protein{txid: "txid7227"})
        SET pr.degree = COUNT{(pr)-[:ProPro]-(:protein)}
        ```

8. The last step is calling a graph projection for pathfinding algorithms. We also have to change the ProPro edges to be undirected for the pathfinding algorithms in order to be more biologically accurate for protein-protein interaction networks.

        ```cypher
        CALL gds.graph.project('proGoGraph',['go_term', 'protein'],['ProGo', 'ProPro']);
        CALL gds.graph.relationships.toUndirected( 'proGoGraph', {relationshipType: 'ProPro', mutateRelationshipType: 'ProProUndirected'} ) YIELD   inputRelationships, relationshipsWritten;
        ```

## Backend Server
The backend server is run using Express.js. To setup the server continue with the following steps:

1. Open a new terminal window and clone the ProteinWeaver GitHub repository. Locate the `server` directory:

        ```bash
        cd server
        ```

2. Next we need to install `node.js`, and the recommended way is to use a Node Version Manager. Follow the [NVM GitHub](https://github.com/nvm-sh/nvm) instructions before proceeding.

3. The correct version is outlined in the `.nvmrc` file in both of the client and server directories. Follow the command below to use the correct version.

        ```bash
        nvm use
        ```

4. If you do not have the correct version, install it with the following command:

        ```bash
        npm install
        ```

5. You can verify your node version is now correct with the following command:

        ```bash
        node -v
        ```

6. Finally, to start the server enter:

        ```bash
        npm start
        ```

7. The server should be running on [http://localhost:3000/](http://localhost:3000/). There are several APIs, and you can verify it works by using [http://localhost:3000/api/test](http://localhost:3000/api/test) which should output a JSON object. Please keep the terminal window open.

## Frontend Client
The client uses the `React.js` framework, and uses `Vite.js` as a bundler.

1. Open a new terminal window and navigate to the cloned ProteinWeaver Github repository. Locate the `client` directory with the following `bash` command:

        ```bash
        cd client
        ```

2. Similar to the backend server setup, we need to use and install the correct `node.js` version. Follow the command below to use the correct version.

        ```bash
        nvm use
        ```

4. If you do not have the correct version, install it with the following command:

        ```bash
        npm install
        ```

5. You can verify your node version is now correct with the following command:

        ```bash
        node -v
        ```

6. Lastly, start the client with the following command:

        ```bash
        npm run dev
        ```
ProteinWeaver should now be up and running on [http://localhost:5173/](http://localhost:5173/)!

## Verify Guide

Once you have completed the guide, you can use the following query to verify that the database matches the most updated version (AS OF 2024-05-06):


        ```cypher
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
        WITH flyCount, bsubCount, drerioCount, goCount, flyProProCount, bsubProProCount, COUNT(drerioProPro)/2 AS drerioProProCount
        match (go1:go_term) -[goGoGo:GoGo]- (go2:go_term)
        WITH flyCount, bsubCount, drerioCount, goCount, flyProProCount, bsubProProCount, drerioProProCount, COUNT(goGoGo)/2 AS goGoGoCount
        match (fly:protein {txid :"txid7227"}) -[flyProGo:ProGo]- (go)
        WITH flyCount, bsubCount, drerioCount, goCount, flyProProCount, bsubProProCount, drerioProProCount, goGoGoCount, COUNT(flyProGo) AS flyProGoCount
        match (bsub:protein {txid :"txid224308"}) -[bsubProGo:ProGo]- (go)
        WITH flyCount, bsubCount, drerioCount, goCount, flyProProCount, bsubProProCount, drerioProProCount, goGoGoCount,flyProGoCount, COUNT(bsubProGo) AS bsubProGoCount
        match (drerio:protein {txid :"txid7955"}) -[drerioProGo:ProGo]- (go)
        WITH flyCount, bsubCount, drerioCount, goCount, flyProProCount, bsubProProCount, drerioProProCount, goGoGoCount,flyProGoCount, bsubProGoCount, COUNT(drerioProGo) AS drerioProGoCount
        RETURN flyCount, flyProProCount, flyProGoCount, bsubCount, bsubProProCount, bsubProGoCount, drerioCount, drerioProProCount, drerioProGoCount, goCount, goGoGoCount
        ```

You should get the following output:

        ```
        ╒════════╤══════════════╤═════════════╤═════════╤═══════════════╤══════════════╤═══════════╤═════════════════╤════════════════╤═══════╤═══════════╕
        │flyCount│flyProProCount│flyProGoCount│bsubCount│bsubProProCount│bsubProGoCount│drerioCount│drerioProProCount│drerioProGoCount│goCount│goGoGoCount│
        ╞════════╪══════════════╪═════════════╪═════════╪═══════════════╪══════════════╪═══════════╪═════════════════╪════════════════╪═══════╪═══════════╡
        │11501   │233054        │482391       │1933     │6441           │59510         │6438       │45003            │103139          │42231  │66168      │
        └────────┴──────────────┴─────────────┴─────────┴───────────────┴──────────────┴───────────┴─────────────────┴────────────────┴───────┴───────────┘
        ```

## Useful Commands

* Delete nodes:
`MATCH (n:protein {txid: "example", species: "example"}) DETACH DELETE n`

* Drop constraints:
`DROP CONSTRAINT constraint`

* Drop graph projection:
`CALL gds.graph.drop('proGoGraph') YIELD graphName`

* Show database information:
`:schema`
