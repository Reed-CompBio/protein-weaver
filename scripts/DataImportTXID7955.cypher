LOAD CSV WITH HEADERS FROM 'file:///interactome_txid7955_2024-06-24.txt' AS zfish
        FIELDTERMINATOR '\t'
        CALL {
            with zfish
            MERGE (a:protein {id: zfish.uniprotID1, name: zfish.name1, alt_name: zfish.alt_name1, txid: "txid7955", species: "Danio rerio"})
            MERGE (b:protein {id: zfish.uniprotID2, name: zfish.name2, alt_name: zfish.alt_name2, txid: "txid7955", species: "Danio rerio"})
            MERGE (a)-[r:ProPro]-(b)
        } IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///zfish_GO_data_2024-04-03.tsv' AS zfishgo
        FIELDTERMINATOR '\t'
        CALL {
            with zfishgo
            MATCH (n:protein {id: zfishgo.GENE_PRODUCT_ID, txid: "txid7955"})
            MERGE (g:go_term {id: zfishgo.GO_TERM})
            MERGE (n)-[r:ProGo]-(g)
        } IN TRANSACTIONS OF 1000 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///zfish_GO_data_2024-04-03.tsv' AS zfishgo
        FIELDTERMINATOR '\t'
        CALL {
            with zfishgo
            MATCH (p:protein {id: zfishgo.GENE_PRODUCT_ID, txid: "txid7955"})-[r:ProGo]-(g:go_term {id: zfishgo.GO_TERM})
            SET r.relationship = zfishgo.QUALIFIER
        } IN TRANSACTIONS OF 1000 ROWS;