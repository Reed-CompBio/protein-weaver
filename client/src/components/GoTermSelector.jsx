import { React, useState, useEffect } from "react";
import AncestorSelector from "./AncestorSelector";
import DescendantSelector from "./DescendantSelector";

export default function GoTermSelector({
    parentGoTerms,
    childrenGoTerms,
    storeGoTermValue,
    handleGoTermChange,
    handleSubmit,
}) {
    const [inputValueAncestor, setInputValueAncestor] = useState("");
    const [inputValueDescendant, setInputValueDescendant] = useState("");
    const [goButtonClassname, setGoButtonClassname] = useState(
        "new-go-term-button-disabled"
    );
    const handleInputChangeAncestor = (value) => {
        setInputValueAncestor(value);
    };

    const handleInputChangeDescendant = (value) => {
        setInputValueDescendant(value);
    };

    useEffect(() => {
        if (inputValueAncestor == "" && inputValueDescendant == "") {
            setGoButtonClassname("new-go-term-button-disabled");
        } else if (inputValueAncestor != "" || inputValueDescendant != "") {
            setGoButtonClassname("new-go-term-button");
        }
    }, [inputValueAncestor, inputValueDescendant]);

    useEffect(() => {
        if (inputValueAncestor != "") {
            setInputValueDescendant("");
        } else {
            setInputValueAncestor("");
        }
    }, [inputValueAncestor]);

    useEffect(() => {
        if (inputValueDescendant != "") {
            setInputValueAncestor("");
        } else {
            setInputValueDescendant("");
        }
    }, [inputValueDescendant]);

    const handleNewGoButton = () => {
        setInputValueAncestor("");
        setInputValueDescendant("");
        handleGoTermChange();
    };

    return (
        <div>
            <div className="go-container">
                <h5>Change GO Term:</h5>
                <div className="go-selector-container">
                    <AncestorSelector
                        parentGoTerms={parentGoTerms}
                        storeGoTermValue={storeGoTermValue}
                        handleInputChangeAncestor={handleInputChangeAncestor}
                        inputValueAncestor={inputValueAncestor}
                    />
                    <DescendantSelector
                        childrenGoTerms={childrenGoTerms}
                        storeGoTermValue={storeGoTermValue}
                        handleInputChangeDescendant={
                            handleInputChangeDescendant
                        }
                        inputValueDescendant={inputValueDescendant}
                    />
                    <form
                        method="post"
                        onSubmit={handleSubmit}
                        className="new-go-form"
                    >
                        <button
                            className={goButtonClassname}
                            onClick={handleNewGoButton}
                            disabled={
                                goButtonClassname ==
                                "new-go-term-button-disabled"
                            }
                        >
                            Set as New GO Term
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};