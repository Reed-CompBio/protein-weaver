# Data Gathering and Cleaning Scripts

This folder contains supplementary scripts to generate and clean the data used in ProteinWeaver.

## Folder Structure

- **`/scripts`**: Contains the data scraping and cleaning scripts.
  - [`GeneOntologyNeverAnnotate.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/GeneOntologyNeverAnnotate.R): R script to identify GO terms that should never be annotated to proteins.
  - [`get-interactors.js`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/get-interactors.js): JavaScript for getting interactor data from XML and converting to JSON format.
  - [`get-interactions.js`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/get-interactions.js): JavaScript for getting interaction data from XML and converting to JSON format.
  - [`GetXML.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/GetXML.ipynb): Jupyter Notebook for scraping zebrafish data from PSICQUIC database into XML format.
  - [`JoinBSUtoUniProt.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/JoinBSUtoUniProt.R): R script to join the BSubCyc identifiers with UniProt identifiers.
  - [`ParseOBOtoTXT.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ParseOBOtoTXT.ipynb): Jupyter Notebook for parsing Gene Ontology common names from OBO format into tab-delimited format.
  - [`ParseOntologyRelationship.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ParseOntologyRelationship.ipynb): Jupyter Notebook for parsing Gene Ontology relationships from OBO format into tab-delimited format.
  - [`RemoveNotQualifier.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/RemoveNotQualifier.R): R script to remove NOT| qualifiers from GO Association data files.
  - [`SubColNames.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/SubColNames.R): R script to replace column names from QuickGO data for easy Neo4j import.
  - [`ZebrafishDataMerging.Rmd`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ZebrafishDataMerging.Rmd): R Markdown for merging, filtering, and cleaning zebrafish data from STRING-DB & PSICQUIC.
  - [`AutomaticDataImport.sh`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/AutomaticDataImport.sh): A bash script that automates the data import in a pre-existing `proteinweaver` Neo4j Docker instance. Each corresponding `.cypher` extension file will have to be updated when datasets are updated.

- **`/data`**: Placeholder for any intermediate or processed data files.
  - [`DanioRerio/zfish_psicquic_results.xml`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/): Results from PSICQUIC database in XML format.
  - [`DanioRerio/interactors.csv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/interactors.csv): Resulting dataset from `/scripts/get-interactors.js`.
  - [`DanioRerio/interactions.csv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/interactions.csv): Resulting dataset from `/scripts/get-interactions.js`.
  - [`DanioRerio/zfish_interactome.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_interactome.txt): Resulting dataset from `/scripts/ZebrafishDataMerging.Rmd`.
  - [`GeneOntology/go_neverAnnotate.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/GeneOntology/go_neverAnnotate.txt): Resulting dataset from `/scripts/GeneOntologyNeverAnnotate.R`.

## Data Sources

1. The Gene Ontology
    - *The Gene Ontology Consortium, Aleksander, S. A., Balhoff, J., Carbon, S., Cherry, J. M., Drabkin, H. J., Ebert, D., Feuermann, M., Gaudet, P., Harris, N. L., Hill, D. P., Lee, R., Mi, H., Moxon, S., Mungall, C. J., Muruganugan, A., Mushayahama, T., Sternberg, P. W., Thomas, P. D., … Westerfield, M.* (2023). **The Gene Ontology knowledgebase in 2023**. Genetics, 224(1), iyad031. [!doi.org/10.1093/genetics/iyad031](https://doi.org/10.1093/genetics/iyad031)

2. PSCICQUIC
    - *del-Toro, N., Dumousseau, M., Orchard, S., Jimenez, R. C., Galeota, E., Launay, G., Goll, J., Breuer, K., Ono, K., Salwinski, L., & Hermjakob, H.* (2013). **A new reference implementation of the PSICQUIC web service**. Nucleic Acids Research, 41(W1), W601–W606. [!doi.org/10.1093/nar/gkt392](https://doi.org/10.1093/nar/gkt392)

3. STRING-DB
    - *Szklarczyk, D., Kirsch, R., Koutrouli, M., Nastou, K., Mehryary, F., Hachilif, R., Gable, A. L., Fang, T., Doncheva, N. T., Pyysalo, S., Bork, P., Jensen, L. J., & von Mering, C.* (2023). **The STRING database in 2023: Protein–protein association networks and functional enrichment analyses for any sequenced genome of interest**. Nucleic Acids Research, 51(D1), D638–D646. [!doi.org/10.1093/nar/gkac1000](https://doi.org/10.1093/nar/gkac1000)