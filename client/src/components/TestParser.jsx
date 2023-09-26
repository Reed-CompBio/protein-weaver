import React, { useState, useEffect, useRef } from "react";
import { Neo4jParser } from "../tools/Parser";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape, { Stylesheet } from "cytoscape";
import coseBilkent from "cytoscape-cose-bilkent";
import { cytoscapeStyle, layout } from "../assets/CytoscapeConfig";
import { SharedEdgeParser, getNodes } from "../tools/SharedEdgeParser";

cytoscape.use(coseBilkent);

export default function TestParser() {
  const [elements, setElements] = useState({});
  const [showResults, setShowResults] = useState(false);
  const cyRef = useRef(cytoscape.Core | undefined);

  async function getCompleteNetwork() {
    const network = await fetch("/api/getNetwork")
      .then((response) => response.json())
      .then((data) => {
        setElements(Neo4jParser(data, "FBgn0031985", "GO:0003674"));
        return Neo4jParser(data, "FBgn0031985", "GO:0003674");
      });

    const sharedEdges = await fetch("/api/getSharedEdges")
      .then((response) => response.json())
      .then((edgeData) => {
        setElements(SharedEdgeParser(network, edgeData))
        return(SharedEdgeParser(network, edgeData))
      });
  }

  return (
    <div>
      <button
        onClick={() => {
          getCompleteNetwork();
          setShowResults(true);
        }}
      >
        Click to do getNetwork API call
      </button>
      {showResults && JSON.stringify(elements) != "{}" && (
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
