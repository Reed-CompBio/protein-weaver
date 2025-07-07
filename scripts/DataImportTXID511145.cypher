LOAD CSV WITH HEADERS FROM 'file:///interactome-txid511145-2025_06_24.txt' AS ecoli
FIELDTERMINATOR '\t'
CALL {
  WITH ecoli

  MERGE (a:protein {id: ecoli.uniprotID1, txid: "txid511145"})
  SET a.name = ecoli.name1,
      a.alt_name = ecoli.alias1,
      a.species = "Escherichia coli K-12"
  MERGE (b:protein {id: ecoli.uniprotID2, txid: "txid511145"})
  SET b.name = ecoli.name2,
      b.alt_name = ecoli.alias2,
      b.species = "Escherichia coli K-12"
  MERGE (a)-[:ProPro]-(b)
} IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///interactome-txid511145-2025_06_24.txt' AS ecoli
        FIELDTERMINATOR '\t'
        CALL {
            with ecoli
            MATCH (p:protein {id: ecoli.uniprotID1, txid: "txid511145"})-[r:ProPro]-(p2:protein {id: ecoli.uniprotID2, txid: "txid511145"})
            SET r.link = ecoli.link, r.source = ecoli.source
        } IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///regulatory-txid511145-2025_06_24.txt' AS ecoli
	FIELDTERMINATOR '\t'
	CALL {
		with ecoli
		MERGE (a:protein {id: ecoli.tf_uniprot_id, txid: "txid511145", species: "Escherichia coli K-12"})
		MERGE (b:protein {id: ecoli.target_uniprot_id, txid: "txid511145", species: "Escherichia coli K-12"})
		MERGE (a)-[r:Reg]->(b)
		SET r.relationship = "regulates",
		r.source = ecoli.source,
		a.gene_name = ecoli.tf_name,
		b.gene_name = ecoli.target_name
	} IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///annotations-txid511145-2025_06_26.txt' AS go
	FIELDTERMINATOR '\t'
	CALL {
		with go
		MATCH (n:protein {id: go.uniprot_protein_id, txid:"txid511145"})
		MERGE (g:go_term {id: go.go_term})
		MERGE (n)-[r:ProGo]-(g)
	} IN TRANSACTIONS OF 1000 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///annotations-txid511145-2025_06_26.txt' AS go
	FIELDTERMINATOR '\t'
	CALL {
		with go
		MATCH (p:protein {id: go.uniprot_protein_id, txid:"txid511145"}) -[r:ProGo]- (g:go_term {id: go.go_term})
		SET r.relationship = go.qualifier
	} IN TRANSACTIONS OF 1000 ROWS;