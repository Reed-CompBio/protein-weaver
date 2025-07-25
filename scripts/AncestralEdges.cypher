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

MATCH (p:protein {txid: 'txid6239'})-[:ProGo]-(g:go_term)
        WITH p, collect(g) AS go_terms

        UNWIND go_terms as go_input
        MATCH (p)-[:ProGo]-(g:go_term {id: go_input.id})-[:GoGo*]->(g2)
        WITH p, collect(distinct g2) AS parent_terms
        UNWIND parent_terms AS parent_term

        MERGE (p)-[r:ProGo]-(parent_term);

MATCH (p:protein {txid: 'txid559292'})-[:ProGo]-(g:go_term)
        WITH p, collect(g) AS go_terms

        UNWIND go_terms as go_input
        MATCH (p)-[:ProGo]-(g:go_term {id: go_input.id})-[:GoGo*]->(g2)
        WITH p, collect(distinct g2) AS parent_terms
        UNWIND parent_terms AS parent_term

        MERGE (p)-[r:ProGo]-(parent_term);

MATCH (p:protein {txid: 'txid3702'})-[:ProGo]-(g:go_term)
        WITH p, collect(g) AS go_terms

        UNWIND go_terms as go_input
        MATCH (p)-[:ProGo]-(g:go_term {id: go_input.id})-[:GoGo*]->(g2)
        WITH p, collect(distinct g2) AS parent_terms
        UNWIND parent_terms AS parent_term

        MERGE (p)-[r:ProGo]-(parent_term);

MATCH (p:protein {txid: 'txid511145'})-[:ProGo]-(g:go_term)
        WITH p, collect(g) AS go_terms

        UNWIND go_terms as go_input
        MATCH (p)-[:ProGo]-(g:go_term {id: go_input.id})-[:GoGo*]->(g2)
        WITH p, collect(distinct g2) AS parent_terms
        UNWIND parent_terms AS parent_term

        MERGE (p)-[r:ProGo]-(parent_term);

CALL apoc.periodic.iterate(
  "
  MATCH (p:protein)-[r:ProGo]-(g:go_term)
  WHERE r.relationship IS NULL
  RETURN r
  ",
  "
  SET r.relationship = 'inferred_from_descendant'
  ",
  {batchSize: 1000, parallel: false}
)
YIELD batches, total, errorMessages
RETURN batches, total, errorMessages;

MATCH (p:protein)-[rel:ProPro]-(p) DETACH DELETE rel;
MATCH (p:protein)-[rel:Reg]->(p) DETACH DELETE rel;
MATCH (g:go_term) WHERE NOT (g)-[:GoGo]-() DETACH DELETE g;

MATCH (pr:protein{txid: "txid224308"})
        SET pr.degree = COUNT{(pr)-[:ProPro]-(:protein)};
MATCH (pr:protein{txid: "txid7955"})
        SET pr.degree = COUNT{(pr)-[:ProPro]-(:protein)};
MATCH (pr:protein{txid: "txid7227"})
        SET pr.degree = COUNT{(pr)-[:ProPro]-(:protein)};
MATCH (pr:protein{txid: "txid6239"})
        SET pr.degree = COUNT{(pr)-[:ProPro]-(:protein)};
MATCH (pr:protein{txid: "txid559292"})
        SET pr.degree = COUNT{(pr)-[:ProPro]-(:protein)};
MATCH (pr:protein{txid: "txid3702"})
        SET pr.degree = COUNT{(pr)-[:ProPro]-(:protein)};
MATCH (pr:protein{txid: "txid511145"})
        SET pr.degree = COUNT{(pr)-[:ProPro]-(:protein)};

MATCH (pr:protein{txid: "txid224308"})
		SET pr.regDegreeOut = COUNT{(pr)-[:Reg]->(:protein)};
MATCH (pr:protein{txid: "txid7955"})
		SET pr.regDegreeOut = COUNT{(pr)-[:Reg]->(:protein)};
MATCH (pr:protein{txid: "txid7227"})
		SET pr.regDegreeOut = COUNT{(pr)-[:Reg]->(:protein)};
MATCH (pr:protein{txid: "txid6239"})
		SET pr.regDegreeOut = COUNT{(pr)-[:Reg]->(:protein)};
MATCH (pr:protein{txid: "txid559292"})
		SET pr.regDegreeOut = COUNT{(pr)-[:Reg]->(:protein)};
MATCH (pr:protein{txid: "txid3702"})
		SET pr.regDegreeOut = COUNT{(pr)-[:Reg]->(:protein)};
MATCH (pr:protein{txid: "txid511145"})
                SET pr.regDegreeOut = COUNT{(pr)-[:Reg]->(:protein)};

MATCH (pr:protein{txid: "txid224308"})
		SET pr.regDegreeIn = COUNT{(pr)<-[:Reg]-(:protein)};
MATCH (pr:protein{txid: "txid7955"})
		SET pr.regDegreeIn = COUNT{(pr)<-[:Reg]-(:protein)};
MATCH (pr:protein{txid: "txid7227"})
		SET pr.regDegreeIn = COUNT{(pr)<-[:Reg]-(:protein)};
MATCH (pr:protein{txid: "txid6239"})
		SET pr.regDegreeIn = COUNT{(pr)<-[:Reg]-(:protein)};
MATCH (pr:protein{txid: "txid559292"})
		SET pr.regDegreeIn = COUNT{(pr)<-[:Reg]-(:protein)};
MATCH (pr:protein{txid: "txid3702"})
                SET pr.regDegreeIn = COUNT{(pr)<-[:Reg]-(:protein)};
MATCH (pr:protein{txid: "txid511145"})
                SET pr.regDegreeIn = COUNT{(pr)<-[:Reg]-(:protein)};