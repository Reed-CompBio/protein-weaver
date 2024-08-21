CREATE CONSTRAINT txid_constraint FOR (n:protein) REQUIRE (n.txid, n.id) IS UNIQUE;
CREATE CONSTRAINT go_constraint FOR (n:go_term) REQUIRE n.id IS UNIQUE;