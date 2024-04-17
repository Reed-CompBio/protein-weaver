import React, { useState, useRef, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

export default function StatisticsTab() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className="statistics-panel-container">
      <h4 className="stats-title">Statistics</h4>
      <Tabs
        selectedIndex={tabIndex}
        onSelect={(index) => setTabIndex(index)}
        className="stats-tabs"
        selectedTabClassName="stats-tab-selected"
      >
        <TabList className="stats-tab-list">
          <Tab className="stats-tab">Graph Info</Tab>
          <Tab className="stats-tab">Nodes</Tab>
          <Tab className="stats-tab">Edges</Tab>
        </TabList>
        <TabPanel>
          <h2>Stats about graph </h2>
        </TabPanel>
        <TabPanel>
          <h2>Stats about nodes</h2>
        </TabPanel>
        <TabPanel>
          <h2>Stats about edges</h2>
        </TabPanel>
      </Tabs>
    </div>
  );
}
