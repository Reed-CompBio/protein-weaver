export default class ProteinService {
    /**
     * @type {neo4j.Driver}
     */
    driver

    /**
     * The constructor expects an instance of the Neo4j Driver, which will be
     * used to interact with Neo4j.
     *
     * @param {neo4j.Driver} driver
     */
    constructor(driver) {
        this.driver = driver
    }

    async getProtein() {
        console.log("Getting protein list for autocompletion...")

        const session = this.driver.session()

        const res = await session.executeRead(
            tx => tx.run(
                `
                MATCH (n:txid7227) RETURN n;
                `,
            )
        )

        const proteinOptions = res.records

        await session.close()

        console.log(proteinOptions)

        return proteinOptions
    };
};