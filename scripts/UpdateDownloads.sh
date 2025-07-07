#!/bin/bash

# List of TXIDs
TXIDS=("txid6239" "txid7227" "txid7955" "txid224308" "txid559292" "txid3702" "txid511145")
# TXIDS=("txid511145")

# Import directory
IMPORT_DIR="$HOME/neo4j/import"

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
sleep 120
echo "Neo4j started."

# Function to download CSVs for each TXID
download_csvs() {
    local txid=$1
    local downloads_dir="../data/Downloads/$txid"

    echo "Downloading CSVs for $txid..."
    if [ ! -f "DownloadCSV-$txid.cypher" ]; then
        echo "Error: 'DownloadCSV-$txid.cypher' file not found."
        exit 1
    fi
    cat DownloadCSV-$txid.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j

    echo "Copying downloaded CSVs for $txid from $IMPORT_DIR to $downloads_dir..."
    mkdir -p "$downloads_dir"
    cp "$IMPORT_DIR"/"$txid"-protein_protein_interaction.csv "$IMPORT_DIR"/"$txid"-regulatory_interaction.csv "$IMPORT_DIR"/"$txid"-direct_go_annotation.csv "$IMPORT_DIR"/"$txid"-go_annotation.csv "$downloads_dir" 2>/dev/null

    if [ $? -eq 0 ]; then
        echo "CSVs for $txid successfully copied to $downloads_dir."
    else
        echo "Error: Failed to copy CSVs for $txid from $IMPORT_DIR."
        exit 1
    fi
}

# Function to merge CSVs for each TXID
merge_csv() {
    local txid=$1
    local downloads_dir="../data/Downloads/$txid"
    local ppi="$downloads_dir/$txid-protein_protein_interaction.csv"
    local reg="$downloads_dir/$txid-regulatory_interaction.csv"
    local mixed="$downloads_dir/$txid-mixed_interaction.csv"

    echo "Merging CSVs for $txid in $downloads_dir..."
    if [ -f "$ppi" ] && [ -f "$reg" ]; then
        cat "$ppi" <(tail -n +2 "$reg")> "$mixed"
        echo "Merged CSV created for $txid: $mixed"
    else
        echo "Error: One or both input CSV files are missing for $txid ($ppi, $reg)."
        exit 1
    fi
}

# Loop through each TXID
for txid in "${TXIDS[@]}"; do
    echo "Processing TXID: $txid"
    download_csvs "$txid"
    merge_csv "$txid"
    echo "Completed processing for TXID: $txid"
done