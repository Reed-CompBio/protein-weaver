# Data Gathering and Cleaning Scripts

This folder contains supplementary scripts to generate and clean the data used in ProteinWeaver.

## Overview

Provide a brief overview of the purpose and goals of this project.

## Folder Structure

- **`/scripts`**: Contains the data scraping and cleaning scripts.
  - `get-interactors.js`: JavaScript for getting interactor data from XML and converting to JSON format.
  - `get-interactions.js`: JavaScript for getting interaction data from XML and converting to JSON format.
  - `GetXML.ipynb`: Jupyter Notebook for scraping zebrafish data from PSICQUIC database into XML format.
  - `ParseOBOtoTXT.ipynb`: Jupyter Notebook for parsing Gene Ontology common names from OBO format into tab-delimited format.
  - `ParseOntologyRelationship.ipynb`: Jupyter Notebook for parsing Gene Ontology relationships from OBO format into tab-delimited format.
  - `ZebrafishDataMerging.Rmd`: R Markdown for merging, filtering, and cleaning zebrafish data from STRING-DB & PSICQUIC.

- **`/data`**: Placeholder for any intermediate or processed data files.
  - `DanioRerio/zfish_psicquic_results.xml`: Results from PSICQUIC database in XML format.
  - `DanioRerio/interactors.csv`: Resulting dataset from `/scripts/get-interactors.js`.
  - `DanioRerio/interactions.csv`: Resulting dataset from `/scripts/get-interactions.js`.
  - `DanioRerio/zfish_interactome.txt`: Resulting dataset from `/scripts/ZebrafishDataMerging.Rmd`.

  

## Data Sources

1. The Gene Ontology
    - *The Gene Ontology Consortium, Aleksander, S. A., Balhoff, J., Carbon, S., Cherry, J. M., Drabkin, H. J., Ebert, D., Feuermann, M., Gaudet, P., Harris, N. L., Hill, D. P., Lee, R., Mi, H., Moxon, S., Mungall, C. J., Muruganugan, A., Mushayahama, T., Sternberg, P. W., Thomas, P. D., … Westerfield, M.* (2023). **The Gene Ontology knowledgebase in 2023**. Genetics, 224(1), iyad031. [!doi.org/10.1093/genetics/iyad031](https://doi.org/10.1093/genetics/iyad031)

2. PSCICQUIC
    - *del-Toro, N., Dumousseau, M., Orchard, S., Jimenez, R. C., Galeota, E., Launay, G., Goll, J., Breuer, K., Ono, K., Salwinski, L., & Hermjakob, H.* (2013). **A new reference implementation of the PSICQUIC web service**. Nucleic Acids Research, 41(W1), W601–W606. [!doi.org/10.1093/nar/gkt392](https://doi.org/10.1093/nar/gkt392)

3. STRING-DB
    - *Szklarczyk, D., Kirsch, R., Koutrouli, M., Nastou, K., Mehryary, F., Hachilif, R., Gable, A. L., Fang, T., Doncheva, N. T., Pyysalo, S., Bork, P., Jensen, L. J., & von Mering, C.* (2023). **The STRING database in 2023: Protein–protein association networks and functional enrichment analyses for any sequenced genome of interest**. Nucleic Acids Research, 51(D1), D638–D646. [!doi.org/10.1093/nar/gkac1000](https://doi.org/10.1093/nar/gkac1000)