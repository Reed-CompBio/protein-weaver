import React from "react";
import MainLayout from "../layout/MainLayout";
import SubNetworkImage from "../assets/subnetwork-example.png";
import Neo4jImage from "../assets/neo4j-image.png";
import InducedSubgraph from "../assets/induced-subgraph.png";
import ConfusingK from "../assets/confusing-k.png";


export default function FAQPage() {
  return (
    <div>
      <MainLayout>
        <div className="main-layout-body">
          <div className="faq-body">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <h3>What is ProteinWeaver?</h3>
            <p>
              ProteinWeaver is a web-based tool designed to enhance the
              visualization and analysis of non-human protein interaction
              networks through integration of Gene Ontology (<a
                className="faq-body-link"
                href="https://geneontology.org/docs/ontology-documentation/"
              >
                GO
              </a>) annotations.
            </p>
            <div className="faq-image-container">
              <div>
                <h3 className="faq-body-text">What is the purpose of ProteinWeaver?</h3>
                <p className="faq-body-text">
                  While many network-based methods and tools exist to predict protein function,
                  one may simply want to ask, “How does a protein connect to other proteins with a specific function?”
                  ProteinWeaver provides users with a simple, easy interface to visualize protein interaction networks
                  in the context of a specific biological function. Based on a user-specified protein and GO term,
                  ProteinWeaver generates an induced subgraph connecting the protein of interest to proteins annotation to
                  the GO term of interest.
                </p>
                <h3 className="faq-body-text">
                  How does ProteinWeaver generate the subnetwork?
                </h3>
                <p className="faq-body-text">
                  ProteinWeaver constructs a subnetwork using three user-defined parameters: a source protein,
                  a specified GO term, and <em>k</em>. Using <a
                    className="faq-body-link"
                    href="https://neo4j.com/docs/graph-data-science/current/algorithms/yens/"
                  >
                    Yen's <em>k</em>-shortest path algorithm
                  </a>, ProteinWeaver
                  generates an induced subgraph that interconnects the source protein with proteins
                  annotated to the designated GO term.
                </p>
              </div>
              <img className="subnetwork-image" src={SubNetworkImage}></img>
            </div>
            <h3 className="faq-body-text">
              Why was there only one GO protein when I entered <em>k</em>=3?
            </h3>
            <div className="faq-image-container">
              <div>
                <p className="faq-body-text">
                  ProteinWeaver generates the <em>k</em>-shortest path between the source protein and
                  proteins annotated to specific GO terms. In cases where the three shortest paths
                  from the source protein converge on the same GO protein or if there exists only
                  one protein annotated to the GO term of interest, ProteinWeaver will return a singular GO protein.
                </p>
                <h3 className="faq-body-text">
                  How can biologists use this tool?
                </h3>
                <p className="faq-body-text">
                  ProteinWeaver provides users with a rapid, user-friendly, and reproducible
                  means to investigate proteins across a diverse range of non-human model
                  organisms, including prokaryotes (<em>B. subtilis</em>),
                  invertebrates (<em>D. melanogaster</em>), and vertebrates (<em>D. rerio</em>).
                  This tool streamlines the process of hypothesis generation and exploration of
                  protein networks across multiple species, catering to users with varying levels of expertise.
                  Its intuitive interface and seamless reproducibility expedite the discovery of
                  valuable biological insights without compromising accessibility.
                </p>
              </div>
              <img className="confusing-k-image" src={ConfusingK}></img>
            </div>
            <h3>What is ProteinWeaver built on?</h3>
            <div className="faq-image-container">
              <div>
                <p className="faq-body-text">
                  ProteinWeaver uses React.js and Cytoscape.js to render the frontend, providing
                  users with a fluid and dynamic interface. This combination enables seamless
                  alterations to the displayed information within a visualization software tailored for graph networks.
                </p>
                <p className="faq-body-text">
                  Given the intricate nature of protein networks, traditional relational databases
                  struggle with efficient lookups within the network structure, such as swiftly
                  retrieving paths between nodes or obtaining all nodes with specific properties.
                  To address this challenge, ProteinWeaver employs Neo4j, a native graph database uniquely
                  designed for handling complex networks. Neo4j excels in performing graph traversals,
                  computing shortest paths, and executing rapid node lookups, enabling fast and effective
                  operations within ProteinWeaver's network environment. To facilitate seamless communication
                  between the React.js/Cytoscape.js frontend and the Neo4j database, ProteinWeaver employs Express.js and Node.js.
                </p>
              </div>
              <img className="subnetwork-image" src={Neo4jImage}></img>
            </div>
            <h3>What is an "induced subgraph?"</h3>
            <div className="faq-image-container">
              <div>
                <p className="faq-body-text">
                  ProteinWeaver uses a <em>k</em>-shortest path algorithm to generate
                  the queried subnetwork. Interactions may exist between the proteins
                  in the subnetwork that are not directly on the shortest path from
                  the queried protein to proteins annotated to GO terms. In order to provide
                  the full context of the protein of interest and the subnetwork generated,
                  ProteinWeaver also returns any existing interaction between any protein
                  on the subnetwork AKA the "induced subgraph." ProteinWeaver represents
                  these interactions in grey on the graph and gives users the ability
                  to hide or show these edges.
                </p>
              </div>
              <img className="induced-subgraph-image" src={InducedSubgraph}></img>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
