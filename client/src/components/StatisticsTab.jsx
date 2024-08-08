import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import { MdConstruction } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Motif from "./Motif";

export default function StatisticsTab({
    nodeList,
    edgeEvidence,
    edgeSource,
    edgeTarget,
}) {
    const [tabIndex, setTabIndex] = useState(0);
    const [interactionDatabase, setInteractionDatabase] = useState("");

    useEffect(() => {
        getDatabase(edgeEvidence);
    }, [edgeEvidence]);

    const getDatabase = (evidence) => {
        if (evidence.startsWith("FBrf")) {
            setInteractionDatabase("FlyBase");
        } else if (evidence.includes("/")) {
            setInteractionDatabase("STRING");
        } else if (/^\d{1,8}$/.test(evidence)) {
            setInteractionDatabase("PMID");
        } else if (evidence.includes(";")) {
            setInteractionDatabase("PMID");
        } else {
            setInteractionDatabase("");
        }
    }

    const getLink = (evidence) => {
        if (evidence.startsWith("FBrf")) {
            return [`https://flybase.org/reports/${evidence}.htm`];
        } else if (evidence.includes("/")) {
            return [`https://string-db.org/interaction/${evidence}`];
        } else if (/^\d{1,8}$/.test(evidence)) {
            return [`https://pubmed.ncbi.nlm.nih.gov/${evidence}`]
        } else if (evidence.includes(";")) {
            return evidence.split(";").map(i => `https://pubmed.ncbi.nlm.nih.gov/${i}`);
        } else {
            return [];
        }
    };

    const edgeLink = getLink(edgeEvidence);

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
                </TabPanel>
                <TabPanel>
                    <h4 className="stats-title">Edges stats</h4>
                    <div>
                        <div className="click-edge-container">
                            <h4>
                                <div>
                                    Selected edge:{" "}
                                    {edgeLink.length > 0 ? (
                                        edgeLink.map((link, index) => (
                                            <span key={index}>
                                                <a href={link} target="_blank" rel="noopener noreferrer">
                                                    {edgeEvidence.split(";")[index]}
                                                </a>
                                                {` (${interactionDatabase})`}
                                                {index < edgeLink.length - 1 && "; "}
                                            </span>
                                        ))
                                    ) : (
                                        edgeEvidence
                                    )}
                                </div>
                            </h4>
                        </div>
                        {edgeSource ? (
                            <div className="edge-container">
                                <div>Source node: {edgeSource}</div>
                                <div>Target edge: {edgeTarget}</div>
                            </div>
                        ) : (
                            <p>Click an edge to see more information</p>
                        )}
                    </div>
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
