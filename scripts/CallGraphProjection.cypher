CALL gds.graph.drop('proGoGraph') YIELD graphName;
CALL gds.graph.project('proGoGraph',['go_term', 'protein'],['ProGo', 'ProPro']);
CALL gds.graph.relationships.toUndirected( 'proGoGraph', {relationshipType: 'ProPro', mutateRelationshipType: 'ProProUndirected'} ) YIELD inputRelationships, relationshipsWritten;