import { Tooltip as ReactTooltip } from "react-tooltip";

export default function Modetooltip() {
  return (
    <div>
      <ReactTooltip
        id="path-tooltip"
        place="top"
        content="This query mode will output a graph that shows k-unique paths"
        style={{ backgroundColor: "#f7e3e1", color: "black"}}
      />
      <ReactTooltip
        id="node-tooltip"
        place="top"
        variant="info"
        content="This query mode will output a graph that shows k-nodes that are closest to the protein of interest"
        style={{ backgroundColor: "#f7e3e1", color: "black"}}
      />
    </div>
  );
}
