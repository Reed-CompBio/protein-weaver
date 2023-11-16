export const guideConfig = {
  run: false,
  steps: [
    {
      content: (
        <div>
          <h2>Welcome to ProteinWeaver!</h2>{" "}
          <p>This guide will provide an overview of the features available on our website.</p>
        </div>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      placement: "center",
      target: "body",
    },
    {
      content: (
        <p>
          Enter your protein of interest, GO term, and the desired number of paths. If you're unsure, feel free to refer to the examples.
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
          The query generates a graphical representation of the subnetwork you've queried, along with additional details about the subnetwork.
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
          Cytoscape.js renders an interactive graph that allows you to explore all nodes and edges of the subnetwork.
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
          The sidebar contains comprehensive information about the subnetwork, including links to details about the selected proteins and GO terms.
        </p>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 5,
      target: ".sidebar",
    },
    {
      content: (
        <p>
          Here is a legend that show you all the key information about the graph information.
        </p>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 5,
      target: ".legend",
    },
  ],
};
