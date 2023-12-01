import { React, useState, useEffect, useRef } from "react";
import ExportLogJSON from "./ExportLogJSON";
import GoDefinition from "./GoDefinition";
import AncestorSelector from "./AncestorSelector";

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
  parentGoTerms,
  childrenGoTerms,
  handleGoTermChange
}) {
  const [proteinCount, setProteinCount] = useState(0);
  const [selectedDbLink, setSelectedDbLink] = useState("");
  const [sourceNodeLink, setSourceNodeLink] = useState("");

  useEffect(() => {
    if (query.species === "txid7227") {
      setSourceNodeLink(`https://amigo.geneontology.org/amigo/gene_product/FB:${sourceNode.id}`)
    } else if (query.species === "txid224308") {
      var bsubId = query.protein.replace(/_/g, '')
      setSourceNodeLink(`https://bsubcyc.org/gene?orgid=BSUB&id=${bsubId}#tab=GO`)
    } else if (query.species === "txid7955") {
      setSourceNodeLink(`https://www.uniprot.org/uniprotkb/${sourceNode.id}/entry#function`)
    }
  }, [query.species]);

  useEffect(() => {
    if (currentNode) {
      if (query.species === "txid7227") {
        setSelectedDbLink(`https://flybase.org/reports/${currentNode.id}`)
      } else if (query.species === "txid224308") {
        var bsubId = query.protein.replace(/_/g, '')
        setSelectedDbLink(`https://bsubcyc.org/gene?orgid=BSUB&id=${bsubId}`)
      } else if (query.species === "txid7955") {
        setSelectedDbLink(`https://www.uniprot.org/uniprotkb/${currentNode.id}/entry`)
      }
    }
  }, [currentNode, query.species])

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
          <p>Queried protein: <b>{sourceNode.label}</b></p>
          <div className="center-buttons">
            <a
              className="red-sidebar-link"
              href={sourceNodeLink}
              target="_blank"
              rel="noopener"
            >
              Source Ontology
            </a>
          </div>
          <div>
            <p>Queried GO term:</p>
            <div className="center-buttons">
              <AncestorSelector
                parentGoTerms={parentGoTerms}
              />
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
          <GoDefinition open>
            <p>&nbsp;&nbsp;&nbsp;{goTerm.def}</p>
          </GoDefinition>
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
          <p>Protein of interest: <b>{sourceNode.label}</b></p>
          <div className="center-buttons">
            <a
              className="red-sidebar-link"
              href={sourceNodeLink}
              target="_blank"
              rel="noopener"
            >
              Source Ontology
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
            <GoDefinition open>
              <p>&nbsp;&nbsp;&nbsp;{goTerm.def}</p>
            </GoDefinition>
          </div>
          <p>Selected protein: {currentNode.label}</p>
          <p>
            Database ID:&nbsp;
            <a
              className="blue-sidebar-link"
              href={selectedDbLink}
              target="_blank"
              rel="noopener"
            >
              {currentNode.id}
            </a>
          </p>
          <p>GO qualifier: {currentNode.go_protein}</p>
          <div className="center-buttons">
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
          <p>Protein of interest: <b>{sourceNode.label}</b></p>
          <div className="center-buttons">
            <a
              className="red-sidebar-link"
              href={sourceNodeLink}
              target="_blank"
              rel="noopener"
            >
              Source Ontology
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
            <GoDefinition open>
              <p>&nbsp;&nbsp;&nbsp;{goTerm.def}</p>
            </GoDefinition>
          </div>
          <p>Selected protein: {currentNode.label}</p>
          <p>
            Database ID:&nbsp;
            <a
              className="tan-sidebar-link"
              href={selectedDbLink}
              target="_blank"
              rel="noopener"
            >
              {currentNode.id}
            </a>
          </p>
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
          <p>Protein of interest: <b>{sourceNode.label}</b></p>
          <div className="center-buttons">
            <a
              className="red-sidebar-link"
              href={sourceNodeLink}
              target="_blank"
              rel="noopener"
            >
              Source Ontology
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
            <GoDefinition open>
              <p>&nbsp;&nbsp;&nbsp;{goTerm.def}</p>
            </GoDefinition>
          </div>
          <p>Selected protein: {currentNode.label}</p>
          <p>
            Database ID:&nbsp;
            <a
              className="red-sidebar-link"
              href={selectedDbLink}
              target="_blank"
              rel="noopener"
            >
              {currentNode.id}
            </a>
          </p>
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
