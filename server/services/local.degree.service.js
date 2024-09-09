export default class LocalDegreeService {
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

    async getLocalDegrees(nodeList) {
        const session = this.driver.session();
        const res = await session.executeRead((tx) =>
            tx.run(
                `
                WITH $nodeList AS nodeList
                    MATCH (n:protein)
                    WHERE n.id IN nodeList
                    RETURN sum(n.degree) AS ppiDegree, 
                        sum(n.regDegreeIn + n.regDegreeOut) AS grnDegree, 
                        sum(n.degree + n.regDegreeOut + n.regDegreeIn) AS mixedDegree;

            `,
                {
                    nodeList: nodeList
                }
            )
        );
        const localDegrees = res.records;
        await session.close();
        return localDegrees;
    }
}