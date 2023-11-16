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
              The inspiration came from collaborators wanting to ask the
              question “How does a protein connect to other proteins with a
              specific function?" Many network-based tools exists to predict
              protein function, however, there was a lack of tools that helps
              biologists understand how a protein is situated in a biological
              context.
            </p>
            <p>
              The current version of ProteinWeaver supports the ability to
              search for a specific protein of interest and how it connects to a
              specific function of process (through a gene ontology term). This
              generates a subnetwork that connects the protein to other proteins
              that are labeled with those GO terms. Exploration is aided by the
              interactive cytoscape graph by learning about the node
              informations, and dynamically travese the graph by setting new
              proteins of interest
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
            <h2>Libraries</h2>
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
