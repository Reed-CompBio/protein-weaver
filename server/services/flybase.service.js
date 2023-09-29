export default class FlyBaseService {
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

  async getFlyBase(proteinInput, goTermInput, kInput) {
    if (!proteinInput || !goTermInput || !kInput) {
      console.error('Protein, GO Term and Number of Pathways are required inputs.');
      return null;
    }
  
    console.log("Getting k paths for Protein:", proteinInput, "and GO Term:", goTermInput, "with k =", kInput);
  
    const session = this.driver.session();
  
    try {
      const res = await session.executeRead(async (tx) => {
        const network = await tx.run(
          `
          MATCH (source:txid7227)
          WHERE source.id = $protein OR source.name = $protein
          MATCH (target:go_term)
          WHERE target.id = $goTerm OR target.name = $goTerm
          CALL gds.shortestPath.yens.stream('myGraph', {
            sourceNode: source,
            targetNode: target,
            k: toInteger($k)
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
            protein: proteinInput,
            goTerm: goTermInput,
            k: kInput
          }
        );
        return network.records;
      });
  
      console.log("Network result:", res);
  
      return res;
    } catch (error) {
      console.error('Error in getFlyBase:', error);
      return null; // You can handle the error in a more appropriate way
    } finally {
      await session.close();
    }
  }
  
};