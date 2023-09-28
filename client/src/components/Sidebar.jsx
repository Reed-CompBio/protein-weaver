import React from "react";
import ExportJSON from "./ExportJSON";

export default function Sidebar({ currentNode, sourceNode, log }) {

    return (
    <div>
        <div 
        id="sidebarContent"
        className="sidebar"
        >
            <h2>Network Data</h2>
            <p>Protein: {currentNode.label}</p>
            <p>Type of node: {currentNode.type}</p>
            <p>Protein of interest: {sourceNode}</p>
            <p>Source node GO terms: </p>
            <p>Queried GO term: 
                <a
                href={`https://amigo.geneontology.org/amigo/term/${log.goTerm}`}
                target="_blank"
                rel="noopener"
                >
                    &nbsp;{log.goTerm}
                </a>
            </p>
            {/* Need a separate query in Cypher to get all GO terms for the sourceNode and then display them */}
            <ExportJSON 
            log = {log}
            />
        </div>
    </div>
    );
};