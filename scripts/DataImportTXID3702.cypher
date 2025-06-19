LOAD CSV WITH HEADERS FROM 'file:///interactome-txid3702-2025_06_18.txt' AS thalecress
FIELDTERMINATOR '\t'
CALL {
  WITH thalecress

  MERGE (a:protein {id: thalecress.uniprot_id1, txid: "txid3702"})
  SET a.alt_id = thalecress.id1,
      a.name = thalecress.name1,
      a.alt_name = thalecress.synonym1,
      a.species = "Arabidopsis thaliana"

  MERGE (b:protein {id: thalecress.uniprot_id2, txid: "txid3702"})
  SET b.alt_id = thalecress.id2,
      b.name = thalecress.name2,
      b.alt_name = thalecress.synonym2,
      b.species = "Arabidopsis thaliana"

  MERGE (a)-[:ProPro]-(b)
} IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///interactome-txid3702-2025_06_18.txt' AS thalecress
	FIELDTERMINATOR '\t'
	CALL {
		with thalecress
		MATCH (a:protein {id: thalecress.uniprot_id1, name: thalecress.name1, txid: "txid3702", species: "Arabidopsis thaliana"})-[r:ProPro]-(b:protein {id: thalecress.uniprot_id2, name: thalecress.name2, txid: "txid3702", species: "Arabidopsis thaliana"})
		SET r.pubmed = thalecress.pubmed, r.source = thalecress.source
	} IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///regulatory-txid3702-2025_06_18.txt' AS thalecress
	FIELDTERMINATOR '\t'
	CALL {
		with thalecress
		MERGE (a:protein {id: thalecress.tf_uniprot_id, txid: "txid3702", species: "Arabidopsis thaliana"})
		MERGE (b:protein {id: thalecress.target_uniprot_id, txid: "txid3702", species: "Arabidopsis thaliana"})
		MERGE (a)-[r:Reg]->(b)
		SET r.relationship = "regulates",
		r.pubmed = thalecress.pubmed,
		r.source = thalecress.source,
		a.gene_name = thalecress.tf_name,
		b.gene_name = thalecress.target_name,
        a.alt_gene_id = thalecress.tf_id,
        b.alt_gene_id = thalecress.target_id
	} IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///annotations-txid3702-2025_06_19.txt' AS go
	FIELDTERMINATOR '\t'
	CALL {
		with go
		MATCH (n:protein {id: go.uniprot_protein_id, txid:"txid3702"})
		MERGE (g:go_term {id: go.go_term})
		MERGE (n)-[r:ProGo]-(g)
	} IN TRANSACTIONS OF 1000 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///annotations-txid3702-2025_06_19.txt' AS go
	FIELDTERMINATOR '\t'
	CALL {
		with go
		MATCH (p:protein {id: go.uniprot_protein_id, txid:"txid3702"}) -[r:ProGo]- (g:go_term {id: go.go_term})
		SET r.relationship = go.qualifier
	} IN TRANSACTIONS OF 1000 ROWS;