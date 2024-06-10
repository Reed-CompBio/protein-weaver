export default class PGStats {
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

    async ProGoStats(GoName) {
        const session = this.driver.session();
        const res = await session.executeRead((tx) =>
            tx.run(
                `
            match (go:go_term)
            where (go.name = $GoName)
            return COUNT {(go) - [:ProGo] - (:protein)} as Count
            `,

                {
                    GoName: GoName
                }
            )
        );
        const count = res.records;


        await session.close();


        return count;

    }
}