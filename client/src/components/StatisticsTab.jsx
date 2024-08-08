import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import { MdConstruction } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Motif from "./Motif";
import NodeTab from "./NodeTab";
import EdgeTab from "./EdgeTab";

export default function StatisticsTab({
    nodeList,
    edgeEvidence,
    edgeSource,
    edgeTarget,
    edgeType,
    currentNode,
    query,
}) {
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
                    <Tab className="stats-tab">Nodes</Tab>
                    <Tab className="stats-tab">Edges</Tab>{" "}
                    <Tab className="stats-tab">Motifs</Tab>
                </TabList>
                <TabPanel>
                    <h4 className="stats-title">Node stats</h4>
                    <NodeTab
                        currentNode={currentNode}
                        query={query}
                    />
                </TabPanel>
                <TabPanel>
                    <h4 className="stats-title">Edges stats</h4>
                    <EdgeTab
                        edgeEvidence={edgeEvidence}
                        edgeSource={edgeSource}
                        edgeTarget={edgeTarget}
                        edgeType={edgeType}
                    />
                </TabPanel>
                <TabPanel>
                    <div className="graph-statistics-container">
                        <Motif nodeList={nodeList} />
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
