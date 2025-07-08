import React, { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";

export default function Download() {
    const [txid, setTxid] = useState("txid224308");
    const [species, setSpecies] = useState("B. subtilis");
    const speciesDict = {
        txid224308: "B. subtilis",
        txid7227: "D. melanogaster",
        txid7955: "D. rerio",
        txid559292: "S. cerevisiae",
        txid6239: "C. elegans",
        txid3702: "A. thaliana",
        txid511145: "E. coli",
    };
    const handleSpeciesChange = (event) => {
        const txid = event.target.value
        setTxid(txid);
        setSpecies(speciesDict[txid])
    };

    async function handleDownload(e) {
        const file = e.target.textContent;
        const url = `https://raw.githubusercontent.com/Reed-CompBio/protein-weaver/refs/main/data/Downloads/${txid}/${file}`;

        console.log(`Downloading file from ${url}`);

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);

            // Create an anchor element to trigger download
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = file; // Use the file name for the download
            document.body.appendChild(a);
            a.click();

            // Clean up
            URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (error) {
            console.error(`Error downloading file: ${error.message}`);
        }
    }


    return (
        <div>
            <MainLayout>
                <div className="main-layout-body">
                    <div className="download-body">
                        <h2 className="download-title">Data Download</h2>
                        <select
                            className="species-input-container"
                            value={txid}
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
                                E. coli (511145)
                            </option>
                        </select>
                        <div className="download-table">
                            <div className="download-header-row">
                                <div className="download-table-left-column">
                                    <h4>
                                        File
                                    </h4>
                                </div>
                                <div className="download-table-right-column">
                                    <h4>
                                        Description
                                    </h4>
                                </div>
                            </div>
                            <div className="download-table-row">
                                <div className="download-table-left-column">
                                    <p onClick={handleDownload}>
                                        {txid}-protein_protein_interaction.csv
                                    </p>
                                </div>
                                <div className="download-table-right-column">
                                    <p>Complete edge file of PPIs for{" "}
                                        <strong>
                                            <em>{species}</em>
                                        </strong>
                                    </p>
                                </div>
                            </div>
                            <div className="download-table-row">
                                <div className="download-table-left-column">
                                    <p onClick={handleDownload}>
                                        {txid}-regulatory_interaction.csv
                                    </p>
                                </div>
                                <div className="download-table-right-column">
                                    <p>
                                        Complete edge file of
                                        regulatory interactions for{" "}
                                        <strong>
                                            <em>{species}</em>
                                        </strong>
                                    </p>
                                </div>
                            </div>
                            <div className="download-table-row">
                                <div className="download-table-left-column">
                                    <p onClick={handleDownload}>
                                        {txid}-mixed_interaction.csv
                                    </p>
                                </div>
                                <div className="download-table-right-column">
                                    <p>
                                        Complete edge file (PPI & regulatory) for{" "}
                                        <strong>
                                            <em>{species}</em>
                                        </strong>
                                    </p>
                                </div>
                            </div>
                            <div className="download-table-row">
                                <div className="download-table-left-column">
                                    <p onClick={handleDownload}>
                                        {txid}-direct_go_annotation.csv
                                    </p>
                                </div>
                                <div className="download-table-right-column">
                                    <p>
                                        Direct GO annotations for{" "}
                                        <strong>
                                            <em>{species}</em>
                                        </strong>
                                    </p>
                                </div>
                            </div>
                            <div className="download-table-row">
                                <div className="download-table-left-column">
                                    <p onClick={handleDownload}>
                                        {txid}-go_annotation.csv
                                    </p>
                                </div>
                                <div className="download-table-right-column">
                                    <p>
                                        All GO annotations for{" "}
                                        <strong>
                                            <em>{species}</em>
                                        </strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="download-note">
                            <a
                                href='https://geneontology.org/docs/download-ontology/'
                                target='_blank'
                                rel='noopener noreferrer'
                            >Download page</a> for the most up to date Gene Onotology hierarchy.
                        </div>
                    </div>
                </div>
            </MainLayout>
        </div>
    );
}