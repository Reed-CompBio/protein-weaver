WITH "match (p1:protein {txid:'txid3702'})-[r:ProPro]->(p2:protein) return p1.id as id1, p2.id as id2,
COALESCE(p1.name, p1.id)as name1, COALESCE(p2.name, p2.id) as name2,
COALESCE(p1.gene_name, p1.id) as geneName1, COALESCE(p2.gene_name, p2.id) as geneName2,
COALESCE(p1.alt_name, p1.id) as altName1, COALESCE(p2.alt_name, p2.id) as altName2,
COALESCE(p1.alt_id, p1.id) as altId1, COALESCE(p2.alt_id, p2.id) as altId2,
r.source as source, r.pubmed as sourceLink, 'physical' as intType, p1.txid as species" AS query
CALL apoc.export.csv.query(query, "txid3702-protein_protein_interaction.csv", {})
YIELD file, source, format, nodes, relationships, properties, time, rows, batchSize, batches, done, data
RETURN file, source, format, nodes, relationships, properties, time, rows, batchSize, batches, done, data;

WITH "match (p1:protein {txid:'txid3702'})-[r:Reg]->(p2:protein) return p1.id as id1, p2.id as id2,
COALESCE(p1.name, p1.id)as name1, COALESCE(p2.name, p2.id) as name2,
COALESCE(p1.gene_name, p1.id) as geneName1, COALESCE(p2.gene_name, p2.id) as geneName2,
COALESCE(p1.alt_name, p1.id) as altName1, COALESCE(p2.alt_name, p2.id) as altName2,
COALESCE(p1.alt_gene_id, p1.id) as altId1, COALESCE(p2.alt_gene_id, p2.id) as altId2,
r.source as source, r.pubmed as sourceLink, r.relationship as intType, p1.txid as species" AS query
CALL apoc.export.csv.query(query, "txid3702-regulatory_interaction.csv", {})
YIELD file, source, format, nodes, relationships, properties, time, rows, batchSize, batches, done, data
RETURN file, source, format, nodes, relationships, properties, time, rows, batchSize, batches, done, data;

WITH "match (p1:protein {txid:'txid3702'}) -[r:ProGo]-> (g1:go_term) where not r.relationship = 'inferred_from_descendant'
return p1.id as protein, r.relationship as relType, g1.id as goTerm, g1.name as goName,
g1.namespace as namespace, g1.never_annotate as neverAnnotate" AS query
CALL apoc.export.csv.query(query, "txid3702-direct_go_annotation.csv", {})
YIELD file, source, format, nodes, relationships, properties, time, rows, batchSize, batches, done, data
RETURN file, source, format, nodes, relationships, properties, time, rows, batchSize, batches, done, data;

WITH "match (p1:protein {txid:'txid3702'}) -[r:ProGo]-> (g1:go_term)
return p1.id as protein, r.relationship as relType, g1.id as goTerm, g1.name as goName,
g1.namespace as namespace, g1.never_annotate as neverAnnotate" AS query
CALL apoc.export.csv.query(query, "txid3702-go_annotation.csv", {})
YIELD file, source, format, nodes, relationships, properties, time, rows, batchSize, batches, done, data
RETURN file, source, format, nodes, relationships, properties, time, rows, batchSize, batches, done, data;