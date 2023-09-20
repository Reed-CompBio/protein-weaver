import React, { useState, useEffect} from "react";
import CytoscapeComponent from "react-cytoscapejs";

export default function CytoscapeRender(props) {
  // const element = {
  //     node: props.data.node
  // }
  const [showResults, setShowResults] = useState(0)

  const elements = {
    nodes: [
      {
        data: {
          id: "1",
          label: "Node 1",
          type: "interest",
          term: "GO-PROTEIN",
        },
        // position: { x: 50, y: 50 },
      },
      {
        data: { id: "2", label: "Node 2", type: "interest" },
        // position: { x: 150, y: 150 },
      },
      {
        data: {
          id: "3",
          label: "Node 3",
          type: "interest",
          term: "GO-PROTEIN",
        },
        // position: { x: 350, y: 100 },
      },
      {
        data: { id: "4", label: "Node 4", type: "interest" },
        // position: { x: 350, y: 350 },
      },
      {
        data: { id: "5", label: "Core Node 1", type: "source" },
        // position: { x: 250, y: 250 },
      },
      {
        data: { id: "6", label: "Node 6", type: "interest" },
        // position: { x: 350, y: 350 },
      },
      {
        data: { id: "7", label: "Node 7", type: "interest" },
        // position: { x: 350, y: 350 },
      },
      {
        data: { id: "8", label: "Node 8", type: "interest" },
        // position: { x: 350, y: 350 },
      },
    ],
    edges: [
      { data: { source: "2", target: "1", label: "Edge from Node1 to Node2" } },
      { data: { source: "5", target: "2", label: "Edge from Node1 to Node2" } },
      { data: { source: "5", target: "3", label: "Edge from Node1 to Node2" } },
      { data: { source: "5", target: "4", label: "Edge from Node1 to Node2" } },
      { data: { source: "6", target: "4", label: "Edge from Node1 to Node2" } },
      { data: { source: "6", target: "7", label: "Edge from Node1 to Node2" } },
      { data: { source: "6", target: "8", label: "Edge from Node1 to Node2" } },
    ],
  };

  console.log("Standard Element Format", elements)

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
      selector: "node[term='GO-PROTEIN']",
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

//   useEffect(() => {
//     console.log(props.data);
//   }, []);
  return (
    <div>
      {console.log("Parsed Element data", props.data)}
      <CytoscapeComponent
        className="cytoscape-graph"
        elements={CytoscapeComponent.normalizeElements(props.data)}
        style={{ width: "450px", height: "450px" }}
        stylesheet={cytoscapeStyle}
        // layout={layout}
        cy={(cy) => {
          cy.center(cy.elements("node[type='source']"));
        }}
        layout={layout}
      />
    </div>
  );
}
