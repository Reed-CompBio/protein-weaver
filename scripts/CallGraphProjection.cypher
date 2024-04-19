CALL gds.graph.project(
  'proGoGraph',
  {
    go_term: {
      label: 'go_term'
    },
    protein: {
      label: 'protein'
    }
  },
  {
    ProGo: {
      type: 'ProGo',
      orientation: 'NATURAL',
      properties: {}
    },
    ProPro: {
      type: 'ProPro',
      orientation: 'UNDIRECTED',
      properties: {}
    }
  }
);