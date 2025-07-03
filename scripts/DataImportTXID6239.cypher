LOAD CSV WITH HEADERS FROM 'file:///interactome-txid6239-2024_08_19.txt' AS elegans
	FIELDTERMINATOR '\t'
	CALL {
		with elegans
		MERGE (a:protein {id: elegans.Interactor1, name: elegans.commonName1, txid: "txid6239", species: "Caenorhabditis elegans"})
		MERGE (b:protein {id: elegans.Interactor2, name: elegans.commonName2, txid: "txid6239", species: "Caenorhabditis elegans"})
		MERGE (a)-[r:ProPro]-(b)
	} IN TRANSACTIONS OF 100 ROWS;
MATCH (n:protein {txid: "txid6239"}) SET n.alt_name = n.name;
LOAD CSV WITH HEADERS FROM 'file:///interactome-txid6239-2024_08_19.txt' AS elegans
	FIELDTERMINATOR '\t'
	CALL {
		with elegans
		MATCH (a:protein {id: elegans.Interactor1, name: elegans.commonName1, txid: "txid6239", species: "Caenorhabditis elegans"})-[r:ProPro]-(b:protein {id: elegans.Interactor2, name: elegans.commonName2, txid: "txid6239", species: "Caenorhabditis elegans"})
		SET r.interaction = elegans.InteractionId, r.source = elegans.source
	} IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///regulatory-txid6239-2024_08_19.txt' AS elegans
	FIELDTERMINATOR '\t'
	CALL {
		with elegans
		MERGE (a:protein {id: elegans.worm_id_TF, txid: "txid6239", species: "Caenorhabditis elegans"})
		MERGE (b:protein {id: elegans.worm_id_Target, txid: "txid6239", species: "Caenorhabditis elegans"})
		MERGE (a)-[r:Reg]->(b)
		SET r.relationship = "regulates",
		r.pubmed = elegans.PubmedID,
		r.source = elegans.source,
		a.gene_name = elegans.name_TF,
		b.gene_name = elegans.name_Target
	} IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///annotations-txid6239-2025_06_19.txt' AS go
	FIELDTERMINATOR '\t'
	CALL {
		with go
		MATCH (n:protein {id: go.gene_id, txid:"txid6239"})
		MERGE (g:go_term {id: go.go_id})
		MERGE (n)-[r:ProGo]-(g)
	} IN TRANSACTIONS OF 1000 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///annotations-txid6239-2025_06_19.txt' AS go
	FIELDTERMINATOR '\t'
	CALL {
		with go
		MATCH (p:protein {id: go.gene_id, txid:"txid6239"}) -[r:ProGo]- (g:go_term {id: go.go_id})
		SET r.relationship = go.rel_type
	} IN TRANSACTIONS OF 1000 ROWS;