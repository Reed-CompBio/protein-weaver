import { Tooltip as ReactTooltip } from "react-tooltip";

export default function ModeTooltip() {
  return (
    <div>
      <ReactTooltip
        id="path-tooltip"
        place="top"
        content="Finds the k-shortest paths from the protein of interest to proteins annotated with the queried GO term."
        style={{ backgroundColor: "#f7e3e1", color: "black" }}
      />
      <ReactTooltip
        id="node-tooltip"
        place="top"
        variant="info"
        content="Finds the k-closest proteins annotated to the queried GO term, in relation to the protein of interest."
        style={{ backgroundColor: "#f7e3e1", color: "black" }}
      />
    </div>
  );
}
