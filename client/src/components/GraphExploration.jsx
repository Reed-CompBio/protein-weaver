import { React, useState, useEffect } from "react";
import AncestorSelector from "./AncestorSelector";
import DescendantSelector from "./DescendantSelector";
import { PiGraph } from "react-icons/pi";
import { TbGridDots } from "react-icons/tb";
import { TbArrowsRandom } from "react-icons/tb";
import { IconContext } from "react-icons";

export default function GraphExploration({
    currentNode,
    handleSourceNode,
    handleSubmit,
    parentGoTerms,
    childrenGoTerms,
    storeGoTermValue,
    handleGoTermChange,
    handleLayoutChange
}) {
    const [inputValueAncestor, setInputValueAncestor] = useState("");
    const [inputValueDescendant, setInputValueDescendant] = useState("");
    const [goButtonClassname, setGoButtonClassname] = useState(
        "new-go-term-button-disabled"
    );
    const [sourceNodeButton, setSourceNodeButton] = useState(
        "new-source-disabled"
    );

    const handleInputChangeAncestor = (value) => {
        setInputValueAncestor(value);
    };

    const handleInputChangeDescendant = (value) => {
        setInputValueDescendant(value);
    };

    useEffect(() => {
        if (inputValueAncestor == "" && inputValueDescendant == "") {
            setGoButtonClassname("new-go-term-button-disabled");
        } else if (inputValueAncestor != "" || inputValueDescendant != "") {
            setGoButtonClassname("new-go-term-button");
        }
    }, [inputValueAncestor, inputValueDescendant]);

    useEffect(() => {
        if (inputValueAncestor != "") {
            setInputValueDescendant("");
        } else {
            setInputValueAncestor("");
        }
    }, [inputValueAncestor]);

    useEffect(() => {
        if (inputValueDescendant != "") {
            setInputValueAncestor("");
        } else {
            setInputValueDescendant("");
        }
    }, [inputValueDescendant]);

    const handleNewGoButton = () => {
        setInputValueAncestor("");
        setInputValueDescendant("");
        handleGoTermChange();
    };

    useEffect(() => {
        if (currentNode) {
            setSourceNodeButton("new-source");
        } else {
            setSourceNodeButton("new-source-disabled");
        }
    }, [currentNode]);
    return (
        <div>
            <h4 className="graph-exploration-title">Graph Exploration Tools</h4>
            <div className="graph-exploration">
                {/* New Source Node Button */}
                <div className="new-source-container">
                    {currentNode && (
                        <h5>Selected protein: {currentNode.label}</h5>
                    )}
                    {!currentNode && <h5>Selected protein:</h5>}

                    <form method="post" onSubmit={handleSubmit}>
                        <button
                            className={sourceNodeButton}
                            onClick={handleSourceNode}
                            new-source-node={
                                currentNode && currentNode.label
                                    ? currentNode.label
                                    : ""
                            }
                            disabled={
                                sourceNodeButton ==
                                "new-go-term-button-disabled"
                            }
                        >
                            Set as New Source Node
                        </button>
                    </form>
                </div>
                {/* GO Term Selection */}
                <div className="go-container">
                    <h5>Change GO Term:</h5>
                    <div className="go-selector-container">
                        <AncestorSelector
                            parentGoTerms={parentGoTerms}
                            storeGoTermValue={storeGoTermValue}
                            handleInputChangeAncestor={
                                handleInputChangeAncestor
                            }
                            inputValueAncestor={inputValueAncestor}
                        />
                        <DescendantSelector
                            childrenGoTerms={childrenGoTerms}
                            storeGoTermValue={storeGoTermValue}
                            handleInputChangeDescendant={
                                handleInputChangeDescendant
                            }
                            inputValueDescendant={inputValueDescendant}
                        />
                        <form
                            method="post"
                            onSubmit={handleSubmit}
                            className="new-go-form"
                        >
                            <button
                                className={goButtonClassname}
                                onClick={handleNewGoButton}
                                disabled={
                                    goButtonClassname ==
                                    "new-go-term-button-disabled"
                                }
                            >
                                Set as New GO Term
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {/* Export Logs/PNG */}
            <h5 className="change-layout-header">Rearrange graph layout:</h5>
            <div className="align-change-layout">
                <IconContext.Provider
                    value={{
                        className: "change-layout",
                        color: "black",
                        size: "2em",
                    }}
                >
                    <div className="layout-tooltip">
                        <PiGraph
                            className="layout-icon"
                            onClick={(e) => handleLayoutChange("cola", e)}
                            aria-label="default"
                        />
                        <span className="tooltiptext">Cola</span>
                    </div>
                    <div className="layout-tooltip">
                        <TbGridDots
                            className="layout-icon"
                            onClick={(e) => handleLayoutChange("grid", e)}
                            aria-label="grid"
                        />
                        <span className="tooltiptext">Grid</span>
                    </div>
                    <div className="layout-tooltip">
                        <TbArrowsRandom
                            className="layout-icon"
                            onClick={(e) => handleLayoutChange("random", e)}
                            aria-label="random"
                        />
                        <span className="tooltiptext">Random</span>
                    </div>
                </IconContext.Provider>
            </div>
        </div>
    );
}
