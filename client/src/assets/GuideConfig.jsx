export const guideConfig = {
  run: false,
  steps: [
    {
      content: (
        <div>
          <h2>Welcome to ProteinWeaver!</h2>{" "}
          <p>
            This guide offers an overview of the features provided by
            ProteinWeaver.
          </p>
        </div>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      placement: "center",
      target: "body",
    },
    {
      content: (
        <p>
          Enter a protein of interest, GO term, and the desired number of paths,
          (<i>k</i>). ProteinWeaver generates a subnetwork of the <i>k</i>
          -shortest paths connecting the protein of interest to proteins
          annotated with the specified GO term. To help initiate the search,
          three example inputs are provided.
        </p>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 5,
      target: ".query-container",
    },
    {
      content: (
        <p>
          After making a query, ProteinWeaver generates a visual representation
          of the subnetwork, accompanied by supplementary details that provide
          insight into the subnetwork.
        </p>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 5,
      target: ".panel-container",
    },
    {
      content: (
        <p>
          The lefthand section contains the a visualisation of the subnetwork
          along with key tools to aid network exploration
        </p>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 5,
      target: ".left-panel-container",
    },
    {
      content: (
        <p>
          ProteinWeaver uses Cytoscape.js to render an interactive graph,
          enabling users to comprehensively explore every node and edge of the
          subnetwork.
        </p>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 5,
      target: ".graph-panel-container",
    },
    {
      content: (
        <p>
          Graph exploration tools are available to traverse through the network
          via the GO term hierarchy or nodes in the graph.
        </p>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 5,
      target: ".graph-exploration-panel-container",
    },
    {
      content: (
        <p>
          The righthand section contains detailed information about the
          subnetwork, featuring external links to databases providing
          information about the selected proteins and associated GO terms, and
          statistics about the network.{" "}
        </p>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 5,
      target: ".right-panel-container",
    },
    {
      content: (
        <p>
          The sidebar contains detailed information about the subnetwork,
          featuring external links to databases providing information about the
          selected proteins and associated GO terms.
        </p>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 5,
      target: ".summary-panel-container",
    },
    {
      content: (
        <p>
          The statistics section contains information about the subnetwork and
          also the wider interactome.
        </p>
      ),
      locale: { skip: <strong aria-label="skip">S-K-I-P</strong> },
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 5,
      target: ".statistics-panel-container",
    },
  ],
};
