#!/bin/bash

# Define paths that match your personal environment
CLIENT=$HOME/Desktop/GitHub_Repos/protein-weaver/client
SERVER=$HOME/Desktop/GitHub_Repos/protein-weaver/server

# Check if the Docker container already exists
if [ "$(docker ps -aq -f name=proteinweaver)" ]; then
    echo "Container 'proteinweaver' already exists. Starting the container..."
    docker start proteinweaver
else
    echo "Container 'proteinweaver' does not exist. Creating and starting a new container..."
    docker run \
        -d \
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
fi

# Wait for Neo4j to start (adjust sleep time as needed)
echo "Waiting for Neo4j to start..."
sleep 60

# Execute Cypher query within Neo4j database
echo "Calling graph projection"
cat CallGraphProjection.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j

# Start server
echo "Starting server..."
cd $SERVER
npm start &

# Start client
echo "Starting client..."
cd $CLIENT
npm run dev &

# End of script
echo "Script execution completed."