export default class DijkstraService {
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

  async getDijkstra(source, target) {

    const session = this.driver.session()
    const res = await session.executeRead(
      tx => tx.run(
        `
          MATCH (source:protein)
          WHERE source.id =~'(?i)' + $source OR source.name =~'(?i)' + $source OR source.alt_name =~'(?i)' + $source OR source.gene_name =~'(?i)' + $source
          MATCH (target:protein{id: $target})
          CALL gds.shortestPath.dijkstra.stream('proGoGraph', {
              sourceNode: source,
              targetNode: target
          })
          YIELD index, sourceNode, targetNode, nodeIds, path
          RETURN
              nodes(path) as path
          ORDER BY index
          `, {
        source: source,
        target: target
      }
      )
    )

    const path = res.records

    await session.close()

    console.log(target, path)

    return path
  }

}