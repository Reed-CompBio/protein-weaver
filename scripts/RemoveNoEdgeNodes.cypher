MATCH (p:protein {txid: "txid7227"})
WHERE NOT (p)-[:ProPro]-(:protein)
  AND NOT (p)-[:Reg]->(:protein)
  AND NOT (p)<-[:Reg]-(:protein)
  WITH p AS flyNoEdgeNodes
DETACH DELETE flyNoEdgeNodes;

MATCH (p:protein {txid: "txid224308"})
WHERE NOT (p)-[:ProPro]-(:protein)
  AND NOT (p)-[:Reg]->(:protein)
  AND NOT (p)<-[:Reg]-(:protein)
  WITH p AS bsubNoEdgeNodes
DETACH DELETE bsubNoEdgeNodes;

MATCH (p:protein {txid: "txid7955"})
WHERE NOT (p)-[:ProPro]-(:protein)
  AND NOT (p)-[:Reg]->(:protein)
  AND NOT (p)<-[:Reg]-(:protein)
  WITH p AS drerioNoEdgeNodes
DETACH DELETE drerioNoEdgeNodes;

MATCH (p:protein {txid: "txid559292"})
WHERE NOT (p)-[:ProPro]-(:protein)
  AND NOT (p)-[:Reg]->(:protein)
  AND NOT (p)<-[:Reg]-(:protein)
  WITH p AS yeastNoEdgeNodes
DETACH DELETE yeastNoEdgeNodes;

MATCH (p:protein {txid: "txid6239"})
WHERE NOT (p)-[:ProPro]-(:protein)
  AND NOT (p)-[:Reg]->(:protein)
  AND NOT (p)<-[:Reg]-(:protein)
  WITH p AS elegansNoEdgeNodes
DETACH DELETE elegansNoEdgeNodes;

MATCH (p:protein {txid: "txid3702"})
WHERE NOT (p)-[:ProPro]-(:protein)
  AND NOT (p)-[:Reg]->(:protein)
  AND NOT (p)<-[:Reg]-(:protein)
  WITH p AS arabThalNoEdgeNodes
DETACH DELETE arabThalNoEdgeNodes;

MATCH (p:protein {txid: "txid511145"})
WHERE NOT (p)-[:ProPro]-(:protein)
  AND NOT (p)-[:Reg]->(:protein)
  AND NOT (p)<-[:Reg]-(:protein)
  WITH p AS ecoliNoEdgeNodes
DETACH DELETE ecoliNoEdgeNodes;