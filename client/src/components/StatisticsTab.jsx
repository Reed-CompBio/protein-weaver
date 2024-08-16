import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import { MdConstruction } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import MotifTab from "./MotifTab";
import NodeTab from "./NodeTab";
import EdgeTab from "./EdgeTab";

export default function StatisticsTab({
    nodeList,
    edgeEvidence,
    edgeSource,
    edgeTarget,
    edgeType,
    regType,
    dataSource,
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
                    <Tab className="stats-tab">Proteins</Tab>
                    <Tab className="stats-tab">Interactions</Tab>{" "}
                    <Tab className="stats-tab">Motifs</Tab>
                </TabList>
                <TabPanel>
                    <h4 className="stats-title">Protein Information</h4>
                    <NodeTab
                        currentNode={currentNode}
                        query={query}
                    />
                </TabPanel>
                <TabPanel>
                    <h4 className="stats-title">Interaction Information</h4>
                    <EdgeTab
                        edgeEvidence={edgeEvidence}
                        edgeSource={edgeSource}
                        edgeTarget={edgeTarget}
                        edgeType={edgeType}
                        regType={regType}
                        dataSource={dataSource}
                    />
                </TabPanel>
                <TabPanel>
                    <h4 className="stats-title">Network Motif Counts</h4>
                    <MotifTab nodeList={nodeList} />
                </TabPanel>
            </Tabs>
            {/* <ReactTooltip
                id="construction-tooltip"
                place="bottom"
                content="Feature currently under development"
                style={{ backgroundColor: "#f7e3e1", color: "black" }}
            /> */}
        </div>
    );
}
