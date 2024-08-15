import { React, useState, useEffect } from "react";
import GoDefinition from "./GoDefinition";
import ExportGraph from "./ExportGraph";
import GraphStats from "./GraphStats";
import { PiWarningBold } from "react-icons/pi";
import ProGoStats from "./ProGoStats";

export default function GraphSummary({
    currentNode,
    sourceNode,
    query,
    goTerm,
    exportPNG,
    searchExecuted,
    queryCount,
    logs,
    handleLog,
    networkStatistics
}) {
    const [proteinCount, setProteinCount] = useState(0);
    const [sourceNodeLink, setSourceNodeLink] = useState("");
    const [neverAnnotateWarning, setNeverAnnotateWarning] = useState(false);
    const [showNeverAnnotate, setShowNeverAnnotate] = useState(false);
    const [txid, setTxid] = useState("");

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

    // Change species ID for graph statistics after search execution
    useEffect(() => {
        setTxid(query.species);
    }, [searchExecuted]);

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
        <div className="query-result-summary">
            <h4 className="graph-summary-title">Your Query Inputs</h4>
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
                <ProGoStats name={goTerm.name} txid={txid} species={query.species} />
            </GoDefinition>
            <GraphStats
                networkStatistics={networkStatistics}
            />
            <ExportGraph log={logs} exportPNG={exportPNG} />
        </div>
    )
}