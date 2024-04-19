import React, { useState, useRef, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { MdConstruction } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function StatisticsTab() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className="statistics-panel-container">
      {/* <h4 className="stats-title">Statistics</h4> */}
      <Tabs
        selectedIndex={tabIndex}
        onSelect={(index) => setTabIndex(index)}
        className="stats-tabs"
        selectedTabClassName="stats-tab-selected"
      >
        <TabList className="stats-tab-list">
          <Tab className="stats-tab">
            Graph
            <MdConstruction
              data-tooltip-id="construction-tooltip"
              className="construction"
            />
          </Tab>
          <Tab className="stats-tab">
            Nodes
            <MdConstruction
              data-tooltip-id="construction-tooltip"
              className="construction"
            />
          </Tab>{" "}
          <Tab className="stats-tab">
            Edges
            <MdConstruction
              data-tooltip-id="construction-tooltip"
              className="construction"
            />
          </Tab>
        </TabList>
        <TabPanel>
          <h2>Statistics about graph</h2>
        </TabPanel>
        <TabPanel>
          <h2>Statistics about nodes</h2>
        </TabPanel>
        <TabPanel>
          <h2>Statistics about edges</h2>
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
