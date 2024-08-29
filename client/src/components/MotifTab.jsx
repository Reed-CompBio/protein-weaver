import React, { useState, useEffect } from "react";
import iconPC from "/src/assets/icon-protein-clique.svg";
import iconCoregTFs from "/src/assets/icon-coreg-tfs.svg";
import iconFFL from "/src/assets/icon-feed-fwd-loop.svg";
import iconCoregProteins from "/src/assets/icon-coreg-proteins.svg";
import iconMFL from "/src/assets/icon-mixed-feedback-loop.svg";

// create component
export default function MotifTab({ nodeList, query, searchExecuted, networkResult }) {
    // create empty object to store query results
    const [MotifCount, setMotifCount] = useState([]);
    const [txid, setTxid] = useState("");
    const [globalMotifCount, setGlobalMotifCount] = useState([]);
    const [globalDegree, setGlobalDegree] = useState([]);
    const [localDegree, setLocalDegree] = useState([]);

    useEffect(() => {
        setTxid(query.species);
    }, [searchExecuted]);

    // logic for setting global count variables
    useEffect(() => {
        const txidMapping = {
            "txid7227": {
                motifCount: [1267922, 5049, 3706, 3236, 1439],
                degree: [],
            },
            "txid224308": {
                motifCount: [43088, 164, 972, 1359, 65],
                degree: [],
            },
            "txid7955": {
                motifCount: [319540, 960, 2257, 523, 14],
                degree: [],
            },
            "txid559292": {
                motifCount: [1816919, 171664, 1036451, 522163, 76231],
                degree: [],
            },
            "txid6239": {
                motifCount: [16880, 28856, 457362, 82309, 18579],
                degree: [],
            },
        };

        const selectedTxid = txidMapping[txid];
        if (selectedTxid) {
            setGlobalMotifCount(selectedTxid.motifCount);
            setGlobalDegree(selectedTxid.degree);
        }
    }, [searchExecuted]);

    // logic for setting total degree of subnetwork
    useEffect(() => {

    }, [nodeList]);


    useEffect(() => {
        if (nodeList != undefined) {
            const fetchData = async () => {
                try {
                    const response = await fetch("/api/getMotif", {
                        method: "POST", // Change to GET if your call is a GET request
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            // Example of JSON body request. Needs to match your POST request's parameters
                            nodeList: nodeList,
                        }),
                    });

                    const data = await response.json();

                    const count = [];
                    for (let i = 0; i < data.length; i++) {
                        count.push(data[i]._fields[0].low);
                    }

                    setMotifCount(count);
                } catch (error) {
                    console.error("Error:", error);
                }
            };

            fetchData();
        }
    }, [nodeList]);

    return (
        <div className="motif-stats-container">
            <div className="motif-item">
                <img src={iconPC} alt="Protein Clique Icon" className="motif-icon" />
                <p>Protein clique: {MotifCount[0]}</p>
            </div>
            <div className="motif-item">
                <img src={iconCoregTFs} alt="Coregulating TFs Icon" className="motif-icon" />
                <p>Interacting transcription factors that coregulate a third gene: {MotifCount[1]}</p>
            </div>
            <div className="motif-item">
                <img src={iconFFL} alt="Feed Forward Loop Icon" className="motif-icon" />
                <p>Feed forward loop: {MotifCount[2]}</p>
            </div>
            <div className="motif-item">
                <img src={iconCoregProteins} alt="Coregulating Proteins Icon" className="motif-icon" />
                <p>Coregulating interacting proteins: {MotifCount[3]}</p>
            </div>
            <div className="motif-item">
                <img src={iconMFL} alt="Mixed Feedback Loop Icon" className="motif-icon" />
                <p>Mixed feedback loop between transcription factors coregulating a third gene: {MotifCount[4]}</p>
            </div>
        </div>
    );
}
