/**
 * Parser for handling API response data from Neo4j's Yen's Shortest Path Algorithm.
 *
 * @param {JSON} data   JSON data containing all the k shortest paths
 * @param {string} source   Protein of Interest
 * @param {string} go_term   GO term of Interest
 * @returns {JSON}
 */
// tag::NetworkParser
export function NetworkParserPath(data, source, go_term) {
  let parsedData = { nodes: [], edges: [], nodeList: [], edgeList: [] };
  //Iterate through data where each element is a path
  for (let i = 0; i < data.length; i++) {
    let currentPath = data[i]._fields[4];
    let startNode = null;
    let endNode = null;
    for (let j = 0; j < currentPath.length - 1; j++) {
      //Add each node in a path, and label them accordingly (source, go_protein, or intermediate)
      //Keep track of all the nodes in nodeList
      let nodeEntry = {
        data: {
          id: currentPath[j].properties.id,
          label: currentPath[j].properties.name,
          degree: currentPath[j].properties.degree.low
        },
      };
      if (
        (currentPath[j].properties.name.toUpperCase() === source.toUpperCase() ||
          currentPath[j].properties.id.toUpperCase() === source.toUpperCase() ||
          currentPath[j].properties.alt_name.toUpperCase() === source.toUpperCase()
        ) &&
        j == currentPath.length - 2
      ) {
        nodeEntry.data.type = "go_source";
      } else if (
        currentPath[j].properties.name.toUpperCase() === source.toUpperCase() ||
        currentPath[j].properties.id.toUpperCase() === source.toUpperCase() ||
        currentPath[j].properties.alt_name.toUpperCase() === source.toUpperCase()
      ) {
        nodeEntry.data.type = "source";
      } else if (j == currentPath.length - 2) {
        nodeEntry.data.type = "go_protein";
      } else {
        nodeEntry.data.type = "intermediate";
      }
      if (!parsedData.nodeList.includes(currentPath[j].properties.id)) {
        parsedData.nodeList.push(currentPath[j].properties.id);
        parsedData.nodes.push(nodeEntry);
      }
    }
    for (let j = 1; j < currentPath.length - 1; j++) {
      //Add the edges in a path and keep track in the edgeList
      startNode = currentPath[j - 1].properties.id;
      endNode = currentPath[j].properties.id;
      if (
        !parsedData.edgeList.includes(startNode + endNode) &&
        !parsedData.edgeList.includes(endNode + startNode)
      ) {
        let edgeEntry = {
          data: { source: endNode, target: startNode, evidence: "evidenceTest"},
        };
        parsedData.edgeList.push(startNode + endNode);
        parsedData.edges.push(edgeEntry);
      }
    }
  }
  parsedData.goTerm =
    data[0]._fields[data[0]._fields.length - 1][
      data[0]._fields[data[0]._fields.length - 1].length - 1
    ].properties;
  return parsedData;
}

/**
 * Parser that handles API response data from Neo4j all edges in an induced subgraph query.
 * Adds shared edge information and Protein to GO Term relationship properties
 *
 * @param {JSON} networkData   JSON data from NetworkParser which outlines preliminary network data
 * @param {JSON} edgeData JSON data from API response with all edges in an induced subgraph
 * @returns {JSON}
 */
// tag::EdgeDataParser
export function EdgeDataParser(networkData, edgeData) {
  //Iterate through al the edges in the induced subgraph
  for (let i = 0; i < edgeData.length; i++) {
    let startNode = edgeData[i]._fields[0].start.properties.id;
    let endNode = edgeData[i]._fields[0].end.properties.id;
    //check for shared edges
    if (
      !networkData.edgeList.includes(startNode + endNode) &&
      !networkData.edgeList.includes(endNode + startNode) &&
      edgeData[i]._fields[0].segments[0].relationship.type != "ProGo"
    ) {
      let edgeEntry = {
        data: { source: endNode, target: startNode, type: "shared", evidence: "evidenceTest"},
      };
      networkData.edgeList.push(startNode + endNode);
      networkData.edges.push(edgeEntry);
    }
    //If the edge is a Protein to GO term relationship,
    //iterate through all the nodes in the nodeList and add the relationship information to the protein
    else if (edgeData[i]._fields[0].segments[0].relationship.type === "ProGo") {
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

export function NetworkParserNode(data, source, k) {
  let parsedData = { nodes: [], edges: [], nodeList: [], edgeList: [] };
  for (let i = 0; i < Math.min(k, data.length - 1); i++) {
    let currentPath = data[i];
    for (let j = 0; j < currentPath.length; j++) {
      //Add each node in a path, and label them accordingly (source, go_protein, or intermediate)
      //Keep track of all the nodes in nodeList
      let nodeEntry = {
        data: {
          id: currentPath[j].properties.id,
          label: currentPath[j].properties.name,
          degree: currentPath[j].properties.degree.low
        },
      };
      if (
        (currentPath[j].properties.name.toUpperCase() === source.toUpperCase() ||
          currentPath[j].properties.id.toUpperCase() === source.toUpperCase() ||
          currentPath[j].properties.alt_name.toUpperCase() === source.toUpperCase()
        ) &&
        j == currentPath.length - 1
      ) {
        nodeEntry.data.type = "go_source";
      } else if (
        currentPath[j].properties.name.toUpperCase() === source.toUpperCase() ||
        currentPath[j].properties.id.toUpperCase() === source.toUpperCase() ||
        currentPath[j].properties.alt_name.toUpperCase() === source.toUpperCase()
      ) {
        nodeEntry.data.type = "source";
      } else if (j == currentPath.length - 1) {
        nodeEntry.data.type = "go_protein";
      } else {
        nodeEntry.data.type = "intermediate";
      }
      if (!parsedData.nodeList.includes(currentPath[j].properties.id)) {
        parsedData.nodeList.push(currentPath[j].properties.id);
        parsedData.nodes.push(nodeEntry);
      }
    }
    let startNode = null;
    let endNode = null;
    for (let j = 1; j < currentPath.length; j++) {
      //Add the edges in a path and keep track in the edgeList
      startNode = currentPath[j - 1].properties.id;
      endNode = currentPath[j].properties.id;
      if (
        !parsedData.edgeList.includes(startNode + endNode) &&
        !parsedData.edgeList.includes(endNode + startNode)
      ) {
        let edgeEntry = {
          data: { source: endNode, target: startNode, evidence: "evidenceTest"},
        };
        parsedData.edgeList.push(startNode + endNode);
        parsedData.edges.push(edgeEntry);
      }
    }
  }
  parsedData.goTerm = data[data.length - 1][0]._fields[0].properties;
  return parsedData;
}
