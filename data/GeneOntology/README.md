# GO Hierarchy and Common Name Data Sources

## Initial Import:

### Common name:
* [`go.obo`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/GeneOntology/go.obo) processed into [`go.txt`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/GeneOntology/go.txt)
* [Source](http://current.geneontology.org/ontology/go.obo)
* Used `wget` to download the file. Processed the file using [`scripts/ParseOBOtoTXT.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ParseOBOtoTXT.ipynb) and imported the resulting `go.txt` file into the Neo4j database according to the steps in [`data/README.md`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/README.md).

### Relationships:
* `go.obo` processed into [`is_a_import.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/GeneOntology/is_a_import.tsv)
* Processed the file using [`scripts/ParseOntologyRelationship.ipynb`](https://github.com/Reed-CompBio/protein-weaver/blob/main/scripts/ParseOntologyRelationship.ipynb) and imported the resulting file into the Neo4j database according to the steps in `data/README.md`.

* `go.obo` processed into [`relationship_import.tsv`](https://github.com/Reed-CompBio/protein-weaver/blob/main/data/GeneOntology/relationship_import.tsv)
* Processed the file using `scripts/ParseOntologyRelationship.ipynb` and imported the resulting file into the Neo4j database according to the steps in `data/README.md`.

## Data Structure
* GO terms (nodes): **42,854**
* "is_a"/ancestral relationships (GoGo edges): **68,308**

## Taxon ID source:
[NCBI taxonomy browser](https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/)
Looked up species name and got taxon ID.