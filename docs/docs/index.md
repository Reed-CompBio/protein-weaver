# Welcome to ProteinWeaver Docs

ProteinWeaver is a web interface for ontology-based protein network visualization.

<img width="500" alt="Screenshot 2023-10-05 at 11 11 20 AM" src="https://github.com/Reed-CompBio/protein-weaver/assets/67818840/0b9e6235-efdd-4781-81a6-ba41a33d0f4e">

# Background & Motivation
Being able to explore how proteins are connected to other proteins with a specific function is a great tool for a biologists, as it allows them to quickly generate hypotheses that seeks to answer the ways that a protein is connected to a pathway or process. ProteinWeaver provides the tools for this type of exploration via an intuitive website that easily lets users query a protein and a specific function or process (as a [gene ontology term](https://geneontology.org/)). 

# Website Overview
ProteinWeaver allows the users to input a protein of their interest, a specific function or process ([gene ontology term](https://geneontology.org/)), and the number of paths to output in the network. This generates a subnetwork that connects the protein of interest to the k shortest paths that include a protein labeled with the specific GO term. The network's information is summarised, including GO term description, links to proteins' and GO term AmiGO entry, and GO term qualifiers of the proteins. Exploration is possibly by easily interacting with the graph and setting new nodes as the protein of interest. Queries are easily reproduced through exporting a log history of all queries and explorations done in a session, and exporting networks via images. 

<img width="700" alt="Screenshot 2023-10-05 at 11 30 52 AM" src="https://github.com/Reed-CompBio/protein-weaver/assets/67818840/f0029e57-a9ba-4410-a54e-e4a632daf2d7">