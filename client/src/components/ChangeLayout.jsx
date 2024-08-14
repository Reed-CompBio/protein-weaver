import { PiGraph } from "react-icons/pi";
import { TbGridDots } from "react-icons/tb";
import { TbArrowsRandom } from "react-icons/tb";
import { IconContext } from "react-icons";

export default function ChangeLayout({ handleLayoutChange }) {
    return (
        <div>
            <h5 className="change-layout-header">Rearrange graph layout:</h5>
            <div className="align-change-layout">
                <IconContext.Provider
                    value={{
                        className: "change-layout",
                        color: "black",
                        size: "2em",
                    }}
                >
                    <div className="layout-tooltip">
                        <PiGraph
                            className="layout-icon"
                            onClick={(e) => handleLayoutChange("cola", e)}
                            aria-label="default"
                        />
                        <span className="tooltiptext">Cola</span>
                    </div>
                    <div className="layout-tooltip">
                        <TbGridDots
                            className="layout-icon"
                            onClick={(e) => handleLayoutChange("grid", e)}
                            aria-label="grid"
                        />
                        <span className="tooltiptext">Grid</span>
                    </div>
                    <div className="layout-tooltip">
                        <TbArrowsRandom
                            className="layout-icon"
                            onClick={(e) => handleLayoutChange("random", e)}
                            aria-label="random"
                        />
                        <span className="tooltiptext">Random</span>
                    </div>
                </IconContext.Provider>
            </div>
        </div>
    )
};