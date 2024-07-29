LOAD CSV WITH HEADERS FROM 'file:///is_a_import_2024-07-17.tsv' AS go
        FIELDTERMINATOR '\t'
        CALL {
            with go
            MERGE (a:go_term {id: go.id})
            MERGE (b:go_term {id: go.id2})
            MERGE (a)-[r:GoGo]->(b)
            SET r.relationship = go.is_a
        } IN TRANSACTIONS OF 100 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///go_2024-07-17.txt' AS go
        FIELDTERMINATOR '\t'
        CALL {
            with go
            MATCH (n:go_term {id: go.id})
            SET n.name = go.name,
            n.namespace = go.namespace,
            n.def = go.def
        } IN TRANSACTIONS OF 1000 ROWS;
LOAD CSV WITH HEADERS FROM 'file:///go_2024-07-17.txt' AS go
        FIELDTERMINATOR '\t'
        CALL {
            with go
            MATCH (n:go_term {id: go.id})
            SET n.never_annotate = go.never_annotate
        } IN TRANSACTIONS OF 1000 ROWS;