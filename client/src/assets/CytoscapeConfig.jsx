export const cytoscapeStyle = [
  {
    selector: "node",
    style: {
      width: 30,
      height: 30,
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
    selector: "node[type='go_source']",
    style: {
      width: 30,
      height: 30,
      shape: "rectangle",
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
      width: 30,
      height: 30,
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
      "border-width": "3px",
      "border-color": "white",
      "border-opacity": "0.5",
      width: 30,
      height: 30
    },
  },
  {
    selector: "edge:selected",
    style: {
      width: 3,
      "line-color": "#ca545a",
    },
    
  },
];

export const layout = {
  name: "cola",
  // padding: 30,
  // randomize: true,
  // nodeRepulsion: 40000,
  // idealEdgeLength: 50,
  // nestingFactor: 0.1,
  animate: true, // whether to show the layout as it's running
  refresh: 1, // number of ticks per frame; higher is faster but more jerky
  maxSimulationTime: 4000, // max length in ms to run the layout
  ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  fit: true, // on every layout reposition of nodes, fit the viewport
  padding: 30, // padding around the simulation
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node

  // layout event callbacks
  ready: function () { }, // on layoutready
  stop: function () { }, // on layoutstop

  // positioning options
  randomize: false, // use random node positions at beginning of layout
  avoidOverlap: true, // if true, prevents overlap of node bounding boxes
  handleDisconnected: true, // if true, avoids disconnected components from overlapping
  convergenceThreshold: 0.0001, // when the alpha value (system energy) falls below this value, the layout stops
  nodeSpacing: function (node) {
    return 10;
  }, // extra spacing around nodes
  flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
  alignment: undefined, // relative alignment constraints on nodes, e.g. {vertical: [[{node: node1, offset: 0}, {node: node2, offset: 5}]], horizontal: [[{node: node3}, {node: node4}], [{node: node5}, {node: node6}]]}
  gapInequalities: undefined, // list of inequality constraints for the gap between the nodes, e.g. [{"axis":"y", "left":node1, "right":node2, "gap":25}]
  centerGraph: true, // adjusts the node positions initially to center the graph (pass false if you want to start the layout from the current position)

  // different methods of specifying edge length
  // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
  edgeLength: undefined, // sets edge length directly in simulation
  edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
  edgeJaccardLength: undefined, // jaccard edge length in simulation

  // iterations of cola algorithm; uses default values on undefined
  unconstrIter: undefined, // unconstrained initial layout iterations
  userConstIter: undefined, // initial layout iterations with user-specified constraints
  allConstIter: undefined, // initial layout iterations with all constraints including non-overlap
};
