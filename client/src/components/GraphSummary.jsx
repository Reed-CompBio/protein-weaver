import { React, useState, useEffect, useRef } from "react";
import GoDefinition from "./GoDefinition";
import { PiWarningBold } from "react-icons/pi";

export default function GraphSummary({
    currentNode,
    sourceNode,
    query,
    goTerm
}) {
    const [selectedDbLink, setSelectedDbLink] = useState("");
    const [sourceNodeLink, setSourceNodeLink] = useState("");
    const [neverAnnotateWarning, setNeverAnnotateWarning] = useState(false);
    const [showNeverAnnotate, setShowNeverAnnotate] = useState(false);

    // Create a warning if GO term is blacklisted
    useEffect(() => {
        if (goTerm.never_annotate === "true") {
            setNeverAnnotateWarning(true);
        } else if (goTerm.never_annotate === "false") {
            setNeverAnnotateWarning(false);
        }
    }, [goTerm.never_annotate]);

    // Change the link for queried protein when species changes
    useEffect(() => {
        if (query.species === "txid7227") {
            setSourceNodeLink(
                `https://amigo.geneontology.org/amigo/gene_product/FB:${sourceNode.id}`
            );
        } else if (query.species === "txid224308") {
            var bsubId = query.protein.replace(/_/g, "");
            setSourceNodeLink(
                `https://bsubcyc.org/gene?orgid=BSUB&id=${bsubId}#tab=GO`
            );
        } else if (query.species === "txid7955") {
            setSourceNodeLink(
                `https://www.uniprot.org/uniprotkb/${sourceNode.id}/entry#function`
            );
        }
    }, [query.species]);

    // Change the Database link based on species and selected protein
    useEffect(() => {
        if (currentNode) {
            if (query.species === "txid7227") {
                setSelectedDbLink(`https://flybase.org/reports/${currentNode.id}`);
            } else if (query.species === "txid224308") {
                var bsubId = query.protein.replace(/_/g, "");
                setSelectedDbLink(`https://bsubcyc.org/gene?orgid=BSUB&id=${bsubId}`);
            } else if (query.species === "txid7955") {
                setSelectedDbLink(
                    `https://www.uniprot.org/uniprotkb/${currentNode.id}/entry`
                );
            }
        }
    }, [currentNode, query.species]);

    if (!currentNode) {
        return (
            <div>
                <div className="query-result-summary">
                    <h4 className="graph-summary-title">Network Summary</h4>
                    <h5>Ontology links:</h5>
                    <div className="query-result-container">
                        <div className="query-result-link-container">
                            <a
                                className="red-sidebar-link"
                                href={sourceNodeLink}
                                target="_blank"
                                rel="noopener"
                            >
                                {sourceNode.label}
                            </a>
                        </div>
                        <div className="query-result-link-container">
                            <a
                                className="blue-sidebar-link"
                                href={`https://www.ebi.ac.uk/QuickGO/term/${goTerm.id}`}
                                target="_blank"
                                rel="noopener"
                            >
                                {goTerm.name}
                            </a>
                            {neverAnnotateWarning && (
                                <div
                                    className="never-annotate-container"
                                    onMouseEnter={() => setShowNeverAnnotate(true)}
                                    onMouseLeave={() => setShowNeverAnnotate(false)}
                                >
                                    <PiWarningBold className="never-annotate-icon" />
                                    {showNeverAnnotate && (
                                        <div className="never-annotate-warning">
                                            This term should not be used for direct annotation.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <GoDefinition open>
                        <p>&nbsp;&nbsp;&nbsp;{goTerm.def}</p>
                    </GoDefinition>
                </div>
                <h5 className="protein-selection-suggestion">Select a protein to learn more...</h5>
            </div>
        );

    } else if (currentNode.type === "intermediate") {
        return (
            <div>
                <div className="query-result-summary">
                    <h4 className="graph-summary-title">Network Summary</h4>
                    <h5>Ontology links:</h5>
                    <div className="query-result-container">
                        <div className="query-result-link-container">
                            <a
                                className="red-sidebar-link"
                                href={sourceNodeLink}
                                target="_blank"
                                rel="noopener"
                            >
                                {sourceNode.label}
                            </a>
                        </div>
                        <div className="query-result-link-container">
                            <a
                                className="blue-sidebar-link"
                                href={`https://www.ebi.ac.uk/QuickGO/term/${goTerm.id}`}
                                target="_blank"
                                rel="noopener"
                            >
                                {goTerm.name}
                            </a>
                            {neverAnnotateWarning && (
                                <div
                                    className="never-annotate-container"
                                    onMouseEnter={() => setShowNeverAnnotate(true)}
                                    onMouseLeave={() => setShowNeverAnnotate(false)}
                                >
                                    <PiWarningBold className="never-annotate-icon" />
                                    {showNeverAnnotate && (
                                        <div className="never-annotate-warning">
                                            This term should not be used for direct annotation.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <GoDefinition open>
                        <p>&nbsp;&nbsp;&nbsp;{goTerm.def}</p>
                    </GoDefinition>
                </div>
                <div className="protein-summary">
                    <h5>Selected protein: {currentNode.label}</h5>
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
                <div className="query-result-summary">
                    <h4 className="graph-summary-title">Network Summary</h4>
                    <h5>Ontology links:</h5>
                    <div className="query-result-container">
                        <div className="query-result-link-container">
                            <a
                                className="red-sidebar-link"
                                href={sourceNodeLink}
                                target="_blank"
                                rel="noopener"
                            >
                                {sourceNode.label}
                            </a>
                        </div>
                        <div className="query-result-link-container">
                            <a
                                className="blue-sidebar-link"
                                href={`https://www.ebi.ac.uk/QuickGO/term/${goTerm.id}`}
                                target="_blank"
                                rel="noopener"
                            >
                                {goTerm.name}
                            </a>
                            {neverAnnotateWarning && (
                                <div
                                    className="never-annotate-container"
                                    onMouseEnter={() => setShowNeverAnnotate(true)}
                                    onMouseLeave={() => setShowNeverAnnotate(false)}
                                >
                                    <PiWarningBold className="never-annotate-icon" />
                                    {showNeverAnnotate && (
                                        <div className="never-annotate-warning">
                                            This term should not be used for direct annotation.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <GoDefinition open>
                        <p>&nbsp;&nbsp;&nbsp;{goTerm.def}</p>
                    </GoDefinition>
                </div>
                <div className="protein-summary">
                    <h5>Selected protein: {currentNode.label}</h5>
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
                <div className="query-result-summary">
                    <h4 className="graph-summary-title">Network Summary</h4>
                    <h5>Ontology links:</h5>
                    <div className="query-result-container">
                        <div className="query-result-link-container">
                            <a
                                className="red-sidebar-link"
                                href={sourceNodeLink}
                                target="_blank"
                                rel="noopener"
                            >
                                {sourceNode.label}
                            </a>
                        </div>
                        <div className="query-result-link-container">
                            <a
                                className="blue-sidebar-link"
                                href={`https://www.ebi.ac.uk/QuickGO/term/${goTerm.id}`}
                                target="_blank"
                                rel="noopener"
                            >
                                {goTerm.name}
                            </a>
                            {neverAnnotateWarning && (
                                <div
                                    className="never-annotate-container"
                                    onMouseEnter={() => setShowNeverAnnotate(true)}
                                    onMouseLeave={() => setShowNeverAnnotate(false)}
                                >
                                    <PiWarningBold className="never-annotate-icon" />
                                    {showNeverAnnotate && (
                                        <div className="never-annotate-warning">
                                            This term should not be used for direct annotation.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <GoDefinition open>
                        <p>&nbsp;&nbsp;&nbsp;{goTerm.def}</p>
                    </GoDefinition>
                </div>
                <div className="go-protein-summary">
                    <h5>Selected protein: {currentNode.label}</h5>
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