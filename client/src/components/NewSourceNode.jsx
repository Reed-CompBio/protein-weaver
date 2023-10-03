import React from 'react';

export default function NewSourceNode({ currentNode, query }) {
    // const [newSource, setNewSource] = useState(currentNode.id);
    // const [newQuery, setNewQuery] = useState({ protein: "", goTerm: "", k: [] });

    async function handleSubmit(e) {
        setSidebarNode(null);
        setNetworkResult({});
        e.preventDefault();
        let network = null;
        try {
          network = await fetch("/api/getFlyBase", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newQuery),
          })
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else if (response.status === 404) {
                return Promise.reject("error 404");
              } else {
                return Promise.reject("some other error: " + response.status);
              }
            })
            .then((data) => {
              setNetworkResult(Neo4jParser(data, newQuery.protein, newQuery.goTerm));
              return Neo4jParser(data, newQuery.protein, newQuery.goTerm);
            });
        } catch (error) {
          console.error("Error getting the network:", error, ". Protein or GO term may not exists");
    
        }
    
        if(network != null){
          let nodeList = {nodeList: network.nodeList}
          nodeList.nodeList.push(newQuery.goTerm)
          setSourceNode(network.nodes[0].data)
          setGoTerm(newQuery.goTerm)
          let sharedEdges = null
          try{
            sharedEdges = await fetch("/api/getSharedEdges", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(nodeList),
            })
              .then((response) => {
                if (response.ok) {
                  return response.json();
                } else if (response.status === 404) {
                  return Promise.reject("error 404");
                } else {
                  return Promise.reject("some other error: " + response.status);
                }
              })
              .then((edgeData) => {
                setNetworkResult(SharedEdgeParser(network, edgeData));
                return SharedEdgeParser(network, edgeData);
              });
    
            setShowResults(true);
          } catch (error) {
            console.error("Error getting the network:", error);
            throwAsyncError(e)
          };
        };
      };

      return (
        <div>
            <form method="post" onSubmit={handleSubmit} action="api/getFlyBase">
                <button
                type="submit"
                className="button"
                >Set Current Node as Source</button>
            </form>
        </div>
      )
}