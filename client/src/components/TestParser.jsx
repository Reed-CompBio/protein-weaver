import React, { useState, useEffect, useRef } from "react";
import { Neo4jParser } from "../tools/Parser";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, { Stylesheet } from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import { cytoscapeStyle, layout } from "../assets/CytoscapeConfig";

cytoscape.use(coseBilkent);

export default function TestParser() {
  const [elements, setElements] = useState({});
  const [showResults, setShowResults] = useState(false);
  const cyRef = useRef(cytoscape.Core | undefined);
  const [test, setTest] = useState({});

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
      {showResults && JSON.stringify(elements) != "{}"&& (
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
    </div>
  );
}
