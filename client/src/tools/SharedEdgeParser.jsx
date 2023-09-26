export function SharedEdgeParser(networkData, sharedEdgeData) {
  for (let i = 0; i < sharedEdgeData.length; i++) {
    // console.log(sharedEdgeData[i]._fields[0].start.properties.id)
    let startNode = sharedEdgeData[i]._fields[0].start.properties.id
    let endNode = sharedEdgeData[i]._fields[0].end.properties.id
    if (
      !networkData.edgeList.includes(startNode + endNode) &&
      !networkData.edgeList.includes(endNode + startNode)
    ) {
      let edgeEntry = {
        data: { source: endNode, target: startNode, type: 'shared'},
      };
      networkData.edgeList.push(startNode + endNode);
      networkData.edges.push(edgeEntry);
    }
  }

  return networkData;
}

export function getNodes(networkData) {
  let nodeList = [];
  for (let i = 0; i < networkData.nodes.length; i++) {
    nodeList.push(networkData.nodes[i].data.id);
  }
  return nodeList;
}
