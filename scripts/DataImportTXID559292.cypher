LOAD CSV WITH HEADERS FROM 'file:///yeast_ppi-2024-08-08.tsv' AS yeast
FIELDTERMINATOR '\t'
CALL {
with yeast
MERGE (a:protein {id: yeast.uniprot_id, txid: "txid559292", species: "Saccharomyces cerevisiae"})
MERGE (b:protein {id: yeast.uniprot_id2,txid: "txid559292", species: "Saccharomyces cerevisiae"})
MERGE (a)-[r:ProPro]-(b)
} IN TRANSACTIONS OF 100 ROWS;

LOAD CSV WITH HEADERS FROM 'file:///yeast_ppi-2024-08-08.tsv' AS yeast
FIELDTERMINATOR '\t'
CALL {
with yeast
MATCH (a:protein {id: yeast.uniprot_id, txid: "txid559292", species: "Saccharomyces cerevisiae"})
set a.name = yeast.synonym1,
a.alt_name = yeast.synonym1
} IN TRANSACTIONS OF 1000 ROWS;

LOAD CSV WITH HEADERS FROM 'file:///yeast_ppi-2024-08-08.tsv' AS yeast
FIELDTERMINATOR '\t'
CALL {
with yeast
MATCH (b:protein {id: yeast.uniprot_id2, txid: "txid559292", species: "Saccharomyces cerevisiae"})
set b.name = yeast.synonym2,
b.alt_name = yeast.synonym2
} IN TRANSACTIONS OF 1000 ROWS;

LOAD CSV WITH HEADERS FROM 'file:///yeast_ppi-2024-08-08.tsv' AS yeast
FIELDTERMINATOR '\t'
CALL {
with yeast
MATCH (a:protein {id: yeast.uniprot_id, name: yeast.synonym1, txid: "txid559292", species: "Saccharomyces cerevisiae"})-[r:ProPro]-(b:protein {id: yeast.uniprot_id2, name: yeast.synonym2, txid: "txid559292", species: "Saccharomyces cerevisiae"})
SET r.pubmed = yeast.pubmedid
} IN TRANSACTIONS OF 100 ROWS;

LOAD CSV WITH HEADERS FROM 'file:///yeast_reg-2024-08-08.tsv' AS yeast
FIELDTERMINATOR '\t'
CALL {
with yeast
MERGE (a:protein {id: yeast.tf_id, txid: "txid559292", species: "Saccharomyces cerevisiae"})
MERGE (b:protein {id: yeast.target_id, txid: "txid559292", species: "Saccharomyces cerevisiae"})
MERGE (a)-[r:Reg]->(b)
SET r.relationship = "Regulates",
r.pubmed = yeast.pubmed,
a.gene_name = yeast.tf_name,
b.gene_name = yeast.target_name
} IN TRANSACTIONS OF 100 ROWS;

LOAD CSV WITH HEADERS FROM 'file:///yeast_go_annotation-2024-08-08.tsv' AS go
FIELDTERMINATOR '\t'
CALL {
with go
MATCH (n:protein {id: go.uniprot_protein_id, txid:"txid559292"})
MERGE (g:go_term {id: go.go_term})
MERGE (n)-[r:ProGo]-(g)
} IN TRANSACTIONS OF 1000 ROWS;

LOAD CSV WITH HEADERS FROM 'file:///yeast_go_annotation-2024-08-08.tsv' AS go
FIELDTERMINATOR '\t'
CALL {
with go
MATCH (p:protein {id: go.uniprot_protein_id, txid:"txid559292"}) -[r:ProGo]- (g:go_term {id: go.go_term})
SET r.relationship = go.qualifier
} IN TRANSACTIONS OF 1000 ROWS;