# *Drosophila melanogaster* Data Sources

## Initial Import:

### Interaction data:
* [`interactome-flybase-collapsed-weighted.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DrosophilaMelanogaster/interactome-flybase-collapsed-weighted.txt)
* [Source](https://github.com/annaritz/fly-interactome/tree/master/interactome/weighted-interactome)
* Downloaded from GitHub repo and imported the file into Neo4j using [`data/README.md`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/README.md).

### GO association data:
* [`gene_association.fb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DrosophilaMelanogaster/gene_association.fb)
* [Source](https://wiki.flybase.org/wiki/FlyBase:Downloads_Overview#Gene_Association_File_-_GAF_.28gene_association.fb.gz.29)
* Downloaded from FlyBase and imported the file into Neo4j using `data/README.md`.

## March 18, 2024 Major Update:

### GO association data:
* [`dmel_GO_data_Mar15_24.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DrosophilaMelanogaster/dmel_GO_data_Mar15_24.tsv)
* [Source](https://www.ebi.ac.uk/QuickGO/annotations?taxonId=7227&taxonUsage=descendants&geneProductSubset=Swiss-Prot&geneProductType=protein)
* Downloaded and merged data together in [`scripts/SubColNames.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/SubColNames.R) and imported with `data/README.md`.

### FlyBase IDs from UniProt IDs for mapping:
* [`idmapping_2024_03_18.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DrosophilaMelanogaster/idmapping_2024_03_18.tsv)
* [Source](https://www.uniprot.org/id-mapping)
* Downloaded from UniProt and merged with GO data from QuickGO to match the FlyBase naming convention. Renamed columns to "GENE_PRODUCT_ID" and "FB_ID" and merged in `scripts/SubColNames.R`.

## Data Structure
* Proteins (nodes): **11,501**
* Interactions (ProPro edges): **233,054**
* Annotations (ProGo edges): **83,555**