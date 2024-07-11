export default class MaxDegreeService {
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

  async getMaxDegree(speciesInput, nodeList) {
    const session = this.driver.session();
    const res = await session.executeRead((tx) =>
      tx.run(
        `
          MATCH (p:protein {txid: $speciesInput})
          WHERE p.id IN toStringList($nodeList)
          WITH p
          MATCH (p)-[r:ProPro]-() 
          WITH p, count(r) as degree 
          RETURN max(degree) as maxDegree;
          `,
        {
          speciesInput: speciesInput,
          nodeList: nodeList,
        }
      )
    );

    const deg = res.records;

    await session.close();

    return deg;
  }
}
