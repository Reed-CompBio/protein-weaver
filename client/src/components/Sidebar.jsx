import React from "react";
import ExportJSON from "./ExportJSON";

export default function Sidebar({ currentNode, sourceNode, log, goTerm }) {
    if (!currentNode) {
        return (
            <div>
        <div 
        id="sidebarContent"
        className="sidebar"
        >
            <h2>Network Data</h2>
            <h3>Select a node to learn more</h3>
            <p>Queried protein: {sourceNode.label}</p>
            <p>Queried GO term:&nbsp;
                <a
                className="sidebar-link"
                href={`https://amigo.geneontology.org/amigo/term/${goTerm}`}
                target="_blank"
                rel="noopener"
                >
                    {goTerm}
                </a>
            </p>
            <div
            className="center-buttons">
                <a
                className="sidebar-link"
                href={`https://amigo.geneontology.org/amigo/gene_product/FB:${sourceNode.id}`}
                target="_blank"
                rel="noopener"
                >
                    AmiGO
                </a>
            {/* Need a separate query in Cypher to get all GO terms for the sourceNode and then display them */}
                <ExportJSON 
                log = {log}
                />
            </div>
        </div>
    </div>
        )
    } else if (currentNode.type === "go_protein") {
        return (
            <div>
                <div 
                id="sidebarContent"
                className="sidebar"
                >
                    <h2>Network Data</h2>
                    <p>Selected protein: {currentNode.label}</p>
                    <p>Database ID:&nbsp;
                        <a
                        className="sidebar-link"
                        href={`https://flybase.org/reports/${currentNode.id}`}
                        target="_blank"
                        rel="noopener"
                        >
                            {currentNode.id}
                        </a>
                    </p>
                    <p>Protein of interest: {sourceNode.label}</p>
                    <p>Queried GO term:&nbsp;
                        <a
                        className="sidebar-link"
                        href={`https://amigo.geneontology.org/amigo/term/${goTerm}`}
                        target="_blank"
                        rel="noopener"
                        >
                            {goTerm}
                        </a>
                    </p>
                    <div
                    className="center-buttons">
                        <a
                        className="sidebar-link"
                        href={`https://amigo.geneontology.org/amigo/gene_product/FB:${sourceNode.id}`}
                        target="_blank"
                        rel="noopener"
                        >
                        AmiGO
                        </a>
                    {/* Need a separate query in Cypher to get all GO terms for the sourceNode and then display them */}
                        <ExportJSON 
                        log = {log}
                        />
                    </div>
                </div>
            </div>
            );
    
    } else {

    // need to write conditional logic to check the current node
    // if currentNode is null, do not display anything but a message to select a node and title
    // if currentNode.type === "source" then display specific information about the source node
    // if currentNode.type === "intermediate" then display specific information about the path its on, maybe source and targets of path
    // if currentNode.type === "go_protein" then display specific information about the go term and level of evidence node

        return (
        <div>
            <div 
            id="sidebarContent"
            className="sidebar"
            >
                <h2>Network Data</h2>
                <p>Selected protein: {currentNode.label}</p>
                <p>Database ID:&nbsp;
                    <a
                    className="sidebar-link"
                    href={`https://flybase.org/reports/${currentNode.id}`}
                    target="_blank"
                    rel="noopener"
                    >
                        {currentNode.id}
                    </a>
                </p>
                <p>Protein of interest: {sourceNode.label}</p>
                <p>Source node GO terms: </p>
                <p>Queried GO term:&nbsp;
                    <a
                    className="sidebar-link"
                    href={`https://amigo.geneontology.org/amigo/term/${goTerm}`}
                    target="_blank"
                    rel="noopener"
                    >
                        {goTerm}
                    </a>
                </p>
            {/* Need a separate query in Cypher to get all GO terms for the sourceNode and then display them */}
                <div
                className="center-buttons">
                    <a
                    className="sidebar-link"
                    href={`https://amigo.geneontology.org/amigo/gene_product/FB:${sourceNode.id}`}
                    target="_blank"
                    rel="noopener"
                    >
                        AmiGO
                    </a>
            {/* Need a separate query in Cypher to get all GO terms for the sourceNode and then display them */}
                    <ExportJSON 
                    log = {log}
                    />
                </div>
            </div>
        </div>
        );
    };
};