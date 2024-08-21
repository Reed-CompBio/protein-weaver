LOAD CSV WITH HEADERS FROM 'file:///interactome-txid7227-2024_08_19.txt' AS fly
        FIELDTERMINATOR '\t'
        CALL {
            with fly
            MERGE (a:protein {id: fly.FlyBase1, name: fly.symbol1, txid: "txid7227", species: "Drosophila melanogaster"})
            MERGE (b:protein {id: fly.FlyBase2, name: fly.symbol2, txid: "txid7227", species: "Drosophila melanogaster"})
            MERGE (a)-[r:ProPro]-(b)
        } IN TRANSACTIONS OF 100 ROWS;
MATCH (n:protein {txid: "txid7227"}) SET n.alt_name = n.name;
LOAD CSV WITH HEADERS FROM 'file:///interactome-txid7227-2024_08_19.txt' AS fly
        FIELDTERMINATOR '\t'
        CALL {
            with fly
            MATCH (p:protein {id: fly.FlyBase1,  txid:"txid7227"})-[r:ProPro]-(p2:protein {id: fly.FlyBase2,  txid:"txid7227"})
            SET r.pubmed = fly.PubMedIDs, r.source = fly.source
        } IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///regulatory-txid7227-2024_08_19.txt' AS dmel_reg
        FIELDTERMINATOR '\t'
        CALL {
                with dmel_reg
                MERGE (a:protein {id: dmel_reg.Interacting_gene_FBgn, txid: "txid7227", species: "Drosophila melanogaster"})
                MERGE (b:protein {id: dmel_reg.Starting_gene_FBgn, txid: "txid7227", species: "Drosophila melanogaster"})
                MERGE (a)-[r:Reg]->(b)
                SET r.relationship = dmel_reg.Interaction_type,
                r.reference = dmel_reg.Publication_FBrf,
                r.source = dmel_reg.source,
                a.gene_name = dmel_reg.Interacting_gene_symbol,
                b.gene_name = dmel_reg.Starting_gene_symbol
        } IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///gene_association_fb_2024-04-03.tsv' AS flygo
        FIELDTERMINATOR '\t'
        CALL {
            with flygo
            MATCH (n:protein {id: flygo.db_object_id, txid:"txid7227"})
            MERGE (g:go_term {id: flygo.go_id})
            MERGE (n)-[r:ProGo]-(g)
        } IN TRANSACTIONS OF 1000 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///gene_association_fb_2024-04-03.tsv' AS flygo
        FIELDTERMINATOR '\t'
        CALL {
            with flygo
            MATCH (p:protein {id: flygo.db_object_id, txid:"txid7227"})-[r:ProGo]-(g:go_term {id: flygo.go_id})
            SET r.relationship = flygo.qualifier
        } IN TRANSACTIONS OF 1000 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///dmel_GO_data_2024-04-03.tsv' AS dmelgo
        FIELDTERMINATOR '\t'
        CALL {
            with dmelgo
            MATCH (n:protein {id: dmelgo.FB_ID, txid: "txid7227"})
            MERGE (g:go_term {id: dmelgo.GO_TERM})
            MERGE (n)-[r:ProGo]-(g)
        } IN TRANSACTIONS OF 1000 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///dmel_GO_data_2024-04-03.tsv' AS dmelgo
        FIELDTERMINATOR '\t'
        CALL {
            with dmelgo
            MATCH (p:protein {id: dmelgo.FB_ID, txid: "txid7227"})-[r:ProGo]-(g:go_term {id: dmelgo.GO_TERM})
            SET r.relationship = dmelgo.QUALIFIER
        } IN TRANSACTIONS OF 1000 ROWS;