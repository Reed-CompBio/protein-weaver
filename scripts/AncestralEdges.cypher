MATCH (p:protein {txid: 'txid7955'})-[:ProGo]-(g:go_term)
        WITH p, collect(g) AS go_terms
        
        UNWIND go_terms as go_input
        MATCH (p)-[:ProGo]-(g:go_term {id: go_input.id})-[:GoGo*]->(g2)
        WITH p, collect(distinct g2) AS parent_terms
        UNWIND parent_terms AS parent_term
        
        MERGE (p)-[r:ProGo]-(parent_term);
MATCH (p:protein {txid: 'txid224308'})-[:ProGo]-(g:go_term)
        WITH p, collect(g) AS go_terms

        UNWIND go_terms as go_input
        MATCH (p)-[:ProGo]-(g:go_term {id: go_input.id})-[:GoGo*]->(g2)
        WITH p, collect(distinct g2) AS parent_terms
        UNWIND parent_terms AS parent_term

        MERGE (p)-[r:ProGo]-(parent_term);
MATCH (p:protein {txid: 'txid7227'})-[:ProGo]-(g:go_term)
        WITH p, collect(g) AS go_terms
        
        UNWIND go_terms as go_input
        MATCH (p)-[:ProGo]-(g:go_term {id: go_input.id})-[:GoGo*]->(g2)
        WITH p, collect(distinct g2) AS parent_terms
        UNWIND parent_terms AS parent_term
        
        MERGE (p)-[r:ProGo]-(parent_term);
MATCH (p:protein)-[r:ProGo]-(g:go_term)
        WHERE r.relationship IS NULL
        SET r.relationship = "inferred_from_descendant";
MATCH (p:protein)-[rel:ProPro]-(p) DETACH DELETE rel;
MATCH (g:go_term) WHERE NOT (g)-[:GoGo]-() DETACH DELETE g;
MATCH (pr:protein{txid: "txid224308"})
        SET pr.degree = COUNT{(pr)-[:ProPro]-(:protein)};
MATCH (pr:protein{txid: "txid7955"})
        SET pr.degree = COUNT{(pr)-[:ProPro]-(:protein)};
MATCH (pr:protein{txid: "txid7227"})
        SET pr.degree = COUNT{(pr)-[:ProPro]-(:protein)};
