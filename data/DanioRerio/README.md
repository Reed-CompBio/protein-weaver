# *Danio rerio* Data Sources

## Initial Import (March 18, 2024 Major Update):

### Interaction data:
* [`zfish_string_db_results.csv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_string_db_results.csv) merged into [`zfish_interactome_Mar12_2024.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_interactome_Mar12_2024.txt).
* [Source](https://string-db.org/cgi/download?sessionId=bjC4UlI45w0z&species_text=Danio+rerio)
* Downloaded file `7955.protein.physical.links.full.v12.0.txt.gz` from String-DB and filtered to experimentally validated, database-curated, and textmined interactions according to [`scripts/ZebrafishDataMerging.Rmd`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ZebrafishDataMerging.Rmd). Mar. 12, 2024.
	
* [`7955.protein.aliases.v12.0.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/7955.protein.aliases.v12.0.txt) merged into `zfish_interactome_Mar12_2024.txt`
* [Source](https://string-db.org/cgi/download?sessionId=bjC4UlI45w0z&species_text=Danio+rerio)
* Downloaded file from String-DB to provide UniProt IDs for STRING-DB aliases.

* [`zfish_psicquic_results.csv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_psicquic_results.csv) merged into `zfish_interactome_Mar12_2024.txt`
* [Source](http://www.ebi.ac.uk/Tools/webservices/psicquic/view/home.xhtml)
* Used a Python script [`scripts/GetXML.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/GetXML.ipynb) to scrape all entries for “*Danio rerio*” from the REST API. Removed all `<entrySet>` tags that were in between the first and last instance. All `<xml>` tags but the first were removed from the file. Got data for interactions and interactors and converted XML format to JSON using [`scripts/get-interactions.js`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/get-interactions.js) and [`scripts/get-interactors.js`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/get-interactors.js). Converted the resulting JSON files to CSV using a [free online convertor](https://www.convertcsv.com/json-to-csv.htm). Merged `interactions.csv` and `interactors.csv` into `zfish_psicquic_results.csv` using `scripts/ZebrafishDataMerging.Rmd`. Some UniProt IDs were found from the IntAct entry using the IntAct ID as documented in the Rmd.

* [`zfish_id_mapper.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_id_mapper.tsv) merged into `zfish_interactome_Mar12_2024.txt`
* [Source](https://www.uniprot.org/id-mapping/uniprotkb)
* Retrieved updated UniProt entries and common names for 11,765 entries. 2781 protein entries were found to be obsolete, thus did not have a name available on UniProt. These were removed and separated into their own dataset.
* The resulting dataset had 6,438 unique proteins.
 
* [`zfish_gene_names.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_gene_names.tsv) merged into `zfish_interactome_Mar12_2024.txt`
* [Source](https://www.uniprot.org/id-mapping/uniprotkb)
* Retrieved gene names for 6,438 *D. rerio* proteins [`zfish_unique_protein_ids_Mar12_24.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/updated_Mar12_24_zfish_unique_protein_ids.txt) from UniProt's name mapping service. For entries with a "gene name", the gene name was used as the name, for those without a gene name, the first portion of the "protein name" was used. This was decided to ensure uniqueness for the node names in the user interface.

* Merged all *D. rerio* data together into one master file using the instructions in `scripts/ZebrafishDataMerging.Rmd`.
* Data was imported according to the steps in [`data/README.md`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/README.md).

### GO Association Data:
* [`zfish_GO_data_Mar12_24.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/DanioRerio/zfish_GO_data_Mar12_24.tsv)
* [Source](https://www.ebi.ac.uk/QuickGO/annotations)
* Used QuickGO to get all 65,876 "Reviewed" GO annotations for *D. rerio*. Replaced the " " in headers with "_" to ease data import.
* Data was imported according to the steps in [`data/README.md`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/README.md).

## Data Structure
* Proteins (nodes): **6,438**
* Interactions (ProPro edges): **45,034**
* Annotations (ProGo edges): **22,583**