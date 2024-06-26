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

    async ProGoStats(GoName, txid) {
        const session = this.driver.session();
        const res = await session.executeRead((tx) =>
            tx.run(
                `
                match (go:go_term{name:$GoName})-[pg:ProGo]-(pr:protein{txid:$txid})
                return count(pg)
            `,

                {
                    GoName: GoName,
                    txid: txid
                }
            )
        );
        const count = res.records;
        await session.close();
        return count;
    }
}