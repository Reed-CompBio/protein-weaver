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
        </div>
    )
};