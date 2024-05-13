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

### Create New API Call

### Add a New Page
Now that we have linked the backend with the Neo4j database through the API call, we will create a React webpage with a button that lets a user execute our new query.

1. Navigate to `client/src/pages` and create a new page named `NewPage.jsx`. Examine the other pages in this directory and copy the content from `TestingPage.jsx` into the blank `NewPage.jsx`. Replace `TestingPage()` with the name of the new page you created: `NewPage()`.

2. Navigate to `client/src/main.jsx` and add the `NewPage` component to the main website by importing it and creating a route. Import the component by adding this below the other import statements: `import NewPage from "./pages/NewPage.jsx";`. Copy one of the route snippets and replace the `path` and `element` with `"/newpage"` and `<NewPage />`.

3. Navigate to `client/src/components/` and add a new component by creating a page named `NewQuery.jsx`. This document will be where we add the API query and do other styling. Copy these imports to the top of the page and create the NewQuery component:
```js
import React, { useState, useEffect } from "react";

// create component
export default function NewQuery() { };
```

4. Now go back to the first page you created `NewPage.jsx`. Import the NewQuery component with `import NewQuery from "../components/NewQuery.jsx";`. Within the central `<div></div>` add `<NewQuery />` to place the component within the NewPage.

5. Go to the previous Service that you created with your own Neo4j Query from earlier. Modify the `return` statement within the first `try` section of your service to `return network.records.map((record) => record.get('n'));` to extract only the data on the nodes that your query returned.

6. Finally, add a `useEffect` hook that will execute your API query when you load the page. Inside of the set of "{ }" brackets in `NewQuery() { }` copy the following code to execute your query on refresh:
```js
// create empty object to store query results
const [nodeNames, setNodeNames] = useState([]);

    // execute query on page reload
    useEffect(() => {
        fetch("/api/newQuery")
            .then((res) => res.json())
            .then((data) => {
                const names = data.map((item) => item.properties.name); // extract just names
                setNodeNames(names);
            })
            .catch((error) => {
                console.error("Error fetching network data:", error);
            });
    }, []);

    // display the node names in the console (right click and inspect element)
    console.log(nodeNames);
```
You can check the structure of your query response in the running `server` terminal. Using the object hierarchy displayed there, we extracted just the "name" property in the useEffect hook for displaying. You should now have a blank page at http://localhost:5173/newpage that allows you to see the names of the nodes returned by your Neo4j query in the console when you inspect the page element.

### Add Button to Execute Query
1. Now we will add the ability for users to execute the query on demand rather than when refreshing the page. To do this, first we will modify the useEffect statement and make it a function:
```js
// Function for submitting the query
async function handleNewQuery(e) {
        setNodeNames([]); // reset upon execution
        e.preventDefault(); // prevent default form submission

        // copied exactly from the useEffect statement
        fetch("/api/newQuery")
            .then((res) => res.json())
            .then((data) => {
                const names = data.map((item) => item.properties.name);
                setNodeNames(names);
            })
            .catch((error) => {
                console.error("Error fetching network data:", error);
            });

        // functions must return something, since we executed everything and assigned node names already we just return
        return;
    }
```

2. Next we will create a New Query button that executes our new function when clicked. Place this inside of the { } brackets of `NewQuery() { }` after everything else. A React component is like any other function, it must end in a return statement. The return statement holds everything that the user will actually interact with and is where we will style things as well.
```js
return (
        <div>
            <button onClick={handleNewQuery}>New Query</button>
        </div>
    );
```
Now we should have a button that will set the node results in the console only after we have pressed it.

3. Now lets display the information to the users without having to inspect the element. Copy the following code below the `<button></button>` inside of the `<div></div>`:
 ```js
{nodeNames.map((name, index) => (
                <p key={index}>{index + 1}: {name}</p>
            ))}
```
We are now displaying a list of the node names ordered by their index.

Congratulations, you have now created a new webpage with full connection to the Neo4j database!
### Add New Page Icon to NavBar
Let's finish off by doing some styling and adding a new icon to the NavBar.

1. Navigate to `client/src/components/NavBar.jsx` and copy one of the `<li></li>` snippets and paste it below another. Create a new link to your page by replacing the old link with `<Link to={`/newpage`}>`.

2. Now rename the icon by putting "New" within the `<div></div>`.

3. Finally navigate to https://react-icons.github.io/react-icons/ and choose your favorite icon. I will be using the GiTigerHead icon for mine! Add the relevant import statement to the top of the NavBar page: `import { GiTigerHead } from "react-icons/gi";`. Next replace the icon component in the code that you copied from earlier with the name of the new one. In my case I put `<GiTigerHead />`.

Congratulations, you have now completed the contributing guide!