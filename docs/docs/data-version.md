# ProteinWeaver Data Log & Version

This section of the documentation outlines the data sources, processing steps and versions of the ProteinWeaver web interface.

## *Drosophila melanogaster* Data Sources
### 2023-09-29 (BETA):
#### Interaction data:
* [`interactome-flybase-collapsed-weighted.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DrosophilaMelanogaster/interactome-flybase-collapsed-weighted.txt) [(Source)](https://github.com/annaritz/fly-interactome/tree/master/interactome/weighted-interactome)

#### GO association data:
* [`gene_association.fb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DrosophilaMelanogaster/gene_association.fb) [(Source)](https://wiki.flybase.org/wiki/FlyBase:Downloads_Overview#Gene_Association_File_-_GAF_.28gene_association.fb.gz.29)

### 2024-03-18:
#### GO association data:
* [`dmel_GO_data_Mar15_24.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DrosophilaMelanogaster/dmel_GO_data_Mar15_24.tsv) [(Source)](https://www.ebi.ac.uk/QuickGO/annotations?taxonId=7227&taxonUsage=descendants&geneProductSubset=Swiss-Prot&geneProductType=protein)
* Downloaded and merged data together in [`scripts/SubColNames.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/SubColNames.R).

#### FlyBase IDs from UniProt IDs for mapping:
* [`idmapping_2024_03_18.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DrosophilaMelanogaster/idmapping_2024_03_18.tsv) [(Source)](https://www.uniprot.org/id-mapping)
* Downloaded from UniProt and merged with GO data from QuickGO to match the FlyBase naming convention. Renamed columns to "GENE_PRODUCT_ID" and "FB_ID" and merged in `scripts/SubColNames.R`.

### 2024-04-01:
* Added 415,493 inferred ProGo edges using a Cypher command.

### 2024-04-03:
#### GO association data:
* [`gene_association_fb_2024-04-03.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DrosophilaMelanogaster/gene_association_fb_2024-04-03.tsv)
* [`dmel_GO_data_2024-04-03.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DrosophilaMelanogaster/dmel_GO_data_2024-04-03.tsv)
* Removed qualifiers with "NOT" preceding them using [`scripts/RemoveNotQualifier.R](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/RemoveNotQualifier.R)
* Reduced inferred ProGo edges to 413,704.

### Current _D. melanogaster_ Network [Updated 2024-07-17]
```
| Proteins | Interactions (ProPro) | Annotations (ProGo) |
| -------- | --------------------- | :------------------ |
| 11501    | 233054                | 482391              |
```

## *Bacillus subtilis* Data Sources
### 2023-10-18 (BETA):
#### Interaction data:
* [`bsub_interactome.csv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/bsub_interactome.csv)
* [Source](http://subtiwiki.uni-goettingen.de/v4/exports)
* Exported the “Interaction” set and renamed to `bsub_interactome.csv`.

#### GO association data:
* [`subtiwiki.gene.export.2023-10-18.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/subtiwiki.gene.export.2023-10-18.tsv) processed and merged into [`bsub_GO_data.csv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/bsub_GO_data.csv) [(Source)](http://subtiwiki.uni-goettingen.de/v4/exports)
* Exported the “Gene” set with all options selected. Processed and merged the file according to [`scripts/JoinBSUtoUniProt.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/JoinBSUtoUniProt.R).

* [`bsub_go_uniprot.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/bsub_go_uniprot.csv) [(Source)](https://amigo.geneontology.org/amigo/search/annotation)
* Selected all annotations for *B. subtilis* and used the following bash command to download:
```
wget 'https://golr-aux.geneontology.io/solr/select?defType=edismax&qt=standard&indent=on&wt=csv&rows=100000&start=0&fl=source,bioentity_internal_id,bioentity_label,qualifier,annotation_class,reference,evidence_type,evidence_with,aspect,bioentity_name,synonym,type,taxon,date,assigned_by,annotation_extension_class,bioentity_isoform&facet=true&facet.mincount=1&facet.sort=count&json.nl=arrarr&facet.limit=25&hl=true&hl.simple.pre=%3Cem%20class=%22hilite%22%3E&hl.snippets=1000&csv.encapsulator=&csv.separator=%09&csv.header=false&csv.mv.separator=%7C&fq=document_category:%22annotation%22&fq=taxon_subset_closure_label:%22Bacillus%20subtilis%20subsp.%20subtilis%20str.%20168%22&facet.field=aspect&facet.field=taxon_subset_closure_label&facet.field=type&facet.field=evidence_subset_closure_label&facet.field=regulates_closure_label&facet.field=isa_partof_closure_label&facet.field=annotation_class_label&facet.field=qualifier&facet.field=annotation_extension_class_closure_label&facet.field=assigned_by&facet.field=panther_family_label&q=*:*'
```
* File was renamed to `bsub_go_uniprot.tsv`, processed and merged into `bsub_GO_data.csv` according to the `scripts/JoinBSUtoUniProt.R` file.

### 2024-03-18:
#### GO association data:
* [`bsub_GO_data_Mar18_24.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/bsub_GO_data_Mar18_24.tsv) [(Source)](https://www.ebi.ac.uk/QuickGO/annotations?taxonId=224308&taxonUsage=descendants&geneProductSubset=Swiss-Prot&geneProductType=protein)
* Downloaded and merged data together in [`scripts/SubColNames.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/SubColNames.R) and imported with `data/README.md`.

#### BSU IDs from UniProt IDs for mapping:
* [`subtiwiki.gene.export.2024-03-18.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/subtiwiki.gene.export.2024-03-18.tsv) [(Source)](http://subtiwiki.uni-goettingen.de/v4/gene/exporter)
* Selected BSU and UniProt outlinks from menu and exported. Renamed columns to "GENE_PRODUCT_ID" and "BSU_ID" to remove special characters. Merged in `scripts/SubColNames.R`.

### 2024-04-01:
* Added 39,215 inferred ProGo edges using a Cypher command.

### 2024-04-03:
* No "NOT" qualifiers were found in the dataset so there were no changes to the _B. subtilis_ data structure during this update.

### 2024-06-11:
* Added new interaction data from [STRING-DB](https://string-db.org/cgi/download).
* Downloaded physical interactions full [`224308.protein.physical.links.full.v12.0.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/224308.protein.physical.links.full.v12.0.txt) and [`224308.protein.info.v12.0.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/224308.protein.info.v12.0.txt) and merged both into [`interactome_txid224308_2024-06-06.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/interactome_txid224308_2024-06-06.txt) and cleaned according to [`BsubDataMerging.Rmd`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/scripts/BsubDataMerging.Rmd).
* Added updated GO term edges for B. subtilis after new data import.
* Downloaded all reviewed annotations from QuickGO ([Source])(https://www.ebi.ac.uk/QuickGO/annotations?taxonId=224308&taxonUsage=descendants&geneProductSubset=Swiss-Prot&geneProductType=protein) and downloaded UniProt and BSU ID mapper [`subtiwiki.gene.export.2024-06-03.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/subtiwiki.gene.export.2024-06-03.tsv) from [SubtiWiki](https://subtiwiki.uni-goettingen.de/v4/gene/exporter).
* Merged the two into [`annotations_txid224308_2024-06-03.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/BacillusSubtilis/annotations_txid224308_2024-06-03.txt) according to `BsubDataMerging.Rmd`.

### 2024-06-24:
* Remove "self-edges" from PPI data.

### Current _B. subtilis_ Network [Updated 2024-07-17]
```
| Proteins | Interactions (ProPro) | Annotations (ProGo) |
| -------- | --------------------- | :------------------ |
| 1933     | 6441                  | 59510               |
```

## *Danio rerio* Data Sources
### 2024-03-18:
#### Interaction data:
* [`zfish_string_db_results.csv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_string_db_results.csv) merged into [`zfish_interactome_Mar12_2024.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_interactome_Mar12_2024.txt). [(Source)](https://string-db.org/cgi/download?sessionId=bjC4UlI45w0z&species_text=Danio+rerio)
* Downloaded file `7955.protein.physical.links.full.v12.0.txt.gz` from String-DB and filtered to experimentally validated, database-curated, and textmined interactions according to [`scripts/ZebrafishDataMerging.Rmd`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ZebrafishDataMerging.Rmd). Mar. 12, 2024.
	
* [`7955.protein.aliases.v12.0.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/7955.protein.aliases.v12.0.txt) merged into `zfish_interactome_Mar12_2024.txt` [(Source)](https://string-db.org/cgi/download?sessionId=bjC4UlI45w0z&species_text=Danio+rerio)
* Downloaded file from String-DB to provide UniProt IDs for STRING-DB aliases.

* [`zfish_psicquic_results.csv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_psicquic_results.csv) merged into `zfish_interactome_Mar12_2024.txt` [(Source)](http://www.ebi.ac.uk/Tools/webservices/psicquic/view/home.xhtml)
* Used a Python script [`scripts/GetXML.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/GetXML.ipynb) to scrape all entries for “*Danio rerio*” from the REST API. Removed all `<entrySet>` tags that were in between the first and last instance. All `<xml>` tags but the first were removed from the file. Got data for interactions and interactors and converted XML format to JSON using [`scripts/get-interactions.js`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/get-interactions.js) and [`scripts/get-interactors.js`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/get-interactors.js). Converted the resulting JSON files to CSV using a [free online convertor](https://www.convertcsv.com/json-to-csv.htm). Merged `interactions.csv` and `interactors.csv` into `zfish_psicquic_results.csv` using `scripts/ZebrafishDataMerging.Rmd`. Some UniProt IDs were found from the IntAct entry using the IntAct ID as documented in the Rmd.

* [`zfish_id_mapper.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_id_mapper.tsv) merged into `zfish_interactome_Mar12_2024.txt` [(Source)](https://www.uniprot.org/id-mapping/uniprotkb)
* Retrieved updated UniProt entries and common names for 11,765 entries. 2781 protein entries were found to be obsolete, thus did not have a name available on UniProt. These were removed and separated into their own dataset.
* The resulting dataset had 6,438 unique proteins.
 
* [`zfish_gene_names.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_gene_names.tsv) merged into `zfish_interactome_Mar12_2024.txt` [(Source)](https://www.uniprot.org/id-mapping/uniprotkb)
* Retrieved gene names for 6,438 *D. rerio* proteins [`zfish_unique_protein_ids_Mar12_24.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/updated_Mar12_24_zfish_unique_protein_ids.txt) from UniProt's name mapping service. For entries with a "gene name", the gene name was used as the name, for those without a gene name, the first portion of the "protein name" was used. This was decided to ensure uniqueness for the node names in the user interface.

* Merged all *D. rerio* data together into one master file using the instructions in `scripts/ZebrafishDataMerging.Rmd`.

#### GO Association Data:
* [`zfish_GO_data_Mar12_24.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_GO_data_Mar12_24.tsv) [(Source)](https://www.ebi.ac.uk/QuickGO/annotations)
* Used QuickGO to get all 65,876 "Reviewed" GO annotations for *D. rerio*. Replaced the " " in headers with "_" to ease data import.

### 2024-04-01:
* Added 86,304 inferred ProGo edges using a Cypher command.

### 2024-04-03:
#### GO association data:
* [`zfish_GO_data_2024-04-03.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_GO_data_2024-04-03.tsv)
* Removed qualifiers with "NOT" preceding them using [`scripts/RemoveNotQualifier.R](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/RemoveNotQualifier.R)
* Reduced inferred ProGo edges to 86,216.

### 2024-06-11:
* Added alt_name parameter to Neo4j import statement.

### 2024-06-24:
* Remove trailing whitespaces from some names according to `ZebrafishDataMerging.Rmd`.
* Remove "self-edges" from PPI data.

### Current _D. rerio_ Network [Updated 2024-07-17]
```
| Proteins | Interactions (ProPro) | Annotations (ProGo) |
| -------- | --------------------- | :------------------ |
| 6438     | 45003                 | 103139              |
```

## Gene Ontology Hierarchy Data Sources
### 2023-09-29:
#### Common name:
* [`go.obo`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/GeneOntology/go.obo) processed into [`go.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/GeneOntology/go.txt) [(Source)](http://current.geneontology.org/ontology/go.obo)
* Used `wget` to download the file. Processed the file using [`scripts/ParseOBOtoTXT.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ParseOBOtoTXT.ipynb).

#### Relationships:
* `go.obo` processed into [`is_a_import.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/GeneOntology/is_a_import.tsv)
* Processed the file using [`scripts/ParseOntologyRelationship.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ParseOntologyRelationship.ipynb).

* `go.obo` processed into [`relationship_import.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/GeneOntology/relationship_import.tsv)
* Processed the file using `scripts/ParseOntologyRelationship.ipynb`.

### 2024-03-28:
* [`goNeverAnnotate.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/GeneOntology/goNeverAnnotate.txt) joined with `go.txt` into [`go_2024-03-28.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/GeneOntology/go_2024-03-28.txt)
* Joined the data together with [`scripts/GeneOntologyNeverAnnotate.R`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/GeneOntologyNeverAnnotate.R).

* [`gocheck_do_not_annotate.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/GeneOntology/gocheck_do_not_annotate.txt) parsed from `gocheck_do_not_annotate.obo` [(Source)](https://current.geneontology.org/ontology/subsets/gocheck_do_not_annotate.obo) using `scripts/ParseOBOtoTXT.ipynb` and merged into `go_2024-03-28.txt`.

### 2024-07-17:
* [`go_2024-07-17.obo`] processed into `go_2024-07-17.txt`, `is_a_import_2024-07-17.tsv`, and `relationship_import_2024-07-17.tsv`.
* [`is_a_import_2024-07-17.tsv`] created with `scripts/ParseOntologyRelationship.ipynb`.
* [`relationship_import_2024-07-17.tsv`] created with `scripts/ParseOntologyRelationship.ipynb`.
* [`go_2024-07-17.txt`] created with `scripts/ParseOBOtoTXT.ipynb` and `scripts/GeneOntologyNeverAnnotate.R`.

### Gene Ontology Data Structure [Updated 2024-07-17]
```
| GO Terms | "is_a" Relationships (GoGo) |
| -------- | :-------------------------- |
| 42231    | 66168                       |
```

### Taxon ID source:
[NCBI taxonomy browser](https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/)
Looked up species name and got taxon ID.

## Versioning & Dates

### 2023-09-29 -- 2024-03-17 (BETA):
* Imported weighted _D. melanogaster_ interactome and FlyBase annotations.
* Imported raw GO data and "is_a" relationships.

### 2024-03-18:
* Added _D. rerio_ protein interactome and GO association data.
* Updated _B. subtilis_ and _D. melanogaster_ GO association networks with QuickGO data.

### 2024-03-28:
* Added blacklist indicator to GO term nodes that should never have an annotation.

### 2024-04-01:
* Added inferred ProGo edges from descendant ProGo edges. This means that proteins annotated to a specific GO term, such as Mbs to enzyme inhibitor activity, will also be annotated to that GO term's ancestors, such as molecular function inhibitor activity and molecular_function.

```
| Species         | Inferred Edges |
| --------------- | :------------- |
| D. melanogaster | 415,493        |
| B. subtilis     | 39,215         |
| D. rerio        | 86,304         |
| Total           | 541,012        |
```

### 2024-04-03:
* Removed "NOT" qualifiers (those that should not be explicitly annotated to the GO term due to experimental or other evidence) from all GO assocation datasets.
* Repropogated the "inferred_from_descendant" edges to ensure no false propogation of "NOT" qualifiers.

```
| Species         | Inferred Edges |
| --------------- | :------------- |
| D. melanogaster | 413,704        |
| B. subtilis     | 39,215         |
| D. rerio        | 86,216         |
| Total           | 539,135        |
```

### 2024-06-11:
* Added _B. subtilis_ interaction data from STRING-DB and updated QuickGO annotations.
* Added alt_name parameters to _B. subtilis_ and _D. rerio_ nodes.

```
| Species         | Inferred Edges |
| --------------- | :------------- |
| D. melanogaster | 413,704        |
| B. subtilis     | 54,270         |
| D. rerio        | 86,216         |
| Total           | 554,190        |
```

### 2024-06-24:
* Removed trailing whitespaces from _D. rerio_ data.
* Removed "self-edges" i.e., interactions between two copies of the same protein to improve path algorithm performance.
    - 309 "self-edges" were removed from the data from _B. subtilis_ and _D. rerio_.

### 2024-07-17:
* Updated full Gene Ontology dataset including hierarchy and descriptions of GO terms.
* The Gene Ontology removed 660 GO terms in the update. This resulted in the removal of previously existing edges to GO terms.
    * Removed 28,571 ProGo edges in _D. melanogaster_.
    * Removed 5,553 ProGo edges in _B. subtilis_.
    * Removed 5,619 ProGo edges in _D. rerio_.
    * Removed 2,140 GoGo edges.
    * Removed 41,883 edges total.