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
                    MATCH (n:protein)-[r]->(m:protein)
                    WHERE n.id IN nodeList AND m.id IN nodeList
                    WITH COUNT(CASE WHEN type(r) = 'ProPro' THEN 1 END) AS proProCount,
                    COUNT(CASE WHEN type(r) = 'Reg' THEN 1 END) AS regCount
                    RETURN proProCount, regCount
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