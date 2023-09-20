import React, { useState, useEffect, useRef } from "react";
import { Neo4jParser } from "../tools/Parser";
import CytoscapeRender from "./CytoscapeRender";

export default function TestParser() {
  const [networkData, setNetworkData] = useState({});
  const [showResponse, setShowResponse] = useState(false);
  const effectRan = useRef(false);

  const getNetwork = () => {
    fetch("/api/getNetwork")
      .then((response) => response.json())
      .then((response) => {
        setNetworkData(Neo4jParser(response));
      });
  };

  useEffect(() => {
    if (effectRan.current === true) {
      console.log("UseEffect Triggered");
      fetch("/api/getNetwork")
        .then((response) => response.json())
        .then((response) => {
          setNetworkData(Neo4jParser(response));
        });
      //   return () => {
      //     console.log;
      //     effectRan.current = false;
      //   };
    }
    effectRan.current = false;
  }, [showResponse]);

  return (
    <div>
      <button
        onClick={() => {
          //   getNetwork();
          effectRan.current = true;
          setShowResponse(true);
        }}
      >
        Click to do getNetwork API call
      </button>
      <button
        onClick={() => {
          //   getNetwork();
          setShowResponse(false);
        }}
      >
        Disable
      </button>
      <div>
        {/* {console.log(networkData)} */}
        {showResponse && <CytoscapeRender data={networkData} />}
      </div>
    </div>
  );
}
