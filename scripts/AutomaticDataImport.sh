#!/bin/bash

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
echo "Neo4j started."

# Execute Cypher query to create constraints within Neo4j database
echo "Creating constraints.."
cat ProteinWeaverConstraints.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j
echo "Constraints created."

# Execute Cypher query to import D. melanogaster data within Neo4j database
echo "Importing TXID: 7227..."
cat DataImportTXID7227.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j
echo "TXID: 7227 imported"

# Execute Cypher query to import B. subtilis data within Neo4j database
echo "Importing TXID: 224308..."
cat DataImportTXID224308.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j
echo "TXID: 224308 imported"

# Execute Cypher query to import D. rerio data within Neo4j database
echo "Importing TXID: 7955..."
cat DataImportTXID7955.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j
echo "TXID: 7955 imported"

# Execute Cypher query to import D. rerio data within Neo4j database
echo "Importing GO hierarchy..."
cat DataImportGO.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j
echo "GO hierarchy imported."

# Execute Cypher query to propagate ancestral edges, remove self ProPro edges, and add node degree within Neo4j database
echo "Propagating ancestral edges..."
cat AncestralEdges.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j
echo "Edges propogated."

# Execute Cypher query to call graph projection within Neo4j database
echo "Calling graph projection..."
cat CallGraphProjection.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j
echo "Projection created."

# End of script
echo "Script execution completed."