import { React } from "react";
import GoTermSelector from "./GoTermSelector";
import NewSourceNode from "./NewSourceNode";
import ChangeLayout from "./ChangeLayout";

export default function GraphExploration({
    currentNode,
    handleSourceNode,
    handleSubmit,
    parentGoTerms,
    childrenGoTerms,
    storeGoTermValue,
    handleGoTermChange,
    handleLayoutChange
}) {
    return (
        <div>
            <h4 className="graph-exploration-title">Graph Exploration Tools</h4>
            <div className="graph-exploration">
                {/* New Source Node Button */}
                <NewSourceNode
                    currentNode={currentNode}
                    handleSourceNode={handleSourceNode}
                    handleSubmit={handleSubmit}
                />
                {/* GO Term Selection */}
                <GoTermSelector
                    parentGoTerms={parentGoTerms}
                    childrenGoTerms={childrenGoTerms}
                    storeGoTermValue={storeGoTermValue}
                    handleGoTermChange={handleGoTermChange}
                    handleSubmit={handleSubmit}
                />
            </div>
            {/* Change Graph Layout */}
            <ChangeLayout handleLayoutChange={handleLayoutChange} />
        </div>
    );
}
