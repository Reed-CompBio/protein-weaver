import React, { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { TbChevronCompactDown, TbChevronCompactUp } from 'react-icons/tb';
import { IconContext } from 'react-icons';
import iconNode from "/src/assets/icon-node.png";
import iconPaths from "/src/assets/icon-paths.png";
import iconEdges from "/src/assets/icon-edges.png";
import iconDegree from "/src/assets/icon-degree.png";

export default function GraphStats({ networkStatistics }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleShow = () => {
        setIsOpen(prev => !prev);
    };

    const TooltipIcon = ({ icon, alt, tooltipId, tooltipContent, iconClass }) => (
        <div className={iconClass}>
            <img
                src={icon}
                alt={alt}
                data-tooltip-id={tooltipId}
            />
            <ReactTooltip
                id={tooltipId}
                place="top"
                content={tooltipContent}
                effect="float"
            />
        </div>
    );

    return (
        <div>
            {/* drop down to toggle Network Stats display */}
            <div className="graph-stats" onClick={handleShow}>
                <p>Network Statistics:</p>
                <IconContext.Provider value={{
                    className: 'icon', size: '1.5em', color: '#7F95D1'
                }}>
                    {isOpen ? (
                        <TbChevronCompactUp className="icon-top-right" />
                    ) : (
                        <TbChevronCompactDown className="icon-top-right" />
                    )}
                </IconContext.Provider>
            </div>

            {isOpen && (
                <div className="graph-stats-container">
                    <div className="align-graph-stats">
                        <div className="img-text-container">
                            <TooltipIcon
                                icon={iconNode}
                                alt="Node Icon"
                                tooltipId="nodeTooltip"
                                tooltipContent="Number of nodes displayed on graph"
                                iconClass="graph-stats-icon-container"
                            />
                            <p># of nodes: {networkStatistics.nodeCount}</p>
                        </div>

                        <div className="img-text-container">
                            <TooltipIcon
                                icon={iconPaths}
                                alt="Edges Icon"
                                tooltipId="edges-tooltip"
                                tooltipContent="Number of edges displayed on graph"
                                iconClass="graph-stats-icon-container"
                            />
                            <p># of edges: {networkStatistics.edgeCount}</p>
                        </div>
                    </div>

                    <div className="align-graph-stats">
                        <div className="img-text-container">
                            <TooltipIcon
                                icon={iconEdges}
                                alt="Paths Icon"
                                tooltipId="paths-tooltip"
                                tooltipContent="Number of paths from the GO protein to source node"
                                iconClass="graph-stats-icon-container"
                            />
                            <p># of paths: {networkStatistics.pathCount}</p>
                        </div>

                        <div className="img-text-container">
                            <TooltipIcon
                                icon={iconDegree}
                                alt="Degree Icon"
                                tooltipId="degree-tooltip"
                                tooltipContent="Higher degree indicates more neighboring nodes"
                                iconClass="graph-stats-icon-container"
                            />
                            <p>
                                Average node degree: {networkStatistics.avgNodeDegree}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
