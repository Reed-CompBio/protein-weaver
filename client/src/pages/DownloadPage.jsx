import React, { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";

export default function Download() {
    const [species, setSpecies] = useState("txid224308");

    useEffect(() => {
        console.log(species);
    }, [species]);

    const handleSpeciesChange = (event) => {
        setSpecies(event.target.value);
    };

    return (
        <div>
            <MainLayout>
                <div className="main-layout-body">
                    <div className="download-body">
                        <h2 className="download-title">Download Page</h2>
                        <select
                            className="species-input-container"
                            value={species}
                            onChange={handleSpeciesChange}
                        >
                            <option value="txid224308">
                                B. subtilis (224308)
                            </option>
                            <option value="txid7227">
                                D. melanogaster (7227)
                            </option>
                            <option value="txid7955">D. rerio (7955)</option>
                            <option value="txid559292">
                                S. cerevisiae (559292)
                            </option>
                            <option value="txid6239">C. elegans (6239)</option>
                        </select>
                        <div>
                            <div className="download-table-row">
                                <div className="download-table-column">File</div>
                                <div className="download-table-column">Description</div>
                            </div>
                            <div className="download-table-row">
                                <div className="download-table-column">protein_protein_interaction.csv</div>
                                <div className="download-table-column">Complete edge file of protein-protein interactions</div>
                            </div>
                            <div className="download-table-row">
                                <div className="download-table-column">regulatory_interaction.csv</div>
                                <div className="download-table-column">Complete edge file of regulatory_interactions</div>
                            </div>
                            <div className="download-table-row">
                                <div className="download-table-column">mixed_interaction.csv</div>
                                <div className="download-table-column">Complete edge file with both protein-protein and regulatory interactions</div>
                            </div>
                            <div className="download-table-row">
                                <div className="download-table-column">gene_ontology_hierarchy.csv</div>
                                <div className="download-table-column">Complete gene ontology hierarchy</div>
                            </div>

                        </div>
                    </div>
                </div>
            </MainLayout>
        </div>
    );
}
