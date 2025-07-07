# Data Processing Scripts

This folder contains supplementary scripts to generate and clean the data used in ProteinWeaver.

## Folder Structure

- **`/scripts`**: Contains all data processing, scraping, and cleaning scripts.
  - [`AddSourceColumn.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/AddSourceColumn.R): Add source database as a column to all regulatory and physical datasets.
  - [`ArabidopsisThaliana.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ArabidopsisThaliana.R): R file that processes protein-protein interaction, gene ontology annotations, and regulatory interactions from STRING, ATRM, QuickGO and Uniprot (Arabidopsis thaliana)
  - [`AutomaticDataImport.sh`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/AutomaticDataImport.sh): A bash script that automates the data import in a pre-existing `proteinweaver` Neo4j Docker instance. Each corresponding `.cypher` extension file will have to be updated when datasets are updated.
  - [`AncestralEdges.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/AncestralEdges.cypher): Cypher script that propagates inferred edges from direct GO annotations.
  - [`BsubDataMerging.Rmd`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/): R Markdown for merging, filtering, and cleaning B. subtilis data.
  - [`CallGraphProjection.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/): Cypher script that calls the graph projection for local development.
  - [`CreateLocalEnv.sh`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/CreateLocalEnv.sh): A bash script that automates the setup of the ProteinWeaver development environment.
  - [`DataImportGO.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/DataImportGO.cypher): Cypher script for importing GO data.
  - [`DataImportTXID3702.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/DataImportTXID3702.cypher): Cypher script for importing A. thaliana data.
  - [`DataImportTXID6239.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/DataImportTXID6239.cypher): Cypher script for importing C. elegans data.
  - [`DataImportTXID7227.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/DataImportTXID7227.cypher): Cypher script for importing D. melanogaster data.
  - [`DataImportTXID7955.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/DataImportTXID7955.cypher): Cypher script for importing D. rerio data.
  - [`DataImportTXID224308.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/DataImportTXID224308.cypher): Cypher script for importing B. subtilis data.
  - [`DataImportTXID511145.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/DataImportTXID511145.cypher): Cypher script for importing E. coli (K-12) data.
  - [`DataImportTXID559292.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/DataImportTXID559292.cypher): Cypher script for importing S. cerevisiae data.
  - [`DownloadCSVs.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/): Cypher script that processes and downloads CSVs from Neo4j for the user download page.
  - [`EscherichiaColi.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/EscherichiaColi.R): R file that processes protein-protein interaction, gene ontology annotations, and regulatory interactions from STRING, RegulonDB, QuickGO and Uniprot (Escherichia coli K-12)
  - [`elegans.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/elegans.R): R script that processes protein-protein interaction, gene ontology annotations, and regulatory interactions from Wormbase, TFLink, and Uniprot (Caenorhabditis elegans)
  - [`GeneOntologyNeverAnnotate.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/GeneOntologyNeverAnnotate.R): R script to identify GO terms that should never be annotated to proteins.
  - [`get-experiments.js`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/get-experiments.js): JavaScript for getting experimental data from XML and converting to JSON format.
  - [`get-interactors.js`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/get-interactors.js): JavaScript for getting interactor data from XML and converting to JSON format.
  - [`get-interactions.js`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/get-interactions.js): JavaScript for getting interaction data from XML and converting to JSON format.
  - [`GetXML.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/GetXML.ipynb): Jupyter Notebook for scraping zebrafish data from PSICQUIC database into XML format.
  - [`JoinBSUtoUniProt.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/JoinBSUtoUniProt.R): R script to join the BSubCyc identifiers with UniProt identifiers.
  - [`ParseOBOtoTXT.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ParseOBOtoTXT.ipynb): Jupyter Notebook for parsing Gene Ontology common names from OBO format into tab-delimited format.
  - [`ParseOntologyRelationship.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ParseOntologyRelationship.ipynb): Jupyter Notebook for parsing Gene Ontology relationships from OBO format into tab-delimited format.
  - [`ProteinWeaverConstraints.cypher`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ProteinWeaverConstraints.cypher): Cypher script for setting constraints in the Neo4j database.
  - [`RemoveNotQualifier.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/RemoveNotQualifier.R): R script to remove NOT| qualifiers from GO Association data files.
  - [`SplitRegulatoryColumns7227.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/SplitRegulatoryColumns7227.R): R script to split FlyBase references for D. melanogaster regulatory data.
  - [`SubColNames.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/SubColNames.R): R script to replace column names from QuickGO data for easy Neo4j import.
  - [`TestNeo4j.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/TestNeo4j.ipynb): Python notebook to test if a Neo4j docker instance is working.
  - [`UpdateDownloads.sh`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/UpdateDownloads.sh): A bash script that updates the files in `/Downloads/`.
  - [`yeast.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/yeast.R): R file that processes protein-protein interaction, gene ontology annotations, and regulatory interactions from Biogrid, TFLink, and Uniprot (Saccharomyces cerevisiae)
  - [`ZebrafishDataMerging.Rmd`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ZebrafishDataMerging.Rmd): R Markdown for merging, filtering, and cleaning zebrafish data from STRING-DB & PSICQUIC (Danio rerio)
  
- **`/data`**: Placeholder for any intermediate or processed data files.
  - [`DanioRerio/zfish_psicquic_results.xml`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/): Results from PSICQUIC database in XML format.
  - [`DanioRerio/interactors.csv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/interactors.csv): Resulting dataset from `/scripts/get-interactors.js`.
  - [`DanioRerio/interactions.csv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/interactions.csv): Resulting dataset from `/scripts/get-interactions.js`.
  - [`DanioRerio/zfish_interactome.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_interactome.txt): Resulting dataset from `/scripts/ZebrafishDataMerging.Rmd`.
  - [`GeneOntology/go_neverAnnotate.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/GeneOntology/go_neverAnnotate.txt): Resulting dataset from `/scripts/GeneOntologyNeverAnnotate.R`.

## Data Sources
- Available in [ProteinWeaver's documentation](https://reed-compbio.github.io/protein-weaver/data-version/).