import React, { useState, useEffect } from "react";

export default function EdgeTab({
    edgeEvidence,
    edgeSource,
    edgeTarget,
    edgeType,
    regType,
    dataSource,
}) {
    const [interactionDatabase, setInteractionDatabase] = useState("");
    const [interactionType, setInteractionType] = useState("");
    const [interactionSource, setInteractionSource] = useState("");

    const getDatabase = (evidence) => {
        if (evidence.startsWith("FBrf")) {
            setInteractionDatabase("FlyBase");
        } else if (evidence.includes("/")) {
            setInteractionDatabase("STRING");
        } else if (/^\d{1,8}$/.test(evidence)) {
            setInteractionDatabase("PMID");
        } else if (evidence.includes(";")) {
            setInteractionDatabase("PMID");
        } else {
            setInteractionDatabase("");
        }
    }

    useEffect(() => {
        getDatabase(edgeEvidence);
    }, [edgeEvidence]);

    const getInteractionSource = (source) => {
        if (source === "flybase") {
            setInteractionSource("FlyBase");
        } else if (source === "wormbase") {
            setInteractionSource("WormBase");
        } else if (source === "string-db") {
            setInteractionSource("STRING-DB");
        } else if (source === "psicquic") {
            setInteractionSource("PSICQUIC");
        } else if (source === "subtiwiki") {
            setInteractionSource("SubtiWiki");
        } else if (source === "biogrid") {
            setInteractionSource("BioGRID");
        } else if (source === "tf-link") {
            setInteractionSource("TFLink");
        } else {
            setInteractionSource("");
        }
    }

    useEffect(() => {
        getInteractionSource(dataSource);
    }, [dataSource]);

    const getLink = (evidence) => {
        if (evidence.startsWith("FBrf")) {
            return [`https://flybase.org/reports/${evidence}.htm`];
        } else if (evidence.includes("/")) {
            return [`https://string-db.org/interaction/${evidence}`];
        } else if (/^\d{1,8}$/.test(evidence)) {
            return [`https://pubmed.ncbi.nlm.nih.gov/${evidence}`]
        } else if (evidence.includes(";")) {
            return evidence.split(";").map(i => `https://pubmed.ncbi.nlm.nih.gov/${i}`);
        } else {
            return [];
        }
    };

    const edgeLink = getLink(edgeEvidence);

    const getInteractionType = (type) => {
        if (type === "Reg") {
            setInteractionType("Regulatory Interaction");
        } else if (type === "ProPro") {
            setInteractionType("Physical Interaction");
        }
    };

    useEffect(() => {
        getInteractionType(edgeType);
    }, [edgeType]);

    if (!edgeSource) {
        return (
            <div className="edge-tab-container">
                <h5 className="edge-tab-text">Select an edge to learn more...</h5>
            </div>
        );
    }

    return (
        <div className="edge-tab-container">
            <h5 className="edge-tab-text">
                Selected Interaction:
            </h5>
            <h5 className="edge-tab-text">
                &nbsp;&nbsp;&nbsp;Node 1: {edgeSource}
            </h5>
            <h5 className="edge-tab-text">
                &nbsp;&nbsp;&nbsp;Node 2: {edgeTarget}
            </h5>
            <h5 className="edge-tab-text">
                Interaction Type: {interactionType}
            </h5>
            {edgeType === "Reg" &&
                <h5 className="edge-tab-text" style={{ textTransform: "capitalize" }}>Regulation Mode: {regType}</h5>}
            <h5 className="edge-tab-text">
                Data Source: {interactionSource}
            </h5>
            <h5 className="edge-tab-evidence">
                Evidence [External Link]:{" "}
            </h5>
            <div className="align-edge-link">
                <h5 className="edge-tab-link">
                    {edgeLink.length > 0 ? (
                        edgeLink.map((link, index) => (
                            <span key={index}>
                                <a href={link} target="_blank" rel="noopener noreferrer">
                                    {edgeEvidence.split(";")[index]}
                                </a>
                                {` [${interactionDatabase}]`}
                                {index < edgeLink.length - 1 && "; "}
                            </span>
                        ))
                    ) : (
                        edgeEvidence
                    )}
                </h5>
            </div>
        </div>
    );
}