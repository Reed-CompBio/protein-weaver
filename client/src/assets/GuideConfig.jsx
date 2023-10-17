export const guideConfig = {
  run: false,
  steps: [
    {
      content: (
        <div>
          <h2>Welcome to ProteinWeaver!</h2>{" "}
          <p>This guide will go through the features of our website </p>
        </div>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      placement: "center",
      target: "body",
    },
    {
      content: (
        <p>
          Enter your protein of interest, GO term, and the number of paths you
          want. Use the examples if you are unsure!
        </p>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 5,
      target: ".container",
    },
    {
      content: (
        <p>
          The search output includes a graph for visualization, and information
          about the network
        </p>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 5,
      target: ".sidebar-align",
    },
    {
      content: (
        <p>
          Cytoscape.js render an interactive graph, where you can explore all
          the nodes and edges.
        </p>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 5,
      target: ".cytoscape-graph",
    },
    {
      content: (
        <p>
          The sidebar contains all the information about the network, including
          links about the proteins and the GO term summaries
        </p>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 5,
      target: ".sidebar",
    },
  ],
};
