LOAD CSV WITH HEADERS FROM 'file:///interactome_txid224308_2024-06-06.txt' AS bsub
        FIELDTERMINATOR '\t'
        CALL {
        with bsub
        MERGE (a:protein {id: bsub.protein_1_locus, name: bsub.protein_1_name, alt_name: bsub.protein_1_alt_name, txid: "txid224308", species: "Bacillus subtilis 168"})
        MERGE (b:protein {id: bsub.protein_2_locus, name: bsub.protein_2_name, alt_name: bsub.protein_2_alt_name, txid: "txid224308", species: "Bacillus subtilis 168"})
        MERGE (a)-[r:ProPro]-(b)
        } IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///bsub_GO_data.csv' AS bsubgo
        CALL {
            with bsubgo
            MATCH (n:protein {id: bsubgo.locus, txid: "txid224308"})
            MERGE (g:go_term {id: bsubgo.go_term})
            MERGE (n)-[r:ProGo]-(g)
        } IN TRANSACTIONS OF 1000 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///bsub_GO_data.csv' AS bsubgo
        CALL {
            with bsubgo
            MATCH (p:protein {id: bsubgo.locus, txid: "txid224308"})-[r:ProGo]-(g:go_term {id: bsubgo.go_term})
            SET r.relationship = bsubgo.qualifier
        } IN TRANSACTIONS OF 1000 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///annotations_txid224308_2024-06-03.txt' AS bsubgo
        FIELDTERMINATOR '\t'
        CALL {
            with bsubgo
            MATCH (n:protein {id: bsubgo.BSU_ID, txid: "txid224308"})
            MERGE (g:go_term {id: bsubgo.GO_TERM})
            MERGE (n)-[r:ProGo]-(g)
        } IN TRANSACTIONS OF 1000 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///annotations_txid224308_2024-06-03.txt' AS bsubgo
        FIELDTERMINATOR '\t'
        CALL {
            with bsubgo
            MATCH (p:protein {id: bsubgo.BSU_ID, txid: "txid224308"})-[r:ProGo]-(g:go_term {id: bsubgo.GO_TERM})
            SET r.relationship = bsubgo.QUALIFIER
        } IN TRANSACTIONS OF 1000 ROWS;