# *Bacillus subitilis* Data Sources

## Initial Import (October 18, 2024):

### Interaction data:
* [`bsub_interactome.csv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/bsub_interactome.csv)
* [Source](http://subtiwiki.uni-goettingen.de/v4/exports)
* Exported the “Interaction” set and renamed to `bsub_interactome.csv`. Imported the file into Neo4j according to the steps in [`data/README.md`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/README.md).

### GO association data:
* [`subtiwiki.gene.export.2023-10-18.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/subtiwiki.gene.export.2023-10-18.tsv) processed and merged into [`bsub_GO_data.csv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/bsub_GO_data.csv)
* [Source](http://subtiwiki.uni-goettingen.de/v4/exports)
* Exported the “Gene” set with all options selected. Processed and merged the file according to [`scripts/JoinBSUtoUniProt.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/JoinBSUtoUniProt.R).

* [`bsub_go_uniprot.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/bsub_go_uniprot.csv)
* [Source](https://amigo.geneontology.org/amigo/search/annotation)
* Selected all annotations for *B. subtilis* and used the following bash command to download:
```
wget 'https://golr-aux.geneontology.io/solr/select?defType=edismax&qt=standard&indent=on&wt=csv&rows=100000&start=0&fl=source,bioentity_internal_id,bioentity_label,qualifier,annotation_class,reference,evidence_type,evidence_with,aspect,bioentity_name,synonym,type,taxon,date,assigned_by,annotation_extension_class,bioentity_isoform&facet=true&facet.mincount=1&facet.sort=count&json.nl=arrarr&facet.limit=25&hl=true&hl.simple.pre=%3Cem%20class=%22hilite%22%3E&hl.snippets=1000&csv.encapsulator=&csv.separator=%09&csv.header=false&csv.mv.separator=%7C&fq=document_category:%22annotation%22&fq=taxon_subset_closure_label:%22Bacillus%20subtilis%20subsp.%20subtilis%20str.%20168%22&facet.field=aspect&facet.field=taxon_subset_closure_label&facet.field=type&facet.field=evidence_subset_closure_label&facet.field=regulates_closure_label&facet.field=isa_partof_closure_label&facet.field=annotation_class_label&facet.field=qualifier&facet.field=annotation_extension_class_closure_label&facet.field=assigned_by&facet.field=panther_family_label&q=*:*'
```
* File was renamed to `bsub_go_uniprot.tsv`, processed and merged into `bsub_GO_data.csv` according to the `scripts/JoinBSUtoUniProt.R` file. The resulting *B. subtilis* GO data was imported into Neo4j according to `data/README.md`.

## March 18, 2024 Major Update:

### GO association data:
* [`bsub_GO_data_Mar18_24.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/bsub_GO_data_Mar18_24.tsv)
* [Source](https://www.ebi.ac.uk/QuickGO/annotations?taxonId=224308&taxonUsage=descendants&geneProductSubset=Swiss-Prot&geneProductType=protein)
* Downloaded and merged data together in [`scripts/SubColNames.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/SubColNames.R) and imported with `data/README.md`.

### BSU IDs from UniProt IDs for mapping:
* [`subtiwiki.gene.export.2024-03-18.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/subtiwiki.gene.export.2024-03-18.tsv)
* [Source](http://subtiwiki.uni-goettingen.de/v4/gene/exporter)
* Selected BSU and UniProt outlinks from menu and exported. Renamed columns to "GENE_PRODUCT_ID" and "BSU_ID" to remove special characters. Merged in `scripts/SubColNames.R`.

## Data Structure
* Proteins (nodes): **1,394**
* Interactions (ProPro edges): **2,854**
* Annotations (ProGo edges): **2,203**