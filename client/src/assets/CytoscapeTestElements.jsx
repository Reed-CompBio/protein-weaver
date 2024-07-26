export const cytoscapeTestElements = [
  {
    data: {
      id: "FBgn0003731",
      label: "Egfr",
      type: "source",
      degree: "12"
    },
  },
  {
    data: {
      id: "FBgn0031972",
      label: "Wwox",
      type: "go_protein",
      degree: "15"
    },
  },
  {
    data: {
      id: "ab",
      source: "FBgn0003731",
      target: "FBgn0031972",
    },
  },
];

export const cytoscapeTest = [
  {
    nodes: [
      {
        data: {
          id: "FBgn0003731",
          label: "Egfr",
          type: "source",
        },
      },
      {
        data: {
          id: "FBgn0031972",
          label: "Wwox",
          type: "go_protein",
        },
      },
      {
        data: {
          id: "FBgn0264492",
          label: "CkIIalpha",
          type: "go_protein",
        },
      },
      {
        data: {
          id: "FBgn0000499",
          label: "dsh",
          type: "go_protein",
        },
      },
    ],
    edges: [
      {
        data: {
          source: "FBgn0031972",
          target: "FBgn0003731",
        },
      },
      {
        data: {
          source: "FBgn0264492",
          target: "FBgn0003731",
        },
      },
      {
        data: {
          source: "FBgn0000499",
          target: "FBgn0003731",
        },
      },
    ],
    nodeList: ["FBgn0003731", "FBgn0031972", "FBgn0264492", "FBgn0000499"],
    edgeList: [
      "FBgn0003731FBgn0031972",
      "FBgn0003731FBgn0264492",
      "FBgn0003731FBgn0000499",
    ],
    goTerm: {
      name: "Wnt signaling pathway",
      namespace: "biological_process",
      id: "GO:0016055",
      def: "The series of molecular signals initiated by binding of a Wnt protein to a frizzled family receptor on the surface of the target cell and ending with a change in cell state. [GOC:dph, GOC:go_curators, PMID:11532397]",
      never_annotate: "false",
    },
  },
];

export const cytoscapeTest2 = [
  {
    data: {
      id: "FBgn0003731",
      label: "Egfr",
      type: "source",
    },
  },
  {
    data: {
      id: "FBgn0031972",
      label: "Wwox",
      type: "go_protein",
    },
  },
  {
    data: {
      id: "FBgn0264492",
      label: "CkIIalpha",
      type: "go_protein",
    },
  },
  {
    data: {
      id: "FBgn0000499",
      label: "dsh",
      type: "go_protein",
    },
  },
  {
    data: {
      source: "FBgn0031972",
      target: "FBgn0003731",
      evidence: "evidence test1"
    },
  },
  {
    data: {
      source: "FBgn0264492",
      target: "FBgn0003731",
      evidence: "evidence test2"
    },
  },
  {
    data: {
      source: "FBgn0000499",
      target: "FBgn0003731",
      evidence: "evidence test3"
    },
  },
  {
    data: {
      source: "FBgn0031972",
      target: "FBgn0000499",
      type: "shared",
      evidence: "evidence test4"
    },
  },
  //   nodeList: ["FBgn0003731", "FBgn0031972", "FBgn0264492", "FBgn0000499"],
  //   edgeList: [
  //     "FBgn0003731FBgn0031972",
  //     "FBgn0003731FBgn0264492",
  //     "FBgn0003731FBgn0000499",
  //   ],
  //   goTerm: {
  //     name: "Wnt signaling pathway",
  //     namespace: "biological_process",
  //     id: "GO:0016055",
  //     def: "The series of molecular signals initiated by binding of a Wnt protein to a frizzled family receptor on the surface of the target cell and ending with a change in cell state. [GOC:dph, GOC:go_curators, PMID:11532397]",
  //     never_annotate: "false",
  //   },
];
