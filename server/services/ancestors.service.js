export default class AncestorsService {
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

    async getAncestors(goTermInput, species) {
        console.log("Getting list of ancestors for GO term...")
        const ancestors = [];

        const session = this.driver.session()
        try {
            const res = await session.run(
                `
                MATCH (qgt:go_term)-[r:GoGo]->(pgt)
                WHERE (pgt)-[:ProGo]-(:protein {txid: $species})
                AND (qgt.id =~ '(?i)' + $goTerm OR qgt.name =~ '(?i)' + $goTerm)
                RETURN pgt;
                `,
                {
                    goTerm: goTermInput,
                    species: species
                }
            );

            const nodes = res.records.map(record => record.get('pgt'));
            nodes.forEach(node => {
                // const nodeId = node.properties.id.split(';');
                const nodeName = node.properties.name;

                const nodeOptions = {
                    // id: nodeId[0],
                    name: nodeName
                };
                ancestors.push(nodeOptions);
            });
            return (ancestors);
        } catch (error) {
            console.error('Error in getAncestors:', error);
            return null // You can handle the error in a more appropriate way
        } finally {
            await session.close()
        }
    };
};