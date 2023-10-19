export default class GoTermService {
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

    async getGoTerm() {
        console.log("Getting GO term list for autocompletion...")
        const goTermOptions = [];

        const session = this.driver.session()
        try {
            const res = await session.run(
                `
            MATCH (n:go_term) RETURN n AS goTermOptions;
            `,
            );

            const nodes = res.records.map(record => record.get('goTermOptions'));

            nodes.forEach(node => {
                const nodeId = node.properties.id.split(';');
                const nodeName = node.properties.name;

                const nodeProperties = {
                    id: nodeId[0],
                    name: nodeName
                }

                goTermOptions.push(nodeProperties)
            })

            return (goTermOptions);
        }
        catch (error) {
            console.error('Error in getGoTerm:', error);
            return null // You can handle the error in a more appropriate way
        } finally {
            await session.close()
        }
    };
};