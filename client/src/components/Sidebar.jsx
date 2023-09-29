import React from "react";
import ExportJSON from "./ExportJSON";

export default function Sidebar({ currentNode, sourceNode, log, goTerm }) {

    return (
    <div>
        <div 
        id="sidebarContent"
        className="sidebar"
        >
            <h2>Network Data</h2>
            <p>Protein: {currentNode.label}</p>
            <p>Database ID: {currentNode.id}</p>
            <p>Type of node: {currentNode.type}</p>
            <p>Protein of interest: {sourceNode}</p>
            <p>Source node GO terms: </p>
            <p>Queried GO term: 
                <a
                href={`https://amigo.geneontology.org/amigo/term/${goTerm}`}
                target="_blank"
                rel="noopener"
                >
                    &nbsp;{goTerm}
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