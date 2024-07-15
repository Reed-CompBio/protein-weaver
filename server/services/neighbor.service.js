export default class NeighborService {
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

  async getNeighbor(goTermInput, speciesInput) {
    const session = this.driver.session()
    const res = await session.executeRead(
      tx => tx.run(
        `
            MATCH (goTerm:go_term)
            WHERE goTerm.id =~'(?i)' + $goTermInput OR goTerm.name =~'(?i)' + $goTermInput 
            CALL apoc.neighbors.athop(goTerm, "ProGo", 1)
            YIELD node
            MATCH (node where node.txid = $speciesInput)
            RETURN node.id
            `, {
        goTermInput: goTermInput,
        speciesInput: speciesInput
      }
      )
    )

    const neighbors = res.records

    await session.close()
    return neighbors
  }

};