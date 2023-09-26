import React, { useState, useEffect, useRef } from "react";
import { Neo4jParser } from "../tools/Parser";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import { cytoscapeStyle, layout } from "../assets/CytoscapeConfig";
import { SharedEdgeParser } from "../tools/SharedEdgeParser";

export default function FlyQuery() {
  const [query, setQuery] = useState({ protein: "", goTerm: "", k: [] });
  const [showResults, setShowResults] = useState(false);
  const [networkResult, setNetworkResult] = useState({});
  const cyRef = useRef(cytoscape.Core | undefined);

  async function handleSubmit(e) {
    setNetworkResult({});
    e.preventDefault();

    const network = await fetch("/api/getFlyBase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    })
      .then((response) => response.json())
      .then((data) => {
        setNetworkResult(Neo4jParser(data, query.protein, query.goTerm));
        return Neo4jParser(data, "FBgn0031985", "GO:0003674");
      })
      .catch((error) => {
        console.error("Error getting the network:", error);
      });

    const nodeList = {nodeList: network.nodeList}

    const sharedEdges = await fetch("/api/getSharedEdges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nodeList),
    })
      .then((response) => response.json())
      .then((edgeData) => {
        setNetworkResult(SharedEdgeParser(network, edgeData));
        return SharedEdgeParser(network, edgeData);
      });

    setShowResults(true);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuery((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2>Enter Protein, GO Term and Number of Networks</h2>
      <form method="post" onSubmit={handleSubmit} action="api/getFlyBase">
        <label>FlyBase Protein ID:</label>
        <input
          type="text"
          name="protein"
          value={query.protein}
          onChange={handleInputChange}
          required
        />
        <label>GO Term:</label>
        <input
          type="text"
          name="goTerm"
          value={query.goTerm}
          onChange={handleInputChange}
          required
        />
        <label>Number of Paths:</label>
        <input
          type="number"
          name="k"
          value={query.k}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Search for Networks</button>
      </form>

      {showResults && JSON.stringify(networkResult) != "{}" && (
        <div>
          <CytoscapeComponent
            className="cytoscape-graph"
            elements={CytoscapeComponent.normalizeElements(networkResult)}
            style={{
              width: "800px",
              height: "500px",
            }}
            stylesheet={cytoscapeStyle}
            layout={layout}
          />
        </div>
      )}
    </div>
  );
}
