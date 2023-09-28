export function Neo4jParser(data, source, go_term) {
  let parsedData = { nodes: [], edges: [], nodeList: [], edgeList: [] };
  for (let i = 0; i < data.length; i++) {
    let current = data[i];
    for (let [key, value] of Object.entries(current)) {
      if (key == "_fields") {
        let startNode = null;
        let endNode = null;
        for (let j = 0; j < value[3].length - 1; j++) {
          let nodeEntry = {
            data: { id: value[3][j], label: value[3][j]},
          };
          if(value[3][j] === source){
            nodeEntry.data.type = "source"
          }else if(j == value[3].length - 2){
            nodeEntry.data.type = "go_protein"
          }else {
            nodeEntry.data.type = "intermediate"
          }
          if (!parsedData.nodeList.includes(value[3][j])) {
            parsedData.nodeList.push(value[3][j]);
            parsedData.nodes.push(nodeEntry);
          }
        }
        for (let j = 1; j < value[3].length - 1; j++) {
          startNode = value[3][j - 1];
          endNode = value[3][j];
          if (
            !parsedData.edgeList.includes(startNode + endNode) &&
            !parsedData.edgeList.includes(endNode + startNode)
          ) {
            let edgeEntry = {
              data: { source: endNode, target: startNode},
            };
            parsedData.edgeList.push(startNode + endNode);
            parsedData.edges.push(edgeEntry);
          }
        }
      }
    }
  }
  return parsedData;
}
