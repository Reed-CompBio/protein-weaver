export default class NewService {
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

    async newQuery() {
        console.log("Mic test 1,2,3")
        const session = this.driver.session()
        try {
            const res = await session.executeRead(async (tx) => {
                const network = await tx.run(
                    `
                    MATCH (n:protein {txid:"txid7955"})-[:ProPro]-(t:protein {name:"brd4"}) RETURN n
                  `
                );
                return network.records.map((record) => record.get('n'));
            });

            console.log("Network result:", res);

            return res;
        } catch (error) {
            console.error("Error in newQuery:", error);
            return null; // You can handle the error in a more appropriate way
        } finally {
            await session.close();
        }
    }
};