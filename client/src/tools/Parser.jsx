export function NetworkParser(data, source, go_term) {
  let parsedData = { nodes: [], edges: [], nodeList: [], edgeList: [] };
  for (let i = 0; i < data.length; i++) {
    let current = data[i];
    for (let [key, value] of Object.entries(current)) {
      if (key == "_fields") {
        let startNode = null;
        let endNode = null;
        for (let j = 0; j < value[4].length - 1; j++) {
          let nodeEntry = {
            data: {
              id: value[4][j].properties.id,
              label: value[4][j].properties.name,
            },
          };
          if (
            value[4][j].properties.name.toUpperCase() ===
              source.toUpperCase() ||
            value[4][j].properties.id.toUpperCase() === source.toUpperCase()
          ) {
            nodeEntry.data.type = "source";
          } else if (j == value[4].length - 2) {
            nodeEntry.data.type = "go_protein";
          } else {
            nodeEntry.data.type = "intermediate";
          }
          if (!parsedData.nodeList.includes(value[3][j])) {
            parsedData.nodeList.push(value[3][j]);
            parsedData.nodes.push(nodeEntry);
          }
        }
        for (let j = 1; j < value[4].length - 1; j++) {
          startNode = value[4][j - 1].properties.id;
          endNode = value[4][j].properties.id;
          if (
            !parsedData.edgeList.includes(startNode + endNode) &&
            !parsedData.edgeList.includes(endNode + startNode)
          ) {
            let edgeEntry = {
              data: { source: endNode, target: startNode },
            };
            parsedData.edgeList.push(startNode + endNode);
            parsedData.edges.push(edgeEntry);
          }
        }
      }
    }
  }
  parsedData.goTerm = data[0]._fields[data[0]._fields.length - 1][data[0]._fields[data[0]._fields.length - 1].length - 1].properties
  return parsedData;
}

export function EdgeDataParser(networkData, edgeData) {
  for (let i = 0; i < edgeData.length; i++) {
    let startNode = edgeData[i]._fields[0].start.properties.id;
    let endNode = edgeData[i]._fields[0].end.properties.id;
    if (
      !networkData.edgeList.includes(startNode + endNode) &&
      !networkData.edgeList.includes(endNode + startNode) &&
      edgeData[i]._fields[0].segments[0].relationship.type != "ProGo"
    ) {
      let edgeEntry = {
        data: { source: endNode, target: startNode, type: "shared" },
      };
      networkData.edgeList.push(startNode + endNode);
      networkData.edges.push(edgeEntry);
    } else if (
      edgeData[i]._fields[0].segments[0].relationship.type === "ProGo"
    ) {
      for (let k = 0; k < networkData.nodes.length; k++) {
        let currentNode = networkData.nodes[k];
        if (currentNode.data.id === startNode) {
          networkData.nodes[k].data.go_protein =
            edgeData[
              i
            ]._fields[0].segments[0].relationship.properties.relationship;
        }
      }
    }
  }
  return networkData;
}
