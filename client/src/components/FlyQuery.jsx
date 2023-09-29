import React, { useState, useRef } from "react";
import { Neo4jParser } from "../tools/Parser";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import { cytoscapeStyle, layout } from "../assets/CytoscapeConfig";
import Sidebar from "./Sidebar";
import { SharedEdgeParser } from "../tools/SharedEdgeParser";
import QueryError from "./QueryError";

export default function FlyQuery() {
  const [query, setQuery] = useState({ protein: "", goTerm: "", k: [] });
  const [showResults, setShowResults] = useState(false);
  const [networkResult, setNetworkResult] = useState({});
  const cyRef = useRef(cytoscape.Core | undefined);
  const [sidebarNode, setSidebarNode] = useState("");
  const [sourceNode, setSourceNode] = useState("");
  const [goTerm, setGoTerm] = useState("");
  const [hasError, setHasError] = useState(false);

  async function handleSubmit(e) {
    setNetworkResult({});
    setHasError(false);
    e.preventDefault();
    let network = null;
    try {
      network = await fetch("/api/getFlyBase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 404) {
            return Promise.reject("error 404");
          } else {
            return Promise.reject("some other error: " + response.status);
          }
        })
        .then((data) => {
          setNetworkResult(Neo4jParser(data, query.protein, query.goTerm));
          return Neo4jParser(data, query.protein, query.goTerm);
        });
    } catch (error) {
      console.error(
        "Error getting the network:",
        error,
        ". Protein or GO term may not exists"
      );
      setHasError(true);
    }

    if (network != null) {
      let nodeList = { nodeList: network.nodeList };
      nodeList.nodeList.push(query.goTerm);
      setSourceNode(network.nodes[0].data.label);
      setGoTerm(query.goTerm);
      let sharedEdges = null;
      try {
        sharedEdges = await fetch("/api/getSharedEdges", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nodeList),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else if (response.status === 404) {
              return Promise.reject("error 404");
            } else {
              return Promise.reject("some other error: " + response.status);
            }
          })
          .then((edgeData) => {
            setNetworkResult(SharedEdgeParser(network, edgeData));
            return SharedEdgeParser(network, edgeData);
          });

        setShowResults(true);
      } catch (error) {
        console.error("Error getting the network:", error);
        setHasError(true);
      }
    }
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
    console.log(currentNode);
    setSidebarNode(currentNode);

    // if (currentNode.type === "source") {
    //             console.log(currentNode);
    //             setSidebarNode(currentNode);
    // }
    // else if (currentNode.type === "intermediate") {
    //             console.log(currentNode);
    //             setSidebarNode(currentNode);
    // }
    // else if (currentNode.type === "go_protein") {
    //             console.log(currentNode);
    //             setSidebarNode(currentNode);
    // }
};

  return (
    <div>
      <div className="search-box-align">
        <div className="container">
          <form method="post" onSubmit={handleSubmit} action="api/getFlyBase">
            <div className="wrapper">
              <h2>
                Enter protein, GO term and number of paths to visualize...
              </h2>
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
                <button type="submit" className="button">
                  Search for Networks
                </button>
              </div>
            </div>
          </form>
        </div>

        {hasError && <QueryError />}

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
                cy.on("click", "node", (evt) => {
                  getSidePanelData(evt);
                });
              }}
            />
            <Sidebar
              currentNode={sidebarNode}
              sourceNode={sourceNode}
              log={query}
              goTerm={goTerm}
            />
          </div>
        )}
      </div>
    </div>
  );
}
