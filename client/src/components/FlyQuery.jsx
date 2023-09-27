import React, { useState, useRef } from "react";
import { Neo4jParser } from "../tools/Parser";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import { cytoscapeStyle, layout } from "../assets/CytoscapeConfig";
import Sidebar from "./Sidebar";


export default function FlyQuery() {
  const [query, setQuery] = useState({ protein: "", goTerm: "", k: [] });
  const [showResults, setShowResults] = useState(false);
  const [networkResult, setNetworkResult] = useState({});
  const cyRef = useRef(cytoscape.Core | undefined);
  

  const handleSubmit = async (e) => {
    setNetworkResult({})
    e.preventDefault();

    fetch("/api/getFlyBase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    })
      .then((response) => response.json())
      .then((data) => {
        setNetworkResult(Neo4jParser(data, query.protein, query.goTerm));
      })
      .catch((error) => {
        console.error("Error getting the network:", error);
      });
    setShowResults(true);
  };

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
        <div className="sidebar-align">
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
          <Sidebar />
        </div>
      )}
    </div>
  );
};