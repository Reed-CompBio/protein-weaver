from flask import Flask, jsonify, request
from helper import import_graph_from_pickle
from pathlib import Path
import networkx as nx


app = Flask(__name__)


@app.route("/test", methods=["GET"])
def test_connection():
    return jsonify(message="connected to flask server!"), 200


# create the networkx graph from the picklefile (this is faster)
# for a given go term, get the page rank statistics


@app.route("/pageRank", methods=["POST"])
def get_pagerank_prediction():
    data = request.json
    protein = data.get('protein')
    go_term = data.get('goTerm')
    species = data.get('species')


    if species == "txid7227":
        graph_file_path = Path("./data/fly/go_protein.pickle")
    elif species == "txid7955": 
        graph_file_path = Path("./data/zfish/go_protein.pickle")
    elif species == "txid224308": 
        graph_file_path = Path("./data/bsub/go_protein.pickle")

    G = import_graph_from_pickle(graph_file_path)
    p = nx.pagerank(G, alpha=0.7, personalization={go_term: 1})
    sorted_list = sorted(p.items(), key=lambda item: item[1], reverse=True)

    sorted_dict = {}
    i = 1
    for key, value in sorted_list:
        if "GO:" not in key:
            sorted_dict[key] = i
            i+=1

    return jsonify(page_rank=p.get(protein), ranking=sorted_dict.get(protein)), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)