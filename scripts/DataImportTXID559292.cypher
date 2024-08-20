LOAD CSV WITH HEADERS FROM 'file:///interactome-txid559292-2024_08_19.txt' AS yeast
	FIELDTERMINATOR '\t'
	CALL {
		with yeast
		MERGE (a:protein {id: yeast.uniprot_id, name: yeast.synonym1, alt_name: yeast.synonym1, txid: "txid559292", species: "Saccharomyces cerevisiae"})
		MERGE (b:protein {id: yeast.uniprot_id2, name: yeast.synonym2, alt_name: yeast.synonym2, txid: "txid559292", species: "Saccharomyces cerevisiae"})
		MERGE (a)-[r:ProPro]-(b)
	} IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///interactome-txid559292-2024_08_19.txt' AS yeast
	FIELDTERMINATOR '\t'
	CALL {
		with yeast
		MATCH (a:protein {id: yeast.uniprot_id, name: yeast.synonym1, txid: "txid559292", species: "Saccharomyces cerevisiae"})-[r:ProPro]-(b:protein {id: yeast.uniprot_id2, name: yeast.synonym2, txid: "txid559292", species: "Saccharomyces cerevisiae"})
		SET r.pubmed = yeast.pubmedid, r.source = yeast.source
	} IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///regulatory-txid559292-2024_08_19.txt' AS yeast
	FIELDTERMINATOR '\t'
	CALL {
		with yeast
		MERGE (a:protein {id: yeast.tf_id, txid: "txid559292", species: "Saccharomyces cerevisiae"})
		MERGE (b:protein {id: yeast.target_id, txid: "txid559292", species: "Saccharomyces cerevisiae"})
		MERGE (a)-[r:Reg]->(b)
		SET r.relationship = "regulates",
		r.pubmed = yeast.pubmed,
		r.source = yeast.source,
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