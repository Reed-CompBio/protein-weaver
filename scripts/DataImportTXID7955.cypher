LOAD CSV WITH HEADERS FROM 'file:///interactome_txid7955_2024-06-24.txt' AS zfish
        FIELDTERMINATOR '\t'
        CALL {
            with zfish
            MERGE (a:protein {id: zfish.uniprotID1, name: zfish.name1, alt_name: zfish.alt_name1, txid: "txid7955", species: "Danio rerio"})
            MERGE (b:protein {id: zfish.uniprotID2, name: zfish.name2, alt_name: zfish.alt_name2, txid: "txid7955", species: "Danio rerio"})
            MERGE (a)-[r:ProPro]-(b)
        } IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///interactome_txid7955_2024-07-30.txt' AS zfish
        FIELDTERMINATOR '\t'
        CALL {
            with zfish
            MATCH (p:protein {id: zfish.uniprotID1, txid: "txid7955"})-[r:ProPro]-(p2:protein {id: zfish.uniprotID2, txid: "txid7955"})
            SET r.link = zfish.link, r.source = zfish.source
        } IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///regulatory_txid7955_2024-07-31.txt' AS drer_reg
        FIELDTERMINATOR '\t'
        CALL {
                with drer_reg
                MERGE (a:protein {id: drer_reg.UniprotID_TF, txid: "txid7955", species: "Danio rerio"})
                MERGE (b:protein {id: drer_reg.UniprotID_Target, txid: "txid7955", species: "Danio rerio"})
                MERGE (a)-[r:Reg]->(b)
                SET r.relationship = "regulates",
                r.pubmed = drer_reg.PubmedID,
                a.gene_name = drer_reg.Name_TF,
                b.gene_name = drer_reg.Name_Target
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