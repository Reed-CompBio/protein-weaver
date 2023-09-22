import React, { useState, useEffect, useRef } from "react";
import { Neo4jParser } from "../tools/Parser";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, { Stylesheet } from "cytoscape";
import FlyBaseService from "../../../server/services/flybase.service";

export default function FlyQuery() {
    const [elements, setElements] = useState({});
    const cyRef = useRef(cytoscape.Core | undefined);
    const [proteinInput, setProteinInput] = useState('FBgn0031985'); // Default value
    const [goTermInput, setGoTermInput] = useState('GO:0003674'); // Default value
    const [kInput, setKInput] = useState('5'); // Default value
    const [showResults, setShowResults] = useState(false);

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

  const getFlyBase = () => {
    fetch("/api/getFlyBase?proteinInput=${proteinInput}&goTermInput=${goTermInput}")
      .then((response) => response.json())
      .then((data) => {
        setElements(Neo4jParser( data, proteinInput, goTermInput ));
      });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter source node ID"
        value={proteinInput}
        onChange={(e) => setProteinInput(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter target node ID"
        value={goTermInput}
        onChange={(e) => setGoTermInput(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter number of pathways to display"
        value={kInput}
        onChange={(e) => setKInput(e.target.value)}
      />
        <br/>
      <button
        onClick={() => {
          getFlyBase();
          setShowResults(true);
        }}
      >
        Click to Query FlyBase API
      </button>
      {JSON.stringify(elements) === "{}" ? (
        <p>Loading...</p>
      ) : (
        <div>
          <CytoscapeComponent
            className="cytoscape-graph"
            elements={CytoscapeComponent.normalizeElements(elements)}
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
      )}
    </div>
  );
}