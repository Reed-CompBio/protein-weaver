import React, { useState, useEffect } from "react";

export default function EdgeTab({
    edgeEvidence,
    edgeSource,
    edgeTarget,
    edgeType,
}) {
    const [interactionDatabase, setInteractionDatabase] = useState("");

    useEffect(() => {
        getDatabase(edgeEvidence);
    }, [edgeEvidence]);

    const getDatabase = (evidence) => {
        if (evidence.startsWith("FBrf")) {
            setInteractionDatabase("FlyBase");
        } else if (evidence.includes("/")) {
            setInteractionDatabase("STRING");
        } else if (/^\d{1,8}$/.test(evidence)) {
            setInteractionDatabase("PMID");
        } else if (evidence.includes(";")) {
            setInteractionDatabase("PMID");
        } else if (evidence.startsWith("WB")) {
            setInteractionDatabase("Wormbase");
        } else {
            setInteractionDatabase("");
        }
    }

    const getLink = (evidence) => {
        if (evidence.startsWith("FBrf")) {
            return [`https://flybase.org/reports/${evidence}.htm`];
        } else if (evidence.includes("/")) {
            return [`https://string-db.org/interaction/${evidence}`];
        } else if (/^\d{1,8}$/.test(evidence)) {
            return [`https://pubmed.ncbi.nlm.nih.gov/${evidence}`]
        } else if (evidence.includes(";")) {
            return evidence.split(";").map(i => `https://pubmed.ncbi.nlm.nih.gov/${i}`);
        } else if (evidence.startsWith("WB")) {
            return [`http://api.wormbase.org/species/all/interaction/${evidence}`];
        }  else {
            return [];
        }
    };

    const edgeLink = getLink(edgeEvidence);

    return (
        <div>
            <div className="click-edge-container">
                <h4>
                    <div>
                        Selected edge:{" "}
                        {edgeLink.length > 0 ? (
                            edgeLink.map((link, index) => (
                                <span key={index}>
                                    <a href={link} target="_blank" rel="noopener noreferrer">
                                        {edgeEvidence.split(";")[index]}
                                    </a>
                                    {` (${interactionDatabase})`}
                                    {index < edgeLink.length - 1 && "; "}
                                </span>
                            ))
                        ) : (
                            edgeEvidence
                        )}
                    </div>
                </h4>
            </div>
            {edgeSource ? (
                <div className="edge-container">
                    <div>Source node: {edgeSource}</div>
                    <div>Target edge: {edgeTarget}</div>
                    <div>Edge type: {edgeType}</div>
                </div>
            ) : (
                <p>Click an edge to see more information</p>
            )}
        </div>
    )
}