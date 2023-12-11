import { React, useState } from "react";
import { MdOutlineCheckBox, MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { IconContext } from "react-icons";
import { PiGraph } from "react-icons/pi";
import { TbGridDots } from "react-icons/tb";
import { TbArrowsRandom } from "react-icons/tb";


export default function Legend({
    handleSharedEdgesToggle,
    showSharedEdges,
    handleLayoutChange,
}) {

    return (
        <div>
            <div id="legendContent" className="legend">
                <h2>Legend</h2>
                <div className="key-align">

                    <div id="node-types" className="legend-container">
                        <h3>Node Types</h3>
                        <div className="dot-align">
                            <div className="source-node-symbol"></div>
                            <p className="legend-text">&nbsp;&nbsp;Source node</p>
                        </div>
                        <div className="dot-align">
                            <div className="go-protein-symbol"></div>
                            <p className="legend-text">&nbsp;&nbsp;GO protein</p>
                        </div>
                        <div className="dot-align">
                            <div className="intermediate-symbol"></div>
                            <p className="legend-text">&nbsp;&nbsp;On path from GO protein to source node</p>
                        </div>
                    </div>

                    <div id="edge-types" className="legend-container">
                        <h3>Edge Types</h3>
                        <div className="line-align">
                            <div className="black-line"></div>
                            <p className="legend-text">&nbsp;&nbsp;Exists in shortest path</p>
                        </div>
                        <div className="line-align">

                            <div className="grey-line"></div>
                            <p className="legend-text">&nbsp;&nbsp;Induced subgraph</p>
                            <IconContext.Provider
                                value={{
                                    className: "checkbox",
                                    color: "black",
                                    size: "1.5em",
                                }}
                            >
                                {showSharedEdges ? (
                                    <MdOutlineCheckBox onClick={(e) => handleSharedEdgesToggle(e)} />

                                ) : (
                                    <MdOutlineCheckBoxOutlineBlank onClick={(e) => handleSharedEdgesToggle(e)} />
                                )}
                            </IconContext.Provider>
                        </div>
                        <div>
                            <p>Change graph layout:</p>
                            <IconContext.Provider
                                value={{
                                    className: "change-layout",
                                    color: "black",
                                    size: "2em"
                                }}>
                                <PiGraph
                                    onClick={(e) => handleLayoutChange("cose-bilkent", e)}
                                    aria-label="default"
                                />
                                <TbArrowsRandom
                                    onClick={(e) => handleLayoutChange("random", e)}
                                    aria-label="random" />
                                <TbGridDots
                                    onClick={(e) => handleLayoutChange("grid", e)}
                                    aria-label="grid"
                                />
                            </IconContext.Provider>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};