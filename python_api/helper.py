import pickle
import numpy as np

def import_graph_from_pickle(filename):
    with open(filename, "rb") as f:
        return pickle.load(f)

def normalize(data):
    data = np.array(data)
    min_val = data.min()
    max_val = data.max()

    if min_val == max_val:
        return np.zeros_like(data)

    normalized_data = (data - min_val) / (max_val - min_val)
    return normalized_data.tolist()