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

  async function handleSubmit(e) {
    setNetworkResult({});
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
      console.error("Error getting the network:", error, ". Protein or GO term may not exists");

    }

    if(network != null){
      const nodeList = { nodeList: network.nodeList };
      let sharedEdges = null
      try{
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
      }catch (error) {
        console.error("Error getting the network:", error);
        throwAsyncError(e)
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

  const useThrowAsyncError = () => {
    const [state, setState] = useState();

    return (error) => {
      setState(() => {throw error})
    }
  }

  const getSidePanelData = (node) => {
    let currentNode = node.target.data();
    console.log(currentNode);
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
              <button type="submit" className="button">
                Search for Networks
              </button>
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
              cy.on("click", "node", (evt) => {
                getSidePanelData(evt);
              });
            }}
          />
          <Sidebar />
        </div>
      )}
    </div>
  );
}
