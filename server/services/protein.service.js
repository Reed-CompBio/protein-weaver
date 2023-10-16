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
        const proteinOptions = [];

        const session = this.driver.session()
        try {
            const res = await session.run(
                `
            MATCH (n:txid7227) RETURN n AS proteinOptions;
            `,
            );

            const nodes = res.records.map(record => record.get('proteinOptions'));

            nodes.forEach(node => {
                const nodeId = node.properties.id.split(';');
                const nodeName = node.properties.name;

                const nodeProperties = {
                    id: nodeId[0],
                    name: nodeName
                }

                proteinOptions.push(nodeProperties)
            })
            return (proteinOptions);
        }
        catch (error) {
            console.error('Error in getProtein:', error);
            return null // You can handle the error in a more appropriate way
        } finally {
            await session.close()
        }
    };
};