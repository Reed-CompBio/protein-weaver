import { React, useState, useEffect } from "react";
import StaticSummary from "./StaticSummary";
import Degree from "./Degree";

export default function GraphSummary({
    currentNode,
    sourceNode,
    query,
    goTerm
}) {
    const [selectedDbLink, setSelectedDbLink] = useState("");

    // Change the Database link based on species and selected protein
    useEffect(() => {
        if (currentNode) {
            if (query.species === "txid7227") {
                setSelectedDbLink(`https://flybase.org/reports/${currentNode.id}`);
            } else if (query.species === "txid224308") {
                setSelectedDbLink(`https://bsubcyc.org/gene?orgid=BSUB&id=${currentNode.id.replace("_", "")}`);
            } else if (query.species === "txid7955") {
                setSelectedDbLink(
                    `https://www.uniprot.org/uniprotkb/${currentNode.id}/entry`
                );
            }
        }
    }, [currentNode, query.species]);

    if (!currentNode) {
        // Dynamically render the summary based on the selected node
        return (
            <div>
                <StaticSummary // This part of the graph summary never changes
                    sourceNode={sourceNode}
                    query={query}
                    goTerm={goTerm}
                />
                <h5 className="protein-selection-suggestion">Select a protein to learn more...</h5>
            </div>
        );

    } else if (currentNode.type === "intermediate") {
        return (
            <div>
                <StaticSummary
                    sourceNode={sourceNode}
                    query={query}
                    goTerm={goTerm}
                />
                <div className="protein-summary">
                    <h5>Selected protein: {currentNode.label}
                        <Degree id={currentNode.id} />
                    </h5>
                    <p className="database-link">
                        Database link:&nbsp;
                        <a
                            className="tan-sidebar-link"
                            href={selectedDbLink}
                            target="_blank"
                            rel="noopener"
                        >
                            {currentNode.id}
                        </a>
                    </p>
                </div>
            </div>
        );
    } else if (currentNode.type === "source") {
        return (
            <div>
                <StaticSummary
                    sourceNode={sourceNode}
                    query={query}
                    goTerm={goTerm}
                />
                <div className="protein-summary">
                    <h5>Selected protein: {currentNode.label}
                        <Degree id={currentNode.id} />
                    </h5>
                    <p className="database-link">
                        Database link:&nbsp;
                        <a
                            className="red-sidebar-link"
                            href={selectedDbLink}
                            target="_blank"
                            rel="noopener"
                        >
                            {currentNode.id}
                        </a>
                    </p>
                </div>
            </div>
        );
    } else if (
        currentNode.type === "go_protein" ||
        currentNode.type === "go_source"
    ) {
        return (
            <div>
                <StaticSummary
                    sourceNode={sourceNode}
                    query={query}
                    goTerm={goTerm}
                />
                <div className="go-protein-summary">
                    <h5>Selected protein: {currentNode.label}
                        <Degree id={currentNode.id} />
                    </h5>
                    <p className="database-link">
                        Database link:&nbsp;
                        <a
                            className="blue-sidebar-link"
                            href={selectedDbLink}
                            target="_blank"
                            rel="noopener"
                        >
                            {currentNode.id}
                        </a>
                    </p>
                    <p className="go-protein-disclaimer">*This protein is annotated to the queried GO term with:</p>
                    <p
                        style={{
                            fontWeight:
                                currentNode.go_protein === "inferred_from_descendant"
                                    ? "bold"
                                    : "normal",
                        }}
                    >
                        {currentNode.go_protein}
                    </p>
                </div>
            </div>
        );
    };
};