import { React, useState, useEffect } from "react";

export default function Legend({
}) {

    // if currentNode is null, display query info and a message to select a node
    return (
      <div>
        <div id="legendContent" className="legend">
          <h2>Legend</h2>
          <div className="key-align">

            <div id="node-types" className="legend-container">
                <h3>Node Types</h3>
                <div className="dot-align">
                    <div className="source-node-symbol"></div>
                    <p className="white-text">&nbsp;&nbsp;Source node</p>
                </div>
                <div className="dot-align">
                    <div className="go-protein-symbol"></div>
                    <p className="white-text">&nbsp;&nbsp;GO protein</p>
                </div>
                <div className="dot-align">
                    <div className="intermediate-symbol"></div>
                    <p className="white-text">&nbsp;&nbsp;On path from GO protein to source node</p>
                </div>
            </div>

            <div id="edge-types" className="legend-container">
                <h3>Edge Types</h3>
                <div className="line-align">
                    <div className="black-line"></div>
                    <p className="white-text">&nbsp;&nbsp;Exists in shortest path</p>
                </div>
                <div className="line-align">
                    <div className="grey-line"></div>
                    <p className="white-text">&nbsp;&nbsp;Induced subgraph</p>
                </div>
            </div>
            
          </div>
        </div>
      </div>
    );
};