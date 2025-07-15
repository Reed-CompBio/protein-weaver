import pickle
import networkx as nx
import os
import argparse


def create_go_protein_only_network(
    ppi_network_file, regulatory_network_file, go_network_file
):
    i = 1
    G = nx.DiGraph()
    protein_go_edge = 0
    protein_node = 0
    go_node = 0
    protein_list = []
    go_term_list = []

    # only add nodes and not their ppi or regulatory edges
    for line in ppi_network_file:
        if not G.has_node(line[0]):
            G.add_node(line[0], name=line[0], type="protein")
            protein_list.append({"id": line[0], "name": line[0]})
            protein_node += 1

        if not G.has_node(line[1]):
            G.add_node(line[1], name=line[1], type="protein")
            protein_list.append({"id": line[1], "name": line[1]})
            protein_node += 1

    for line in regulatory_network_file:
        if not G.has_node(line[0]):
            G.add_node(line[0], name=line[0], type="protein")
            protein_list.append({"id": line[0], "name": line[0]})
            protein_node += 1

        if not G.has_node(line[1]):
            G.add_node(line[1], name=line[1], type="protein")
            protein_list.append({"id": line[1], "name": line[1]})
            protein_node += 1

    # Proteins annotated with a GO term have an edge to a GO term node
    for line in go_network_file:
        if not G.has_node(line[1]):
            G.add_node(line[1], type="go_term")
            go_term_list.append(line[1])  #
            go_node += 1

        if not G.has_node(line[0]):
            if line[0] == "FBgn0069446":
                print("found FBgn0069446")
            G.add_node(line[0], name=line[0], type="protein")
            protein_list.append({"id": line[0], "name": line[0]})
            protein_node += 1

        G.add_edge(line[0], line[1], type="protein_go_term")
        G.add_edge(line[1], line[0], type="protein_go_term")
        protein_go_edge += 1
        i += 1

    print("")
    print("")
    print("ProGO edge only network summary")

    print("protein-go edge count: ", protein_go_edge)
    print("protein node count: ", protein_node)
    print("go node count: ", go_node)
    print("total edge count: ", len(G.edges()))
    print("total node count: ", len(G.nodes()))

    return G


def read_specific_columns(file_path, delimit):
    try:
        with open(file_path, "r") as file:
            next(file)
            data = []
            for line in file:
                parts = line.strip().split(delimit)
                filtered_columns = []
                for col in parts:
                    filtered_columns.append(col.replace('"', ""))
                data.append(filtered_columns)
                # print(filtered_columns)
            return data
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None


def read_pro_go_data(file_path, columns, delimit):
    try:
        with open(file_path, "r") as file:
            next(file)
            data = []
            for line in file:
                parts = line.strip().split(delimit)
                selected_columns = []
                for col in columns:
                    selected_columns.append(parts[col].replace('"', ""))
                data.append(selected_columns)
            return data
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None


def get_network_pickle(ppi_network_file, regulatory_network_file, go_network_file):

    ppi_data = read_specific_columns(ppi_network_file, ",")
    reg_data = read_specific_columns(regulatory_network_file, ",")
    go_cols = [0, 2]  # only want the protein and go term
    go_data = read_pro_go_data(go_network_file, go_cols, ",")

    G = create_go_protein_only_network(ppi_data, reg_data, go_data)
    output_dir = "./output"
    pickle_file = "go_protein.pickle"

    try:
        os.makedirs(output_dir, exist_ok=True)
    except OSError as e:
        print(f"Error creating directory '{output_dir}': {e}")

    with open(f"{output_dir}/{pickle_file}", "wb") as f:
        pickle.dump(G, f)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Generate network pickle files from network files for protein function prediction"
    )
    parser.add_argument(
        "-p",
        "--ppi",
        type=str,
        help="Path to the PPI edges input file.",
        required=True,
    )
    parser.add_argument(
        "-r",
        "--regulatory",
        type=str,
        help="Path to the Reg edges input file.",
        required=True,
    )
    parser.add_argument(
        "-g",
        "--go",
        type=str,
        help="Path to the GO network file.",
        required=True,
    )

    args = parser.parse_args()
    get_network_pickle(args.ppi, args.regulatory, args.go)
