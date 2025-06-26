# Guide to Adding New Species to ProteinWeaver

This is the guide for adding a new species to ProteinWeaver.

## Step 1: Data Sources
ProteinWeaver requires three data files for a new species entry:
1. Protein-Protein Interaction (PPI) Dataset: `interactome-txid0000-YYYY_MM_DD.txt`
    - Undirected, physical binding events between two proteins
    - Potential sources: [BioGRID](https://downloads.thebiogrid.org/File/BioGRID/Latest-Release/BIOGRID-ORGANISM-LATEST.tab3.zip) or [STRING-DB](https://string-db.org/cgi/download?)
2. Gene Regulatory Network (GRN) Dataset: `regulatory-txid0000-YYYY_MM_DD.txt`
    - Directed transcription factor (TF) to target regulatory events
    - Look for species-specific sources. [TFLink](https://tflink.net/download/) also has a few model organisms available.
3. Gene Ontology (GO) Association Dataset: `annotations-txid0000-YYYY_MM_DD.txt`
    - Protein/Gene to GO term relationships
    - The best practice is to download the entire dataset for the specific taxon ID from [QuickGO](https://www.ebi.ac.uk/QuickGO/annotations?taxonId=000000&taxonUsage=descendants&geneProductSubset=Swiss-Prot&geneProductType=protein).

- Once you have gathered your data, create a new folder in the `ProteinWeaver/data/` directory with your full species name. Model it after the other folders that exist.

- Bring your raw datasets into this folder and create a data cleaning script in this directory with the same name as your directory. Use whatever language feels comfortable, R or Python are great for data cleaning.

**NOTES:**
- There may be multiple taxon IDs for a given species (strains), you will need to determine which taxon ID will provide the most robust data. Ensure that there is a good source of PPI data, GRN data and GO association data for the given taxon ID.
- The identifiers from the PPI and GRN datasets may be different. You will need to ensure that there is at least one common ID between all three datasets. A good rule of thumb is to have a column with the UniProtKB/Swiss-Prot ID for each node. A namespace mapper is available [here](https://www.uniprot.org/id-mapping). This may result in some interactions being lost, but we need to ensure that there is a common ID convention between all nodes so that they can merge together properly during import to Neo4j. It is recommended to drop all rows that do not have the common identifier in both columns.
- Ensure that the primary ID for the species provides an outlink on ProteinWeaver. For example, *D. melanogaster* uses FlyBase IDs and provides links to the FlyBase database while *S. cerevisiae* uses UniProt IDs to provide the outlink. When possible, prioritize outlinks to species-specific databases.

## Step 2: Data Cleaning

1. Prepare the PPI data.
    - If you had to convert to UniProt IDs, keep the original ID columns and the new UniProt IDs in the final dataset.
    - If your data is from STRING, filter it similar to the `ArabidopsisThaliana.R` script to ensure that all entries are either textmined, database or experimental evidence. Add the evidence as a column like in the example script.
    - You may also need to add a name and UniProt ID column from STRING. They provide datasets for each species on their downloads pages.
    - Add the source for example "string-db" as a column.
    - Keep alternate names since we can import those into ProteinWeaver.
    - Provide a link, if possible, for each interaction to STRING or Pubmed.
    - Look at other scripts data cleaning scripts from previous species to validate your work.
2. Prepare the GRN data.
    - Ensure that there is an ID for every TF and target that matches the PPI IDs or vice versa. We need to have an ID that the nodes can merge on during import.
    - Add in a source column, e.g., "tf-link"
3. Prepare the GO assocation data.
    - From the raw file, only select the protein ID, the GO term ID, and the qualifer ("involved_in") columns
    - Import the GO data into RemoveNotQualifers.R and add new lines to remove the "NOT|" qualifiers from the new species' GO association data.

## Step 3: Data Import

1. Copy the final three datasets into the `ProteinWeaver/Import` directory.
2. Copy the final three datasets into your local `neo4j/import` directory to allow import into dockerized Neo4j.
3. Add import commands to scripts:
    - Create `DataImportTXIDXXXX.cypher` script
    - `AutomaticDataImport.sh`
    - `AncestralEdges.cypher`
        - Has a line that removes self-loop edges and removes GO terms with no edges.
    - `RemoveNoEdgeNodes.cypher`
        - Add line for new species to remove nodes with no edges.
4. Import your data manually or automatically with the `AutomaticDataImport.sh` script.

**PRO-TIP:**
- If you add all the commands to the cypher scripts first, then you can run `AutomaticDataImport.sh` and it should import your new species for you!

## Step 4: Add to ProteinWeaver Interface

1. Query.jsx
    1. Add example queries 1,2,3
    2. Edit Autocomplete options for proteins
        1. Maybe need to check Parser.jsx
2. EdgeTab.jsx
    1. Ensure that source and pubmed are rendering properly
3. GraphSummary.jsx
    1. Ensure source link is displayed properly
4. MotifTab.jsx
    1. Calculate constants and add them for new txid
        - `GetMotifCounts.txt` provides the necessary commands to calculate the constants
5. NodeTab.jsx
    1. Add database link
6. SearchBar.jsx
    1. Add spName and `<option>`to the search bar

## Step 5: Add Entry to Data/Version Page
1. Follow the template from another species to report a new addition to PW.
    - `SummarizeNetworks.txt` provides examples of necessary commands to report the new species entry.
2. Push docs to GitHub with `mkdocs gh-deploy` in docs directory from the ReedCompBio github.