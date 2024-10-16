export function NetworkParserPath(data) {
    const parsedData = { nodes: [], edges: [], nodeList: [], edgeList: [] };

    const getNodeLabel = (node) => {
        const { name, id, alt_name, gene_name } = node.properties;
        if (name && name !== "-") return name;
        if (gene_name && gene_name !== "-") return gene_name;
        return alt_name || id;
    };

    const createNodeEntry = (node, nodeType, degree) => ({
        data: {
            id: node.properties.id,
            label: getNodeLabel(node),
            degree: degree.low,
            alt_name: node.properties.alt_name,
            gene_name: node.properties.gene_name,
            type: nodeType,
        },
    });

    const addNodeIfNotExists = (nodeEntry, parsedData) => {
        if (!parsedData.nodeList.includes(nodeEntry.data.id)) {
            parsedData.nodeList.push(nodeEntry.data.id);
            parsedData.nodes.push(nodeEntry);
        }
    };

    const determineNodeType = (node, sourceId, currentIndex, pathLength) => {
        const isSource = node.properties.id.toUpperCase() === sourceId.toUpperCase();
        const isLastNode = currentIndex === pathLength - 2;
        if (isSource && isLastNode) return "go_source";
        if (isSource) return "source";
        if (isLastNode) return "go_protein";
        return "intermediate";
    };

    const addEdges = (path, parsedData) => {
        for (let j = 1; j < path.length - 1; j++) {
            const startNode = path[j - 1].properties.id;
            const endNode = path[j].properties.id;
            if (
                !parsedData.edgeList.includes(startNode + endNode) &&
                !parsedData.edgeList.includes(endNode + startNode)
            ) {
                parsedData.edgeList.push(startNode + endNode);
                parsedData.edges.push({ data: { source: endNode, target: startNode } });
            }
        }
    };

    data.forEach((item) => {
        const currentPath = item._fields[4];
        const sourceId = currentPath[0].properties.id;

        currentPath.forEach((node, index) => {
            if (index < currentPath.length - 1) {
                const nodeType = determineNodeType(node, sourceId, index, currentPath.length);
                const nodeEntry = createNodeEntry(node, nodeType, node.properties.degree);
                addNodeIfNotExists(nodeEntry, parsedData);
            }
        });

        addEdges(currentPath, parsedData);
    });

    parsedData.goTerm = data[0]._fields[data[0]._fields.length - 1]
    [data[0]._fields[data[0]._fields.length - 1].length - 1].properties;

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
    const tempEdgeList = [];
    const tempEdges = [];

    // Helper function to create edge entry
    function createEdgeEntry(source, target, relType, evidence, dataSource, type = "", regType = "") {
        return {
            data: {
                source,
                target,
                relType,
                evidence: evidence || "No Evidence",
                dataSource,
                type: type || undefined,
                regType: regType || undefined,
            },
        };
    }

    // Helper function to process ProPro edges
    function processProProEdge(startNode, endNode, relType, evidence, dataSource, type = "") {
        const edgeEntry = createEdgeEntry(endNode, startNode, relType, evidence, dataSource, type);
        tempEdgeList.push(startNode + endNode);
        tempEdges.push(edgeEntry);
    }

    // Helper function to process Reg edges
    function processRegEdge(startNode, endNode, relType, evidence, dataSource, regType, type = "") {
        const edgeEntry = createEdgeEntry(endNode, startNode, relType, evidence, dataSource, type, regType);
        tempEdgeList.push(startNode + endNode);
        tempEdges.push(edgeEntry);
    }

    // Helper function to process ProGo edges
    function processProGoEdge(startNode, edgeRelType) {
        networkData.nodes.forEach((node) => {
            if (node.data.id === startNode) {
                node.data.go_protein = edgeRelType;
            }
        });
    }

    // Main loop through all edges
    for (let i = 0; i < edgeData.length; i++) {
        const startNode = edgeData[i]._fields[0].start.properties.id;
        const endNode = edgeData[i]._fields[0].end.properties.id;
        const relType = edgeData[i]._fields[0].segments[0].relationship.type;
        const properties = edgeData[i]._fields[0].segments[0].relationship.properties;
        const { pubmed, link, reference: fbRef, interaction, source: dataSource, relationship: regType } = properties;

        const evidence = pubmed || link || fbRef || interaction;

        // // Check for existing edges in network data
        // const edgeExists = networkData.edgeList.includes(startNode + endNode) || networkData.edgeList.includes(endNode + startNode);
        // Check for existing edges in the exact specified order (startNode -> endNode)
        const edgeExists = networkData.edgeList.includes(startNode + endNode);

        // Check for shared edges (existing but reversed order: endNode -> startNode)
        const sharedEdgeExists = networkData.edgeList.includes(endNode + startNode);

        // Handle edge existence
        if (edgeExists) {
            // Handle ProPro edges
            if (relType === "ProPro" && ppi && edgeExists) {
                processProProEdge(startNode, endNode, relType, evidence, dataSource);
            }
            // Handle Reg edges
            else if (relType === "Reg" && regulatory && edgeExists) {
                processRegEdge(startNode, endNode, relType, evidence, dataSource, regType);
            }
            // Handle ProGo edges
            else if (relType === "ProGo") {
                processProGoEdge(startNode, properties.relationship);
            }
        } else if (sharedEdgeExists) {
            // Edge exists but in reversed order, label it as "shared"
            if (relType === "ProPro" && ppi && sharedEdgeExists) {
                processProProEdge(startNode, endNode, relType, evidence, dataSource);
            } else if (relType === "Reg" && sharedEdgeExists) {
                processRegEdge(startNode, endNode, relType, evidence, dataSource, regType, "shared");
            }
        } else if (!edgeExists) {
            // Edge exists but in reversed order, label it as "shared"
            if (relType === "ProPro") {
                processProProEdge(startNode, endNode, relType, evidence, dataSource, "shared");
            } else if (relType === "Reg") {
                processRegEdge(startNode, endNode, relType, evidence, dataSource, regType, "shared");
            }
        }
    }

    networkData.edgeList = tempEdgeList;
    networkData.edges = tempEdges;
    return networkData;
}

export function NetworkParserNode(data, k) {
    const parsedData = { nodes: [], edges: [], nodeList: [], edgeList: [] };

    const getNodeLabel = (node) => {
        const { name, id, alt_name, gene_name } = node.properties;
        if (name && name !== "-") return name;
        if (gene_name && gene_name !== "-") return gene_name;
        return alt_name || id;
    };

    const createNodeEntry = (node, nodeType, degree) => ({
        data: {
            id: node.properties.id,
            label: getNodeLabel(node),
            degree: degree.low,
            alt_name: node.properties.alt_name,
            gene_name: node.properties.gene_name,
            type: nodeType,
        },
    });

    const addNodeIfNotExists = (nodeEntry, parsedData) => {
        if (!parsedData.nodeList.includes(nodeEntry.data.id)) {
            parsedData.nodeList.push(nodeEntry.data.id);
            parsedData.nodes.push(nodeEntry);
        }
    };

    const determineNodeType = (node, sourceId, currentIndex, pathLength) => {
        const isSource = node.properties.id.toUpperCase() === sourceId.toUpperCase();
        const isLastNode = currentIndex === pathLength - 1;
        if (isSource && isLastNode) return "go_source";
        if (isSource) return "source";
        if (isLastNode) return "go_protein";
        return "intermediate";
    };

    const addEdges = (path, parsedData) => {
        for (let j = 1; j < path.length; j++) {
            const startNode = path[j - 1].properties.id;
            const endNode = path[j].properties.id;
            if (
                !parsedData.edgeList.includes(startNode + endNode) &&
                !parsedData.edgeList.includes(endNode + startNode)
            ) {
                parsedData.edgeList.push(startNode + endNode);
                parsedData.edges.push({ data: { source: endNode, target: startNode } });
            }
        }
    };

    data.slice(0, Math.min(k, data.length - 1)).forEach((currentPath) => {
        const sourceId = currentPath[0].properties.id;

        currentPath.forEach((node, index) => {
            const nodeType = determineNodeType(node, sourceId, index, currentPath.length);
            const nodeEntry = createNodeEntry(node, nodeType, node.properties.degree);
            addNodeIfNotExists(nodeEntry, parsedData);
        });

        addEdges(currentPath, parsedData);
    });

    parsedData.goTerm = data[data.length - 1][0]._fields[0].properties;

    return parsedData;
}