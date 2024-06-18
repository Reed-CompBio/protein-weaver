export default class Degree {
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

    async getdegree(id) {
        const session = this.driver.session();
        const res = await session.executeRead((tx) =>
            tx.run(
                `
                match (pr:protein{id:$id})
                return pr.degree as degree
            `,
                {
                    id: id
                }
            )
        );
        const degree = res.records;
        await session.close();
        return degree;
    }
}