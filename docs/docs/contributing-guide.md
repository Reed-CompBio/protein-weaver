# Contributing Guide

This is the guide for getting started with ProteinWeaver and will set you up to contribute to whichever aspects of ProteinWeaver interest you.

## Step 1: Fork & Installation

ProteinWeaver uses a Dockerized version of Neo4j as the database. [Follow these instructions](https://docs.docker.com/get-docker/) to install Docker Desktop.

We will also be using GitHub to contribute to ProteinWeaver. It is recommended to install [GitHub Desktop](https://docs.github.com/en/desktop/installing-and-authenticating-to-github-desktop/installing-github-desktop) because of its easy user interface.

Then you will need to [fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) the [`contributing-guide`](https://github.com/Reed-CompBio/protein-weaver/tree/contributing-guide) branch of the ProteinWeaver GitHub repository to get the Zebrafish datasets and the base code for the front and backends in your own repository.

Once forked, clone the repository to your local desktop so that you have access to ProteinWeaver locally.

## Step 2: Data Import

The following section will be using a [`bash`](<https://en.wikipedia.org/wiki/Bash_(Unix_shell)>) terminal to set up the Dockerized Neo4j environment.

1. Open the Docker Desktop application.

2. Navigate to a terminal window and pull the official Neo4j Docker image with the following command:

      
      `docker pull neo4j`
        

3. Create a folder in your root directory named `neo4j`:

        - Within the new `~/neo4j` directory create the following directories:
          - `~/neo4j/data/` to allow storage of database state between Docker instances
          - `~/neo4j/logs/` to allow storage of logs between Docker instances
          - `~/neo4j/import/` to store data for import
          - `~/neo4j/plugins/` to store any necessary plugins for production environments

4. Copy over all of the files in the cloned ProteinWeaver `/data/tutorial` directory to `~/neo4j/import/`.

5. Create a Neo4j Docker instance with GDS and APOC plugins using the following command:

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

      - This docker instance has no security restrictions, to change username and password edit: <br>`--env NEO4J_AUTH=username/password`

6. Access the docker image at [http://localhost:7474](http://localhost:7474) in your browser.

7. Once in the Neo4j Browser, create constraints before data import. We use NCBI as the source of the unique taxon identifiers.

    Create a constraint for the proteins in the database, requiring that only one instance of each protein exists: <br>
   `CREATE CONSTRAINT txid_constraint FOR (n:protein) REQUIRE (n.txid, n.id) IS UNIQUE;`

    Create a constraint for the GO terms in the database using the following command: <br>
   `CREATE CONSTRAINT go_constraint FOR (n:go_term) REQUIRE n.id IS UNIQUE;`

8. Import _D. rerio_ [protein interactome](https://github.com/Reed-CompBio/protein-weaver/blob/database-tutorial/data/tutorial/zfish_interactome_Mar12_2024.txt) with the following command:

        ```cypher
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

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///zfish_interactome_Mar12_2024.txt' AS zfish
        FIELDTERMINATOR '\t'
        CALL {
            with zfish
            MATCH (s:protein {id: zfish.uniprotID1, txid: "txid7955"})-[r:ProPro]-(t:protein {id: zfish.uniprotID2, txid: "txid7955"})
            SET r.evidence = zfish.evidence
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

10. Add [GO data](https://github.com/Reed-CompBio/protein-weaver/blob/database-tutorial/data/tutorial/zfish_GO_data_Mar12_24.tsv) to _D. rerio_ nodes:

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///zfish_GO_data_Mar12_24.tsv' AS zfishgo
        FIELDTERMINATOR '\t'
        CALL {
            with zfishgo
            MATCH (n:protein {id: zfishgo.GENE_PRODUCT_ID, txid: "txid7955"})
            MERGE (g:go_term {id: zfishgo.GO_TERM})
            MERGE (n)-[r:ProGo]-(g)
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

11. Set qualifier property for _D. rerio_.

        ```cypher
        :auto LOAD CSV WITH HEADERS FROM 'file:///zfish_GO_data_Mar12_24.tsv' AS zfishgo
        FIELDTERMINATOR '\t'
        CALL {
            with zfishgo
            MATCH (p:protein {id: zfishgo.GENE_PRODUCT_ID, txid: "txid7955"})-[r:ProGo]-(g:go_term {id: zfishgo.GO_TERM})
            SET r.relationship = zfishgo.QUALIFIER
        } IN TRANSACTIONS OF 1000 ROWS;
        ```

12. The last step is calling a graph projection for pathfinding algorithms. We also have to change the ProPro edges to be undirected for the pathfinding algorithms in order to be more biologically accurate for protein-protein interaction networks.

        ```cypher
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

## Step 3: Create a New Query in Neo4j

Now that you have imported the _D. rerio_ interaction network and annotations. It's time to explore the network and generate a new interesting query to you.

### First practice with some example commands:

1. Count how many nodes there are in the database:<br>
        `MATCH (n) RETURN COUNT(n);`

2. Now count how many protein nodes there are:<br>
        `MATCH (n:protein) RETURN COUNT(n);`

3. Return the first 25 nodes in the zebrafish txid:<br>
        `MATCH (n:protein {txid: 'txid7955'}) RETURN n LIMIT 25;`

4. Retrieve all the species in the database:<br>
        `MATCH (n:protein) RETURN COLLECT(DISTINCT n.species);`

5. Find nodes with a ProGo relationship (limit 25):<br>
        `MATCH (p)-[r:ProGo]->(g) RETURN p, r, g LIMIT 25;`

6. Return the relationship qualifier property for the ProGo relationship (limit 25):<br>
        `MATCH (p)-[r:ProGo]->(g) RETURN r.relationship LIMIT 25;`

7. Update property of existing node (for fun):<br>
        `MATCH (n:protein {species: 'Danio rerio'}) SET n.species = 'Ranio derio';`

8. Set species property back to proper one:<br>
        `MATCH (n:protein {species: 'Ranio derio'}) SET n.species = 'Danio rerio';`

9. Now it is your turn to devise a new Cypher query. Your query should end in a RETURN statement rather than change a property. We will use this query in the next step to create a new webpage that returns and presents the results of this query on ProteinWeaver's user interface.

## Step 4: Setting up Local Development

Now that you have the Neo4j database up and running, and you have a query that you are interested in, we will now set up the frontend and backend for local development.

### Backend Server

1. Open up a terminal window and go to the `server` directory inside the `protein-weaver` directory.

2. We want to install `npm` which is responsible for building the necessary packages of the server. We will use a version manager for node, called `nvm`. This is helpful as it allows you to install multiple versions of node. More information about `nvm` can be found [here](https://github.com/nvm-sh/nvm). Enter the following commands in your terminal:

        ```bash
        export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

        nvm use

        nvm install

        npm install

        npm start # This starts our node.js server for our backend
        ```

3. If everything goes smoothly, you will get a message saying “Server listening on [http://localhost:3000/](http://localhost:3000/)”

4. If you also want to test that the API functionality is working, you can go to the following URL and it should say that you have successfully connected to the backend API: [http://localhost:3000/api/test](http://localhost:3000/api/test)

### Frontend

1. Open up another terminal window, and go to the `client` directory in the `protein-weaver` directory.

2. Enter the following commands in the terminal window:

        ```bash
        nvm use

        nvm install

        npm install

        npm run dev # This will start our frontend instance
        ```

3. If everything goes smoothly, you should be greeted with a message from VITE as well as a message indicating that it is running on [http://localhost:5173/](http://localhost:5173).

4. To summarize, we have set up Neo4j and populated the database with _D. rerio_, created a query that we are interested in, and then set up the backend and frontend of ProteinWeaver for local development. The three localhost URLs are found below:
      - Neo4j: [http://localhost:7474/browser/](http://localhost:7474/browser/)
      - Backend: [http://localhost:3000/api/test](http://localhost:3000/api/test) 
      - Frontend: [http://localhost:5173/](http://localhost:5173)

## Step 5: Create a New Page with Query

### Create New API Call

This section aims to create a new API call in the backend utilizing the Neo4j query you made previously. Before we start implementing a new API call, it is important to have a better understanding of what the backend codebase looks like for ProteinWeaver. We will go through the important files in the backend:

#### `/src`

Within the `server` directory, the `src` directory contains important files that sets up the node.js server. You will generally never need to make changes within this folder. `index.js` is responsible for initializing the node.js server and the Neo4j driver that will be used to make the connection to the database. The `neo4j.js` file contains the Neo4j driver. `constants.js` stores variables including ports, URLs, and Neo4j credentials.

#### `.env`

Within the `server` folder, we also have a file called `.env` which outlines the Neo4j credentials for authentication with our database.

#### `/routes`

The `routes` folder contains `routes.js` which houses all the API calls we use for ProteinWeaver. The router can take in multiple requests, including POST or GET requests. It is helpful to understand the general structure of setting up an API call, and we will use the example below. This API call is responsible for, given a list of nodes, providing us with the average degree value.

    ```js
    //Example of API call in routes.js

    router.post("/getAvgDegree", jsonParser, async (req, res, next) => {
      const data = req.body;
      const nodeList = data.nodeList;
      const species = data.species;

      try {
        const avgDegreeService = new AvgDegreeService(getDriver());

        const avgDegree = await avgDegreeService.getAvgDegree(species, nodeList);
        console.log("Average Degree:");
        console.log(avgDegree)
        res.json(avgDegree);
      } catch (e) {
        next(e);
      }
    });
    ```

  - We use the `route.post()` function to create a new POST API call.
  - It takes in three parameters, first the API call’s URL, the parser we use, and the request, response and next variables
  - The `req.body` holds the information that the API caller has provided. This usually comes in the form of a JSON request body, and in this case this if the following body:<br>
  `{"nodeList": ["FBgn0003731","FBgn0031972","FBgn0264492","FBgn0000499","FBgn0001139"],"species": "txid7227"}`
  - The "try-catch" statement is used to capture potential errors and throw them in an appropriate manner.
    - The `try` portion of the statement creates a new variable called `avgDegreeService` by using a class `AvgDegreeService`. This class is defined in a file called `avg.degree.service.js` in the `/services` folder, and it is responsible for utilizing the Neo4j driver, creating a query call with some parameters, and getting the response. The class contains the function `getAvgDegree` which takes in two parameters: `species` and `nodeList`.
    - We use the `await` key because this is a type of Promise. This essentially tells the program to wait until we get the output from the `avgDegreeService.getAvgDegree()` function.
  - Finally, we set the response in `res.json` to be the variable avgDegree

#### `/services`

The `services` folder contains the heart of all the dependent functions the `routes.js` file needs. This is where you will be adding a new `Neo4j` query as a function that will then be called into a new route in `routes.js`. Before that, it is helpful to understand the general structure of what a service file is, and we will use `avg.degree.service.js` as an example.

```js
//avg.degree.service.js file

export default class AvgDegreeService {
  /**
   * @type {neo4j.Driver}
   */
  driver;

  /**
   * The constructor expects an instance of the Neo4j Driver, which will be
   * used to interact with Neo4j.
   *
   * @param {neo4j.Driver} driver
   */
  constructor(driver) {
    this.driver = driver;
  }

  async getAvgDegree(speciesInput, nodeList) {
    const session = this.driver.session();
    const res = await session.executeRead((tx) =>
      tx.run(
        `
          MATCH (p:protein {txid: $speciesInput})
          WHERE p.id IN toStringList($nodeList)
          WITH p
          MATCH (p)-[r:ProPro]-()
          WITH p, count(r) as degree
          RETURN avg(degree) as averageDegree;
          `,
        {
          speciesInput: speciesInput,
          nodeList: nodeList,
        }
      )
    );

    const deg = res.records;

    await session.close();

    return deg;
  }
}

```

- This file creates a call called `AvgDegreeService`, and requires the Neo4j driver we initialized in `src/neo4j.js` as a variable in the constructor.
- We create an async method (which is why we need the await keyword when we call the method) called `getAvgDegree`, which takes in the two parameters.
- You first have to initialize the Neo4j driver session, and then we execute a read on the database with a Neo4j query.
- Everything inside `tx.run()` is where you place the Neo4j query. Notice that within the query, we use variables as the txid and the nodelist. These variables are paired in the portion after the Neo4j query.
- Finally we close the Neo4j session and return the `res.records` in a variable.


#### Testing API using Postman
![postman_example](https://github.com/Reed-CompBio/protein-weaver/assets/67818840/d3bd8851-39f6-4822-9ee5-d5235bf8dd6f)

We can test this API call in many ways but one that is common is using [Postman](https://www.postman.com/). Postman allows you to create API requests without the need of a frontend server. You can download the app or use the browser. We will test out the `getAvgDegree` API Call with the following steps: 

- Create a new workspace in Postman.
- Select POST as the request type, and use http://localhost:3000/api/getAvgDegree as the URL
- We need to set the body of the request. Navigate to the body tab and set the body as raw and JSON. Now use the following example as the input:<br>
`{"nodeList": ["FBgn0003731","FBgn0031972","FBgn0264492","FBgn0000499","FBgn0001139"],"species": "txid7227"}`
- When you are ready, click the send button. If it is successful you should get a "200 OK" response and within the response body a value of 354.4 for the average node degree.

Below includes a visualization that summarises the key parts of the backend server. Now that you have a better understanding about how API calls are made and how to test them, we can now implement a new API call that will use the Neo4j query you made previously.
![ProteinWeaver_Backend](https://github.com/Reed-CompBio/protein-weaver/assets/67818840/40e2d2c4-852b-4520-a75a-ea6d006adde6)

#### Adding new API Call

1. Create a new file in the service directory.
    - You can duplicate the `avg.degree.service.js` file and rename it to something that represents your query.
    - Within the file, rename the class name to something that represents your query.
    - Rename the method “getAvgDegree” to something that represents your query.
    - Change the parameters of the method to include what you need for your query (you may not need any in your parameters if you are hardcoding a query).
    - Place your Neo4j query inside of `tx.run()`.
    - You can delete the part where `speciesInput` and `nodeList` are paired if you do not have any parameters. If you do have parameters, make sure you pair the parameters properly with the Neo4j query.
    - You are now done with setting up your service file for your API call.

2. Create a new API call in `router.js`. 
    - You can use the `/getAvgDegree` API call as reference.
    - Set the API URL to a name that represents your query.
    - If your API call will need some parameters, set the correct variables in the request body, just like how `getAvgDegree` did it with `nodeList` and `species`.
    - Create a new instance of the service class you made previously like `AvgDegreeService` with the Neo4j driver.
    - Call your method in the service class, and making sure if you need the parameters, you order it correctly.
    - Finally make sure the `res.json` function has the correct variable.

3. Test out your API call using Postman
    - All API calls in ProteinWeaver go under the following url. Simply add your API call after the last backslash: http://localhost:3000/api/.
    - Ensure that you are setting the response as a POST response.
    - If you require parameters in your API call, make sure to set the body, configure as raw and JSON mode, and then ensure the JSON body is in the correct format (See the example previously when testing out Postman).
    - If you get a "200 OK" response and you’ve inspected the response body to what you expect, then you have completed the backend portion.

## Step: 6 Add a New Page
Now that we have linked the backend with the Neo4j database through the API call, we will create a React webpage with a button that lets a user execute our new query. Here is a general overview of adding a new page and a new API query:
![ProteinWeaver Frontend](https://github.com/Reed-CompBio/protein-weaver/assets/67818840/ef6e911f-83b0-4c70-869c-699e6544d9de)

1. Navigate to `client/src/pages` and create a new page named `NewPage.jsx`. Examine the other pages in this directory and copy the content from `TestingPage.jsx` into the blank `NewPage.jsx`. Replace `TestingPage()` with the name of the new page you created: `NewPage()`.

### Add Button to Execute Query
1. Navigate to `client/src/main.jsx` and add the `NewPage` component to the main website by importing it and creating a route. Import the component by adding this below the other import statements: `import NewPage from "./pages/NewPage.jsx";`. Copy one of the route snippets and replace the `path` and `element` with `"/newpage"` and `<NewPage />`.

2. Navigate to `client/src/components/` and add a new component by creating a page named `NewQuery.jsx`. This document will be where we add the API query and do other styling. Copy these imports to the top of the page and create the NewQuery component:

        ```js
        import React, { useState, useEffect } from "react";
        
        // create component
        export default function NewQuery() { };
        ```

3. Now go back to the first page you created `NewPage.jsx`. Import the NewQuery component with `import NewQuery from "../components/NewQuery.jsx";`. Within the central `<div></div>` add `<NewQuery />` to place the component within the NewPage.

4. Go to the previous Service that you created with your own Neo4j Query from earlier. Modify the `return` statement within the first `try` section of your service to `return network.records.map((record) => record.get('n'));` to extract only the data on the nodes that your query returned.

5. Finally, add a `useEffect` hook that will execute your API query when you load the page. Inside of the set of "{ }" brackets in `NewQuery() { }` copy the following code to execute your query on refresh:

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

1. Navigate to `client/src/components/NavBar.jsx` and copy one of the `<li></li>` snippets and paste it below another. Create a new link to your page by replacing the old link with ``<Link to={`/newpage`}>``.

2. Now rename the icon by typing "New" within the `<div></div>`.

3. Next, navigate to [https://react-icons.github.io/react-icons/](https://react-icons.github.io/react-icons/) and choose your favorite icon. I will be using the GiTigerHead icon for mine!

4. Add the relevant import statement to the top of the NavBar page:<br>
`import { GiTigerHead } from "react-icons/gi";`.

5. Finally, replace the icon component in the code that you copied from earlier with the name of the new one. In my case I put `<GiTigerHead />`.

Congratulations, you have now completed the contributing guide!