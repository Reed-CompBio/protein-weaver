import { React, useState, useEffect } from "react";

export default function NewSourceNode({
    currentNode,
    handleSourceNode,
    handleSubmit,
}) {
    const [sourceNodeButton, setSourceNodeButton] = useState(
        "new-source-disabled"
    );

    useEffect(() => {
        if (currentNode) {
            setSourceNodeButton("new-source");
        } else {
            setSourceNodeButton("new-source-disabled");
        }
    }, [currentNode]);

    return (
        <div>
            <div className="new-source-container">
                <div className="graph-exploration-header">
                    <h5>Change Query Protein</h5>
                </div>
                {currentNode && (
                    <p>Selected node: {currentNode.label}</p>
                )}
                {!currentNode && <p>Select a node...</p>}

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
        </div>
    )
};