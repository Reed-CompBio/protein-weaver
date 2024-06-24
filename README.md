# ProteinWeaver
[ProteinWeaver](https://proteinweaver.reedcompbio.org/) is a web interface for ontology-based protein network visualization.

<img width="1040" alt="Gif of ProteinWeaver User Interface" src="https://github.com/Reed-CompBio/protein-weaver/assets/67818840/9ecf19ef-898f-4b54-a8a8-f005a8f62c4b">

# Background & Motivation
Being able to explore how proteins are connected to other proteins with a specific function is a great tool for a biologists, as it allows them to quickly generate hypotheses that seeks to answer the ways that a protein is connected to a pathway or process. ProteinWeaver provides the tools for this type of exploration via an intuitive website that easily lets users query a protein and a specific function or process (as a [gene ontology term](https://geneontology.org/)). 

# Website Overview
ProteinWeaver allows the users to input a protein of their interest, a specific function or process ([gene ontology term](https://geneontology.org/)), and the number of paths to output in the network. This generates a subnetwork that connects the protein of interest to the k shortest paths that include a protein labeled with the specific GO term. The network's information is summarised, including GO term description, links to proteins' and GO term AmiGO entry, and GO term qualifiers of the proteins. Exploration is possibly by easily interacting with the graph and setting new nodes as the protein of interest. Queries are easily reproduced through exporting a log history of all queries and explorations done in a session, and exporting networks via images. 

<img width="700" alt="Screenshot of ProteinWeaver Query" src="https://github.com/Reed-CompBio/protein-weaver/assets/67818840/64d50761-e7b4-4ca5-9aaf-bf2cd01cf80d">

# Setup
For an introduction to Neo4j and the ProteinWeaver site architecture, the [contributing guide](https://reed-compbio.github.io/protein-weaver/contributing-guide/) is a good place to start before completing the setup guide.

The [setup guide](https://reed-compbio.github.io/protein-weaver/setup/) includes detailed instructions for setting up the backend database, server, and the frontend to work with ProteinWeaver locally.

# Licensing & Attribution
The content of this project itself is licensed under the [Creative Commons CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/) license, and the underlying source code used to format and display that content is licensed under the [GNU General Public License (GPLv3)](https://www.gnu.org/licenses/quick-guide-gplv3.html).

This code was built with the [Neo4J community edition](https://neo4j.com/licensing/) and imports data from FlyBase [(download page)](https://wiki.flybase.org/wiki/FlyBase:Downloads_Overview#Gene_Association_File_-_GAF_.28gene_association.fb.gz.29) and the Gene Ontology [(download page)](https://geneontology.org/docs/download-ontology/).