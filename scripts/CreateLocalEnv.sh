#!/bin/bash

# Activate conda environment first before running script (conda activate protein-weaver)
# Open Docker Desktop before running this script
# Replace $LOCALPATH with your local path
LOCALPATH=$HOME/Desktop/GitHub_Repos/bio-net-viz/protein-weaver

# Define paths that match your personal environment
CLIENT=$LOCALPATH/client
SERVER=$LOCALPATH/server
SCRIPTS=$LOCALPATH/scripts

wait_for_neo4j() {
    # Wait for Neo4j to start (adjust sleep time as needed)
    echo "Waiting for Neo4j to start..."
    sleep 120
    echo "Neo4j started."
}

# Check if the Docker container already exists
if [ "$(docker ps -q -f name=proteinweaver)" ]; then
    echo "Container 'proteinweaver' is already running."
elif [ "$(docker ps -aq -f name=proteinweaver)" ]; then
    echo "Container 'proteinweaver' already exists. Starting the container..."
    docker start proteinweaver
    wait_for_neo4j
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
    wait_for_neo4j
fi

# Execute Cypher query within Neo4j database
echo "Calling graph projection"
cd $SCRIPTS
cat CallGraphProjection.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j

# Start server
echo "Starting server..."
cd $SERVER
npm start &
echo "Server started."

# Start client
echo "Starting client..."
cd $CLIENT
npm run dev &
echo "Client started..."

# End of script
echo "ProteinWeaver is available at http://localhost:5173/"
echo "Script execution completed."