# ProteinWeaver Data Sources

## *D. melanogaster*:

Interaction data:
`interactome-flybase-collapsed-weighted.txt`
(Source)[https://github.com/annaritz/fly-interactome/tree/master/interactome/weighted-interactome]
Downloaded from GitHub repo and imported the file into Neo4j using `DataImportTutorial.md`.

GO association data:
`gene_association.fb`
(Source)[https://wiki.flybase.org/wiki/FlyBase:Downloads_Overview#Gene_Association_File_-_GAF_.28gene_association.fb.gz.29]
Downloaded from FlyBase and imported the file into Neo4j using `DataImportTutorial.md`.

Proteins: 11,501
Interactions: 233,054

### Gene ontology data source:

Common name:
`go.obo` processed into `go.txt`
(Source)[http://current.geneontology.org/ontology/go.obo]
Used `wget` to download the file. Processed the file using `ParseOBOtoTXT.ipynb` and imported the resulting `go.txt` file into the Neo4j database according to the steps in `DataImportTutorial.md`.

Relationships:
`go.obo` processed into `is_a_import.tsv`
(Source)[http://current.geneontology.org/ontology/go.obo]
Processed the file using `ParseOntologyRelationship.ipynb` and imported the resulting file into the Neo4j database according to the steps in `DataImportTutorial.md`.

`go.obo` processed into `relationship_import.tsv`
(Source)[http://current.geneontology.org/ontology/go.obo]
Processed the file using `ParseOntologyRelationship.ipynb` and imported the resulting file into the Neo4j database according to the steps in `DataImportTutorial.md`.

*D. melanogaster* annotations: 115,903

## *B. subtilis*:

Interaction data:
`interaction-2023-10-18.csv` renamed to `bsub_interactome.csv`
(Source)[http://subtiwiki.uni-goettingen.de/v4/exports]
Exported the “Interaction” set and renamed to `bsub_interactome.csv`. Imported the file into Neo4j according to the steps in `DataImportTutorial.md`.

Proteins: 1,394
Interactions: 2,854

Regulatory data:
`regulations-2023-12-18.csv` renamed to `bsub_regnet.csv`
(Source)[http://subtiwiki.uni-goettingen.de/v4/exports]
Exported the "Regulations" set and replaced spaces with underscores in header names. Imported the data into Neo4j according to the steps in `DataImportTutorial.md`.

GO association data:
`subtiwiki.gene.export.2023-10-18.tsv` processed and merged into `bsub_GO_data.csv`.
(Source)[http://subtiwiki.uni-goettingen.de/v4/exports]
Exported the “Gene” set with all options selected. Processed and merged the file according to `JoinBSUtoUniProt.R`.

`bsub_go_uniprot.tsv`
(Source)[https://amigo.geneontology.org/amigo/search/annotation]
Selected all annotations for B. subtilis. Then used:
`wget 'https://golr-aux.geneontology.io/solr/select?defType=edismax&qt=standard&indent=on&wt=csv&rows=100000&start=0&fl=source,bioentity_internal_id,bioentity_label,qualifier,annotation_class,reference,evidence_type,evidence_with,aspect,bioentity_name,synonym,type,taxon,date,assigned_by,annotation_extension_class,bioentity_isoform&facet=true&facet.mincount=1&facet.sort=count&json.nl=arrarr&facet.limit=25&hl=true&hl.simple.pre=%3Cem%20class=%22hilite%22%3E&hl.snippets=1000&csv.encapsulator=&csv.separator=%09&csv.header=false&csv.mv.separator=%7C&fq=document_category:%22annotation%22&fq=taxon_subset_closure_label:%22Bacillus%20subtilis%20subsp.%20subtilis%20str.%20168%22&facet.field=aspect&facet.field=taxon_subset_closure_label&facet.field=type&facet.field=evidence_subset_closure_label&facet.field=regulates_closure_label&facet.field=isa_partof_closure_label&facet.field=annotation_class_label&facet.field=qualifier&facet.field=annotation_extension_class_closure_label&facet.field=assigned_by&facet.field=panther_family_label&q=*:*'`

in terminal to download the data on Oct. 18, 2023. File was renamed to `bsub_go_uniprot.tsv`, processed and merged into `bsub_GO_data.csv` according to the `JoinBSUtoUniProt.R` file. The resulting B. subtilis GO data was imported into Neo4j according to `DataImportTutorial.md`.

*B. subtilis* annotations: 2,581

## *D. rerio*:

Interaction data:
`7955.protein.physical.links.full.v12.0_attempt2.txt` merged into `zfish_interactome_Mar12_2024.txt`
(Source)[https://string-db.org/cgi/download?sessionId=bjC4UlI45w0z&species_text=Danio+rerio]
Downloaded file `7955.protein.physical.links.full.v12.0.txt.gz` from String-DB and filtered to experimentally validated, database-curated, and textmined interactions according to `ZebrafishDataMerging.Rmd`. Mar. 12, 2024.
	
`7955.protein.aliases.v12.0.txt` merged into `zfish_interactome_Mar12_2024.txt`
(Source)[https://string-db.org/cgi/download?sessionId=bjC4UlI45w0z&species_text=Danio+rerio]
Downloaded file from String-DB to provide UniProt IDs for STRING-DB aliases.

`zfish_psicquic_results.csv` merged into `zfish_interactome_Mar12_2024.txt`
(Source)[http://www.ebi.ac.uk/Tools/webservices/psicquic/view/home.xhtml]
Used a Python script `GetXML.ipynb` to scrape all entries for “Danio rerio” from the REST API. Removed all <entrySet> tags that were in between the first and last instance. All <xml> tags but the first were removed from the file. Got data for interactions and interactors and converted XML format to JSON using `get-interactions.js` and `get-interactors.js`. Converted the resulting JSON files to CSV using a free online convertor: https://www.convertcsv.com/json-to-csv.htm. Merged `interactions.csv` and `interactors.csv` into one file `zfish_psicquic_results.csv` using `ZebrafishDataMerging.Rmd`. Some UniProt IDs were found from the IntAct entry using the IntAct ID as documented in the Rmd.

`zfish_id_mapper2.tsv` merged into `zfish_interactome_Mar12_2024.txt`
(Source)[https://www.uniprot.org/id-mapping/uniprotkb]
Retrieved updated UniProt entries and common names for 11,765 entries. 2781 protein entries were found to be obsolete, thus did not have a name available on UniProt. These were removed and separated into their own dataset.
The resulting dataset had 6,438 unique proteins.
 
`zfish_gene_names.tsv` merged into `zfish_interactome_Mar12_2024.txt`
(Source)[https://www.uniprot.org/id-mapping/uniprotkb]
We retrieved gene names for 6,438 Zebrafish proteins (`updated_Mar12_24_zfish_unique_protein_ids.txt`) from UniProt's name mapping service.

Merged all Zebrafish data together into one master file using the instructions in `ZebrafishDataMerging.Rmd`.
Proteins: 6,438
Interactions: 354,846

GO Association Data:
`zfish_GO_data.tsv`
(Source)[https://www.ebi.ac.uk/QuickGO/annotations]
Used QuickGO to get all 65876 "Reviewed" GO annotations for Zebrafish. Replaced the " " in headers with "_" to ease data import.

*D. rerio* annotations: 39,270

Taxon ID source:
(NCBI taxonomy browser)[https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/]
Looked up species name and got taxon ID.
