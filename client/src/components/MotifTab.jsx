import React, { useState, useEffect } from "react";

// create component
export default function MotifTab({ nodeList }) {
    // create empty object to store query results
    const [MotifCount, setMotifCount] = useState([]);
    useEffect(() => {
        if (nodeList != undefined) {
            const fetchData = async () => {
                try {
                    const response = await fetch("/api/Motif", {
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
            <p>
                Protein clique: {MotifCount[0]} <br />
                <br />
                Interacting transcription factors that coregulate a third gene:{" "}
                {MotifCount[1]} <br />
                <br />
                Feed forward loop: {MotifCount[2]} <br />
                <br />
                Coregulating interacting proteins: {MotifCount[3]} <br />
                <br />
                Mixed feedback loop between transcription factors coregulating a
                third gene: {MotifCount[4]}
            </p>
        </div>
    );
}
