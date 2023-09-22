export default class FlyBaseService {
  /**
   * @type {neo4j.Driver}
   */
  driver;
  proteinNodeId;
  goNodeId;

  /**
   * The constructor expects an instance of the Neo4j Driver, which will be
   * used to interact with Neo4j.
   *
   * @param {neo4j.Driver} driver
   */
  constructor(driver) {
    this.driver = driver;
    this.proteinNodeId = null; // Initialize to null or a default value
    this.goNodeId = null; // Initialize to null or a default value
  }

  // Method to set source and target nodes based on user input
  setSourceAndTargetNodes(proteinNodeId, goNodeId) {
    this.proteinNodeId = proteinNodeId;
    this.goNodeId = goNodeId;
  }

  async getFlyBase() {
    if (!this.proteinNodeId || !this.goNodeId) {
      console.error('Source and target nodes are not set.');
      return null;
    }

    console.log("getting network");

    const session = this.driver.session();

    const res = await session.executeRead(
      (tx) =>
        tx.run(
          `
          MATCH (source:txid7227 {id: $sourceId})
          MATCH (target:go_term {id: $targetId})
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
          {
            sourceId: this.proteinNodeId,
            targetId: this.goNodeId,
          }
        )
    );

    const network = res.records;

    await session.close();

    console.log(network);

    return network;
  }
}
