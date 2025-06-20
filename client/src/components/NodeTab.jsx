import React, { useState, useEffect } from "react";
import Degree from "./Degree";

export default function NodeTab({ currentNode, query, goTerm, predictionValue, searchExecuted }) {
    const [selectedDbLink, setSelectedDbLink] = useState("");
    const [txid, setTxid] = useState("");

    useEffect(() => {
        setTxid(query.species);
    }, [searchExecuted]);

    // Map of species to database links
    useEffect(() => {
        if (currentNode && txid) {
            const speciesLinkMap = {
                "txid7227": `https://flybase.org/reports/${currentNode.id}.htm`,
                "txid224308": `https://bsubcyc.org/gene?orgid=BSUB&id=${currentNode.id.replace("_", "")}`,
                "txid7955": `https://www.uniprot.org/uniprotkb/${currentNode.id}/entry`,
                "txid559292": `https://www.uniprot.org/uniprotkb/${currentNode.id}/entry`,
                "txid6239": `https://www.wormbase.org/species/c_elegans/gene/${currentNode.id}`,
                "txid3702": `https://www.uniprot.org/uniprotkb/${currentNode.id}/entry`,
            };
            setSelectedDbLink(speciesLinkMap[txid] || "");
        }
    }, [currentNode, txid]);

    if (!currentNode) {
        return (
            <div className="node-tab-container">
                <h5 className="node-tab-text">Select a node to learn more...</h5>
            </div>
        );
    }

    const linkClassMap = {
        "intermediate": "tan-node-link",
        "source": "red-node-link",
        "go_protein": "blue-node-link",
        "go_source": "blue-node-link",
    };

    return (
        <div className="node-tab-container">
            <h5 className="node-tab-text">
                Selected Protein: {currentNode.label}
            </h5>
            {currentNode.gene_name && (
                <h5 className="node-tab-text">
                    Gene Name: {currentNode.gene_name}
                </h5>
            )}
            {currentNode.alt_name && currentNode.alt_name !== currentNode.label && (
                <h5 className="node-tab-text">
                    Alternate Name(s): {currentNode.alt_name}
                </h5>
            )}
            {currentNode.alt_id && currentNode.alt_id !== currentNode.label && (
                <h5 className="node-tab-text">
                    Alternate ID(s): {currentNode.alt_id}
                </h5>
            )}
            {currentNode.alt_gene_id && currentNode.alt_gene_id !== currentNode.label && (
                <h5 className="node-tab-text">
                    Alternate Gene ID(s): {currentNode.alt_gene_id}
                </h5>
            )}
            <Degree id={currentNode.id} />
            <h5 className="node-tab-text">
                Prediction Rank: {predictionValue.rank}
            </h5>
            <h5 className="node-tab-text">
                Prediction Value: {predictionValue.value}
            </h5>
            <h5 className="node-tab-text" style={{ textTransform: "capitalize" }}>
                Node Type: {currentNode.type.replace("_", " ")}
                {(currentNode.type === "go_protein" || currentNode.type === "go_source") && (
                    <div className="align-go-disclaimer">
                        <p className="go-protein-disclaimer">*</p>
                    </div>
                )}
            </h5>
            {(currentNode.type === "go_protein" || currentNode.type === "go_source") && (
                <div>
                    {currentNode.go_protein === "inferred_from_descendant" ? (
                        <p className="go-annotation-info">
                            *{currentNode.label} is annotated to {goTerm.name} <b>[{currentNode.go_protein.replaceAll("_", " ")}]</b>.
                        </p>
                    ) : (
                        <p className="go-annotation-info">
                            *{currentNode.label} is <b>{currentNode.go_protein?.replaceAll("_", " ") || "unavailable"}</b> {goTerm.name}.
                        </p>
                    )}
                </div>
            )}
            <h5 className="database-link">
                Organism-Specific Database:&nbsp;
                <a
                    className={linkClassMap[currentNode.type] || ""}
                    href={selectedDbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Link to database entry for ${currentNode.id}`}
                >
                    {currentNode.id}
                </a>
            </h5>
        </div>
    );
};