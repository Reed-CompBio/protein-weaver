## D. melanogaster source:

Interaction data:
`interactome-flybase-collapsed-weighted.txt`
https://github.com/annaritz/fly-interactome/tree/master/interactome/weighted-interactome
Downloaded from GitHub repo and imported the file into Neo4j using `DataImportTutorial.md`.

GO association data:
`gene_association.fb`
https://wiki.flybase.org/wiki/FlyBase:Downloads_Overview#Gene_Association_File_-_GAF_.28gene_association.fb.gz.29
	Downloaded from FlyBase and imported the file into Neo4j using `DataImportTutorial.md`.

### Gene ontology data source:

Common name:
`go.obo` processed into `go.txt`
http://current.geneontology.org/ontology/go.obo
Used `wget` to download the file. Processed the file using `ParseOBOtoTXT.ipynb` and imported the resulting `go.txt` file into the Neo4j database according to the steps in `DataImportTutorial.md`.

Relationships:
`go.obo` processed into `is_a_import.tsv`
http://current.geneontology.org/ontology/go.obo
	Processed the file using `ParseOntologyRelationship.ipynb` and imported the resulting file into the Neo4j database according to the steps in `DataImportTutorial.md`.

`go.obo` processed into `relationship_import.tsv`
http://current.geneontology.org/ontology/go.obo
	Processed the file using `ParseOntologyRelationship.ipynb` and imported the resulting file into the Neo4j database according to the steps in `DataImportTutorial.md`.


## B. subtilis source:

Interaction data:
`interaction-2023-10-18.csv` renamed to `bsub_interactome.csv`
http://subtiwiki.uni-goettingen.de/v4/exports
	Exported the “Interaction” set and renamed to `bsub_interactome.csv`. Imported the file into Neo4j according to the steps in `DataImportTutorial.md`.

GO association data:
`subtiwiki.gene.export.2023-10-18.tsv` processed and merged into `bsub_GO_data.csv`.
http://subtiwiki.uni-goettingen.de/v4/exports
	Exported the “Gene” set with all options selected. Processed and merged the file according to `JoinBSUtoUniProt.R`.

`bsub_go_uniprot.tsv`
https://amigo.geneontology.org/amigo/search/annotation
	Selected all annotations for B. subtilis. Then used:

`wget 'https://golr-aux.geneontology.io/solr/select?defType=edismax&qt=standard&indent=on&wt=csv&rows=100000&start=0&fl=source,bioentity_internal_id,bioentity_label,qualifier,annotation_class,reference,evidence_type,evidence_with,aspect,bioentity_name,synonym,type,taxon,date,assigned_by,annotation_extension_class,bioentity_isoform&facet=true&facet.mincount=1&facet.sort=count&json.nl=arrarr&facet.limit=25&hl=true&hl.simple.pre=%3Cem%20class=%22hilite%22%3E&hl.snippets=1000&csv.encapsulator=&csv.separator=%09&csv.header=false&csv.mv.separator=%7C&fq=document_category:%22annotation%22&fq=taxon_subset_closure_label:%22Bacillus%20subtilis%20subsp.%20subtilis%20str.%20168%22&facet.field=aspect&facet.field=taxon_subset_closure_label&facet.field=type&facet.field=evidence_subset_closure_label&facet.field=regulates_closure_label&facet.field=isa_partof_closure_label&facet.field=annotation_class_label&facet.field=qualifier&facet.field=annotation_extension_class_closure_label&facet.field=assigned_by&facet.field=panther_family_label&q=*:*'`

in terminal to download the data on Oct. 18, 2023. File was renamed to `bsub_go_uniprot.tsv`, processed and merged into `bsub_GO_data.csv` according to the `JoinBSUtoUniProt.R` file. The resulting B. subtilis GO data was imported into Neo4j according to `DataImportTutorial.md`.

## D. rerio source:

Interaction data:
`zfish-interactome.txt`
https://string-db.org/cgi/download?sessionId=bjC4UlI45w0z&species_text=Danio+rerio
	Downloaded file `7955.protein.physical.links.full.v12.0.txt.gz` and filtered to only experimentally validated interactions according to `ZebrafishDataMerging.R`.

`7955.protein.aliases.v12.0.txt`
https://string-db.org/cgi/download?sessionId=bjC4UlI45w0z&species_text=Danio+rerio
	Downloaded file of same name for mapping to gene ontology and other data sources.

`zfish_psicquic_results.csv`
https://psicquic.github.io/PsicquicSpec_1_4_Rest.html
	Used a Python script `GetXML.ipynb` to scrape all entries for “Danio rerio” from the REST API. Removed all <entrySet> tags that were in between the first and last instance. All <xml> tags but the first were removed from the file. Got data for interactions and interactors and converted XML format to JSON using `get-interactions.js` and `get-interactors.js`. Converted the resulting JSON files to CSV using a free online convertor: https://www.convertcsv.com/json-to-csv.htm. Merged `interactions.csv` and `interactors.csv` into one file `zfish_psicquic_results.csv` using `ZebrafishDataMerging.Rmd`. Some UniProt IDs were found from the IntAct entry using the IntAct ID as documented in the Rmd.

`zfish-interactome.csv`
Retrieved common names for 614 proteins from UniProts name mapping service: https://www.uniprot.org/id-mapping/uniprotkb/

158 protein entries were found to be obsolete, thus did not have a name available on UniProt. These were removed and separated into their own dataset. The final dataset had 428 unique proteins and

Merged all Zebrafish data together into one master file using `ZebrafishDataMerging.Rmd`.

GO Association Data:
`zfish_GO_data.tsv`
https://www.ebi.ac.uk/QuickGO/annotations
	Extracted all unique UniProt identifiers and used QuickQO to query GO terms for all entries. Downloaded all entries as a TSV. Deleted all spaces and potentially impactful characters like “/” and replaced with “_” for column headers.


Taxon ID source:

NCBI taxonomy browser
https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/
Looked up species name and got taxon ID.
