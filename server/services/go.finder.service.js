export default class GoFinderService {
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

  async getGoFinder(goTermInput) {
    const session = this.driver.session()
    const res = await session.executeRead(
      tx => tx.run(
        `
            MATCH (target:go_term)
            WHERE target.id =~'(?i)' + $goTerm OR target.name =~'(?i)' + $goTerm 
            RETURN target
            `, {
        goTerm: goTermInput
      }
      )
    )

    const go = res.records
    // console.log("go result:", go);
    await session.close()
    return go
  }

};