export default class GoNodeService {
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

    async getGoNode (goTermInput) {

      const session = this.driver.session()
      const res = await session.executeRead(
        tx => tx.run(
          `
          MATCH (goTerm:go_term)
          WHERE goTerm.id =~'(?i)' + $goTermInput OR goTerm.name =~'(?i)' + $goTermInput
          RETURN goTerm
          `,{
            goTermInput: goTermInput
          }
        )
      )

      const go = res.records

      await session.close()

      return go
    }

  }