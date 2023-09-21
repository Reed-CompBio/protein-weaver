import React, { useState, useEffect, useRef } from "react";
import { Neo4jParser } from "../tools/Parser";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, { Stylesheet } from "cytoscape";

export default function TestParser() {
  const [elements, setElements] = useState({});
  const cyRef = useRef(cytoscape.Core | undefined);
  const [proteinInput, setProteinInput] = useState('Enter FlyBase ID: "FBgn0031985"');
  const [goTermInput, setGoTermInput] = useState('Enter GO Term: "GO:0003674"');
  const [kInput, setKInput] = useState('Number of Pathways to Display: 5');
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

  const getNetwork = () => {
    fetch("/api/getNetwork")
      .then((response) => response.json())
      .then((data) => {
        setElements(Neo4jParser( data, proteinInput, goTermInput ));
      });
  };

  return (
    <div>
      <input
            type="text"
            value={proteinInput}
            onChange={(e) => setProteinInput(e.target.value)}
      />
      <input
            type="text"
            value={goTermInput}
            onChange={(e) => setGoTermInput(e.target.value)}
      />
      <input
            type="text"
            value={kInput}
            onChange={(e) => setKInput(e.target.value)}
      />
        <br/>
      <button
        onClick={() => {
          getNetwork();
          setShowResults(true);
        }}
      >
        Click to do getNetwork API call
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