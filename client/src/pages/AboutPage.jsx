import React from "react";
import MainLayout from "../layout/MainLayout";

export default function AboutPage() {
  return (
    <div>
      <MainLayout>
        <div className="main-layout-body">
          <div className="about-body">
            <h2 className="about-title">About Page</h2>
            <p>
              ProteinWeaver is a web-based interface designed to enhance the
              visualization and analysis of protein interaction networks through
              the integration of ontological information.
            </p>
            <p>
              The inspiration for ProteinWeaver came from our collaborators asking the
              question “How does a protein connect to other proteins with a
              specific function?" While many network-based tools exist for predicting protein function
              and visualizing protein networks, a gap existed in the tools to help
              biologists understand a protein's contextual placement in a biological
              framework. Thus, ProteinWeaver was created to facilitate the exploration of protein
              interaction networks, emphasizing protein function.
            </p>
            <p>
              The current version of ProteinWeaver enables users to query a protein
              of interest and its associations with specific functions or processes via gene
              ontology terms. This prompts ProteinWeaver to construct a focused subnetwork,
              connecting the queried protein with others annotated by the specified GO term.
              Users can navigate and delve deeper into these networks using the interactive Cytoscape graph,
              allowing dynamic traversal and the ability to requery by introducing new proteins of interest.
            </p>
            <h2 className="about-body-text-heading">Project Team</h2>
            <h3 className="about-body-text-heading">Project Lead</h3>
            <p>
              Anna Ritz is an Associate Professor of Biology at Reed College. A
              computer scientist by training, she does research in computational
              systems molecular biology. Dr. Ritz primarily develops graph
              algorithms to analyze signaling pathways in large protein-protein
              interaction networks.
            </p>
            <h3 className="about-body-text-heading">Contributors</h3>
            <ul>
              <li>Altaf Barelvi, Reed College</li>
              <li>Oliver Anderson, Reed College</li>
            </ul>
            <h2 className="about-body-text-heading">Funding</h2>
            <p>
              This project is supported by an NSF CAREER Award{" "}
              <a href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=1750981">
                (DBI-1750981)
              </a>{" "}
              to Anna Ritz.
            </p>
            <h2 className="about-body-text-heading">Libraries</h2>
            <p>
              This website was produced with the following libraries and
              frameworks:
            </p>
            <ul className="about-list">
              <li className=".about-body-link">
                <a href="https://react.dev/">React.js</a>
              </li>
              <li>
                <a href="https://vitejs.dev/">Vite</a>
              </li>
              <li>
                <a href="https://expressjs.com/">Express.js</a>
              </li>
              <li>
                <a href="https://nodejs.org/en/">Node.js</a>
              </li>
              <li>
                <a href="https://react-joyride.com/">react-joyride</a>
              </li>
              <li>
                <a href="https://neo4j.com/">Neo4j</a>
              </li>
              <li>
                <a href="https://www.digitalocean.com/">DigitalOcean</a>
              </li>
              <li>
                <a href="https://www.nginx.com/">Nginx</a>
              </li>
              <li>
                <a href="https://react-icons.github.io/react-icons/">
                  react-icons
                </a>
              </li>
            </ul>
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
