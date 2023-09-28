export function SharedEdgeParser(networkData, sharedEdgeData) {
  for (let i = 0; i < sharedEdgeData.length; i++) {
    let startNode = sharedEdgeData[i]._fields[0].start.properties.id;
    let endNode = sharedEdgeData[i]._fields[0].end.properties.id;
    if (
      !networkData.edgeList.includes(startNode + endNode) &&
      !networkData.edgeList.includes(endNode + startNode) &&
      sharedEdgeData[i]._fields[0].segments[0].relationship.type != "ProGo"
    ) {
      let edgeEntry = {
        data: { source: endNode, target: startNode, type: "shared" },
      };
      networkData.edgeList.push(startNode + endNode);
      networkData.edges.push(edgeEntry);
    } else if (
      sharedEdgeData[i]._fields[0].segments[0].relationship.type === "ProGo"
    ) {
      for (let k = 0; k < networkData.nodes.length; k++) {
        let currentNode = networkData.nodes[k];
        if (currentNode.data.id === startNode) {
          networkData.nodes[k].data.go_protein =
            sharedEdgeData[
              i
            ]._fields[0].segments[0].relationship.properties.relationship;
        }
      }
    }
  }
  console.log(networkData.nodes);

  return networkData;
}

export function getNodes(networkData) {
  let nodeList = [];
  for (let i = 0; i < networkData.nodes.length; i++) {
    nodeList.push(networkData.nodes[i].data.id);
  }
  return nodeList;
}
