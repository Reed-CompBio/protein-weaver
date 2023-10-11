import { React, useState, useEffect } from "react";
import ExportLogJSON from "./ExportLogJSON";

export default function Sidebar({
  currentNode,
  sourceNode,
  query,
  goTerm,
  newSourceNode,
  handleSubmit,
  exportPNG,
  networkResult,
}) {
  const [log, setLog] = useState({});
  const [queryCount, setQueryCount] = useState(0);
  const [proteinCount, setProteinCount] = useState(0);

  useEffect(() => {
    if (currentNode) {
      const logKey = `protein${proteinCount + 1}`;
      setLog((prevLog) => {
        const newProtein = {
          ...prevLog[logKey],
          protein: currentNode,
          timestamp: new Date().toISOString(),
        };
        return {
          ...prevLog,
          [logKey]: newProtein,
        };
      });
      setProteinCount(proteinCount + 1);
    };
  }, [currentNode]);

  useEffect(() => {
    if (query) {
      const logKey = `query${queryCount + 1}`;
      setLog((prevLog) => {
        const newQuery = {
          ...prevLog[logKey],
          query: query,
          timestamp: new Date().toISOString(),
        };
        return {
          ...prevLog,
          [logKey]: newQuery,
        };
      });
      setQueryCount(queryCount + 1);
      console.log("added query log", log);
    }
  }, [networkResult]);

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
              className="sidebar-link"
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
                className="sidebar-link"
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
            <ExportLogJSON log={log} />
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
              className="sidebar-link"
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
              className="sidebar-link"
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
                className="sidebar-link"
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
                className="button"
                onClick={newSourceNode}
                new-source-node={currentNode.id}
              >
                Set as New Source Node
              </button>
            </form>
            <br />
            <ExportLogJSON log={log} />
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
              className="sidebar-link"
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
              className="sidebar-link"
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
                className="sidebar-link"
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
                className="button"
                onClick={newSourceNode}
                new-source-node={currentNode.id}
              >
                Set as New Source Node
              </button>
            </form>
            <br />
            <ExportLogJSON log={log} />
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
              className="sidebar-link"
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
              className="sidebar-link"
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
                className="sidebar-link"
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
            <ExportLogJSON log={log} />
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
