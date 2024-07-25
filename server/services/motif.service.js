export default class MotifService {
    /**
     * @type {neo4j.Driver}
     */
    driver;

    /**
     * The constructor expects an instance of the Neo4j Driver, which will be
     * used to interact with Neo4j.
     *
     * @param {neo4j.Driver} driver
     */
    constructor(driver) {
        this.driver = driver;
    }

    async getMotif(nodeList) {
        const session = this.driver.session();
        const res = await session.executeRead((tx) =>
            tx.run(
                `
                with $nodeList as lst
                match path=(p1:protein where p1.id in lst)-[:ProPro]-(p2:protein where p2.id in lst)-[:ProPro]-(p3:protein where p3.id in lst)-[:ProPro]-(p1)
                where elementId(p1) < elementId(p2) and
                elementId(p2) < elementId(p3) and
                elementId(p1) < elementId(p3)
                return count(*) as test
                union all
                with $nodeList as lst
                match (p1:protein where p1.id in lst)-[:ProPro]-(p2:protein where p2.id in lst)-[:Reg]->(p3:protein where p3.id in lst)<-[:Reg]-(p1)
                where elementId(p1) < elementId(p2) and
                elementId(p2) < elementId(p3) and
                elementId(p1) < elementId(p3)
                return count(*) as test
                union all
                with $nodeList as lst
                match (p1:protein where p1.id in lst)-[:Reg]->(p2:protein where p2.id in lst)-[:Reg]->(p3:protein where p3.id in lst)<-[:Reg]-(p1)
                where elementId(p1) < elementId(p2) and
                elementId(p2) < elementId(p3) and
                elementId(p1) < elementId(p3)
                return count(*) as test
                union all
                with $nodeList as lst
                match (p1:protein where p1.id in lst)-[:Reg]->(p2:protein where p2.id in lst)-[:ProPro]-(p3:protein where p3.id in lst)<-[:Reg]-(p1)
                where elementId(p1) < elementId(p2) and
                elementId(p2) < elementId(p3) and
                elementId(p1) < elementId(p3)
                return count(*) as test
                union all
                with $nodeList as lst
                match (p1:protein where p1.id in lst)-[:Reg]->(p2:protein where p2.id in lst)-[:Reg]->(p3:protein where p3.id in lst)<-[:Reg]-(p1),(p1)-[:ProPro]-(p2)
                where elementId(p1) < elementId(p2) and
                elementId(p2) < elementId(p3) and
                elementId(p1) < elementId(p3)
                return count(*) as test
            `,
                {
                    nodeList: nodeList
                }
            )
        );
        const motifCounts = res.records;
        await session.close();
        return motifCounts;
    }
}