#!/bin/bash

# Execute Cypher query to create constraints within Neo4j database
echo "Creating constraints"
cat ProteinWeaverConstraints.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j

# Execute Cypher query to import D. melanogaster data within Neo4j database
echo "Importing TXID: 7227"
cat DataImportTXID7227.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j

# Execute Cypher query to import B. subtilis data within Neo4j database
echo "Importing TXID: 224308"
cat DataImportTXID224308.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j

# Execute Cypher query to import D. rerio data within Neo4j database
echo "Importing TXID: 7955"
cat DataImportTXID7955.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j

# Execute Cypher query to import D. rerio data within Neo4j database
echo "Importing GO hierarchy"
cat DataImportGO.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j

# Execute Cypher query to propagate ancestral edges, remove self ProPro edges, and add node degree within Neo4j database
echo "Propagating ancestral edges"
cat AncestralEdges.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j

# Execute Cypher query to call graph projection within Neo4j database
echo "Calling graph projection"
cat CallGraphProjection.cypher | docker exec --interactive proteinweaver cypher-shell -u neo4j

# End of script
echo "Script execution completed."