import React, { useState, useEffect, useRef } from "react";
import { Neo4jParser } from "../tools/Parser";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, { Stylesheet } from "cytoscape";

export default function FlyQuery() {
  const [query, setQuery] = useState({ "protein": "", "goTerm": "", "k" : []});
  const [networkResult, setNetworkResult] = useState({});
  const cyRef = useRef(cytoscape.Core | undefined);

  const cytoscapeStyle = [
    {
      selector: "node",
      style: {
        width: 20,
        height: 20,
        "background-color": "#03c2fc",
        label: "data(label)",
        color: "white",
      },
    },
    {
      selector: "node[type='source']",
      style: {
        shape: "rectangle",
        "background-color": "red",
      },
    },
    {
      selector: "node[type='go_protein']",
      style: {
        shape: "rectangle",
        "background-color": "purple",
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "white",
        "target-arrow-color": "white",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
      },
    },
    {
      selector: "node:selected",
      style: {
        "border-width": "3px",
        "border-color": "white",
        "border-opacity": "0.5",
        "background-color": "red",
        width: 30,
        height: 30,
        //text props
        "text-outline-color": "black",
        "text-outline-width": "3px",
      },
    },
  ];

  const layout = {
    name: "random",
    fit: true,
    // // circle: true,
    // directed: true,
    padding: 50,
    animate: false,
    // animationDuration: 1000,
    avoidOverlap: true,
    // nodeDimensionsIncludeLabels: false,
    // center: ""
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(query)

    fetch('/api/getFlyBase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    })
      .then((response) => response.json())
      .then((data) => {
        setNetworkResult(Neo4jParser(data, query.protein, query.goTerm));
      })
      .catch((error) => {
        console.error('Error getting the network:', error);
      });
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
      <form method="post" onSubmit={handleSubmit} action='api/getFlyBase'>
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
        <label>Number of Pathways:</label>
        <input
          type="number"
          name="k"
          value={query.k}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Search for Networks</button>
      </form>
      {JSON.stringify(networkResult) === "{}" ? (
        <p>Loading...</p>

      ) : (
        <div>
          <CytoscapeComponent
            className="cytoscape-graph"
            elements={CytoscapeComponent.normalizeElements(networkResult)}
            style={{
              width: "800px",
              height: "500px",
              border: "1px solid black",
            }}
            stylesheet={cytoscapeStyle}
            layout={layout}
            cy={(cy) => (cyRef.current = cy)}
          />
        </div>
      )
      }
    </div>
  );
}
