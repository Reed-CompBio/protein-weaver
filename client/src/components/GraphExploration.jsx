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

    return (
        <div>
            <h4 className="graph-exploration-title">Graph Exploration Tools</h4>
            <div className="graph-exploration">
                {/* New Source Node Button */}
                <div className="new-source-container">
                    <h5>Selected Protein: {currentNode.label}</h5>
                    <form method="post" onSubmit={handleSubmit}>
                        <button
                            className="new-source"
                            onClick={handleSourceNode}
                            new-source-node={currentNode.label}
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
                        />
                        <DescendantSelector
                            childrenGoTerms={childrenGoTerms}
                            storeGoTermValue={storeGoTermValue}
                        />
                        <form method="post" onSubmit={handleSubmit} className="new-go-form">
                            <button
                                className="new-go-term-button"
                                onClick={handleGoTermChange}
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

    )
}