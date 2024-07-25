import React, { useState, useRef, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { MdConstruction } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Motif from "./Motif";

export default function StatisticsTab({ networkStatistics, nodeList }) {
  const [tabIndex, setTabIndex] = useState(0);

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
          <Tab className="stats-tab">
            Nodes
          </Tab>{" "}
          <Tab className="stats-tab">
            Edges
          </Tab>
        </TabList>
        <TabPanel>
          <h4 className="stats-title">Graph stats</h4>
          <div className="graph-statistics-container">
            <div>
              <ul className="right-aligned-list">
                <li># of nodes:</li>
                <li># of edges:</li>
                <li># of paths from source:</li>
                <li>Average node degree:</li>
              </ul>
            </div>
            <div>
              <ul className="statistics-list">
                <li>{networkStatistics.nodeCount}</li>
                <li>{networkStatistics.edgeCount}</li>
                <li>{networkStatistics.pathCount}</li>
                <li>{networkStatistics.avgNodeDegree}</li>
              </ul>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <h4 className="stats-title" >Node stats</h4>
          <div className="graph-statistics-container">
            <Motif nodeList={nodeList} />
          </div>

        </TabPanel>
        <TabPanel>
          <h4 className="stats-title" >Edges stats</h4>
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
