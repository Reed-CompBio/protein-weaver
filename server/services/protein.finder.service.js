export default class ProteinFinderService {
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

    async getProteinFinder(proteinInput, speciesInput) {
        const session = this.driver.session()
        const res = await session.executeRead(
          tx => tx.run(
            `
            MATCH (source:protein {txid: $species})
            WHERE source.id =~'(?i)' + $protein OR source.name =~'(?i)' + $protein OR source.alt_name =~'(?i)' + $protein
            RETURN source
            `,{
              protein: proteinInput,
              species: speciesInput,
            }
          )
        )

        const proteins = res.records

        await session.close()
        return proteins
    }

};