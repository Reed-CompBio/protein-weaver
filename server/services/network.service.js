export default class NetworkService {
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

  async getNetwork() {
    console.log("getting network")

    const session = this.driver.session()

    const res = await session.executeRead(
      tx => tx.run(
        `
        MATCH (source:txid7227 {id: "FBgn0031985"})
        MATCH (target:go_term {id: "GO:0003674"})
        CALL gds.shortestPath.yens.stream('myGraph', {
            sourceNode: source,
            targetNode: target,
            k: 3
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
      )
    )

    const network = res.records

    await session.close()

    console.log(network)

    return network
  }

}
