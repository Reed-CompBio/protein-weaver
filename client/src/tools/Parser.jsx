export function NetworkParserPath(data) {
    let parsedData = { nodes: [], edges: [], nodeList: [], edgeList: [] };
    // console.log(data)
    //Iterate through data where each element is a path
    for (let i = 0; i < data.length; i++) {
        let currentPath = data[i]._fields[4];
        let startNode = null;
        let endNode = null;
        let sourceId = null;
        for (let j = 0; j < currentPath.length - 1; j++) {
            let nodeName = currentPath[j].properties.name;
            let nodeId = currentPath[j].properties.id;
            let nodeAltName = currentPath[j].properties.alt_name;
            let nodeGeneName = currentPath[j].properties.gene_name;
            let physicalDegree = currentPath[j].properties.degree.low;

            // handles the case where name param doesnt exist. representing node that only has regulatory interactions
            if (nodeName) {
                nodeName = nodeName === "-" ? nodeId : nodeName;
            } else if (nodeGeneName) {
                nodeName = nodeGeneName === "-" ? nodeId : nodeGeneName;
            } else if (nodeAltName) {
                nodeName = nodeAltName;
            } else {
                nodeName = nodeId;
            }

            // source protein is always the first element
            if (j == 0) {
                sourceId = currentPath[j].properties.id;
            }

            //Add each node in a path, and label them accordingly (source, go_protein, or intermediate)
            //Keep track of all the nodes in nodeList
            let nodeEntry = {
                data: {
                    id: nodeId,
                    label: nodeName,
                    degree: physicalDegree,
                    alt_name: nodeAltName,
                    gene_name: nodeGeneName,
                },
            };
            if (
                nodeId.toUpperCase() == sourceId.toUpperCase() &&
                j == currentPath.length - 2
            ) {
                nodeEntry.data.type = "go_source";
            } else if (nodeId.toUpperCase() == sourceId.toUpperCase()) {
                nodeEntry.data.type = "source";
            } else if (j == currentPath.length - 2) {
                nodeEntry.data.type = "go_protein";
            } else {
                nodeEntry.data.type = "intermediate";
            }
            if (!parsedData.nodeList.includes(nodeId)) {
                parsedData.nodeList.push(nodeId);
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
                    data: {
                        source: endNode,
                        target: startNode,
                    },
                };
                // console.log(i, "Adding an edge")
                // console.log(edgeEntry)
                parsedData.edgeList.push(startNode + endNode);
                parsedData.edges.push(edgeEntry);
                // console.log(parsedData.edges)
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
export function EdgeDataParser(networkData, edgeData, ppi, regulatory) {
    //Iterate through al the edges in the induced subgraph
    // console.log(edgeData)
    //Iterate through al the edges in the induced subgraph
    let tempEdgeList = [];
    let tempEdges = [];
    for (let i = 0; i < edgeData.length; i++) {
        let startNode = edgeData[i]._fields[0].start.properties.id;
        let endNode = edgeData[i]._fields[0].end.properties.id;
        let relType = edgeData[i]._fields[0].segments[0].relationship.type;
        let pubmed =
            edgeData[i]._fields[0].segments[0].relationship.properties.pubmed;
        let link =
            edgeData[i]._fields[0].segments[0].relationship.properties.link;
        let fbRef =
            edgeData[i]._fields[0].segments[0].relationship.properties
                .reference;
        let interaction =
            edgeData[i]._fields[0].segments[0].relationship.properties
                .interaction;
        let dataSource = edgeData[i]._fields[0].segments[0].relationship.properties
            .source
        //Check for shared edges
        //If the edge already exists in the initial network data, add it to the temp edge list
        if (
            networkData.edgeList.includes(endNode + startNode) ||
            networkData.edgeList.includes(startNode + endNode)
        ) {
            if (relType === "ProPro" && ppi) {
                if (pubmed) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            relType: relType,
                            evidence: pubmed,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                } else if (link) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            relType: relType,
                            evidence: link,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                } else if (fbRef) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            relType: relType,
                            evidence: fbRef,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                } else if (interaction) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            relType: relType,
                            evidence: interaction,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                } else {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            relType: relType,
                            evidence: "No Evidence",
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                }
            }
            if (relType === "Reg" && regulatory) {
                let regType = edgeData[i]._fields[0].segments[0].relationship.properties.relationship;
                if (pubmed) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            relType: relType,
                            evidence: pubmed,
                            regType: regType,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                }
                else if (link) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            relType: relType,
                            evidence: link,
                            regType: regType,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                }
                else if (fbRef) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            relType: relType,
                            evidence: fbRef,
                            regType: regType,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                }
                else if (interaction) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            relType: relType,
                            evidence: interaction,
                            regType: regType,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                } else {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            relType: relType,
                            evidence: "No Link",
                            regType: regType,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                }
            }
        }
        //If the edge type is ProGo, add the edges relationship properties to the network data
        else if (relType === "ProGo") {
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
        //If an edge is found that was not a part of the inital network data, add it to the temp edge list with the shared tag
        else {
            if (relType === "ProPro") {
                if (pubmed) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            type: "shared",
                            relType: relType,
                            evidence: pubmed,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                }
                else if (link) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            type: "shared",
                            relType: relType,
                            evidence: link,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                }
                else if (fbRef) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            type: "shared",
                            relType: relType,
                            evidence: fbRef,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                } else if (interaction) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            type: "shared",
                            relType: relType,
                            evidence: interaction,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                } else {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            relType: relType,
                            type: "shared",
                            evidence: "No Link",
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                }
            }
            else if (relType === "Reg") {
                let regType = edgeData[i]._fields[0].segments[0].relationship.properties.relationship;
                if (pubmed) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            relType: relType,
                            type: "shared",
                            evidence: pubmed,
                            regType: regType,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                }
                else if (link) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            relType: relType,
                            type: "shared",
                            evidence: link,
                            regType: regType,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                }
                else if (fbRef) {
                    let edgeEntry = {
                        data: {
                            source: endNode,
                            target: startNode,
                            relType: relType,
                            type: "shared",
                            evidence: fbRef,
                            regType: regType,
                            dataSource: dataSource,
                        },
                    };
                    tempEdgeList.push(startNode + endNode);
                    tempEdges.push(edgeEntry);
                }
            } else if (interaction) {
                let edgeEntry = {
                    data: {
                        source: endNode,
                        target: startNode,
                        type: "shared",
                        relType: relType,
                        evidence: interaction,
                        dataSource: dataSource,
                    },
                };
                tempEdgeList.push(startNode + endNode);
                tempEdges.push(edgeEntry);
            } else {
                let edgeEntry = {
                    data: {
                        source: endNode,
                        target: startNode,
                        relType: relType,
                        type: "shared",
                        evidence: "No Evidence",
                        dataSource: dataSource,
                    },
                };
                tempEdgeList.push(startNode + endNode);
                tempEdges.push(edgeEntry);
            }
        }
    }
    networkData.edgeList = tempEdgeList;
    networkData.edges = tempEdges;
    return networkData;
}
export function NetworkParserNode(data, k) {
    let parsedData = { nodes: [], edges: [], nodeList: [], edgeList: [] };
    for (let i = 0; i < Math.min(k, data.length - 1); i++) {
        let currentPath = data[i];
        let sourceId = null;
        for (let j = 0; j < currentPath.length; j++) {
            //Add each node in a path, and label them accordingly (source, go_protein, or intermediate)
            //Keep track of all the nodes in nodeList
            //If the edge already exists in the initial network data, add it to the temp edge list\
            let nodeName = currentPath[j].properties.name;
            let nodeId = currentPath[j].properties.id;
            let nodeAltName = currentPath[j].properties.alt_name;
            let nodeGeneName = currentPath[j].properties.gene_name;
            let physicalDegree = currentPath[j].properties.degree.low;

            // handles the case where name param doesnt exist. representing node that only has regulatory interactions
            if (nodeName) {
                nodeName = nodeName === "-" ? nodeId : nodeName;
            } else if (nodeGeneName) {
                nodeName = nodeGeneName === "-" ? nodeId : nodeGeneName;
            } else if (nodeAltName) {
                nodeName = nodeAltName;
            } else {
                nodeName = nodeId;
            }


            // source protein is always the first element
            if (j == 0) {
                sourceId = currentPath[j].properties.id;
            }

            let nodeEntry = {
                data: {
                    id: nodeId,
                    label: nodeName,
                    degree: physicalDegree,
                    alt_name: nodeAltName,
                    gene_name: nodeGeneName,
                },
            };
            if (
                nodeId.toUpperCase() === sourceId.toUpperCase() &&
                j == currentPath.length - 1
            ) {
                nodeEntry.data.type = "go_source";
            } else if (nodeId.toUpperCase() === sourceId.toUpperCase()) {
                nodeEntry.data.type = "source";
            } else if (j == currentPath.length - 1) {
                nodeEntry.data.type = "go_protein";
            } else {
                nodeEntry.data.type = "intermediate";
            }
            if (!parsedData.nodeList.includes(nodeId)) {
                parsedData.nodeList.push(nodeId);
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
                    data: {
                        source: endNode,
                        target: startNode,
                    },
                };
                parsedData.edgeList.push(startNode + endNode);
                parsedData.edges.push(edgeEntry);
            }
        }
    }
    parsedData.goTerm = data[data.length - 1][0]._fields[0].properties;
    return parsedData;
}
