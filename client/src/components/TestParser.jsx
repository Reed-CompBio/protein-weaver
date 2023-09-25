import React, { useState, useEffect, useRef } from "react";
import { Neo4jParser } from "../tools/Parser";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, { Stylesheet } from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";

cytoscape.use(coseBilkent);

export default function TestParser() {
  const [elements, setElements] = useState({});
  const [showResults, setShowResults] = useState(false);
  const cyRef = useRef(cytoscape.Core | undefined);
  const [test, setTest] = useState({});

  const cytoscapeStyle = [
    {
      selector: "node",
      style: {
        width: 10,
        height: 10,
        "background-color": "#03c2fc",
        label: "data(label)",
        color: "black",
        "font-size": "12px",
      },
    },
    {
      selector: "node[type='source']",
      style: {
        width: 30,
        height: 30,
        shape: "circle",
        "background-color": "red",
      },
    },
    {
      selector: "node[type='go_protein']",
      style: {
        width: 30,
        height: 30,
        shape: "rectangle",
        "background-color": "purple",
      },
    },
    {
      selector: "node[type='intermediate']",
      style: {
        width: 15,
        height: 15,
        shape: "circle",
        "background-color": "light blue",
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "grey",
        "target-arrow-color": "grey",
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
        width: 30,
        height: 30,
      },
    },
  ];

  const layout = {
    name: "cose-bilkent",
    padding: 30,
    randomize: true,
    nodeRepulsion: 40000,
    idealEdgeLength: 50,
    idealEdgeLength: 50,
    nestingFactor: 0.1,
  };

  const getNetwork = () => {
    fetch("/api/getNetwork")
      .then((response) => response.json())
      .then((data) => {
        setElements(Neo4jParser(data, "FBgn0031985", "GO:0003674"));
      });
  };

  const postRequest = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);

    fetch("/api/postRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    })
      .then((response) => response.json())
      .then((data) => {
        setTest(data);
      });
  };

  return (
    <div>
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
            }}
            stylesheet={cytoscapeStyle}
            layout={layout}
          />
        </div>
      )}
      <form method="post" onSubmit={postRequest}>
        <label>
          Edit your post:
          <textarea name="postContent" defaultValue="" rows={4} cols={20} />
        </label>
        <hr />
        <button type="submit">Click postRequest</button>
      </form>
      <p>{JSON.stringify(test)}</p>
    </div>
  );
}
