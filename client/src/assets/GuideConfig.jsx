export const guideConfig = {
  run: false,
  steps: [
    {
      content: (
        <div>
          <h2>Welcome to ProteinWeaver!</h2>{" "}
          <p>This guide offers an overview of the features provided by ProteinWeaver.</p>
        </div>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      placement: "center",
      target: "body",
    },
    {
      content: (
        <p>
          Enter a protein of interest, GO term, and the desired number of paths. ProteinWeaver will generate a subnetwork
          comprising the <i>k</i>-shortest paths connecting the protein of interest to proteins annotated with the specified GO term.
          To assist in initiating the search, three example inputs are provided.
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
          After making a query, the tool generates a visual representation of the subnetwork, accompanied by
          supplementary details that provide insight into the subnetwork.
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
          Cytoscape.js renders an interactive graph, enabling users to comprehensively explore every node and edge of the subnetwork.
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
          The sidebar contains detailed information about the subnetwork, featuring external links
          to databases providing information about the selected proteins and associated GO terms.
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
          A legend illustrates the node and edge types within the subnetwork. Black edges represent those
          directly on the shortest paths, while grey edges signify known interactions between proteins in the subnetwork.
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
