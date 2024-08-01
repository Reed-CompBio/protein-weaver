export default class AllShortestPathsService {
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

  async getAllShortestPaths(source) {

    const session = this.driver.session()
    const res = await session.executeRead(
      tx => tx.run(
        `
          MATCH (source:protein)
          WHERE source.id =~'(?i)' + $source OR source.name =~'(?i)' + $source OR source.alt_name =~'(?i)' + $source
          CALL gds.allShortestPaths.dijkstra.stream('proGoGraph', {
              sourceNode: source,
              relationshipTypes: ["ProGo", "ProProUndirected","Reg"],
              nodeLabels: ["protein", "go_term"]
          })
          YIELD index, sourceNode, targetNode, nodeIds, path
          RETURN
              index,
              gds.util.asNode(sourceNode).name AS sourceNodeName,
              gds.util.asNode(targetNode).id AS targetNodeName,
              nodes(path) as path
          ORDER BY index
          `, {
        source: source,
      }
      )
    )

    const path = res.records

    await session.close()

    return path
  }

}