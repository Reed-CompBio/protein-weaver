import { React, useState, useEffect, useRef } from "react";
import ExportLogJSON from "./ExportLogJSON";

export default function Sidebar({
  currentNode,
  sourceNode,
  query,
  goTerm,
  newSourceNode,
  handleSubmit,
  exportPNG,
  searchExecuted,
  queryCount,
  logs,
  handleLog,
}) {

  const [proteinCount, setProteinCount] = useState(0);

  useEffect(() => {
    if (currentNode) {
      const logKey = `protein${proteinCount + 1}`;
      const newProtein = {
        protein: currentNode,
        timestamp: new Date().toISOString(),
      };
      setProteinCount(proteinCount + 1);
      handleLog(newProtein)
    }
  }, [currentNode]);

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

  if (!currentNode) {
    // if currentNode is null, display query info and a message to select a node
    return (
      <div>
        <div id="sidebarContent" className="sidebar">
          <h2>Network Results</h2>
          <h3>Select a node to learn more</h3>
          <p>Queried protein: {sourceNode.label}</p>
          <div className="center-buttons">
            <a
              className="red-sidebar-link"
              href={`https://amigo.geneontology.org/amigo/gene_product/FB:${sourceNode.id}`}
              target="_blank"
              rel="noopener"
            >
              AmiGO
            </a>
          </div>
          <div>
            <p>Queried GO term:</p>
            <div className="center-buttons">
              <a
                className="blue-sidebar-link"
                href={`https://amigo.geneontology.org/amigo/term/${goTerm.id}`}
                target="_blank"
                rel="noopener"
              >
                {goTerm.name}
              </a>
            </div>
          </div>
          <br />
          <div className="go-description">
            <p>{goTerm.def}</p>
          </div>
          <br />
          <div className="center-buttons">
            <ExportLogJSON log={logs} />
            <br />
            <a className="export" onClick={exportPNG}>
              Export Graph to PNG
            </a>
          </div>
        </div>
      </div>
    );
  } else if (currentNode.type === "go_protein") {
    // if currentNode.type === "go_protein" then display specific relation information about the go term and level of evidence
    // still need to add level of evidence to the sidebar
    return (
      <div>
        <div id="sidebarContent" className="sidebar">
          <h2>Network Results</h2>
          <p>Selected protein: {currentNode.label}</p>
          <p>
            Database ID:&nbsp;
            <a
              className="blue-sidebar-link"
              href={`https://flybase.org/reports/${currentNode.id}`}
              target="_blank"
              rel="noopener"
            >
              {currentNode.id}
            </a>
          </p>
          <p>Protein of interest: {sourceNode.label}</p>
          <div className="center-buttons">
            <a
              className="red-sidebar-link"
              href={`https://amigo.geneontology.org/amigo/gene_product/FB:${sourceNode.id}`}
              target="_blank"
              rel="noopener"
            >
              AmiGO
            </a>
          </div>
          <p>GO qualifier: {currentNode.go_protein}</p>
          <div>
            <p>Queried GO term:</p>
            <div className="center-buttons">
              <a
                className="blue-sidebar-link"
                href={`https://amigo.geneontology.org/amigo/term/${goTerm.id}`}
                target="_blank"
                rel="noopener"
              >
                {goTerm.name}
              </a>
            </div>
          </div>
          <div className="center-buttons">
            <br />
            <form method="post" onSubmit={handleSubmit} action="api/getFlyBase">
              <button
                className="new-source"
                onClick={newSourceNode}
                new-source-node={currentNode.id}
              >
                Set as New Source Node
              </button>
            </form>
            <br />
            <ExportLogJSON log={logs} />
            <br />
            <a className="export" onClick={exportPNG}>
              Export Graph to PNG
            </a>
          </div>
        </div>
      </div>
    );
  } else if (currentNode.type === "intermediate") {
    // if currentNode.type === "intermediate" then display specific information about the path its on, maybe source and targets of path
    return (
      <div>
        <div id="sidebarContent" className="sidebar">
          <h2>Network Results</h2>
          <p>Selected protein: {currentNode.label}</p>
          <p>
            Database ID:&nbsp;
            <a
              className="tan-sidebar-link"
              href={`https://flybase.org/reports/${currentNode.id}`}
              target="_blank"
              rel="noopener"
            >
              {currentNode.id}
            </a>
          </p>
          <p>Protein of interest: {sourceNode.label}</p>
          <div className="center-buttons">
            <a
              className="red-sidebar-link"
              href={`https://amigo.geneontology.org/amigo/gene_product/FB:${sourceNode.id}`}
              target="_blank"
              rel="noopener"
            >
              AmiGO
            </a>
          </div>
          <div>
            <p>Queried GO term:</p>
            <div className="center-buttons">
              <a
                className="blue-sidebar-link"
                href={`https://amigo.geneontology.org/amigo/term/${goTerm.id}`}
                target="_blank"
                rel="noopener"
              >
                {goTerm.name}
              </a>
            </div>
          </div>
          <div className="center-buttons">
            <br />
            <form method="post" onSubmit={handleSubmit}>
              <button
                className="new-source"
                onClick={newSourceNode}
                new-source-node={currentNode.id}
              >
                Set as New Source Node
              </button>
            </form>
            <br />
            <ExportLogJSON log={logs} />
            <br />
            <a className="export" onClick={exportPNG}>
              Export Graph to PNG
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    // if currentNode.type === "source" then display specific information about the source node
    return (
      <div>
        <div id="sidebarContent" className="sidebar">
          <h2>Network Results</h2>
          <p>Selected protein: {currentNode.label}</p>
          <p>
            Database ID:&nbsp;
            <a
              className="red-sidebar-link"
              href={`https://flybase.org/reports/${currentNode.id}`}
              target="_blank"
              rel="noopener"
            >
              {currentNode.id}
            </a>
          </p>
          <p>Protein of interest: {sourceNode.label}</p>
          <div className="center-buttons">
            <a
              className="red-sidebar-link"
              href={`https://amigo.geneontology.org/amigo/gene_product/FB:${sourceNode.id}`}
              target="_blank"
              rel="noopener"
            >
              AmiGO
            </a>
          </div>
          <div>
            <p>Queried GO term:</p>
            <div className="center-buttons">
              <a
                className="blue-sidebar-link"
                href={`https://amigo.geneontology.org/amigo/term/${goTerm.id}`}
                target="_blank"
                rel="noopener"
              >
                {goTerm.name}
              </a>
            </div>
          </div>
          <div className="center-buttons">
            <br />
            <ExportLogJSON log={logs} />
            <br />
            <a className="export" onClick={exportPNG}>
              Export Graph to PNG
            </a>
          </div>
        </div>
      </div>
    );
  }
}
