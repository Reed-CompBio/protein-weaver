export default class DescendantsService {
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

    async getDescendants(goTermInput, species) {
        console.log("Getting list of descendants for GO term...")
        const descendants = [];

        const session = this.driver.session()
        try {
            const res = await session.run(
                `
                MATCH (cgt)-[r:GoGo]->(qgt:go_term)
                WHERE (cgt)-[:ProGo]-(:protein {txid: $species})
                AND qgt.id =~'(?i)' + $goTerm OR qgt.name =~'(?i)' + $goTerm
                RETURN cgt;
                `,
                {
                    goTerm: goTermInput,
                    species: species
                }
            );
            const nodes = res.records.map(record => record.get('cgt'));

            nodes.forEach(node => {
                const nodeName = node.properties.name;

                const nodeOptions = {
                    name: nodeName
                };

                descendants.push(nodeOptions);
            });
            return (descendants);
        } catch (error) {
            console.error('Error in getDescendants:', error);
            return null // You can handle the error in a more appropriate way
        } finally {
            await session.close()
        }
    };
};