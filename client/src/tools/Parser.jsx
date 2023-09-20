export function Neo4jParser(data) {
  //   console.log("RAW DATA");
  //   console.log(data);

  //
  let parsedData = { node: [], edge: [] };
  let nodeList  = [];
  //   console.log("Parsed Data: ", parsedData)
  //   parsedData.nodes.push({id:"asdasd", name: "bruh"})

  for (let i = 0; i < data.length; i++) {
    // console.log(data[i]);
    let current = data[i];
    // console.log(Object.entries(current))
    for (let [key, value] of Object.entries(current)) {
      if (key == "_fields") {
        // console.log(key, value);
        // console.log(value);
        // console.log("Adding pathway")
        for (let j = 0; j < value[3].length - 1; j++) {
          // console.log(value[3][j])
          let nodeEntry = { "data": { "id": value[3][j], "label": value[3][j], "type": "interest" } }
          if(!nodeList.includes(value[3][j])){
            nodeList.push(value[3][j])
            parsedData.node.push(nodeEntry);
          }
        }
      }
    }
  }
//   console.log(nodeList.length)
  console.log(parsedData);
  return parsedData;
}
