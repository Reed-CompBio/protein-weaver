# Data Processing Scripts

This folder contains supplementary scripts to generate and clean the data used in ProteinWeaver.

## Folder Structure

- **`/scripts`**: Contains all data processing, scraping, and cleaning scripts.
  - [`AddSourceColumn.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/AddSourceColumn.R): Add source database as a column to all regulatory and physical datasets.
  - [`AutomaticDataImport.sh`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/AutomaticDataImport.sh): A bash script that automates the data import in a pre-existing `proteinweaver` Neo4j Docker instance. Each corresponding `.cypher` extension file will have to be updated when datasets are updated.
  	- [`AncestralEdges.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/AncestralEdges.cypher): Cypher script that propagates inferred edges from direct GO annotations.
  	- [`DataImportGO.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/DataImportGO.cypher): Cypher script for importing GO data.
  	- [`DataImportTXID6239.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/DataImportTXID6239.cypher): Cypher script for importing C. elegans data.
  	- [`DataImportTXID7227.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/DataImportTXID7227.cypher): Cypher script for importing D. melanogaster data.
  	- [`DataImportTXID7955.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/DataImportTXID7955.cypher): Cypher script for importing D. rerio data.
  	- [`DataImportTXID224308.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/DataImportTXID224308.cypher): Cypher script for importing B. subtilis data.
  	- [`DataImportTXID559292.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/DataImportTXID559292.cypher): Cypher script for importing S. cerevisiae data.
  	- [`ProteinWeaverConstraints.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ProteinWeaverConstraints.cypher): Cypher script for setting constraints in the Neo4j database.
  - [`BsubDataMerging.Rmd`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/): R Markdown for merging, filtering, and cleaning B. subtilis data.
  - [`CreateLocalEnv.sh`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/CreateLocalEnv.sh): A bash script that automates the setup of the ProteinWeaver development environment.
  	- [`CallGraphProjection.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/): Cypher script that calls the graph projection for local development.
  - [`elegans.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/elegans.R): R script that processes protein-protein interaction, gene ontology annotations, and regulatory interactions from Wormbase, TFLink, and Uniprot
  - [`GeneOntologyNeverAnnotate.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/GeneOntologyNeverAnnotate.R): R script to identify GO terms that should never be annotated to proteins.
  - [`get-experiments.js`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/get-experiments.js): JavaScript for getting experimental data from XML and converting to JSON format.
  - [`get-interactors.js`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/get-interactors.js): JavaScript for getting interactor data from XML and converting to JSON format.
  - [`get-interactions.js`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/get-interactions.js): JavaScript for getting interaction data from XML and converting to JSON format.
  - [`GetXML.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/GetXML.ipynb): Jupyter Notebook for scraping zebrafish data from PSICQUIC database into XML format.
  - [`JoinBSUtoUniProt.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/JoinBSUtoUniProt.R): R script to join the BSubCyc identifiers with UniProt identifiers.
  - [`ParseOBOtoTXT.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ParseOBOtoTXT.ipynb): Jupyter Notebook for parsing Gene Ontology common names from OBO format into tab-delimited format.
  - [`ParseOntologyRelationship.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ParseOntologyRelationship.ipynb): Jupyter Notebook for parsing Gene Ontology relationships from OBO format into tab-delimited format.
  - [`RemoveNotQualifier.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/RemoveNotQualifier.R): R script to remove NOT| qualifiers from GO Association data files.
  - [`SplitRegulatoryColumns7227.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/SplitRegulatoryColumns7227.R): R script to split FlyBase references for D. melanogaster regulatory data.
  - [`SubColNames.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/SubColNames.R): R script to replace column names from QuickGO data for easy Neo4j import.
  - [`TestNeo4j.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/TestNeo4j.ipynb): Python notebook to test if a Neo4j docker instance is working.
  - [`UpdateDownloads.sh`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/UpdateDownloads.sh): A bash script that updates the files in `/downloads/`.
  	- [`DownloadCSVs.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/): Cypher script that processes and downloads CSVs from Neo4j for the user download page.
  - [`yeast.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/elegans.R): R file that processes protein-protein interaction, gene ontology annotations, and regulatory interactions from Biogrid, TFLink, and Uniprot
  - [`ZebrafishDataMerging.Rmd`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ZebrafishDataMerging.Rmd): R Markdown for merging, filtering, and cleaning zebrafish data from STRING-DB & PSICQUIC.

## Data Sources

- Available in [ProteinWeaver's documentation](https://reed-compbio.github.io/protein-weaver/data-version/).