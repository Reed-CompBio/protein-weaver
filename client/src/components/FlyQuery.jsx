import React, { useState, useRef } from "react";
import { Neo4jParser } from "../tools/Parser";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import { cytoscapeStyle, layout } from "../assets/CytoscapeConfig";
import Sidebar from "./Sidebar";

import { SharedEdgeParser } from "../tools/SharedEdgeParser";

export default function FlyQuery() {
  const [query, setQuery] = useState({ protein: "", goTerm: "", k: [] });
  const [showResults, setShowResults] = useState(false);
  const [networkResult, setNetworkResult] = useState({});
  const cyRef = useRef(cytoscape.Core | undefined);
  const [sidebarNode, setSidebarNode] = useState("")

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
        return Neo4jParser(data, query.protein, query.goTerm);
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

  const getSidePanelData = (node) => {
    let currentNode = node.target.data();

    if (currentNode.type === "source") {
                console.log(currentNode.label, currentNode.type);
                setSidebarNode(currentNode);
    }
    if (currentNode.type === "intermediate") {
                console.log(currentNode.label, currentNode.type);
                setSidebarNode(currentNode);
    }
    else if (currentNode.type === "go_protein") {
                console.log(currentNode.label, currentNode.type);
                setSidebarNode(currentNode);
    }
};

  return (
    <div>
      <div className="container">
      <form method="post" onSubmit={handleSubmit} action="api/getFlyBase">

        <div className="wrapper">
          <h3>Enter Protein, GO Term and Number of Networks</h3>
          <div className="search-container">
        <input
          type="text"
          name="protein"
          placeholder="FBgn0031985"
          value={query.protein}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="goTerm"
          placeholder="GO:0003674"
          value={query.goTerm}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          min="0"
          name="k"
          placeholder="3"
          value={query.k}
          onChange={handleInputChange}
          required
        />
        <button
        type="submit"
        className="button"
        >Search for Networks</button>
          </div>
        </div>
      </form>
      </div>

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
            cy={(cy) => {
              cyRef.current = cy;
              cy.on('click', 'node', (evt) => {getSidePanelData(evt)});
            }}
           />
          <Sidebar
          props={sidebarNode}/>
        </div>
      )}
    </div>
  );
};