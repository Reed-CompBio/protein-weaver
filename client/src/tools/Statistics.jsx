export function getBasicStatistics(network, rawData, query) {
  let networkStatistics = {
    nodeCount: null,
    edgeCount: null,
    pathCount: null,
    avgNodeDegree: null,
  };
  networkStatistics.nodeCount = network.nodeList.length - 1;
  networkStatistics.edgeCount = network.edgeList.length;

  networkStatistics.pathCount = getPathCount(rawData, query.k, query.mode);
  return networkStatistics;
}

export function getPathCount(data, k, mode) {
  if (mode == "path") {
    return data.length;
  } else return Math.min(k, data.length - 1);
}

export async function fetchAvgDegree(network, species) {
  let nodeList = network.nodeList.slice(0, network.nodeList.length - 1);
  const requestBody = Object.assign(
    { nodeList: nodeList },
    {
      species: species,
    }
  );
  try {
    const response = await fetch("/api/getAvgDegree", {
      method: "POST", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Set the Content-Type header for JSON data
      },
      body: JSON.stringify(requestBody), // Convert the request body to JSON string
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    let data = await response.json();
    data = data[0]._fields[0];
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
