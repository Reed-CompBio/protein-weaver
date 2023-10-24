export default class QueryService {
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

    async getQuery(speciesInput, proteinInput, goTermInput, kInput) {
        if (!speciesInput || !proteinInput || !goTermInput || !kInput) {
            console.error('Organism, Protein, GO Term and Number of Pathways are required inputs.');
            return null;
        }

        console.log("Getting k paths for Protein:", proteinInput, "and GO Term:", goTermInput, "with k =", kInput, "for", speciesInput);

        const session = this.driver.session();

        try {
            const res = await session.executeRead(async (tx) => {
                const network = await tx.run(
                    `
            MATCH (source:protein {txid: $species})
            WHERE source.id =~'(?i)' + $protein OR source.name =~'(?i)' + $protein
            MATCH (target:go_term)
            WHERE target.id =~'(?i)' + $goTerm OR target.name =~'(?i)' + $goTerm
            CALL gds.shortestPath.yens.stream('proGoGraph', {
              sourceNode: source,
              targetNode: target,
              k: toInteger($k)
            })
            YIELD index, sourceNode, targetNode, nodeIds, path
            RETURN
              index,
              gds.util.asNode(sourceNode).id AS sourceNodeName,
              gds.util.asNode(targetNode).id AS targetNodeName,
              [nodeId IN nodeIds | gds.util.asNode(nodeId).id] AS nodeNames,
              nodes(path) as path
            ORDER BY index
            `,
                    {
                        species: speciesInput,
                        protein: proteinInput,
                        goTerm: goTermInput,
                        k: kInput
                    }
                );
                return network.records;
            });

            console.log("Network result:", res);

            return res;
        } catch (error) {
            console.error('Error in getQuery:', error);
            return null; // You can handle the error in a more appropriate way
        } finally {
            await session.close();
        }
    }

};