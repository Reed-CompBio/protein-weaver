#!/bin/bash

# Function to display usage
usage() {
    echo "Usage: $0 [-a | -s txid1,txid2,...]"
    echo "  -a       Import all species and data (default)"
    echo "  -s       Import specific species using comma-separated TXIDs (e.g. 7227,7955)"
    exit 1
}

# Parse command-line arguments
IMPORT_ALL=true
SPECIFIC_TXIDS=""

while getopts ":as:" opt; do
    case $opt in
        a)
            IMPORT_ALL=true
            ;;
        s)
            IMPORT_ALL=false
            SPECIFIC_TXIDS=$OPTARG
            ;;
        \?)
            usage
            ;;
    esac
done

# Check if Docker container already exists
if [ "$(docker ps -aq -f name=proteinweaver)" ]; then
    if [ "$(docker ps -q -f name=proteinweaver)" ]; then
        echo "Container 'proteinweaver' is already running."
    else
        echo "Container 'proteinweaver' exists but is not running. Starting the container..."
        docker start proteinweaver
        # Wait for Neo4j to start (adjust sleep time as needed)
		echo "Waiting for Neo4j to start..."
		sleep 90
		echo "Neo4j started."
    fi
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
    # Wait for Neo4j to start (adjust sleep time as needed)
	echo "Waiting for Neo4j to start..."
	sleep 60
	echo "Neo4j started."
	
	# Create constraints
	echo "Creating constraints.."
	cat ProteinWeaverConstraints.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j
	echo "Constraints created."
fi


# Function to import data by TXID
import_data_by_txid() {
    local txid=$1
    echo "Importing TXID: $txid..."
    cat DataImportTXID${txid}.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j
    echo "TXID: $txid imported"
}

# Import data based on the provided options
if [ "$IMPORT_ALL" = true ]; then
    import_data_by_txid 7227
    import_data_by_txid 224308
    import_data_by_txid 7955
    import_data_by_txid 6239
    import_data_by_txid 559292
    import_data_by_txid 3702
else
    IFS=',' read -ra TXID_ARRAY <<< "$SPECIFIC_TXIDS"
    for txid in "${TXID_ARRAY[@]}"; do
        import_data_by_txid $txid
    done
fi

echo "Importing GO hierarchy..."
cat DataImportGO.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j
echo "GO hierarchy imported."

# Propagate ancestral edges
echo "Propagating ancestral edges..."
cat AncestralEdges.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j
echo "Edges propagated."

# Call graph projection
echo "Calling graph projection..."
cat CallGraphProjection.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j
echo "Projection created."

# End of script
echo "Script execution completed."