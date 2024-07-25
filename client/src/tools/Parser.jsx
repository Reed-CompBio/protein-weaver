/**
 * Parser for handling API response data from Neo4j's Yen's Shortest Path Algorithm.
 *
 * @param {JSON} data   JSON data containing all the k shortest paths
 * @param {string} source   Protein of Interest
 * @param {string} go_term   GO term of Interest
 * @returns {JSON}
 */

import { PanelResizeHandle } from "react-resizable-panels";


// tag::NetworkParser
export function NetworkParserPath(data, source) {
  let parsedData = { nodes: [], edges: [], nodeList: [], edgeList: [] };
  //Iterate through data where each element is a path
  for (let i = 0; i < data.length; i++) {
    let currentPath = data[i]._fields[4];
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
    let type = edgeData[i]._fields[0].segments[0].relationship.type;
    //If the edge is a Protein to GO term relationship:
    //Iterate through all the nodes in the nodeList and add the relationship information to the protein
    if (type === "ProGo") {
      for (let k = 0; k < networkData.nodes.length; k++) {
        let currentNode = networkData.nodes[k];
        if (currentNode.data.id === startNode) {
          networkData.nodes[k].data.go_protein =
            edgeData[i]._fields[0].segments[0].relationship.properties.relationship;
        }
      }
    }
    //If the edge is not a Protein to GO term relationship:
    //Check if the edge is already stored in networkData. If not, add the edge to networkData.edgeList
    else {
      if (
        //--------doesnt work for multiple regulatory relationships--------
        !networkData.edgeList.includes(startNode + endNode + type) &&
        !networkData.edgeList.includes(endNode + startNode + type)) {
        networkData.edgeList.push(startNode + endNode + type)
        networkData.edges.push({ data: { source: endNode, target: startNode, type: type } })
        // networkData.edges.push({ data: { source: endNode, target: startNode, type: type, tst: "shared" } })
      }
    }
  }
  return networkData;
}

export function NetworkParserNode(data, source, k) {
  let parsedData = { nodes: [], edges: [], nodeList: [], edgeList: [] };
  for (let i = 0; i < Math.min(k, data.length - 1); i++) {
    let currentPath = data[i];
    // console.log("current path", data[i]);
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
  }
  parsedData.goTerm = data[data.length - 1][0]._fields[0].properties;
  return parsedData;
}
