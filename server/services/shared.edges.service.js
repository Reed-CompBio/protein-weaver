export default class SharedEdgesService {
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

  async getSharedEdges () {
    console.log("getting sharedEdges")

    const session = this.driver.session()

    const res = await session.executeRead(
      tx => tx.run(
        `
        WITH ["FBgn0031985", "FBgn0003360", "FBgn0026083", "FBgn0262560", "FBgn0020249", "FBgn0003683" , "FBgn0003165", "FBgn0011726", "FBgn0261671"] AS list
        MATCH p=(l)-[]->(m)
        WHERE l.id in list AND m.id in list AND l.id <> m.id
        RETURN p
        `,
      )
    )

    const sharedEdges = res.records

    await session.close()

    console.log(sharedEdges)

    return sharedEdges
  }

}
