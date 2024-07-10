import { React, useState, useEffect } from "react";
import ExportLogJSON from "./ExportLogJSON";
import AncestorSelector from "./AncestorSelector";
import DescendantSelector from "./DescendantSelector";

export default function GraphExploration({
    currentNode,
    query,
    handleSourceNode,
    handleSubmit,
    exportPNG,
    searchExecuted,
    queryCount,
    logs,
    handleLog,
    parentGoTerms,
    childrenGoTerms,
    storeGoTermValue,
    handleGoTermChange,
}) {
    const [proteinCount, setProteinCount] = useState(0);
    const [inputValueAncestor, setInputValueAncestor] = useState("");
    const [inputValueDescendant, setInputValueDescendant] = useState("");
    const [goButtonClassname, setGoButtonClassname] = useState(
        "new-go-term-button-disabled"
    );
    const [sourceNodeButton, setSourceNodeButton] = useState(
        "new-source-disabled"
    );

    // Keep track of the proteins in the query
    useEffect(() => {
        if (currentNode) {
            const logKey = `protein${proteinCount + 1}`;
            const newProtein = {
                protein: currentNode,
                timestamp: new Date().toISOString(),
            };
            setProteinCount(proteinCount + 1);
            handleLog(newProtein);
        }
    }, [currentNode]);

    // Keep track of the queries
    useEffect(() => {
        if (query) {
            const logKey = `query${queryCount}`;
            const newQuery = {
                query: query,
                timestamp: new Date().toISOString(),
            };
            handleLog(newQuery);
        }
    }, [searchExecuted]);

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
                    <h5>Change queried GO Term:</h5>
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
            <div className="exports-container">
                <h5>Export logs or PNG of current network:</h5>
                <ExportLogJSON log={logs} />
                <a className="export" onClick={exportPNG}>
                    Export Graph to PNG
                </a>
            </div>
        </div>
    );
}
