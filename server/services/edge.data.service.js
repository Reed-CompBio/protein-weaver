export default class EdgeDataService {
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

  async getEdgeData (nodeList) {

    const session = this.driver.session()
    console.log(nodeList)
    const res = await session.executeRead(
      tx => tx.run(
        `
        WITH toStringList($nodeList) AS list
        MATCH p=(l)-[]->(m)
        WHERE l.id in list AND m.id in list AND l.id <> m.id
        RETURN p
        `,{
          nodeList: nodeList
        }
      )
    )

    const edgeData = res.records

    await session.close()

    console.log(edgeData)

    return edgeData
  }

}
