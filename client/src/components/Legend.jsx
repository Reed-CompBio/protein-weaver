import { React } from "react";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import { IconContext } from "react-icons";
import nodeSize from "/src/assets/node-size.svg";

export default function Legend({
  handleSharedEdgesToggle,
  showSharedEdges,
}) {
  return (
    <div>
      <div className="legend-max">
        <div id="node-types" className="node-types">
          <h3>Node Types</h3>
          <div className="dot-align">
            <div className="source-node-symbol"></div>
            <p className="legend-text">&nbsp;&nbsp;Source node</p>
          </div>
          <div className="dot-align">
            <div className="intermediate-symbol"></div>
            <p className="legend-text">
              &nbsp;&nbsp;On path from GO protein to source node
            </p>
          </div>
          <div className="dot-align">
            <div className="go-protein-symbol"></div>
            <p className="legend-text">&nbsp;&nbsp;GO protein</p>
          </div>
          <div className="dot-align">
            <div className="go-source-symbol"></div>
            <p className="legend-text">
              &nbsp;&nbsp;Source node annotated to GO term
            </p>
          </div>
          <div className="dot-align">
            <img src={nodeSize} className="node-size" />
            <p className="legend-text">
              &nbsp;&nbsp;Increasing node degree
            </p>
          </div>
        </div>

        <div id="edge-types" className="edge-types">
          <h3>Edge Types</h3>
          <div className="line-align">
            <div className="black-line"></div>
            <p className="legend-text">&nbsp;&nbsp;Physical interaction on shortest path</p>
          </div>
          <div className="line-align">
            <div className="grey-line"></div>
            <p className="legend-text">&nbsp;&nbsp;Physical interaction in induced subgraph</p>
          </div>
          <div className="line-align">
            <div className="red-dashed-arrow"></div>
            <p className="legend-text">&nbsp;&nbsp;Regulatory interaction on shortest path</p>
          </div>
          <div className="line-align">
            <div className="pink-dashed-arrow"></div>
            <p className="legend-text">&nbsp;&nbsp;Regulatory interaction in induced subgraph</p>
          </div>
          <div className="line-align">
            <h4 className="shared-edge-toggle">Toggle Induced Edges</h4>
            <IconContext.Provider
              value={{
                className: "checkbox",
                color: "black",
                size: "1.5em",
              }}
            >
              {showSharedEdges ? (
                <MdOutlineCheckBox
                  onClick={(e) => handleSharedEdgesToggle(e)}
                />
              ) : (
                <MdOutlineCheckBoxOutlineBlank
                  onClick={(e) => handleSharedEdgesToggle(e)}
                />
              )}
            </IconContext.Provider>
          </div>
        </div>
      </div>
    </div >
  );
}
