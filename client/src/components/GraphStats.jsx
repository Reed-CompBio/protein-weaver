import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import iconNode from "/src/assets/icon-node.png";
import iconPaths from "/src/assets/icon-paths.png";
import iconEdges from "/src/assets/icon-edges.png";
import iconDegree from "/src/assets/icon-degree.png";

export default function GraphStats({
    networkStatistics
}) {
    return (
        <div>
            <h4 className="stats-title">Network Statistics:</h4>
            <div className="graph-stats-container">
                <div className="align-graph-stats">
                    <div className="img-text-container">
                        <div>
                            <div className="node-icon-container">
                                <img
                                    src={iconNode}
                                    alt="Node Icon"
                                    className="icon1"
                                    data-tooltip-id="nodeTooltip"
                                />
                                <ReactTooltip
                                    id="nodeTooltip"
                                    place="top"
                                    content="Number of nodes displayed on graph"
                                    effect="float"
                                />
                            </div>
                        </div>
                        <div>
                            <p># of nodes: {networkStatistics.nodeCount}</p>
                        </div>
                    </div>
                    <div className="img-text-container">
                        <div>
                            <div className="edges-icon-container">
                                <img
                                    src={iconPaths}
                                    alt="Edges icon"
                                    className="icon2"
                                    data-tooltip-id="edges-tooltip"
                                />
                                <ReactTooltip
                                    id="edges-tooltip"
                                    place="top"
                                    content="Number of edges displayed on graph"
                                    effect="float"
                                />
                            </div>
                        </div>
                        <div>
                            <p># of edges: {networkStatistics.edgeCount}</p>
                        </div>
                    </div>
                </div>
                <div className="align-graph-stats">
                    <div className="img-text-container">
                        <div>
                            <div className="paths-icon-container">
                                <img
                                    src={iconEdges}
                                    alt="Paths icon"
                                    className="icon3"
                                    data-tooltip-id="paths-tooltip"
                                />
                                <ReactTooltip
                                    id="paths-tooltip"
                                    place="top"
                                    content="Number of paths from the GO protein to source node"
                                    effect="float"
                                />
                            </div>
                        </div>
                        <div>
                            <p># of paths: {networkStatistics.pathCount}</p>
                        </div>
                    </div>
                    <div className="img-text-container">
                        <div>
                            <div className="degree-icon-container">
                                <img
                                    src={iconDegree}
                                    alt="Degree icon"
                                    className="icon4"
                                    data-tooltip-id="degree-tooltip"
                                />
                                <ReactTooltip
                                    id="degree-tooltip"
                                    place="top"
                                    content="Higher degree indicates more neighboring nodes"
                                    effect="float"
                                />
                            </div>
                        </div>
                        <div>
                            <p>
                                Average node degree:{" "}
                                {networkStatistics.avgNodeDegree}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};