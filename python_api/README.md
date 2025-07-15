# Python Flask Server

This server is responsible for doing the protein prediction calculation. This server uses another port and the express.js server acts as a main server that will call the APIs in the flask server

## Setup

1. Install Conda
2. Open up terminal and go to the python_api directory
3. Do `conda env create -f environment.yml` to create the conda environment
4. Activate the conda environment
5. Do `python app.py` to run the server

## Adding new species

When a new species is added, we have to generate a new go_protein.pickle file for the protein function prediction to work.
This pickle file represents the network which include go terms and their edge to proteins (inferred and direct). we can generate this file if we have the exported csv files for the three edge types from neo4j, proGo, proPro, and reg, and use the generate_pickles.py file. we can use the following example to generate the files. make sure that you execute this command inside of the python_api folder. we will use the ecoli network as an example.

```
python3 generate_pickles.py -p networks/ecoli_proPro.csv -r networks/ecoli_reg.csv -g networks/ecoli_proGo.csv
```
