import { React, useEffect } from "react";
import Autocomplete from "./Autocomplete";
import CheckboxComponent from "./CheckboxComponent";
import ModeTooltip from './ModeTooltip.jsx'
export default function SearchBar({
    handleSubmit,
    submitRef,
    query,
    handleInputChange,
    getExample,
    proteinOptions,
    goTermOptions,
    handleGuide,
    handleSpeciesChange,
    handleQueryMode,
    activeModeButton,
    exState,
    handleCheckboxChange,
}) {
    let spName = "";
    if (query.species == "txid224308") {
        spName = "B. subtilis";
    } else if (query.species == "txid7227") {
        spName = "D. melanogaster";
    } else if (query.species == "txid7955") {
        spName = "D. rerio";
    } else if (query.species == "txid559292") {
        spName = "S. cerevisiae";
    } else if (query.species == "txid6239") {
        spName = "C. elegans";
    } else if (query.species == "txid3702") {
        spName = "A. thaliana";
    } else if (query.species == "txid511145") {
        spName = "E. coli K-12";
    }

    return (
        // Search Bar Component
        <div className="query-container">
            {/* search inputs and button */}
            <form method="post" onSubmit={handleSubmit}>
                <div className="search-container">
                    <div className="search-input-wrapper">
                        <div className="search-input-header">
                            <label htmlFor="protein-input-container">Protein</label>
                            <Autocomplete
                                className="protein-input-container"
                                suggestions={proteinOptions} // Pass the protein suggestions to the Autocomplete component
                                inputName="protein"
                                inputValue={query.protein}
                                onInputChange={handleInputChange}
                                placeholder="Protein"
                                autocomplete="protein-autocomplete"
                            />
                        </div>
                        <div className="search-input-header">
                            <label htmlFor="go-term-input-container">GO Term</label>
                            <div className="shrink-go-input">
                                <Autocomplete
                                    className="go-term-input-container"
                                    suggestions={goTermOptions} // Pass the go term suggestions to the Autocomplete component
                                    inputName="goTerm"
                                    inputValue={query.goTerm}
                                    onInputChange={handleInputChange}
                                    placeholder="Gene Ontology Term"
                                    autocomplete="go-term-autocomplete"
                                />
                            </div>
                        </div>
                        <div className="search-input-header">
                            <label htmlFor="k-input"><i>k</i></label>
                            <input
                                className="k-input" // User input for k
                                type="number"
                                min="0"
                                name="k"
                                placeholder="k"
                                value={query.k}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="search-input-header">
                            <label className="species-header"
                                htmlFor="search select">Organism (TXID)</label>
                            <select
                                className="search-select" // User input for species
                                name="species" // User input for species
                                value={query.species}
                                onChange={handleSpeciesChange}
                            >
                                <option value="txid224308">
                                    B. subtilis (224308)
                                </option>
                                <option value="txid7227">
                                    D. melanogaster (7227)
                                </option>
                                <option value="txid7955">
                                    D. rerio (7955)
                                </option>
                                <option value="txid559292">
                                    S. cerevisiae (559292)
                                </option>
                                <option value="txid6239">
                                    C. elegans (6239)
                                </option>
                                <option value="txid3702">
                                    A. thaliana (3702)
                                </option>
                                <option value="txid511145">
                                    E. coli K-12 (511145)
                                </option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="search-button"
                            ref={submitRef}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </form>

            {/* change query mode */}
            <div className="mode-container">
                <h4>Mode:</h4>
                <input
                    data-tooltip-id="path-tooltip"
                    type="button"
                    className={
                        activeModeButton === "path"
                            ? "active-button"
                            : "inactive-button"
                    }
                    onClick={handleQueryMode}
                    value="Paths"
                />
                <input
                    data-tooltip-id="node-tooltip"
                    type="button"
                    className={
                        activeModeButton === "node"
                            ? "active-button"
                            : "inactive-button"
                    }
                    onClick={handleQueryMode}
                    value="Nodes"
                />
                <ModeTooltip />
            </div>

            <div className="interaction-container">
                <h4 className="interaction-title">Network:</h4>
                <CheckboxComponent
                    handleCheckboxChange={handleCheckboxChange}
                    query={query}
                ></CheckboxComponent>
            </div>

            {/* user examples */}
            <div className="example">
                <i>{spName}</i>
                <div className="align-examples-below">
                    <h4>Examples:</h4>
                    <div className="align-examples">
                        <a
                            onClick={() => getExample(1)}
                            className={
                                exState === "1" ? "activated" : "inactivated"
                            }
                        >
                            #1
                        </a>{" "}
                        <a
                            onClick={() => getExample(2)}
                            className={
                                exState === "2" ? "activated" : "inactivated"
                            }
                        >
                            #2
                        </a>{" "}
                        <a
                            onClick={() => getExample(3)}
                            className={
                                exState === "3" ? "activated" : "inactivated"
                            }
                        >
                            #3
                        </a>
                    </div>
                </div>
            </div>

            {/* user guide */}
            <button className="guide-button" onClick={handleGuide}>
                ?
            </button>
        </div>
    );
}
