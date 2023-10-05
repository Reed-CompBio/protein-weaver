import { React, useState, useEffect } from "react";
import ExportLogJSON from "./ExportLogJSON";

export default function Sidebar({
  currentNode,
  sourceNode,
  query,
  goTerm,
  newSourceNode,
  handleSubmit,
}) {
  const [log, setLog] = useState({});
  const [queryCount, setQueryCount] = useState(0);
  const [proteinCount, setProteinCount] = useState(0);
  console.log(goTerm)

  useEffect(() => {
    if (currentNode) {
      const logKey = `protein${proteinCount + 1}`;
      setLog((prevLog) => ({
        ...prevLog,
        [logKey]: currentNode,
        timestamp: new Date().toISOString(),
      }));
      setProteinCount(proteinCount + 1);
    }
  }, [currentNode]);

  useEffect(() => {
    if (query) {
      const logKey = `query${queryCount + 1}`;
      setLog((prevLog) => ({
        ...prevLog,
        [logKey]: query,
        timestamp: new Date().toISOString(),
      }));
      setQueryCount(queryCount + 1);
    }
  }, [query]);

  console.log(log);

  if (!currentNode) {
    // if currentNode is null, display query info and a message to select a node
    return (
      <div>
        <div id="sidebarContent" className="sidebar">
          <h2>Network Results</h2>
          <h3>Select a node to learn more</h3>
          <p>Queried protein: {sourceNode.label}</p>
          <p>
            Queried GO term:
            <br />
            <br />
            <a
              className="sidebar-link"
              href={`https://amigo.geneontology.org/amigo/term/${goTerm.id}`}
              target="_blank"
              rel="noopener"
            >
              {goTerm.name}
            </a>
          </p>
          <div className="go-description">
            <p>{goTerm.def}</p>
          </div>
          <br />
          <div className="center-buttons">
            <a
              className="sidebar-link"
              href={`https://amigo.geneontology.org/amigo/gene_product/FB:${sourceNode.id}`}
              target="_blank"
              rel="noopener"
            >
              AmiGO
            </a>
            <ExportLogJSON log={log} />
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
          <p>GO qualifier: {currentNode.go_protein}</p>
          <p>
            Queried GO term:
            <br />
            <br />
            <a
              className="sidebar-link"
              href={`https://amigo.geneontology.org/amigo/term/${goTerm.id}`}
              target="_blank"
              rel="noopener"
            >
              {goTerm.name}
            </a>
          </p>
          <div className="center-buttons">
            <a
              className="sidebar-link"
              href={`https://amigo.geneontology.org/amigo/gene_product/FB:${sourceNode.id}`}
              target="_blank"
              rel="noopener"
            >
              AmiGO
            </a>
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
            <ExportLogJSON log={log} />
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
          <p>
            Queried GO term:
            <br />
            <br />
            <a
              className="sidebar-link"
              href={`https://amigo.geneontology.org/amigo/term/${goTerm.id}`}
              target="_blank"
              rel="noopener"
            >
              {goTerm.name}
            </a>
          </p>
          <div className="center-buttons">
            <a
              className="sidebar-link"
              href={`https://amigo.geneontology.org/amigo/gene_product/FB:${sourceNode.id}`}
              target="_blank"
              rel="noopener"
            >
              AmiGO
            </a>
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
            {/* Need a separate query in Cypher to get all GO terms for the sourceNode and then display them */}
            <ExportLogJSON log={log} />
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
          <p>Source node GO terms: </p>
          <p>
            Queried GO term:
            <br />
            <br />
            <a
              className="sidebar-link"
              href={`https://amigo.geneontology.org/amigo/term/${goTerm.id}`}
              target="_blank"
              rel="noopener"
            >
              {goTerm.name}
            </a>
          </p>
          <div className="center-buttons">
            <a
              className="sidebar-link"
              href={`https://amigo.geneontology.org/amigo/gene_product/FB:${sourceNode.id}`}
              target="_blank"
              rel="noopener"
            >
              AmiGO
            </a>
            <ExportLogJSON log={log} />
          </div>
        </div>
      </div>
    );
  };
};