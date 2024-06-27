import { React, useState, useEffect } from "react";
import GoDefinition from "./GoDefinition";
import { PiWarningBold } from "react-icons/pi";
import PGStats from "./ProGoStats";

export default function StaticSummary({
    sourceNode,
    query,
    goTerm
}) {
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
            setSourceNodeLink(
                `https://bsubcyc.org/gene?orgid=BSUB&id=${sourceNode.id.replace('_', '')}#tab=GO`
            );
        } else if (query.species === "txid7955") {
            setSourceNodeLink(
                `https://www.uniprot.org/uniprotkb/${sourceNode.id}/entry#function`
            );
        }
    }, [sourceNode.id]);

    return (
        <div className="query-result-summary">
            <h4 className="graph-summary-title">Network Summary</h4>
            <h5>Ontology links:</h5>
            <div className="query-result-container">
                <div className="query-result-link-container">
                    <a
                        className="red-sidebar-link sidebar-button-block"
                        href={sourceNodeLink}
                        target="_blank"
                        rel="noopener"
                    >
                        {sourceNode.label}
                    </a>
                </div>
                <div className="query-result-link-container">
                    <a
                        className="blue-sidebar-link sidebar-button-block"
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
                <PGStats name={goTerm.name} txid={query.species} />
            </GoDefinition>
        </div>
    )
}