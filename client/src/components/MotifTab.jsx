import React, { useState, useEffect } from "react";
import iconPC from "/src/assets/icon-protein-clique.svg";
import iconCoregTFs from "/src/assets/icon-coreg-tfs.svg";
import iconFFL from "/src/assets/icon-feed-fwd-loop.svg";
import iconCoregProteins from "/src/assets/icon-coreg-proteins.svg";
import iconMFL from "/src/assets/icon-mixed-feedback-loop.svg";

// create component
export default function MotifTab({ nodeList }) {
    // create empty object to store query results
    const [MotifCount, setMotifCount] = useState([]);
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
