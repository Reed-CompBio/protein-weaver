export const cytoscapeStyle = [
  {
    selector: "node",
    style: {
      width: 10,
      height: 10,
      "background-color": "#03c2fc",
      label: "data(label)",
      color: "black",
      "font-size": "12px",
    },
  },
  {
    selector: "node[type='source']",
    style: {
      width: 30,
      height: 30,
      "border-width": "1px",
      "border-color": "black",
      "background-color": "#A70E16",
    },
  },
  {
    selector: "node[type='go_protein']",
    style: {
      width: 30,
      height: 30,
      shape: "rectangle",
      "border-width": "1px",
      "border-color": "black",
      "background-color": "#7F95D1",
    },
  },
  {
    selector: "node[type='intermediate']",
    style: {
      width: 15,
      height: 15,
      "border-width": "1px",
      "border-color": "black",
      "background-color": "#F9C784",
    },
  },
  {
    selector: "edge",
    style: {
      width: 2,
      "line-color": "black",
      "curve-style": "bezier",
    },
  },
  {
    selector: "edge[type='shared']",
    style: {
      width: 2,
      "line-color": "#ACA9A4",
      "curve-style": "bezier",
    },
  },
  {
    selector: "node:selected",
    style: {
      "cursor": "pointer",
      "border-width": "3px",
      "border-color": "white",
      "border-opacity": "0.5",
      width: 30,
      height: 30,
    },
  },
];

export const layout = {
  name: "cose-bilkent",
  padding: 30,
  randomize: true,
  nodeRepulsion: 40000,
  idealEdgeLength: 50,
  nestingFactor: 0.1,
};
