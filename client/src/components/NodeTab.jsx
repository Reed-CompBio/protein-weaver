import { React, useState, useEffect } from "react";
import Degree from "./Degree";

export default function NodeTab({
    currentNode,
    query,
}) {
    const [selectedDbLink, setSelectedDbLink] = useState("");

    // Change the Database link based on species and selected protein
    useEffect(() => {
        if (currentNode && query.species) {
            const speciesLinkMap = {
                "txid7227": `https://flybase.org/reports/${currentNode.id}.htm`,
                "txid224308": `https://bsubcyc.org/gene?orgid=BSUB&id=${currentNode.id.replace("_", "")}`,
                "txid7955": `https://www.uniprot.org/uniprotkb/${currentNode.id}/entry`,
            };
            setSelectedDbLink(speciesLinkMap[query.species] || "");
        }
    }, [currentNode, query.species]);

    if (!currentNode) {
        return <p>Select a protein</p>;
    }

    const linkClassMap = {
        "intermediate": "tan-sidebar-link",
        "source": "red-sidebar-link",
        "go_protein": "blue-sidebar-link",
        "go_source": "blue-sidebar-link",
    };

    return (
        <div className="protein-summary">
            <h5>
                Selected protein: {currentNode.label}
                <Degree id={currentNode.id} />
            </h5>
            <p className="database-link">
                Database link:&nbsp;
                <a
                    className={linkClassMap[currentNode.type] || ""}
                    href={selectedDbLink}
                    target="_blank"
                    rel="noopener"
                >
                    {currentNode.id}
                </a>
            </p>
            {(currentNode.type === "go_protein" || currentNode.type === "go_source") && (
                <>
                    <p className="go-protein-disclaimer">
                        *This protein is annotated to the queried GO term with:
                    </p>
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
                </>
            )}
        </div>
    );
} 