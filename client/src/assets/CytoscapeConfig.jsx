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
      "background-color": "red",
    },
  },
  {
    selector: "node[type='go_protein']",
    style: {
      width: 30,
      height: 30,
      shape: "rectangle",
      "background-color": "purple",
    },
  },
  {
    selector: "node[type='intermediate']",
    style: {
      width: 15,
      height: 15,
      "background-color": "#42c4ef",
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
      "line-color": "#d8d8d8",
      "curve-style": "bezier",
    },
  },
  {
    selector: "node:selected",
    style: {
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
