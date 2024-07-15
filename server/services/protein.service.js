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

    async getProtein(speciesInput) {
        console.log("Getting protein list for autocompletion...")
        const proteinOptions = [];

        const session = this.driver.session()
        try {
            const res = await session.run(
                `
            MATCH (n:protein {txid: $species}) RETURN n AS proteinOptions;
            `,
                {
                    species: speciesInput
                }
            );

            const nodes = res.records.map(record => record.get('proteinOptions'));

            nodes.forEach(node => {
                const nodeId = node.properties.id.split(';');
                const nodeName = node.properties.name;
                const altName = node.properties.alt_name;

                const nodeOptions = {
                    id: nodeId[0],
                    name: nodeName,
                    alt_name: altName
                };

                proteinOptions.push(nodeOptions);
            });
            return (proteinOptions);
        } catch (error) {
            console.error('Error in getProtein:', error);
            return null // You can handle the error in a more appropriate way
        } finally {
            await session.close()
        }
    };
};