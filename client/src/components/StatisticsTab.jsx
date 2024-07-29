import React, { useState, useRef, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { MdConstruction } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";

import iconNode from "/src/assets/icon-node.png";
import iconPaths from "/src/assets/icon-paths.png";
import iconEdges from "/src/assets/icon-edges.png";
import iconDegree from "/src/assets/icon-degree.png";



export default function StatisticsTab({ networkStatistics, edgeEvidence, edgeSource, edgeTarget, edgeTab }) {
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    console.log(edgeEvidence)
  }, [edgeEvidence]);

  return (
    <div className="statistics-panel-container">
      <Tabs
        selectedIndex={tabIndex}
        onSelect={(index) => setTabIndex(index)}
        className="stats-tabs"
        selectedTabClassName="stats-tab-selected"
      >
        <TabList className="stats-tab-list">
          <Tab className="stats-tab">Graph</Tab>
          
          <Tab className="stats-tab-construction" disabled={true}>
            Nodes
            <MdConstruction
              data-tooltip-id="construction-tooltip"
              className="construction"
            />
          </Tab>{" "}
          <Tab className="stats-tab">Edges</Tab>
        </TabList>
        <TabPanel>
          <h4 className="stats-title">Graph stats</h4>
          <div className="graph-stats-container">
            <div className="img-text-container">
              <div>
                <div className="node-icon-container">
                <img src={iconNode} 
                alt="Node Icon" 
                className="icon1"
                data-tooltip-id="nodeTooltip"
                />
                <ReactTooltip 
                  id="nodeTooltip" 
                  place="top" 
                  content="Number of nodes displayed on graph" 
                  effect="float" />
                </div>
              </div>
              <div>
                <p># of nodes: {networkStatistics.nodeCount}</p>
              </div>
            </div>
            <div className="img-text-container">
              <div>
                <div className="edges-icon-container">
                <img src={iconPaths}
                alt="Edges icon"
                className="icon2"
                data-tooltip-id="edges-tooltip"
                />
                <ReactTooltip
                  id="edges-tooltip"
                  place="top"
                  content="Number of edges displayed on graph"
                  effect="float" />
                </div>
              </div>
              <div>
                <p># of edges: {networkStatistics.edgeCount}</p>
              </div>
            </div>
            <div className="img-text-container">
              <div>
                <div className="paths-icon-container">
                <img src={iconEdges}
                alt="Paths icon"
                className="icon3"
                data-tooltip-id="paths-tooltip"
                />
                <ReactTooltip
                  id="paths-tooltip"
                  place="top"
                  content="Number of paths from the GO protein to source node"
                  effect="float" />
                </div>
              </div>
              <div>
                <p># of paths: {networkStatistics.pathCount}</p>
              </div>
            </div>
            <div className="img-text-container">
              <div>
                <div className="degree-icon-container">
                <img src={iconDegree}
                alt="Degree icon"
                className="icon4"
                data-tooltip-id="degree-tooltip"
                />
                <ReactTooltip
                  id="degree-tooltip"
                  place="top"
                  content="Higher degree indicates more neighboring nodes"
                  effect="float" />
                </div>
              </div>
              <div>
                <p>Average node degree: {networkStatistics.avgNodeDegree}</p>
              </div>
            </div>
          </div>

          {/* <div className="graph-statistics-container">
            <div>
              <ul className="statistics-list">
                <li># of nodes: {networkStatistics.nodeCount}</li>
                <li># of edges: {networkStatistics.edgeCount}</li>
                <li># of paths from source: {networkStatistics.pathCount}</li>
                <li>Average node degree: {networkStatistics.avgNodeDegree}</li>
              </ul>
            </div>
          </div> */}

        </TabPanel>
        <TabPanel>
          <h4 className="stats-title" >Node stats</h4>
        </TabPanel>
        <TabPanel>
          <h4 className="stats-title" >Edges stats</h4>
          <div className= "edge-container">
            <div className= "click-edge-container">
            <h4>
              <div>Selected edge: {edgeEvidence}</div>
            </h4>
            </div>
              <div>Source node: {edgeSource}</div>
              <div>Target edge: {edgeTarget}</div>
            </div>
        </TabPanel>
      </Tabs>
      <ReactTooltip
        id="construction-tooltip"
        place="bottom"
        content="Feature currently under development"
        style={{ backgroundColor: "#f7e3e1", color: "black" }}
      />
    </div>
  );
}

